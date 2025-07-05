import React, { useState, useCallback, useRef } from "react";
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { parseJsonFile, validateJsonData } from "../../utils/fileHandlers";
import type { JsonArray, FileUploadResult } from "../../types";

interface FileUploadProps {
  onFileUpload: (data: JsonArray, filename: string) => void;
  onError: (error: string) => void;
  acceptedTypes?: string[];
  maxFileSize?: number; // in MB
  className?: string;
}

export function FileUpload({
  onFileUpload,
  onError,
  acceptedTypes = [".json", ".csv"],
  maxFileSize = 10,
  className = "",
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileValidation = useCallback(
    (file: File): boolean => {
      // Check file size
      if (file.size > maxFileSize * 1024 * 1024) {
        onError(`File size must be less than ${maxFileSize}MB`);
        return false;
      }

      // Check file type
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
      if (!acceptedTypes.includes(fileExtension)) {
        onError(
          `Unsupported file type. Accepted types: ${acceptedTypes.join(", ")}`
        );
        return false;
      }

      return true;
    },
    [acceptedTypes, maxFileSize, onError]
  );

  const processFile = useCallback(
    async (file: File) => {
      if (!handleFileValidation(file)) {
        return;
      }

      setIsUploading(true);
      setUploadStatus("idle");

      try {
        const result: FileUploadResult = await parseJsonFile(file);

        // Validate JSON data structure
        const validationResult = validateJsonData(result.data);
        if (!validationResult.isValid) {
          throw new Error(validationResult.error || "Invalid JSON structure");
        }

        // Success
        onFileUpload(result.data, file.name);
        setUploadStatus("success");

        // Reset status after 3 seconds
        setTimeout(() => setUploadStatus("idle"), 3000);
      } catch (error) {
        console.error("File upload error:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        onError(errorMessage);
        setUploadStatus("error");

        // Reset status after 5 seconds
        setTimeout(() => setUploadStatus("idle"), 5000);
      } finally {
        setIsUploading(false);
      }
    },
    [handleFileValidation, onFileUpload, onError]
  );

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        processFile(files[0]); // Only process the first file
      }
    },
    [processFile]
  );

  // File input change handler
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        processFile(files[0]);
      }
      // Reset input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [processFile]
  );

  // Click to upload
  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case "success":
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case "error":
        return <AlertCircle className="w-8 h-8 text-red-500" />;
      default:
        return (
          <Upload
            className={`w-8 h-8 ${
              isDragOver ? "text-blue-600" : "text-gray-400"
            }`}
          />
        );
    }
  };

  const getStatusText = () => {
    if (isUploading) {
      return "Processing file...";
    }

    switch (uploadStatus) {
      case "success":
        return "File uploaded successfully!";
      case "error":
        return "Upload failed. Please try again.";
      default:
        return isDragOver
          ? "Drop file here"
          : "Drag & drop your JSON file here, or click to browse";
    }
  };

  const getBorderColor = () => {
    if (uploadStatus === "success") return "border-green-300";
    if (uploadStatus === "error") return "border-red-300";
    if (isDragOver) return "border-blue-400";
    return "border-gray-300 dark:border-gray-600";
  };

  const getBackgroundColor = () => {
    if (uploadStatus === "success") return "bg-green-50 dark:bg-green-900/20";
    if (uploadStatus === "error") return "bg-red-50 dark:bg-red-900/20";
    if (isDragOver) return "bg-blue-50 dark:bg-blue-900/20";
    return "bg-gray-50 dark:bg-gray-800";
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(",")}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Drop zone */}
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200 ease-in-out
          ${getBorderColor()}
          ${getBackgroundColor()}
          hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20
          ${isUploading ? "pointer-events-none opacity-70" : ""}
        `}
      >
        {/* Upload icon */}
        <div className="flex justify-center mb-4">{getStatusIcon()}</div>

        {/* Main text */}
        <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {getStatusText()}
        </p>

        {/* Supported formats */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Supported formats: {acceptedTypes.join(", ")} (max {maxFileSize}MB)
        </p>

        {/* File icon */}
        <div className="flex justify-center space-x-2 text-gray-400">
          <FileText className="w-6 h-6" />
          <span className="text-sm">JSON, CSV files</span>
        </div>

        {/* Loading overlay */}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Processing...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Additional info */}
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <p>• JSON files will be automatically parsed and validated</p>
        <p>• CSV files will be converted to JSON format</p>
        <p>• Large files may take a moment to process</p>
      </div>
    </div>
  );
}
