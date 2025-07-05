import { saveAs } from "file-saver";
import type {
  JsonArray,
  FileFormat,
  FileUploadResult,
  ExportOptions,
} from "../types";
import { parseJson, formatJson } from "./jsonParser";

export class FileHandler {
  static async importFromFile(file: File): Promise<FileUploadResult> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const format = this.detectFileFormat(file.name);
          let data: JsonArray;

          switch (format) {
            case "json":
              data = parseJson(content);
              break;
            case "csv":
              data = this.parseCSV(content);
              break;
            default:
              throw new Error(`Unsupported file format: ${format}`);
          }

          resolve({
            data,
            format,
            fileName: file.name,
            size: file.size,
          });
        } catch (error) {
          reject(
            new Error(
              `Failed to parse file: ${
                error instanceof Error ? error.message : "Unknown error"
              }`
            )
          );
        }
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };

      reader.readAsText(file);
    });
  }

  static exportToFile(data: JsonArray, options: ExportOptions): void {
    try {
      let content: string;
      let mimeType: string;

      switch (options.format) {
        case "json":
          content = formatJson(data, options.prettify);
          mimeType = "application/json";
          break;
        case "csv":
          content = this.convertToCSV(data, options.includeHeaders);
          mimeType = "text/csv";
          break;
        default:
          throw new Error(`Unsupported export format: ${options.format}`);
      }

      const blob = new Blob([content], { type: mimeType });
      saveAs(blob, options.fileName);
    } catch (error) {
      throw new Error(
        `Failed to export file: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  static detectFileFormat(filename: string): FileFormat {
    const extension = filename.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "json":
        return "json";
      case "csv":
        return "csv";
      case "xlsx":
      case "xls":
        return "xlsx";
      default:
        return "json";
    }
  }

  private static parseCSV(csvContent: string): JsonArray {
    const lines = csvContent.split("\n").filter((line) => line.trim() !== "");

    if (lines.length === 0) {
      return [];
    }

    const headers = this.parseCSVLine(lines[0]);
    const data: JsonArray = [];

    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i]);
      const row: { [key: string]: any } = {};

      headers.forEach((header, index) => {
        const value = values[index] || "";
        row[header] = this.parseCSVValue(value);
      });

      data.push(row);
    }

    return data;
  }

  private static parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    let i = 0;

    while (i < line.length) {
      const char = line[i];

      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i += 2;
        } else {
          inQuotes = !inQuotes;
          i++;
        }
      } else if (char === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
        i++;
      } else {
        current += char;
        i++;
      }
    }

    result.push(current.trim());
    return result;
  }

  private static parseCSVValue(value: string): any {
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }

    if (!isNaN(Number(value)) && value !== "") {
      return Number(value);
    }

    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;

    return value;
  }

  private static convertToCSV(
    data: JsonArray,
    includeHeaders: boolean = true
  ): string {
    if (data.length === 0) {
      return "";
    }

    const keys = new Set<string>();
    data.forEach((item) => {
      Object.keys(item).forEach((key) => keys.add(key));
    });

    const headers = Array.from(keys);
    const rows: string[] = [];

    if (includeHeaders) {
      rows.push(headers.map((header) => this.escapeCSVValue(header)).join(","));
    }

    data.forEach((item) => {
      const row = headers.map((header) => {
        const value = item[header];
        return this.escapeCSVValue(String(value || ""));
      });
      rows.push(row.join(","));
    });

    return rows.join("\n");
  }

  private static escapeCSVValue(value: string): string {
    if (value.includes(",") || value.includes('"') || value.includes("\n")) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }
}

export const importFromFile = FileHandler.importFromFile;
export const exportToFile = FileHandler.exportToFile;
export const detectFileFormat = FileHandler.detectFileFormat;
