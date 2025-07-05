// JSON Data Types - Basic types for handling JSON data
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonData
  | JsonValue[];

export interface JsonData {
  [key: string]: JsonValue;
}

export type JsonArray = JsonData[];

// Grid Types
export interface GridColumn {
  id: string;
  title: string;
  width?: number;
  kind?: "text" | "number" | "boolean" | "date";
}

export interface GridCell {
  kind: "text" | "number" | "boolean" | "date";
  data: any;
  displayData?: string;
  allowOverlay?: boolean;
}

export interface GridRow {
  [key: string]: GridCell;
}

// Project Management Types
export interface Project {
  id: string;
  name: string;
  data: JsonArray;
  createdAt: Date;
  updatedAt: Date;
  description?: string;
}

export interface ProjectMetadata {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  rowCount: number;
  columnCount: number;
  description?: string;
}

// File Types
export type FileFormat = "json" | "csv" | "xlsx";

export interface FileUploadResult {
  data: JsonArray;
  format: FileFormat;
  fileName: string;
  size: number;
}

export interface ExportOptions {
  format: FileFormat;
  fileName: string;
  includeHeaders?: boolean;
  prettify?: boolean;
}

// Storage Types
export interface StorageData {
  projects: Project[];
  settings: AppSettings;
  version: string;
}

export interface AppSettings {
  theme: "light" | "dark" | "system";
  autoSave: boolean;
  autoSaveInterval: number; // in milliseconds
  defaultFormat: FileFormat;
  maxProjects: number;
}

// Component Props Types
export interface ToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

export interface FAQItemProps {
  question: string;
  answer: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

// Hook Types
export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T) => void;
  removeValue: () => void;
}

export interface UseJsonDataReturn {
  data: JsonArray;
  setData: (data: JsonArray) => void;
  addRow: (row: JsonData) => void;
  removeRow: (index: number) => void;
  updateRow: (index: number, row: JsonData) => void;
  addColumn: (key: string, defaultValue?: any) => void;
  removeColumn: (key: string) => void;
  clear: () => void;
}

// Error Types
export interface AppError {
  message: string;
  code?: string;
  details?: any;
}

export type ErrorHandler = (error: AppError) => void;
