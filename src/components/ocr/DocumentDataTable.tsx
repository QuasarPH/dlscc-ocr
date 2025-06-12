"use client";

import React from "react";
import { DocumentCategory } from "@/constants";

// NOTE: Assuming ExtractedData and UploadedFile types are defined elsewhere
interface ExtractedData {
  [key: string]: never;
}
interface UploadedFile {
  id: string;
  file: File;
  extractedData?: ExtractedData;
}
interface TableColumn<T> {
  key: keyof T;
  label: string;
  type?: "string" | "number" | "date" | "boolean";
}

interface DocumentDataTableProps<T extends ExtractedData> {
  category: DocumentCategory;
  files: UploadedFile[];
  columns: TableColumn<T>[];
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString.length > 2 ? dateString : "N/A";
    }
    if (!/\d{4}/.test(dateString) && dateString.split(/[\/\-]/).length < 3) {
      return dateString;
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

const escapeCsvValue = (value: unknown): string => {
  if (value === null || typeof value === "undefined") {
    return "";
  }
  const stringValue = String(value);
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

const DocumentDataTable = <T extends ExtractedData>({
  category,
  files,
  columns,
}: DocumentDataTableProps<T>) => {
  if (!files || files.length === 0) {
    return null;
  }

  const getDisplayValue = (
    value: unknown,
    type?: "string" | "number" | "date" | "boolean"
  ): string | number | React.ReactNode => {
    if (value === null || typeof value === "undefined")
      return <span className="text-gray-400 italic">N/A</span>;

    switch (type) {
      case "date":
        return formatDate(String(value));
      case "number":
        return typeof value === "number" ? (
          value.toLocaleString()
        ) : (
          <span className="text-gray-400 italic">N/A</span>
        );
      case "boolean":
        return value === true ? (
          <span className="text-green-700 font-semibold">Yes</span>
        ) : value === false ? (
          <span className="text-red-700 font-semibold">No</span>
        ) : (
          <span className="text-gray-400 italic">N/A</span>
        );
      default:
        return String(value);
    }
  };

  const validFiles = files.filter((f) => f.extractedData);

  const formatValueForCsv = (
    value: unknown,
    type?: "string" | "number" | "date" | "boolean"
  ): string => {
    if (value === null || typeof value === "undefined") return "N/A";
    switch (type) {
      case "date":
        return formatDate(String(value));
      case "boolean":
        return value === true ? "Yes" : value === false ? "No" : "N/A";
      case "number":
        return typeof value === "number" ? String(value) : "N/A";
      default:
        return String(value);
    }
  };

  const handleDownloadCsv = () => {
    if (validFiles.length === 0) return;

    const csvHeader = ["File Name", ...columns.map((col) => col.label)]
      .map(escapeCsvValue)
      .join(",");

    const csvRows = validFiles.map((file) => {
      const rowData = [
        file.file.name,
        ...columns.map((col) => {
          const value = file.extractedData
            ? (file.extractedData as T)[col.key]
            : null;
          return formatValueForCsv(value, col.type);
        }),
      ];
      return rowData.map(escapeCsvValue).join(",");
    });

    const csvContent = [csvHeader, ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    const safeCategoryName = category
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_]/g, "");
    link.setAttribute("download", `${safeCategoryName}_extracted_data.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (validFiles.length === 0) {
    return (
      <div className="mt-4 p-4 bg-gray-100 rounded-md shadow">
        <p className="text-gray-600">
          No data has been successfully extracted for {category} documents yet.
        </p>
      </div>
    );
  }

  return (
    <div className="my-8 p-2 bg-white shadow-xl rounded-lg animate-fadeIn">
      <div className="flex justify-between items-center px-4 py-3 bg-indigo-50 rounded-t-lg">
        <h3 className="text-2xl font-semibold text-indigo-700">
          {category} - Extracted Data
        </h3>
        <button
          onClick={handleDownloadCsv}
          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          aria-label={`Download ${category} data as CSV`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 inline-block mr-1.5 -mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {/* CHANGE HERE: Removed sticky classes */}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider min-w-[150px] max-w-[250px] truncate">
                File Name
              </th>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider min-w-[120px]"
                  title={col.label}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {validFiles.map((file) => (
              <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                {/* CHANGE HERE: Removed sticky classes and redundant background/hover classes */}
                <td
                  className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800 min-w-[150px] max-w-[250px] truncate"
                  title={file.file.name}
                >
                  {file.file.name}
                </td>
                {columns.map((col) => (
                  <td
                    key={`${file.id}-${String(col.key)}`}
                    className="px-4 py-3 whitespace-nowrap text-sm text-gray-700"
                  >
                    {getDisplayValue(
                      file.extractedData
                        ? (file.extractedData as T)[col.key]
                        : null,
                      col.type
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {validFiles.length === 0 && (
        <p className="p-4 text-sm text-gray-500">
          No data to display for this category.
        </p>
      )}
    </div>
  );
};

export default DocumentDataTable;
