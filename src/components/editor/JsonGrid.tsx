import React, { useState, useCallback, useMemo } from "react";
import { DataEditor, GridCellKind } from "@glideapps/glide-data-grid";
import type {
  GridColumn,
  GridCell,
  Item,
  GridSelection,
} from "@glideapps/glide-data-grid";
import { GridHelpers } from "../../utils/gridHelpers";
import type { JsonArray } from "../../types";
import "@glideapps/glide-data-grid/dist/index.css";

interface JsonGridProps {
  data: JsonArray;
  onChange: (data: JsonArray) => void;
  readOnly?: boolean;
}

export function JsonGrid({ data, onChange, readOnly = false }: JsonGridProps) {
  const [selection, setSelection] = useState<{
    rows: number[];
    columns: number[];
  }>({ rows: [], columns: [] });

  // Convert JSON data to grid format
  const gridData = useMemo(() => {
    return GridHelpers.jsonToGridData(data);
  }, [data]);

  // Convert grid columns to Glide Data Grid format
  const columns: GridColumn[] = useMemo(() => {
    return gridData.columns.map((col) => ({
      title: col.title,
      width: col.width || 150,
      id: col.id,
    }));
  }, [gridData.columns]);

  // Get cell data for Glide Data Grid
  const getCellContent = useCallback(
    (cell: Item): GridCell => {
      const [colIndex, rowIndex] = cell;
      const column = gridData.columns[colIndex];
      const row = gridData.rows[rowIndex];

      if (!column || !row || !row[column.id]) {
        return {
          kind: GridCellKind.Text,
          data: "",
          displayData: "",
          allowOverlay: !readOnly,
          readonly: readOnly,
        };
      }

      const cellData = row[column.id];
      const value = cellData.data;

      // Convert our cell type to Glide Data Grid cell type
      switch (cellData.kind) {
        case "number":
          return {
            kind: GridCellKind.Number,
            data: Number(value) || 0,
            displayData: String(value),
            allowOverlay: !readOnly,
            readonly: readOnly,
          };
        case "boolean":
          return {
            kind: GridCellKind.Boolean,
            data: Boolean(value),
            allowOverlay: false,
            readonly: readOnly,
          };
        default:
          return {
            kind: GridCellKind.Text,
            data: String(value || ""),
            displayData: String(value || ""),
            allowOverlay: !readOnly,
            readonly: readOnly,
          };
      }
    },
    [gridData.columns, gridData.rows]
  );

  // Handle cell edits
  const onCellEdited = useCallback(
    (cell: Item, newValue: GridCell) => {
      if (readOnly) return;

      const [colIndex, rowIndex] = cell;
      const column = gridData.columns[colIndex];

      if (!column) return;

      // Extract the actual value from the cell
      let value: any;
      switch (newValue.kind) {
        case GridCellKind.Number:
          value = (newValue as any).data;
          break;
        case GridCellKind.Boolean:
          value = (newValue as any).data;
          break;
        default:
          value = (newValue as any).data;
      }

      // Update the grid data
      const newRows = GridHelpers.updateCell(
        gridData.rows,
        rowIndex,
        column.id,
        value
      );

      // Convert back to JSON and update
      const newJsonData = GridHelpers.gridDataToJson(newRows);
      onChange(newJsonData);
    },
    [gridData.columns, gridData.rows, onChange, readOnly]
  );

  // Handle row selection
  const onSelectionChanged = useCallback((newSelection: GridSelection) => {
    // Convert CompactSelection to number arrays
    const rows = Array.from(newSelection.rows);
    const columns = Array.from(newSelection.columns);
    setSelection({ rows, columns });
  }, []);

  // Add new row
  const addRow = useCallback(() => {
    if (readOnly) return;

    const newRows = GridHelpers.addRow(gridData.rows, gridData.columns);
    const newJsonData = GridHelpers.gridDataToJson(newRows);
    onChange(newJsonData);
  }, [gridData.rows, gridData.columns, onChange, readOnly]);

  // Remove selected rows
  const removeSelectedRows = useCallback(() => {
    if (readOnly || selection.rows.length === 0) return;

    let newRows = [...gridData.rows];
    // Sort indices in descending order to remove from the end first
    const sortedIndices = [...selection.rows].sort((a, b) => b - a);

    sortedIndices.forEach((index) => {
      newRows = GridHelpers.removeRow(newRows, index);
    });

    const newJsonData = GridHelpers.gridDataToJson(newRows);
    onChange(newJsonData);
    setSelection({ rows: [], columns: [] });
  }, [gridData.rows, selection.rows, onChange, readOnly]);

  // Add new column
  const addColumn = useCallback(() => {
    if (readOnly) return;

    const newColumnId = `column_${Date.now()}`;
    const { columns: newColumns, rows: newRows } = GridHelpers.addColumn(
      gridData.columns,
      gridData.rows,
      newColumnId,
      ""
    );

    const newJsonData = GridHelpers.gridDataToJson(newRows);
    onChange(newJsonData);
  }, [gridData.columns, gridData.rows, onChange, readOnly]);

  // Remove selected columns
  const removeSelectedColumns = useCallback(() => {
    if (readOnly || selection.columns.length === 0) return;

    let newColumns = [...gridData.columns];
    let newRows = [...gridData.rows];

    // Sort indices in descending order to remove from the end first
    const sortedIndices = [...selection.columns].sort((a, b) => b - a);

    sortedIndices.forEach((index) => {
      const column = newColumns[index];
      if (column) {
        const result = GridHelpers.removeColumn(newColumns, newRows, column.id);
        newColumns = result.columns;
        newRows = result.rows;
      }
    });

    const newJsonData = GridHelpers.gridDataToJson(newRows);
    onChange(newJsonData);
    setSelection({ rows: [], columns: [] });
  }, [gridData.columns, gridData.rows, selection.columns, onChange, readOnly]);

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
        {selection.rows.length > 0 && (
          <button
            onClick={removeSelectedRows}
            disabled={readOnly}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Remove Rows ({selection.rows.length})
          </button>
        )}
        {selection.columns.length > 0 && (
          <button
            onClick={removeSelectedColumns}
            disabled={readOnly}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Remove Columns ({selection.columns.length})
          </button>
        )}
        <div className="flex-1" />
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {gridData.rows.length} rows × {gridData.columns.length} columns
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <DataEditor
          getCellContent={getCellContent}
          columns={columns}
          rows={gridData.rows.length}
          onCellEdited={onCellEdited}
          onGridSelectionChange={onSelectionChanged}
          // Enable editing
          getCellsForSelection={true}
          trailingRowOptions={{
            hint: "New row...",
            sticky: true,
            tint: true,
          }}
          // Scrolling
          smoothScrollX={true}
          smoothScrollY={true}
          // Sizing
          rowHeight={36}
          headerHeight={36}
          // Row markers
          rowMarkers="both"
          // Enable various interactions
          isDraggable={false}
          rangeSelect="rect"
          columnSelect="single"
          rowSelect="single"
          // Keyboard shortcuts
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
          rightElement={
            <div className="w-4 bg-gray-100 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700" />
          }
          theme={{
            accentColor: "#3b82f6",
            accentLight: "#dbeafe",
            textDark: "#1f2937",
            textMedium: "#6b7280",
            textLight: "#9ca3af",
            textBubble: "#ffffff",
            bgIconHeader: "#f9fafb",
            fgIconHeader: "#6b7280",
            textHeader: "#374151",
            textHeaderSelected: "#1f2937",
            bgCell: "#ffffff",
            bgCellMedium: "#f9fafb",
            bgHeader: "#f9fafb",
            bgHeaderHasFocus: "#f3f4f6",
            bgHeaderHovered: "#f3f4f6",
            bgBubble: "#ffffff",
            bgBubbleSelected: "#3b82f6",
            bgSearchResult: "#fef3c7",
            borderColor: "#e5e7eb",
            drilldownBorder: "#d1d5db",
            linkColor: "#3b82f6",
            headerFontStyle: "600 13px",
            baseFontStyle: "13px",
            fontFamily:
              "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
        />
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-400 flex-shrink-0">
        {gridData.rows.length} rows × {gridData.columns.length} columns
        {selection.rows.length > 0 && (
          <span className="ml-4">
            {selection.rows.length} row{selection.rows.length > 1 ? "s" : ""}{" "}
            selected
          </span>
        )}
        {selection.columns.length > 0 && (
          <span className="ml-4">
            {selection.columns.length} column
            {selection.columns.length > 1 ? "s" : ""} selected
          </span>
        )}
      </div>
    </div>
  );
}
