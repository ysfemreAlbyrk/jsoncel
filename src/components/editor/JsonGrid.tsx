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

  // Update current data when props change
  React.useEffect(() => {
    setCurrentData(data);
  }, [data]);

  // Generate columns from data
  const columns = useMemo((): GridColumn[] => {
    if (currentData.length === 0) {
      return [
        { title: "Column 1", width: 150, id: "col1" },
        { title: "Column 2", width: 150, id: "col2" },
      ];
    }

    const firstRow = currentData[0];
    return Object.keys(firstRow).map((key, index) => ({
      title: key,
      width: 150,
      id: key,
    }));
  }, [currentData]);

  // Get cell content
  const getCellContent = useCallback(
    (cell: Item): GridCell => {
      const [col, row] = cell;

      if (row >= currentData.length || col >= columns.length) {
        return {
          kind: GridCellKind.Text,
          data: "",
          displayData: "",
          allowOverlay: true,
          readonly: readOnly,
        };
      }

      const rowData = currentData[row];
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
    [currentData, columns]
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

      // Update the data
      console.log("✅ Updating cell with value:", actualValue);
      const newData = [...currentData];
      newData[row] = {
        ...newData[row],
        [column.id as string]: actualValue,
      };

      console.log("✅ New data:", newData);
      setCurrentData(newData);
      onChange(newData);
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
      <div className="flex items-center gap-2 p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex-shrink-0">
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
          {currentData.length} rows × {columns.length} columns
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 min-h-0">
        <DataEditor
          getCellContent={getCellContent}
          columns={columns}
          rows={currentData.length}
          onCellEdited={onCellEdited}
          width={800}
          height={400}
          smoothScrollX={true}
          smoothScrollY={true}
          rowHeight={36}
          headerHeight={36}
          // Enable editing features
          getCellsForSelection={true}
          fillHandle={true}
          onPaste={true}
          onFillPattern={onFillPattern}
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
          }}
        />
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-400 flex-shrink-0">
        {currentData.length} rows × {columns.length} columns
      </div>
    </div>
  );
}
