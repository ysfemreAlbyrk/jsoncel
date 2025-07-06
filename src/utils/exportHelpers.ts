import { saveAs } from "file-saver";
import type { JsonArray } from "../types";

/**
 * Export data as JSON file
 */
export async function exportToJson(
  data: JsonArray,
  filename: string
): Promise<void> {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], {
      type: "application/json;charset=utf-8",
    });
    saveAs(blob, `${filename}.json`);
  } catch (error) {
    throw new Error(
      `Failed to export JSON: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Export data as CSV file
 */
export async function exportToCsv(
  data: JsonArray,
  filename: string
): Promise<void> {
  try {
    if (!data || data.length === 0) {
      throw new Error("No data to export");
    }

    // Get all unique keys from all objects
    const allKeys = new Set<string>();
    data.forEach((row) => {
      Object.keys(row).forEach((key) => allKeys.add(key));
    });

    const headers = Array.from(allKeys);

    // Create CSV content
    const csvContent = [
      // Header row
      headers.map((header) => escapeCSVValue(header)).join(","),
      // Data rows
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            return escapeCSVValue(value);
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    saveAs(blob, `${filename}.csv`);
  } catch (error) {
    throw new Error(
      `Failed to export CSV: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Export data as Excel file
 */
export async function exportToExcel(
  data: JsonArray,
  filename: string
): Promise<void> {
  try {
    if (!data || data.length === 0) {
      throw new Error("No data to export");
    }

    // For Excel export, we'll use a simple approach by creating an HTML table
    // and saving it as .xls file (which Excel can open)
    const allKeys = new Set<string>();
    data.forEach((row) => {
      Object.keys(row).forEach((key) => allKeys.add(key));
    });

    const headers = Array.from(allKeys);

    // Create HTML table
    const htmlContent = `
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
          </style>
        </head>
        <body>
          <table>
            <thead>
              <tr>
                ${headers
                  .map((header) => `<th>${escapeHTML(header)}</th>`)
                  .join("")}
              </tr>
            </thead>
            <tbody>
              ${data
                .map(
                  (row) => `
                <tr>
                  ${headers
                    .map(
                      (header) =>
                        `<td>${escapeHTML(String(row[header] || ""))}</td>`
                    )
                    .join("")}
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], {
      type: "application/vnd.ms-excel;charset=utf-8",
    });
    saveAs(blob, `${filename}.xls`);
  } catch (error) {
    throw new Error(
      `Failed to export Excel: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Advanced Excel export using XLSX library (requires xlsx package)
 */
export async function exportToExcelAdvanced(
  data: JsonArray,
  filename: string
): Promise<void> {
  // Fallback to basic Excel export since XLSX is not installed
  console.warn(
    "XLSX library not available, falling back to basic Excel export"
  );
  return exportToExcel(data, filename);
}

/**
 * Escape CSV values to handle commas, quotes, and newlines
 */
function escapeCSVValue(value: any): string {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = String(value);

  // If value contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

/**
 * Escape HTML characters
 */
function escapeHTML(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Get file extension for export format
 */
export function getFileExtension(format: "json" | "csv" | "excel"): string {
  switch (format) {
    case "json":
      return ".json";
    case "csv":
      return ".csv";
    case "excel":
      return ".xlsx";
    default:
      return ".txt";
  }
}

/**
 * Get MIME type for export format
 */
export function getMimeType(format: "json" | "csv" | "excel"): string {
  switch (format) {
    case "json":
      return "application/json";
    case "csv":
      return "text/csv";
    case "excel":
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    default:
      return "text/plain";
  }
}

/**
 * Validate data before export
 */
export function validateExportData(data: JsonArray): {
  isValid: boolean;
  error?: string;
} {
  if (!data) {
    return { isValid: false, error: "Data is null or undefined" };
  }

  if (!Array.isArray(data)) {
    return { isValid: false, error: "Data must be an array" };
  }

  if (data.length === 0) {
    return { isValid: false, error: "Data array is empty" };
  }

  // Check if all items are objects
  const hasInvalidItems = data.some(
    (item) => typeof item !== "object" || item === null || Array.isArray(item)
  );

  if (hasInvalidItems) {
    return { isValid: false, error: "All data items must be objects" };
  }

  return { isValid: true };
}

/**
 * Get export statistics
 */
export function getExportStats(data: JsonArray): {
  totalRows: number;
  totalColumns: number;
  columnNames: string[];
  dataTypes: Record<string, string>;
} {
  if (!data || data.length === 0) {
    return {
      totalRows: 0,
      totalColumns: 0,
      columnNames: [],
      dataTypes: {},
    };
  }

  const allKeys = new Set<string>();
  const dataTypes: Record<string, string> = {};

  data.forEach((row) => {
    Object.entries(row).forEach(([key, value]) => {
      allKeys.add(key);

      // Determine data type
      if (!dataTypes[key]) {
        if (typeof value === "number") {
          dataTypes[key] = "number";
        } else if (typeof value === "boolean") {
          dataTypes[key] = "boolean";
        } else if (value instanceof Date) {
          dataTypes[key] = "date";
        } else if (value === null || value === undefined) {
          dataTypes[key] = "null";
        } else {
          dataTypes[key] = "string";
        }
      }
    });
  });

  const columnNames = Array.from(allKeys);

  return {
    totalRows: data.length,
    totalColumns: columnNames.length,
    columnNames,
    dataTypes,
  };
}
