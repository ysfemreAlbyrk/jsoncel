import type {
  JsonArray,
  JsonData,
  GridColumn,
  GridCell,
  GridRow,
} from "../types";

export class GridHelpers {
  static jsonToGridData(data: JsonArray): {
    columns: GridColumn[];
    rows: GridRow[];
  } {
    if (data.length === 0) {
      return { columns: [], rows: [] };
    }

    // Extract all unique keys as columns
    const allKeys = new Set<string>();
    data.forEach((item) => {
      Object.keys(item).forEach((key) => allKeys.add(key));
    });

    const columns: GridColumn[] = Array.from(allKeys).map((key) => ({
      id: key,
      title: key,
      width: 150,
      kind: this.detectColumnType(data, key),
    }));

    const rows: GridRow[] = data.map((item) => {
      const row: GridRow = {};
      columns.forEach((col) => {
        const value = item[col.id];
        row[col.id] = {
          kind: col.kind || "text",
          data: value,
          displayData: this.formatCellValue(value),
          allowOverlay: true,
        };
      });
      return row;
    });

    return { columns, rows };
  }

  static gridDataToJson(rows: GridRow[]): JsonArray {
    return rows.map((row) => {
      const item: JsonData = {};
      Object.keys(row).forEach((key) => {
        item[key] = row[key].data;
      });
      return item;
    });
  }

  static detectColumnType(
    data: JsonArray,
    key: string
  ): "text" | "number" | "boolean" | "date" {
    const values = data
      .map((item) => item[key])
      .filter((v) => v !== null && v !== undefined);

    if (values.length === 0) return "text";

    const firstValue = values[0];

    if (typeof firstValue === "boolean") {
      return "boolean";
    }

    if (typeof firstValue === "number") {
      return "number";
    }

    if (typeof firstValue === "string") {
      // Check if it's a date string
      const isDate = values.every((v) => !isNaN(Date.parse(String(v))));
      return isDate ? "date" : "text";
    }

    return "text";
  }

  static formatCellValue(value: any): string {
    if (value === null || value === undefined) {
      return "";
    }

    if (typeof value === "object") {
      return JSON.stringify(value);
    }

    if (typeof value === "boolean") {
      return value ? "true" : "false";
    }

    return String(value);
  }

  static addColumn(
    columns: GridColumn[],
    rows: GridRow[],
    columnId: string,
    defaultValue: any = null
  ): { columns: GridColumn[]; rows: GridRow[] } {
    const newColumn: GridColumn = {
      id: columnId,
      title: columnId,
      width: 150,
      kind: "text",
    };

    const newColumns = [...columns, newColumn];
    const newRows = rows.map((row) => ({
      ...row,
      [columnId]: {
        kind: "text" as const,
        data: defaultValue,
        displayData: this.formatCellValue(defaultValue),
        allowOverlay: true,
      },
    }));

    return { columns: newColumns, rows: newRows };
  }

  static removeColumn(
    columns: GridColumn[],
    rows: GridRow[],
    columnId: string
  ): { columns: GridColumn[]; rows: GridRow[] } {
    const newColumns = columns.filter((col) => col.id !== columnId);
    const newRows = rows.map((row) => {
      const newRow = { ...row };
      delete newRow[columnId];
      return newRow;
    });

    return { columns: newColumns, rows: newRows };
  }

  static addRow(
    rows: GridRow[],
    columns: GridColumn[],
    defaultValues: Record<string, any> = {}
  ): GridRow[] {
    const newRow: GridRow = {};

    columns.forEach((col) => {
      const value = defaultValues[col.id] || null;
      newRow[col.id] = {
        kind: col.kind || "text",
        data: value,
        displayData: this.formatCellValue(value),
        allowOverlay: true,
      };
    });

    return [...rows, newRow];
  }

  static removeRow(rows: GridRow[], index: number): GridRow[] {
    return rows.filter((_, i) => i !== index);
  }

  static updateCell(
    rows: GridRow[],
    rowIndex: number,
    columnId: string,
    value: any
  ): GridRow[] {
    const newRows = [...rows];
    if (newRows[rowIndex] && newRows[rowIndex][columnId]) {
      newRows[rowIndex] = {
        ...newRows[rowIndex],
        [columnId]: {
          ...newRows[rowIndex][columnId],
          data: value,
          displayData: this.formatCellValue(value),
        },
      };
    }
    return newRows;
  }
}

export const jsonToGridData = GridHelpers.jsonToGridData;
export const gridDataToJson = GridHelpers.gridDataToJson;
export const detectColumnType = GridHelpers.detectColumnType;
export const formatCellValue = GridHelpers.formatCellValue;
export const addColumn = GridHelpers.addColumn;
export const removeColumn = GridHelpers.removeColumn;
export const addRow = GridHelpers.addRow;
export const removeRow = GridHelpers.removeRow;
export const updateCell = GridHelpers.updateCell;
