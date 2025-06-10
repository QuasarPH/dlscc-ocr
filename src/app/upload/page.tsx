"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import FileUploadArea from "@/components/ocr/FileUploadArea";
import FileCard from "@/components/ocr/FileCard";
import FilePreviewModal from "@/components/ocr/FilePreviewModal";
import DocumentDataTable from "@/components/ocr/DocumentDataTable";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_TOTAL_FILES,
  NON_PROCESSABLE_FOR_DATA_EXTRACTION_CATEGORIES,
  COLUMN_DEFINITIONS,
} from "@/constants";
import Spinner from "@/components/ocr/Spinner";
import { DocumentCategory } from "@/constants";
import { Topbar } from "@/components/index/Topbar";

const UploadPage: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedFileForPreview, setSelectedFileForPreview] =
    useState<UploadedFile | null>(null);
  const [isClassifyingQueue, setIsClassifyingQueue] = useState<boolean>(false);
  const [classifyingFileId, setClassifyingFileId] = useState<string | null>(
    null
  );
  const [apiKeyMissing, setApiKeyMissing] = useState<boolean>(false);
  const [isExtractingBatchData, setIsExtractingBatchData] =
    useState<boolean>(false);
  const [currentlyExtractingDataFileId, setCurrentlyExtractingDataFileId] =
    useState<string | null>(null);

  useEffect(() => {
    // Check if API key is configured by making a test request
    fetch("/api/ocr/health")
      .then((res) => res.json())
      .then((data) => {
        if (!data.hasApiKey) {
          setApiKeyMissing(true);
          console.error("Gemini API key is not configured");
        }
      })
      .catch(() => {
        setApiKeyMissing(true);
        console.error("Failed to check API configuration");
      });
  }, []);

  const performFileClassification = useCallback(
    async (fileToClassify: UploadedFile) => {
      if (
        !fileToClassify.processedMimeType ||
        !ALLOWED_IMAGE_TYPES.includes(fileToClassify.processedMimeType) ||
        !fileToClassify.previewUrl
      ) {
        if (fileToClassify.category === DocumentCategory.PROCESSING) {
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === fileToClassify.id
                ? {
                    ...f,
                    category: DocumentCategory.OTHERS,
                    error:
                      "Cannot classify: not a supported image format or preview unavailable.",
                  }
                : f
            )
          );
        }
        return;
      }

      setClassifyingFileId(fileToClassify.id);

      let base64ImageData: string;
      const mimeTypeForGemini = fileToClassify.processedMimeType;

      if (fileToClassify.originalMimeType === "application/pdf") {
        if (
          fileToClassify.previewUrl &&
          fileToClassify.previewUrl.startsWith("data:image/png;base64,")
        ) {
          base64ImageData = fileToClassify.previewUrl.split(",")[1];
        } else {
          console.error(
            "PDF previewUrl is not a valid base64 data URL for classification:",
            fileToClassify.previewUrl
          );
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === fileToClassify.id
                ? {
                    ...f,
                    category: DocumentCategory.ERROR,
                    error: "Invalid PDF preview data for classification.",
                  }
                : f
            )
          );
          setClassifyingFileId(null);
          return;
        }
      } else {
        try {
          const reader = new FileReader();
          base64ImageData = await new Promise<string>((resolve, reject) => {
            reader.onloadend = () => {
              const result = reader.result as string;
              if (result && result.includes(",")) {
                resolve(result.split(",")[1]);
              } else {
                reject(
                  new Error(
                    "Failed to read image file correctly for classification. Invalid data URL format."
                  )
                );
              }
            };
            reader.onerror = (error) =>
              reject(
                new Error(`FileReader error for classification: ${error}`)
              );
            reader.readAsDataURL(fileToClassify.file);
          });
        } catch (error) {
          console.error(
            "Error reading image file for AI classification:",
            error
          );
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === fileToClassify.id
                ? {
                    ...f,
                    category: DocumentCategory.ERROR,
                    error: `Failed to read file for AI classification: ${
                      error instanceof Error ? error.message : String(error)
                    }`,
                  }
                : f
            )
          );
          setClassifyingFileId(null);
          return;
        }
      }

      if (base64ImageData) {
        try {
          const response = await fetch("/api/ocr/classify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              base64ImageData,
              mimeType: mimeTypeForGemini,
            }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          const category = data.category as DocumentCategory;

          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === fileToClassify.id
                ? {
                    ...f,
                    category: category,
                    error:
                      category === DocumentCategory.ERROR
                        ? "AI classification failed."
                        : undefined,
                  }
                : f
            )
          );
        } catch (error) {
          console.error("Error calling classification API:", error);
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === fileToClassify.id
                ? {
                    ...f,
                    category: DocumentCategory.ERROR,
                    error: "AI classification failed.",
                  }
                : f
            )
          );
        }
      } else {
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === fileToClassify.id
              ? {
                  ...f,
                  category: DocumentCategory.ERROR,
                  error: "Missing image data for AI classification.",
                }
              : f
          )
        );
      }
      setClassifyingFileId(null);
    },
    []
  );

  useEffect(() => {
    const filesReadyForClassification = uploadedFiles.filter(
      (f) =>
        f.category === DocumentCategory.PROCESSING &&
        f.processedMimeType &&
        ALLOWED_IMAGE_TYPES.includes(f.processedMimeType) &&
        f.previewUrl
    );

    if (
      filesReadyForClassification.length > 0 &&
      !isClassifyingQueue &&
      !classifyingFileId
    ) {
      setIsClassifyingQueue(true);
      performFileClassification(filesReadyForClassification[0]).finally(() => {
        setIsClassifyingQueue(false);
      });
    }
  }, [
    uploadedFiles,
    performFileClassification,
    isClassifyingQueue,
    classifyingFileId,
  ]);

  const handleFilesAdded = useCallback((newFiles: UploadedFile[]) => {
    setUploadedFiles((prevFiles) => {
      const combined = [
        ...prevFiles,
        ...newFiles.map((f) => ({
          ...f,
          isDataExtracted: false,
          isDataExtracting: false,
        })),
      ];
      return combined.slice(0, MAX_TOTAL_FILES);
    });
  }, []);

  const handlePreview = (file: UploadedFile) => {
    setSelectedFileForPreview(file);
  };

  const handleClosePreview = () => {
    setSelectedFileForPreview(null);
  };

  const handleRemoveFile = (fileIdToRemove: string) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((f) => f.id !== fileIdToRemove)
    );
    if (
      selectedFileForPreview &&
      selectedFileForPreview.id === fileIdToRemove
    ) {
      setSelectedFileForPreview(null);
    }
  };

  const handleProcessDocumentsClick = async () => {
    const filesToExtract = uploadedFiles.filter(
      (f) =>
        !NON_PROCESSABLE_FOR_DATA_EXTRACTION_CATEGORIES.includes(f.category) &&
        !f.isDataExtracted &&
        !f.isDataExtracting &&
        f.processedMimeType &&
        ALLOWED_IMAGE_TYPES.includes(f.processedMimeType) &&
        f.previewUrl
    );

    if (filesToExtract.length === 0) {
      alert("No new documents suitable for data extraction.");
      return;
    }

    setIsExtractingBatchData(true);

    for (const fileToExtract of filesToExtract) {
      setCurrentlyExtractingDataFileId(fileToExtract.id);
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === fileToExtract.id
            ? { ...f, isDataExtracting: true, dataExtractionError: undefined }
            : f
        )
      );

      let base64ImageData: string;
      const mimeTypeForGemini = fileToExtract.processedMimeType!; // Already checked

      if (fileToExtract.originalMimeType === "application/pdf") {
        if (
          fileToExtract.previewUrl &&
          fileToExtract.previewUrl.startsWith("data:image/png;base64,")
        ) {
          base64ImageData = fileToExtract.previewUrl.split(",")[1];
        } else {
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === fileToExtract.id
                ? {
                    ...f,
                    isDataExtracting: false,
                    isDataExtracted: false,
                    dataExtractionError: "Invalid PDF preview for extraction.",
                  }
                : f
            )
          );
          continue; // next file
        }
      } else {
        try {
          const reader = new FileReader();
          base64ImageData = await new Promise<string>((resolve, reject) => {
            reader.onloadend = () => {
              const result = reader.result as string;
              if (result && result.includes(",")) {
                resolve(result.split(",")[1]);
              } else {
                reject(
                  new Error(
                    "Failed to read image file correctly for extraction."
                  )
                );
              }
            };
            reader.onerror = (error) =>
              reject(new Error(`FileReader error for extraction: ${error}`));
            reader.readAsDataURL(fileToExtract.file);
          });
        } catch (error) {
          console.error("Error reading image file for AI extraction:", error);
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === fileToExtract.id
                ? {
                    ...f,
                    isDataExtracting: false,
                    isDataExtracted: false,
                    dataExtractionError: `Failed to read file for extraction: ${
                      error instanceof Error ? error.message : String(error)
                    }`,
                  }
                : f
            )
          );
          continue; // next file
        }
      }

      if (base64ImageData) {
        try {
          const response = await fetch("/api/ocr/extract", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              base64ImageData,
              mimeType: mimeTypeForGemini,
              category: fileToExtract.category,
            }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          const extractedData = data.extractedData as ExtractedData;

          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === fileToExtract.id
                ? {
                    ...f,
                    isDataExtracting: false,
                    isDataExtracted: true,
                    extractedData: extractedData,
                    dataExtractionError: extractedData
                      ? undefined
                      : "AI data extraction failed or returned empty.",
                  }
                : f
            )
          );
        } catch (error) {
          console.error("Error calling extraction API:", error);
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === fileToExtract.id
                ? {
                    ...f,
                    isDataExtracting: false,
                    isDataExtracted: false,
                    dataExtractionError: "AI data extraction failed.",
                  }
                : f
            )
          );
        }
      } else {
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === fileToExtract.id
              ? {
                  ...f,
                  isDataExtracting: false,
                  isDataExtracted: false,
                  dataExtractionError: "Missing image data for extraction.",
                }
              : f
          )
        );
      }
    }
    setCurrentlyExtractingDataFileId(null);
    setIsExtractingBatchData(false);
  };

  const filesReadyForDataExtractionCount = useMemo(() => {
    return uploadedFiles.filter(
      (f) =>
        !NON_PROCESSABLE_FOR_DATA_EXTRACTION_CATEGORIES.includes(f.category) &&
        !f.isDataExtracted &&
        !f.isDataExtracting &&
        !f.dataExtractionError &&
        f.category !== DocumentCategory.PROCESSING && // Ensure classification is done
        f.category !== DocumentCategory.ERROR // Ensure classification was not an error
    ).length;
  }, [uploadedFiles]);

  const extractedDataByCategory = useMemo(() => {
    const grouped: Record<DocumentCategory, UploadedFile[]> = {
      [DocumentCategory.LOAN_APPLICATION]: [],
      [DocumentCategory.UNSECURED_LOANS_APPLICATION]: [],
      [DocumentCategory.SPECIAL_LOANS]: [],
      [DocumentCategory.OTHERS]: [],
      [DocumentCategory.PROCESSING]: [],
      [DocumentCategory.ERROR]: [],
    };
    uploadedFiles.forEach((file) => {
      if (
        file.isDataExtracted &&
        file.extractedData &&
        COLUMN_DEFINITIONS[file.category as DocumentCategory]?.length > 0
      ) {
        if (!grouped[file.category as DocumentCategory]) {
          grouped[file.category as DocumentCategory] = [];
        }
        grouped[file.category as DocumentCategory].push(file);
      }
    });
    return grouped;
  }, [uploadedFiles]);

  if (apiKeyMissing) {
    return (
      <div className="text-center p-8 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md animate-fadeIn">
        <h2 className="text-2xl font-semibold mb-4">Configuration Error</h2>
        <p>Gemini API key is not configured or missing.</p>
        <p>The document processing feature is currently unavailable.</p>
      </div>
    );
  }

  return (
    <div>
      <Topbar />
      <div className="mx-2 sm:mx-10">
        <FileUploadArea
          onFilesAdded={handleFilesAdded}
          currentFileCount={uploadedFiles.length}
        />

        {uploadedFiles.length > 0 && (
          <div className="mt-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Uploaded Documents
              </h2>
              <button
                onClick={handleProcessDocumentsClick}
                disabled={
                  isExtractingBatchData ||
                  filesReadyForDataExtractionCount === 0 ||
                  isClassifyingQueue ||
                  !!classifyingFileId
                }
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center min-w-[200px]"
              >
                {isExtractingBatchData ? (
                  <>
                    <Spinner size="sm" color="text-white" className="mr-2" />
                    Processing...
                  </>
                ) : (
                  `Process Data (${filesReadyForDataExtractionCount} Ready)`
                )}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {uploadedFiles.map((uploadedFile) => (
                <FileCard
                  key={uploadedFile.id}
                  uploadedFile={uploadedFile}
                  onPreview={handlePreview}
                  onRemove={handleRemoveFile}
                />
              ))}
            </div>
          </div>
        )}

        {isClassifyingQueue && classifyingFileId && (
          <div className="fixed bottom-4 right-4 bg-indigo-600 text-white p-3 rounded-lg shadow-lg flex items-center space-x-2 animate-fadeIn">
            <Spinner size="sm" color="text-white" />
            <span>
              Classifying:{" "}
              {uploadedFiles.find((f) => f.id === classifyingFileId)?.file.name}
              ...
            </span>
          </div>
        )}

        {isExtractingBatchData && currentlyExtractingDataFileId && (
          <div className="fixed bottom-16 right-4 bg-green-600 text-white p-3 rounded-lg shadow-lg flex items-center space-x-2 animate-fadeIn z-20">
            <Spinner size="sm" color="text-white" />
            <span>
              Extracting Data:{" "}
              {
                uploadedFiles.find(
                  (f) => f.id === currentlyExtractingDataFileId
                )?.file.name
              }
              ...
            </span>
          </div>
        )}

        {selectedFileForPreview && (
          <FilePreviewModal
            file={selectedFileForPreview}
            onClose={handleClosePreview}
          />
        )}

        <div className="mt-12 space-y-10">
          {Object.entries(extractedDataByCategory).map(
            ([category, filesWithData]) => {
              if (filesWithData.length === 0) return null;
              const cat = category as DocumentCategory;
              const columns = COLUMN_DEFINITIONS[cat];
              if (!columns || columns.length === 0) return null;

              if (cat === DocumentCategory.LOAN_APPLICATION) {
                return (
                  <DocumentDataTable<LoanApplicationData>
                    key={cat}
                    category={cat}
                    files={filesWithData}
                    columns={columns as never}
                  />
                );
              } else if (cat === DocumentCategory.UNSECURED_LOANS_APPLICATION) {
                return (
                  <DocumentDataTable<UnsecuredLoansApplicationData>
                    key={cat}
                    category={cat}
                    files={filesWithData}
                    columns={columns as never}
                  />
                );
              } else if (cat === DocumentCategory.SPECIAL_LOANS) {
                return (
                  <DocumentDataTable<SpecialLoansData>
                    key={cat}
                    category={cat}
                    files={filesWithData}
                    columns={columns as never}
                  />
                );
              }
              return null;
            }
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
