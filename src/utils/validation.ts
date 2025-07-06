// JSON Schema validation and data sanitization utilities

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  sanitizedData?: any;
}

// Basic JSON schema interface
export interface JSONSchema {
  type: "object" | "array" | "string" | "number" | "boolean" | "null";
  properties?: { [key: string]: JSONSchema };
  items?: JSONSchema;
  required?: string[];
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  pattern?: string;
}

// File validation
export const validateFile = (file: File): ValidationResult => {
  const errors: ValidationError[] = [];

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    errors.push({
      field: "file.size",
      message: "File size must be less than 10MB",
      code: "FILE_TOO_LARGE",
    });
  }

  // Check file type
  const allowedTypes = ["application/json", "text/csv", "text/plain"];
  const allowedExtensions = [".json", ".csv", ".txt"];

  const hasValidType = allowedTypes.includes(file.type);
  const hasValidExtension = allowedExtensions.some((ext) =>
    file.name.toLowerCase().endsWith(ext)
  );

  if (!hasValidType && !hasValidExtension) {
    errors.push({
      field: "file.type",
      message: "File must be JSON, CSV, or TXT format",
      code: "INVALID_FILE_TYPE",
    });
  }

  // Check filename
  if (file.name.length > 255) {
    errors.push({
      field: "file.name",
      message: "Filename must be less than 255 characters",
      code: "FILENAME_TOO_LONG",
    });
  }

  // Check for potentially dangerous filenames
  const dangerousPatterns = [
    /\.\./, // Path traversal
    /[<>:"|?*]/, // Invalid characters
    /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i, // Reserved names
  ];

  if (dangerousPatterns.some((pattern) => pattern.test(file.name))) {
    errors.push({
      field: "file.name",
      message: "Filename contains invalid characters",
      code: "INVALID_FILENAME",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// JSON structure validation
export const validateJSON = (data: any): ValidationResult => {
  const errors: ValidationError[] = [];

  try {
    // Check if it's a valid JSON structure
    if (data === null || data === undefined) {
      errors.push({
        field: "data",
        message: "Data cannot be null or undefined",
        code: "NULL_DATA",
      });
      return { isValid: false, errors };
    }

    // For arrays, validate each item
    if (Array.isArray(data)) {
      data.forEach((item, index) => {
        if (typeof item !== "object" || item === null) {
          errors.push({
            field: `data[${index}]`,
            message: "Array items must be objects",
            code: "INVALID_ARRAY_ITEM",
          });
        }
      });
    }

    // For objects, validate structure
    else if (typeof data === "object") {
      // Check for circular references
      try {
        JSON.stringify(data);
      } catch (e) {
        errors.push({
          field: "data",
          message: "Data contains circular references",
          code: "CIRCULAR_REFERENCE",
        });
      }

      // Check depth (max 10 levels)
      const maxDepth = 10;
      const checkDepth = (obj: any, depth = 0): boolean => {
        if (depth > maxDepth) return false;

        if (typeof obj === "object" && obj !== null) {
          for (const key in obj) {
            if (!checkDepth(obj[key], depth + 1)) {
              return false;
            }
          }
        }
        return true;
      };

      if (!checkDepth(data)) {
        errors.push({
          field: "data",
          message: `Data structure is too deep (max ${maxDepth} levels)`,
          code: "TOO_DEEP",
        });
      }
    }

    // Check data size (approximate)
    const dataSize = JSON.stringify(data).length;
    const maxDataSize = 5 * 1024 * 1024; // 5MB

    if (dataSize > maxDataSize) {
      errors.push({
        field: "data",
        message: "Data size is too large (max 5MB)",
        code: "DATA_TOO_LARGE",
      });
    }
  } catch (error) {
    errors.push({
      field: "data",
      message: "Invalid JSON structure",
      code: "INVALID_JSON",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: data,
  };
};

// Input sanitization
export const sanitizeInput = (input: string): string => {
  if (typeof input !== "string") {
    return String(input || "");
  }

  return (
    input
      // Remove null bytes
      .replace(/\0/g, "")
      // Remove control characters (except newline and tab)
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
      // Trim whitespace
      .trim()
      // Limit length
      .substring(0, 1000)
  );
};

// Project name validation
export const validateProjectName = (name: string): ValidationResult => {
  const errors: ValidationError[] = [];
  const sanitizedName = sanitizeInput(name);

  if (!sanitizedName) {
    errors.push({
      field: "name",
      message: "Project name is required",
      code: "REQUIRED",
    });
  }

  if (sanitizedName.length < 1) {
    errors.push({
      field: "name",
      message: "Project name must be at least 1 character",
      code: "TOO_SHORT",
    });
  }

  if (sanitizedName.length > 50) {
    errors.push({
      field: "name",
      message: "Project name must be less than 50 characters",
      code: "TOO_LONG",
    });
  }

  // Check for valid characters
  const validPattern = /^[a-zA-Z0-9\s\-_\.]+$/;
  if (!validPattern.test(sanitizedName)) {
    errors.push({
      field: "name",
      message:
        "Project name can only contain letters, numbers, spaces, hyphens, underscores, and dots",
      code: "INVALID_CHARACTERS",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: sanitizedName,
  };
};

// Data integrity checks
export const checkDataIntegrity = (data: any): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!data) {
    return { isValid: true, errors: [] };
  }

  try {
    // Check for consistent column types in arrays
    if (Array.isArray(data) && data.length > 0) {
      const firstItem = data[0];
      if (typeof firstItem === "object" && firstItem !== null) {
        const expectedKeys = Object.keys(firstItem);

        data.forEach((item, index) => {
          if (typeof item !== "object" || item === null) {
            errors.push({
              field: `data[${index}]`,
              message: "Inconsistent data type in array",
              code: "INCONSISTENT_TYPE",
            });
            return;
          }

          const itemKeys = Object.keys(item);

          // Check for missing keys
          expectedKeys.forEach((key) => {
            if (!(key in item)) {
              errors.push({
                field: `data[${index}].${key}`,
                message: `Missing required field: ${key}`,
                code: "MISSING_FIELD",
              });
            }
          });

          // Check for extra keys
          itemKeys.forEach((key) => {
            if (!expectedKeys.includes(key)) {
              errors.push({
                field: `data[${index}].${key}`,
                message: `Unexpected field: ${key}`,
                code: "UNEXPECTED_FIELD",
              });
            }
          });
        });
      }
    }
  } catch (error) {
    errors.push({
      field: "data",
      message: "Data integrity check failed",
      code: "INTEGRITY_CHECK_FAILED",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Comprehensive validation function
export const validateData = (
  data: any,
  options: {
    validateFile?: boolean;
    validateJSON?: boolean;
    checkIntegrity?: boolean;
  } = {}
): ValidationResult => {
  const allErrors: ValidationError[] = [];

  const {
    validateJSON: shouldValidateJSON = true,
    checkIntegrity: shouldCheckIntegrity = true,
  } = options;

  // JSON validation
  if (shouldValidateJSON) {
    const jsonResult = validateJSON(data);
    allErrors.push(...jsonResult.errors);
  }

  // Data integrity check
  if (shouldCheckIntegrity) {
    const integrityResult = checkDataIntegrity(data);
    allErrors.push(...integrityResult.errors);
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    sanitizedData: data,
  };
};
