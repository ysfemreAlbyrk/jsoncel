import type { JsonArray, JsonData } from "../types";

export class JsonParser {
  static parseJson(jsonString: string): JsonArray {
    try {
      const parsed = JSON.parse(jsonString);

      if (Array.isArray(parsed)) {
        return parsed;
      }

      if (typeof parsed === "object" && parsed !== null) {
        return [parsed];
      }

      return [{ value: parsed }];
    } catch (error) {
      throw new Error(
        `Invalid JSON: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  static validateJson(jsonString: string): {
    isValid: boolean;
    error?: string;
  } {
    try {
      JSON.parse(jsonString);
      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : "Invalid JSON format",
      };
    }
  }

  static formatJson(data: any, prettify: boolean = true): string {
    try {
      return JSON.stringify(data, null, prettify ? 2 : 0);
    } catch (error) {
      throw new Error(
        `Failed to format JSON: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  static normalizeData(data: any[]): JsonArray {
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    const allKeys = new Set<string>();
    data.forEach((item) => {
      if (typeof item === "object" && item !== null) {
        Object.keys(item).forEach((key) => allKeys.add(key));
      }
    });

    return data.map((item) => {
      if (typeof item === "object" && item !== null) {
        const normalized: JsonData = {};
        allKeys.forEach((key) => {
          normalized[key] = item[key] ?? null;
        });
        return normalized;
      }

      return { value: item };
    });
  }
}

export const parseJson = JsonParser.parseJson;
export const validateJson = JsonParser.validateJson;
export const formatJson = JsonParser.formatJson;
export const normalizeData = JsonParser.normalizeData;
