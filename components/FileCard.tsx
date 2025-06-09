import React from 'react';
import { UploadedFile, DocumentCategory } from '../types';
import { CATEGORY_COLORS, NON_PROCESSABLE_FOR_DATA_EXTRACTION_CATEGORIES } from '../constants';
import Spinner from './Spinner';

interface FileCardProps {
  uploadedFile: UploadedFile;
  onPreview: (file: UploadedFile) => void;
  onRemove?: (fileId: string) => void; // Optional remove functionality
}

const FileCard: React.FC<FileCardProps> = ({ uploadedFile, onPreview, onRemove }) => {
  const { file, previewUrl, category, error, 
          isDataExtracting, isDataExtracted, dataExtractionError 
        } = uploadedFile;
  const categoryColor = CATEGORY_COLORS[category] || CATEGORY_COLORS[DocumentCategory.OTHERS];
  
  const isSuitableForDataExtraction = !NON_PROCESSABLE_FOR_DATA_EXTRACTION_CATEGORIES.includes(category);


  let statusMessage = "";
  let statusColor = "";

  if (isDataExtracting) {
    statusMessage = "Extracting data...";
    statusColor = "text-amber-600"; // Using amber for processing-like state
  } else if (isDataExtracted) {
    statusMessage = "Data extracted";
    statusColor = "text-green-600";
  } else if (dataExtractionError) {
    statusMessage = `Extraction failed`; // Simpler message for card
    statusColor = "text-red-600";
  } else if (isSuitableForDataExtraction && category !== DocumentCategory.PROCESSING && category !== DocumentCategory.ERROR) {
     statusMessage = "Ready for data extraction";
     statusColor = "text-gray-500"; // Muted color for 'ready' state
  }


  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl"> {/* Card background to white */}
      <div className="relative aspect-video bg-gray-100 flex items-center justify-center"> {/* Preview background to lighter gray */}
        {category === DocumentCategory.PROCESSING ? (
          <Spinner size="md" />
        ) : previewUrl ? (
          <img
            src={previewUrl}
            alt={`Preview of ${file.name}`}
            className="w-full h-full object-contain p-1 cursor-pointer"
            onClick={() => onPreview(uploadedFile)}
            onError={(e) => (e.currentTarget.src = 'https://picsum.photos/300/200?grayscale&blur=2')} // Fallback
          />
        ) : (
          <div className="p-4 text-center text-gray-500 cursor-pointer"  onClick={() => onPreview(uploadedFile)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            <p className="mt-2 text-xs">No image preview</p>
          </div>
        )}
        {onRemove && (
            <button
                onClick={() => onRemove(uploadedFile.id)}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700 transition-colors text-xs z-10" // Keep red for remove action
                aria-label="Remove file"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        )}
      </div>

      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-800 truncate" title={file.name}> {/* Darker text for filename */}
            {file.name}
          </h3>
          <p className="text-xs text-gray-500"> {/* Lighter text for file size */}
            {(file.size / 1024).toFixed(1)} KB
          </p>
        </div>
        
        <div className={`mt-3 py-1 px-2 text-xs font-medium rounded-full text-center ${categoryColor}`}>
          {category}
        </div>
        {error && <p className="mt-1 text-xs text-red-600" title={error}>Classification Error: {error.substring(0,50)}...</p>}
        
        {statusMessage && (
          <p className={`mt-1 text-xs font-medium text-center ${statusColor}`} title={dataExtractionError || (statusMessage === "Extraction failed" ? uploadedFile.dataExtractionError : statusMessage)}>
            {isDataExtracting && <Spinner size="sm" color={statusColor.replace('text-','border-')} className="inline-block mr-1"/>}
            {statusMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default FileCard;