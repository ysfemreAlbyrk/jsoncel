import React, { useState, useCallback } from "react";
import {
  Download,
  FileText,
  FileSpreadsheet,
  File,
  ChevronDown,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { toast } from "../ui/ToastContainer";
import {
  exportToJson,
  exportToCsv,
  exportToExcel,
} from "../../utils/exportHelpers";
import type { JsonArray } from "../../types";

interface ExportButtonProps {
  data: JsonArray;
  projectName: string;
  disabled?: boolean;
  className?: string;
}

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: JsonArray;
  projectName: string;
}

type ExportFormat = "json" | "csv" | "excel";

interface ExportOption {
  format: ExportFormat;
  label: string;
  icon: React.ReactNode;
  description: string;
  fileExtension: string;
}

const exportOptions: ExportOption[] = [
  {
    format: "json",
    label: "JSON",
    icon: <FileText className="w-5 h-5" />,
    description: "Export as JSON file with full data structure",
    fileExtension: ".json",
  },
  {
    format: "csv",
    label: "CSV",
    icon: <FileSpreadsheet className="w-5 h-5" />,
    description: "Export as CSV file for spreadsheet applications",
    fileExtension: ".csv",
  },
  {
    format: "excel",
    label: "Excel",
    icon: <File className="w-5 h-5" />,
    description: "Export as Excel file with formatting",
    fileExtension: ".xlsx",
  },
];

function ExportModal({ isOpen, onClose, data, projectName }: ExportModalProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("json");

  const handleExport = useCallback(
    async (format: ExportFormat) => {
      if (!data || data.length === 0) {
        toast.error("No data to export");
        return;
      }

      setIsExporting(true);
      try {
        const filename = `${projectName || "export"}_${
          new Date().toISOString().split("T")[0]
        }`;

        switch (format) {
          case "json":
            await exportToJson(data, filename);
            toast.success("JSON file exported successfully");
            break;
          case "csv":
            await exportToCsv(data, filename);
            toast.success("CSV file exported successfully");
            break;
          case "excel":
            await exportToExcel(data, filename);
            toast.success("Excel file exported successfully");
            break;
          default:
            throw new Error("Unsupported export format");
        }

        onClose();
      } catch (error) {
        console.error("Export error:", error);
        toast.error(
          `Export failed: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      } finally {
        setIsExporting(false);
      }
    },
    [data, projectName, onClose]
  );

  const handleQuickExport = useCallback(
    (format: ExportFormat) => {
      setSelectedFormat(format);
      handleExport(format);
    },
    [handleExport]
  );

  const dataPreview = data.slice(0, 3);
  const totalRows = data.length;
  const totalColumns = data.length > 0 ? Object.keys(data[0]).length : 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export Data"
      className="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Data Summary */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Export Summary
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Project:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">
                {projectName || "Untitled"}
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Rows:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">
                {totalRows.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Columns:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">
                {totalColumns}
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Date:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Data Preview */}
        {dataPreview.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Data Preview (First 3 rows)
            </h3>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      {Object.keys(dataPreview[0]).map((key) => (
                        <th
                          key={key}
                          className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {dataPreview.map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((value, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                          >
                            {String(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Export Options */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Select Export Format
          </h3>
          <div className="grid gap-3">
            {exportOptions.map((option) => (
              <div
                key={option.format}
                className={`relative rounded-lg border p-4 cursor-pointer transition-all duration-200 ${
                  selectedFormat === option.format
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
                onClick={() => setSelectedFormat(option.format)}
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`flex-shrink-0 ${
                      selectedFormat === option.format
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-400"
                    }`}
                  >
                    {option.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {option.label}
                      </h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {option.fileExtension}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {option.description}
                    </p>
                  </div>
                </div>
                {selectedFormat === option.format && (
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Export Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={onClose} disabled={isExporting}>
            Cancel
          </Button>
          <Button
            onClick={() => handleExport(selectedFormat)}
            disabled={isExporting || !data || data.length === 0}
            className="min-w-[120px]"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export {selectedFormat.toUpperCase()}
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export function ExportButton({
  data,
  projectName,
  disabled = false,
  className = "",
}: ExportButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleQuickExport = useCallback(
    async (format: ExportFormat, event: React.MouseEvent) => {
      event.stopPropagation();
      setIsDropdownOpen(false);

      if (!data || data.length === 0) {
        toast.error("No data to export");
        return;
      }

      try {
        const filename = `${projectName || "export"}_${
          new Date().toISOString().split("T")[0]
        }`;

        switch (format) {
          case "json":
            await exportToJson(data, filename);
            toast.success("JSON file exported successfully");
            break;
          case "csv":
            await exportToCsv(data, filename);
            toast.success("CSV file exported successfully");
            break;
          case "excel":
            await exportToExcel(data, filename);
            toast.success("Excel file exported successfully");
            break;
        }
      } catch (error) {
        console.error("Export error:", error);
        toast.error(
          `Export failed: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
    [data, projectName]
  );

  const hasData = data && data.length > 0;

  return (
    <>
      <div className={`relative ${className}`}>
        {/* Main Export Button */}
        <div className="flex">
          <Button
            onClick={() => setIsModalOpen(true)}
            disabled={disabled || !hasData}
            className="rounded-r-none border-r-0"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>

          {/* Dropdown Toggle */}
          <Button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            disabled={disabled || !hasData}
            className="rounded-l-none px-2 border-l border-blue-600 dark:border-blue-400"
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </Button>
        </div>

        {/* Quick Export Dropdown */}
        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
            <div className="py-1">
              {exportOptions.map((option) => (
                <button
                  key={option.format}
                  onClick={(e) => handleQuickExport(option.format, e)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  {option.icon}
                  <span>Export as {option.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={data}
        projectName={projectName}
      />
    </>
  );
}
