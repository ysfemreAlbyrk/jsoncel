import React, { useState, useCallback, useMemo } from "react";
import { DataEditor, GridCellKind } from "@glideapps/glide-data-grid";
import type {
  GridColumn,
  GridCell,
  Item,
  EditableGridCell,
  FillPatternEventArgs,
} from "@glideapps/glide-data-grid";
import type { JsonArray } from "../../types";
import "@glideapps/glide-data-grid/dist/index.css";

interface JsonGridProps {
  data: JsonArray;
  onChange: (data: JsonArray) => void;
  readOnly?: boolean;
}

export function JsonGrid({ data, onChange, readOnly = false }: JsonGridProps) {
  // Simple state for current data
  const [currentData, setCurrentData] = useState<JsonArray>(data);

  // Column widths state
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});

  // Container size state
  const [containerSize, setContainerSize] = useState({
    width: 1400,
    height: 700,
  });

  // Virtual grid limits (like Excel)
  const MAX_ROWS = 100000;
  const MAX_COLS = 1000;
  const MIN_VISIBLE_ROWS = 50;
  const MIN_VISIBLE_COLS = 10;

  // Update current data when props change
  React.useEffect(() => {
    setCurrentData(data);
  }, [data]);

  // Resize observer to track container size
  React.useEffect(() => {
    const updateSize = () => {
      // Calculate available space (viewport minus header/toolbar/footer)
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // Reserve space for header (~60px), toolbar (~60px), footer (~40px), padding
      const availableHeight = viewportHeight - 155;
      const availableWidth = viewportWidth - 0; // Some padding

      setContainerSize({
        width: Math.max(availableWidth, 800), // Minimum 800px
        height: Math.max(availableHeight, 400), // Minimum 400px
      });
    };

    // Initial size
    updateSize();

    // Listen for window resize
    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Generate columns from data + virtual columns
  const columns = useMemo((): GridColumn[] => {
    // Get existing columns from data
    const existingColumns = new Set<string>();
    currentData.forEach((row) => {
      Object.keys(row).forEach((key) => existingColumns.add(key));
    });

    const realColumns = Array.from(existingColumns).map((key) => ({
      title: key,
      width: columnWidths[key] || 150,
      id: key,
    }));

    // Add virtual columns to reach minimum or based on existing data
    const totalColumns = Math.max(
      realColumns.length + MIN_VISIBLE_COLS,
      MIN_VISIBLE_COLS
    );

    const virtualColumns: GridColumn[] = [];
    for (let i = realColumns.length; i < totalColumns && i < MAX_COLS; i++) {
      const virtualId = `virtual_col_${i}`;
      virtualColumns.push({
        title: `Column ${i + 1}`,
        width: columnWidths[virtualId] || 150,
        id: virtualId,
      });
    }

    return [...realColumns, ...virtualColumns];
  }, [currentData, columnWidths, MIN_VISIBLE_COLS, MAX_COLS]);

  // Get cell content (handles virtual cells)
  const getCellContent = useCallback(
    (cell: Item): GridCell => {
      const [col, row] = cell;

      // Check bounds
      if (row >= MAX_ROWS || col >= columns.length) {
        return {
          kind: GridCellKind.Text,
          data: "",
          displayData: "",
          allowOverlay: true,
          readonly: readOnly,
        };
      }

      const column = columns[col];
      if (!column) {
        return {
          kind: GridCellKind.Text,
          data: "",
          displayData: "",
          allowOverlay: true,
          readonly: readOnly,
        };
      }

      // Get value from actual data or return empty for virtual cells
      const rowData = currentData[row];
      const value = rowData?.[column.id as string];

      // Determine cell type and return appropriate GridCell
      if (typeof value === "number") {
        return {
          kind: GridCellKind.Number,
          data: value,
          displayData: value.toString(),
          allowOverlay: true,
          readonly: readOnly,
        };
      } else if (typeof value === "boolean") {
        return {
          kind: GridCellKind.Boolean,
          data: value,
          allowOverlay: false,
          readonly: readOnly,
        };
      } else {
        return {
          kind: GridCellKind.Text,
          data: value?.toString() || "",
          displayData: value?.toString() || "",
          allowOverlay: true,
          readonly: readOnly,
        };
      }
    },
    [currentData, columns, readOnly, MAX_ROWS]
  );

  // Handle cell edits
  const onCellEdited = useCallback(
    (cell: Item, newValue: EditableGridCell) => {
      console.log("🔥 Cell edited:", cell, newValue);
      if (readOnly) {
        console.log("❌ Read-only mode, ignoring edit");
        return;
      }

      const [col, row] = cell;

      if (row >= currentData.length || col >= columns.length) {
        console.log("❌ Invalid cell coordinates");
        return;
      }

      const column = columns[col];
      if (!column) {
        console.log("❌ Column not found");
        return;
      }

      let actualValue: any;

      // Extract the actual value based on cell type
      switch (newValue.kind) {
        case GridCellKind.Text:
          actualValue = newValue.data;
          break;
        case GridCellKind.Number:
          actualValue = newValue.data;
          break;
        case GridCellKind.Boolean:
          actualValue = newValue.data;
          break;
        default:
          actualValue = newValue.data;
      }

      // Update the data (extend array if needed for virtual rows)
      console.log("✅ Updating cell with value:", actualValue);
      const newData = [...currentData];

      // Extend array if row doesn't exist yet
      while (newData.length <= row) {
        newData.push({});
      }

      newData[row] = {
        ...newData[row],
        [column.id as string]: actualValue,
      };

      console.log("✅ New data:", newData);

      // Filter out completely empty rows before saving
      const filteredData = newData.filter((row) => {
        return Object.keys(row).some((key) => {
          const value = row[key];
          return value !== "" && value !== null && value !== undefined;
        });
      });

      setCurrentData(newData); // Keep full data for editing
      onChange(filteredData); // Only save non-empty rows to JSON
    },
    [currentData, columns, onChange, readOnly]
  );

  // Handle fill pattern (Excel-like drag to fill)
  const onFillPattern = useCallback(
    (event: any) => {
      console.log("🔥 Fill pattern triggered:", event);
      if (readOnly) {
        console.log("❌ Read-only mode, ignoring fill");
        return;
      }

      // For now, just log the event to see its structure
      console.log("Fill pattern event structure:", Object.keys(event));

      // We'll implement the actual fill logic once we understand the event structure
      // This is a placeholder that will work for now
    },
    [readOnly]
  );

  // Handle column resize
  const onColumnResize = useCallback(
    (column: any, newSize: number, columnIndex: number) => {
      console.log("🔄 Column resized:", column, newSize, columnIndex);
      if (readOnly) {
        console.log("❌ Read-only mode, ignoring resize");
        return;
      }

      // Update column width
      setColumnWidths((prev) => ({
        ...prev,
        [column.id]: newSize,
      }));

      console.log("✅ Column width updated:", column.id, newSize);
    },
    [readOnly]
  );

  // Add row
  const addRow = useCallback(() => {
    if (readOnly) return;

    const newRow: any = {};
    columns.forEach((col) => {
      if (col.id) {
        newRow[col.id as string] = "";
      }
    });

    const newData = [...currentData, newRow];
    setCurrentData(newData);
    onChange(newData);
  }, [currentData, columns, onChange, readOnly]);

  // Add column
  const addColumn = useCallback(() => {
    if (readOnly) return;

    const newColumnName = `Column ${columns.length + 1}`;
    const newData = currentData.map((row) => ({
      ...row,
      [newColumnName as string]: "",
    }));

    setCurrentData(newData);
    onChange(newData);
  }, [currentData, columns, onChange, readOnly]);

  return (
    <div className="h-full w-full flex flex-col">
      {/* Toolbar */}
      <div className="flex w-full items-center gap-2 p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex-shrink-0">
        <button
          onClick={addRow}
          disabled={readOnly}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Row
        </button>
        <button
          onClick={addColumn}
          disabled={readOnly}
          className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Column
        </button>
        <div className="flex-1" />
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {Math.max(currentData.length + MIN_VISIBLE_ROWS, MIN_VISIBLE_ROWS)}{" "}
          rows × {columns.length} columns
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 w-full overflow-hidden">
        <DataEditor
          getCellContent={getCellContent}
          columns={columns}
          rows={Math.max(
            currentData.length + MIN_VISIBLE_ROWS,
            MIN_VISIBLE_ROWS
          )}
          onCellEdited={onCellEdited}
          width={containerSize.width}
          height={containerSize.height}
          smoothScrollX={true}
          smoothScrollY={true}
          rowHeight={36}
          headerHeight={36}
          // Enable editing features
          getCellsForSelection={true}
          fillHandle={true}
          onPaste={true}
          onFillPattern={onFillPattern}
          // Enable column resizing
          onColumnResize={onColumnResize}
          maxColumnWidth={2000}
          minColumnWidth={50}
          maxColumnAutoWidth={500}
          overscrollX={200}
          overscrollY={200}
          keybindings={{
            selectAll: true,
            selectRow: true,
            selectColumn: true,
            downFill: true,
            rightFill: true,
            pageDown: true,
            pageUp: true,
            clear: true,
            copy: true,
            paste: true,
            search: true,
          }}
          // Enable cell activation for editing
          onCellActivated={(cell: Item) => {
            console.log("🔥 Cell activated for editing:", cell);
          }}
          theme={{
            accentColor: "#3b82f6",
            textDark: "#1f2937",
            textMedium: "#6b7280",
            bgCell: "#ffffff",
            bgHeader: "#f9fafb",
            borderColor: "#e5e7eb",
            fontFamily:
              "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            baseFontStyle: "0.8125rem",
            headerFontStyle: "600 0.8125rem",
            editorFontSize: "0.8125rem",
          }}
        />
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-400 flex-shrink-0">
        {Math.max(currentData.length + MIN_VISIBLE_ROWS, MIN_VISIBLE_ROWS)} rows
        × {columns.length} columns
        <span className="ml-4 text-gray-500">
          (
          {
            currentData.filter((row) =>
              Object.keys(row).some((key) => {
                const value = row[key];
                return value !== "" && value !== null && value !== undefined;
              })
            ).length
          }{" "}
          filled rows)
        </span>
      </div>
    </div>
  );
}
