"use client";

// Add Image from next/image and useState from React to the imports
import React, { useState } from "react";
import Image from "next/image";
import { NON_PROCESSABLE_FOR_DATA_EXTRACTION_CATEGORIES } from "@/constants";
import Spinner from "./Spinner";
import { DocumentCategory } from "@/constants";

const CATEGORY_COLORS: Record<DocumentCategory, string> = {
  [DocumentCategory.LOAN_APPLICATION]: "bg-blue-600 text-white",
  [DocumentCategory.UNSECURED_LOANS_APPLICATION]: "bg-teal-600 text-white",
  [DocumentCategory.SPECIAL_LOANS]: "bg-purple-600 text-white",
  [DocumentCategory.OTHERS]: "bg-gray-500 text-white",
  [DocumentCategory.PROCESSING]: "bg-amber-500 text-black",
  [DocumentCategory.ERROR]: "bg-red-600 text-white",
};

interface FileCardProps {
  uploadedFile: UploadedFile;
  onPreview: (file: UploadedFile) => void;
  onRemove?: (fileId: string) => void;
}

const FileCard: React.FC<FileCardProps> = ({
  uploadedFile,
  onPreview,
  onRemove,
}) => {
  const {
    file,
    previewUrl,
    category,
    error,
    isDataExtracting,
    isDataExtracted,
    dataExtractionError,
  } = uploadedFile;

  // State to handle image loading errors for a fallback
  const [imageError, setImageError] = useState(false);

  const categoryColor =
    CATEGORY_COLORS[category as DocumentCategory] ||
    CATEGORY_COLORS[DocumentCategory.OTHERS];

  const isSuitableForDataExtraction =
    !NON_PROCESSABLE_FOR_DATA_EXTRACTION_CATEGORIES.includes(
      category as DocumentCategory
    );

  let statusMessage = "";
  let statusColor = "";

  if (isDataExtracting) {
    statusMessage = "Extracting data...";
    statusColor = "text-amber-600";
  } else if (isDataExtracted) {
    statusMessage = "Data extracted";
    statusColor = "text-green-600";
  } else if (dataExtractionError) {
    statusMessage = "Extraction failed";
    statusColor = "text-red-600";
  } else if (
    isSuitableForDataExtraction &&
    category !== DocumentCategory.PROCESSING &&
    category !== DocumentCategory.ERROR
  ) {
    statusMessage = "Ready for data extraction";
    statusColor = "text-gray-500";
  }

  const isBlobUrl = previewUrl && previewUrl.startsWith("blob:");

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl">
      <div className="relative aspect-video bg-gray-100 flex items-center justify-center">
        {category === DocumentCategory.PROCESSING ? (
          <Spinner size="md" />
        ) : isBlobUrl ? (
          // Use standard <img> for blob URLs
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt={`Preview of ${file.name}`}
            className="w-full h-full object-contain p-1 cursor-pointer"
            onClick={() => onPreview(uploadedFile)}
          />
        ) : previewUrl && !imageError ? (
          // Use next/image for all other URLs
          <Image
            src={previewUrl}
            alt={`Preview of ${file.name}`}
            fill
            className="object-contain p-1 cursor-pointer"
            onClick={() => onPreview(uploadedFile)}
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div
            className="p-4 text-center text-gray-500 cursor-pointer"
            onClick={() => onPreview(uploadedFile)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <p className="mt-2 text-xs">
              {imageError ? "Image failed to load" : "No image preview"}
            </p>
          </div>
        )}
        {onRemove && (
          <button
            onClick={() => onRemove(uploadedFile.id)}
            className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700 transition-colors text-xs z-10"
            aria-label="Remove file"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <h3
            className="text-sm font-semibold text-gray-800 truncate"
            title={file.name}
          >
            {file.name}
          </h3>
          <p className="text-xs text-gray-500">
            {(file.size / 1024).toFixed(1)} KB
          </p>
        </div>
        <div
          className={`mt-3 py-1 px-2 text-xs font-medium rounded-full text-center ${categoryColor}`}
        >
          {category}
        </div>
        {error && (
          <p className="mt-1 text-xs text-red-600" title={error}>
            Classification Error: {error.substring(0, 50)}...
          </p>
        )}

        {statusMessage && (
          <div
            className={`mt-1 text-xs font-medium text-center ${statusColor}`}
            title={
              dataExtractionError ||
              (statusMessage === "Extraction failed"
                ? uploadedFile.dataExtractionError
                : statusMessage)
            }
          >
            {isDataExtracting && (
              <Spinner
                size="sm"
                color={statusColor.replace("text-", "border-")}
                className="inline-block mr-1 align-middle"
              />
            )}
            <span className="align-middle">{statusMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileCard;
