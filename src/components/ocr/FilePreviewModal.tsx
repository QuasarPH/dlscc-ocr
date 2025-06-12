"use client";

import React, { useState } from "react";
import Image from "next/image";

interface FilePreviewModalProps {
  file: UploadedFile | null;
  onClose: () => void;
}

const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  file,
  onClose,
}) => {
  const [imageError, setImageError] = useState(false);

  React.useEffect(() => {
    if (file) {
      setImageError(false);
    }
  }, [file]);

  if (!file) return null;

  const isBlobUrl = file.previewUrl && file.previewUrl.startsWith("blob:");

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100] p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white p-2 md:p-4 rounded-lg shadow-2xl max-w-3xl max-h-[90vh] w-full flex flex-col animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-2 md:mb-4">
          <h3 className="text-lg md:text-xl font-semibold text-gray-800 truncate">
            {file.file.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 transition-colors p-1 rounded-full"
            aria-label="Close preview"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
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
        </div>
        <div className="overflow-auto flex-grow flex items-center justify-center bg-gray-100 rounded">
          {isBlobUrl && file.previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={file.previewUrl}
              alt={`Preview of ${file.file.name}`}
              className="max-w-full max-h-[75vh] object-contain"
            />
          ) : file.previewUrl && !imageError ? (
            // Use next/image for remote URLs to get automatic optimization.
            <Image
              src={file.previewUrl}
              alt={`Preview of ${file.file.name}`}
              // We don't know the exact size, so we let CSS control it.
              // Providing width={0} and height={0} with sizes makes it responsive.
              width={0}
              height={0}
              sizes="90vw"
              className="w-auto h-auto max-w-full max-h-[75vh] object-contain"
              priority
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="text-center p-10 text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-24 w-24 mx-auto text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p>No preview available.</p>
              <p className="text-sm text-gray-500">
                {imageError
                  ? "The image failed to load."
                  : "This might be a non-image file."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;
