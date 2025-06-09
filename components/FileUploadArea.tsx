import React, { useCallback, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs'; // Updated import
import { MAX_TOTAL_FILES, ACCEPTED_FILE_TYPES, ALLOWED_IMAGE_TYPES } from '../constants';
import { UploadedFile, DocumentCategory } from '../types';

// Configure PDF.js worker. Use the exact version from the import map.
const PDFJS_VERSION = '4.4.168'; 
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.mjs`;

interface FileUploadAreaProps {
  onFilesAdded: (newFiles: UploadedFile[]) => void;
  currentFileCount: number;
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({ onFilesAdded, currentFileCount }) => {
  const [isDragging, setIsDragging] = useState(false);

  const processFiles = useCallback(async (files: File[]) => {
    const availableSlots = MAX_TOTAL_FILES - currentFileCount;
    if (availableSlots <= 0) {
        alert(`You can upload a maximum of ${MAX_TOTAL_FILES} files in total.`);
        return;
    }
    
    const filesToProcessInput = files.slice(0, availableSlots);
    if (files.length > availableSlots) {
        alert(`You tried to upload ${files.length} files, but only ${availableSlots} slots are remaining. Adding the first ${availableSlots} valid files.`);
    }

    const newUploadedFilesPromises = filesToProcessInput.map(async (file): Promise<UploadedFile> => {
      const baseUploadedFile = {
        id: `${file.name}-${Date.now()}`,
        file,
        category: DocumentCategory.PROCESSING, // Initial status
        error: undefined,
        originalMimeType: file.type,
      };

      if (file.type === 'application/pdf') {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          const page = await pdfDoc.getPage(1); // Get first page
          const viewport = page.getViewport({ scale: 1.5 }); // Adjust scale as needed
          
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const canvasContext = canvas.getContext('2d');

          if (!canvasContext) {
            throw new Error('Could not get canvas context');
          }

          await page.render({ canvasContext, viewport }).promise;
          const previewUrl = canvas.toDataURL('image/png'); // Convert to PNG data URL

          return {
            ...baseUploadedFile,
            previewUrl,
            processedMimeType: 'image/png',
          };
        } catch (pdfError) {
          console.error(`Error processing PDF ${file.name}:`, pdfError);
          return {
            ...baseUploadedFile,
            previewUrl: null,
            category: DocumentCategory.ERROR,
            error: "Failed to render PDF preview. File may be corrupted or unsupported.",
            processedMimeType: undefined,
          };
        }
      } else if (ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return {
          ...baseUploadedFile,
          previewUrl: URL.createObjectURL(file), // Blob URL for direct images
          processedMimeType: file.type,
        };
      } else {
        // Unsupported file type
        console.warn(`File ${file.name} is not a supported image or PDF type. It will be marked as 'Others'.`);
        return {
          ...baseUploadedFile,
          previewUrl: null,
          category: DocumentCategory.OTHERS,
          error: "File type not supported. Must be an image (PNG, JPG, GIF, WEBP) or PDF.",
          processedMimeType: undefined,
        };
      }
    });

    const newUploadedFiles = await Promise.all(newUploadedFilesPromises);
    const validNewFiles = newUploadedFiles.filter(Boolean) as UploadedFile[]; // Filter out any potential issues

    if (validNewFiles.length > 0) {
      onFilesAdded(validNewFiles);
    }
  }, [currentFileCount, onFilesAdded]);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      processFiles(Array.from(event.target.files));
    }
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer.files) {
      processFiles(Array.from(event.dataTransfer.files));
    }
  }, [processFiles]); // processFiles is now a dependency

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  return (
    <div className="mb-8 p-6 border-2 border-dashed border-gray-300 rounded-lg text-center bg-white shadow-sm"> {/* Changed bg-gray-50 to bg-white */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`p-8 rounded-md transition-colors duration-200 ${
          isDragging ? 'bg-indigo-50 border-indigo-400' : 'bg-gray-100 border-gray-300 hover:border-indigo-300' // Changed bg-gray-50 to bg-gray-100 for dropzone
        }`}
      >
        <input
          type="file"
          id="fileUpload"
          multiple
          accept={ACCEPTED_FILE_TYPES}
          onChange={handleFileChange}
          className="hidden"
          disabled={currentFileCount >= MAX_TOTAL_FILES}
        />
        <label htmlFor="fileUpload" className="cursor-pointer">
          <div className="flex flex-col items-center">
            <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
            <p className="text-lg font-medium text-gray-700"> {/* text-gray-700 for main text */}
              Drag & drop files here, or click to select
            </p>
            <p className="text-sm text-gray-500 mt-1"> {/* text-gray-500 for secondary text */}
              Supported types: PNG, JPG, GIF, WEBP, PDF. Max {MAX_TOTAL_FILES - currentFileCount} files remaining.
            </p>
            {currentFileCount >= MAX_TOTAL_FILES && (
              <p className="text-sm text-red-500 mt-2 font-semibold">Maximum file limit reached.</p>
            )}
          </div>
        </label>
      </div>
    </div>
  );
};

export default FileUploadArea;