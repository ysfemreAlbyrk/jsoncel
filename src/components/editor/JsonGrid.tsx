import React, { useState, useCallback, useMemo } from "react";
import { DataEditor, GridCellKind } from "@glideapps/glide-data-grid";
import type {
  GridColumn,
  GridCell,
  Item,
  EditableGridCell,
  FillPatternEventArgs,
  Theme,
} from "@glideapps/glide-data-grid";
import type { JsonArray } from "../../types";
import { useTheme } from "../../hooks/useTheme";
import {
  Undo2,
  Redo2,
  Search,
  Filter,
  EyeOff,
  Plus,
  PlusCircle,
  RefreshCw,
  Trash2,
  CheckCircle,
  Type,
} from "lucide-react";
import "@glideapps/glide-data-grid/dist/index.css";

interface JsonGridProps {
  data: JsonArray;
  onChange: (data: JsonArray) => void;
  readOnly?: boolean;
}

interface HistoryState {
  data: JsonArray;
  timestamp: number;
}

export function JsonGrid({ data, onChange, readOnly = false }: JsonGridProps) {
  // Theme hook
  const { theme } = useTheme();

  // Simple state for current data
  const [currentData, setCurrentData] = useState<JsonArray>(data);

  // Column widths state
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});

  // Track current selection for fill operations
  const [gridSelection, setGridSelection] = useState<any>(undefined);

  // History for undo/redo
  const [history, setHistory] = useState<HistoryState[]>([
    { data: data, timestamp: Date.now() },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Built-in search state (using Glide Data Grid's native search)
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<readonly Item[]>([]);

  // Filter state
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [showFilters, setShowFilters] = useState(false);

  // Sort state
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Data validation
  const [showValidation, setShowValidation] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Array<{ row: number; col: string; error: string }>
  >([]);

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

  // Handle search shortcuts - need to prevent browser default
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        // Check if we're in our component area
        const target = e.target as Element;
        const isInGrid =
          target?.closest(".flex-1.w-full.overflow-hidden") ||
          target?.closest('[data-testid="data-grid-canvas"]') ||
          target?.closest(".gdg-data-editor") ||
          document.activeElement?.closest(".flex-1.w-full.overflow-hidden");

        if (isInGrid) {
          // Prevent browser search
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          setShowSearch(true);
          return false;
        }
      }

      if (e.key === "Escape" && showSearch) {
        e.preventDefault();
        setShowSearch(false);
        return false;
      }
    };

    // Add multiple event listeners for better coverage
    document.addEventListener("keydown", handleKeyDown, true); // Capture phase
    window.addEventListener("keydown", handleKeyDown, true); // Window level

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [showSearch]);

  // Force grid re-render when theme changes
  const [gridKey, setGridKey] = useState(0);

  React.useEffect(() => {
    console.log("🎯 Theme changed in grid, forcing complete re-render:", theme);
    // Force complete remount of DataEditor and container
    setGridKey((prev) => prev + 1);

    // Additional delay to ensure DOM updates
    setTimeout(() => {
      setGridKey((prev) => prev + 1);
    }, 100);

    // Force a final update after theme CSS has been applied
    setTimeout(() => {
      setGridKey((prev) => prev + 1);
    }, 200);
  }, [theme]);

  // Grid theme based on app theme
  const gridTheme = useMemo((): Partial<Theme> => {
    const isDark = theme === "dark";
    console.log("🎯 Grid theme update - theme:", theme, "isDark:", isDark);

    return {
      accentColor: "#3b82f6",
      textDark: isDark ? "#f9fafb" : "#1f2937",
      textMedium: isDark ? "#9ca3af" : "#6b7280",
      textLight: isDark ? "#6b7280" : "#9ca3af",
      textBubble: isDark ? "#1f2937" : "#ffffff",
      bgIconHeader: isDark ? "#374151" : "#f3f4f6",
      fgIconHeader: isDark ? "#9ca3af" : "#6b7280",
      textHeader: isDark ? "#f9fafb" : "#1f2937",
      textGroupHeader: isDark ? "#d1d5db" : "#374151",
      bgCell: isDark ? "#1f2937" : "#ffffff",
      bgCellMedium: isDark ? "#374151" : "#f9fafb",
      bgHeader: isDark ? "#111827" : "#f9fafb",
      bgHeaderHasFocus: isDark ? "#1f2937" : "#f3f4f6",
      bgHeaderHovered: isDark ? "#374151" : "#f3f4f6",
      bgBubble: isDark ? "#374151" : "#f3f4f6",
      bgBubbleSelected: isDark ? "#1e40af" : "#3b82f6",
      bgSearchResult: isDark ? "#1e40af" : "#dbeafe",
      borderColor: isDark ? "#374151" : "#e5e7eb",
      drilldownBorder: isDark ? "#4b5563" : "#d1d5db",
      linkColor: "#3b82f6",
      cellHorizontalPadding: 8,
      cellVerticalPadding: 3,
      headerFontStyle: "600 0.8125rem",
      baseFontStyle: "0.8125rem",
      fontFamily:
        "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      editorFontSize: "0.8125rem",
      lineHeight: 1.4,
    };
  }, [theme, gridKey]);

  // Add to history
  const addToHistory = useCallback(
    (newData: JsonArray) => {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push({ data: newData, timestamp: Date.now() });

      // Keep only last 50 states
      if (newHistory.length > 50) {
        newHistory.shift();
      } else {
        setHistoryIndex(historyIndex + 1);
      }

      setHistory(newHistory);
    },
    [history, historyIndex]
  );

  // Undo function
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const previousState = history[newIndex];
      setCurrentData(previousState.data);
      onChange(previousState.data);
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex, onChange]);

  // Redo function
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const nextState = history[newIndex];
      setCurrentData(nextState.data);
      onChange(nextState.data);
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex, onChange]);

  // Search handlers for built-in search
  const handleSearchClose = useCallback(() => {
    setShowSearch(false);
    setSearchValue("");
    setSearchResults([]);
  }, []);

  const handleSearchValueChange = useCallback(
    (newVal: string) => {
      setSearchValue(newVal);

      // Custom search implementation
      if (newVal.trim() === "") {
        setSearchResults([]);
        return;
      }

      const results: Item[] = [];
      const searchTerm = newVal.toLowerCase();

      // Search through current data
      currentData.forEach((row, rowIndex) => {
        Object.entries(row).forEach(([key, value], colIndex) => {
          const stringValue = String(value || "").toLowerCase();
          if (stringValue.includes(searchTerm)) {
            results.push([colIndex, rowIndex]);
          }
        });
      });

      setSearchResults(results);
    },
    [currentData]
  );

  const handleSearchResultsChanged = useCallback(
    (results: readonly Item[], navIndex: number) => {
      // Handle search navigation if needed
      console.log(
        "Search results changed:",
        results,
        "Navigation index:",
        navIndex
      );
    },
    []
  );

  // Data validation
  const validateData = useCallback(() => {
    const errors: Array<{ row: number; col: string; error: string }> = [];

    currentData.forEach((row, rowIndex) => {
      Object.entries(row).forEach(([key, value]) => {
        // Check for empty values
        if (value === "" || value === null || value === undefined) {
          errors.push({ row: rowIndex, col: key, error: "Empty value" });
        }

        // Check for data type consistency
        if (typeof value === "string" && value.match(/^\d+$/)) {
          errors.push({
            row: rowIndex,
            col: key,
            error: "Numeric string (consider converting to number)",
          });
        }

        // Check for potential date strings
        if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}/)) {
          errors.push({
            row: rowIndex,
            col: key,
            error: "Date string (consider converting to date)",
          });
        }
      });
    });

    setValidationErrors(errors);
    setShowValidation(true);
  }, [currentData]);

  // Sort data
  const handleSort = useCallback(
    (columnId: string) => {
      const newDirection =
        sortColumn === columnId && sortDirection === "asc" ? "desc" : "asc";

      const sortedData = [...currentData].sort((a, b) => {
        const aVal = a[columnId];
        const bVal = b[columnId];

        if (aVal === bVal) return 0;
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;

        const comparison = aVal < bVal ? -1 : 1;
        return newDirection === "asc" ? comparison : -comparison;
      });

      setSortColumn(columnId);
      setSortDirection(newDirection);
      setCurrentData(sortedData);
      onChange(sortedData);
      addToHistory(sortedData);
    },
    [currentData, sortColumn, sortDirection, onChange, addToHistory]
  );

  // Filter data
  const getFilteredData = useCallback(() => {
    if (Object.keys(filters).length === 0) return currentData;

    return currentData.filter((row) => {
      return Object.entries(filters).every(([column, filterValue]) => {
        if (!filterValue) return true;
        const cellValue = String(row[column] || "").toLowerCase();
        return cellValue.includes(filterValue.toLowerCase());
      });
    });
  }, [currentData, filters]);

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
      const filteredData = getFilteredData();
      const rowData = filteredData[row];
      const value = rowData?.[column.id as string];

      const displayData = value?.toString() || "";

      // Determine cell type and return appropriate GridCell
      if (typeof value === "number") {
        return {
          kind: GridCellKind.Number,
          data: value,
          displayData: displayData,
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
          displayData: displayData,
          allowOverlay: true,
          readonly: readOnly,
        };
      }
    },
    [currentData, columns, readOnly, MAX_ROWS, getFilteredData]
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
      addToHistory(filteredData); // Add to history
    },
    [currentData, columns, onChange, readOnly, addToHistory]
  );

  // Handle fill pattern using data ref approach like your example
  const dataRef = React.useRef<any[][]>([[]]);

  // Update data ref when currentData changes
  React.useEffect(() => {
    const newDataRef: any[][] = [];
    columns.forEach((col, colIndex) => {
      newDataRef[colIndex] = [];
      currentData.forEach((row, rowIndex) => {
        newDataRef[colIndex][rowIndex] = row[col.id as string] ?? "";
      });
    });
    dataRef.current = newDataRef;
  }, [currentData, columns]);

  const onFillPattern = useCallback(
    (event: any) => {
      console.log("🔥 Fill pattern triggered with event:", event);

      // Try to extract cell and value from the event
      let cell, newVal;

      // Different possible event structures
      if (Array.isArray(event) && event.length >= 2) {
        cell = [event[0], event[1]];
        newVal = event[2] || { kind: GridCellKind.Text, data: "" };
      } else if (event.cell && event.value) {
        cell = event.cell;
        newVal = event.value;
      } else {
        console.log("❌ Could not parse fill pattern event");
        return;
      }

      const [col, row] = cell;
      console.log("Processing fill for cell:", [col, row]);

      if (dataRef.current?.[col] == null) {
        dataRef.current[col] = [];
      }

      let value = "";
      if (newVal.kind === GridCellKind.Text) {
        value = newVal.data ?? "";
      } else if (newVal.kind === GridCellKind.Number) {
        value = newVal.data ?? "";
      } else {
        value = newVal.data ?? "";
      }

      dataRef.current[col][row] = value;

      // Convert back to our data format
      const newData = [...currentData];
      while (newData.length <= row) {
        newData.push({});
      }

      if (col < columns.length) {
        const column = columns[col];
        if (column) {
          newData[row] = {
            ...newData[row],
            [column.id as string]: value,
          };
        }
      }

      // Filter out completely empty rows before saving
      const filteredData = newData.filter((row) => {
        return Object.keys(row).some((key) => {
          const value = row[key];
          return value !== "" && value !== null && value !== undefined;
        });
      });

      setCurrentData(newData);
      onChange(filteredData);
      addToHistory(filteredData);
    },
    [currentData, columns, onChange, addToHistory]
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
    addToHistory(newData);
  }, [currentData, columns, onChange, readOnly, addToHistory]);

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
    addToHistory(newData);
  }, [currentData, columns, onChange, readOnly, addToHistory]);

  // Clear data
  const handleClearData = useCallback(() => {
    if (readOnly) return;
    if (
      confirm(
        "Are you sure you want to clear all data? This action cannot be undone."
      )
    ) {
      setCurrentData([]);
      onChange([]);
      addToHistory([]);
    }
  }, [onChange, readOnly, addToHistory]);

  // Refresh data
  const handleRefresh = useCallback(() => {
    setCurrentData(data);
  }, [data]);

  // Auto-detect and convert data types
  const handleAutoFormat = useCallback(() => {
    if (readOnly) return;

    const newData = currentData.map((row) => {
      const newRow: any = {};
      Object.entries(row).forEach(([key, value]) => {
        if (typeof value === "string") {
          // Try to convert to number
          if (value.match(/^\d+$/)) {
            newRow[key] = parseInt(value, 10);
          } else if (value.match(/^\d+\.\d+$/)) {
            newRow[key] = parseFloat(value);
          } else if (value.toLowerCase() === "true") {
            newRow[key] = true;
          } else if (value.toLowerCase() === "false") {
            newRow[key] = false;
          } else {
            newRow[key] = value;
          }
        } else {
          newRow[key] = value;
        }
      });
      return newRow;
    });

    setCurrentData(newData);
    onChange(newData);
    addToHistory(newData);
  }, [currentData, onChange, readOnly, addToHistory]);

  return (
    <div className="h-full w-full flex flex-col">
      {/* Enhanced Toolbar */}
      <div className="flex w-full items-center gap-2 p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex-shrink-0">
        {/* History Controls */}
        <div className="flex items-center gap-2 border-r border-gray-300 dark:border-gray-600 pr-3">
          <button
            onClick={handleUndo}
            disabled={historyIndex === 0}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Undo2 className="w-4 h-4" />
            Undo
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Redo2 className="w-4 h-4" />
            Redo
          </button>
        </div>

        {/* Data Operations */}
        <div className="flex items-center gap-2 border-r border-gray-300 dark:border-gray-600 pr-3">
          <button
            onClick={addRow}
            disabled={readOnly}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Add Row
          </button>
          <button
            onClick={addColumn}
            disabled={readOnly}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusCircle className="w-4 h-4" />
            Add Column
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2 border-r border-gray-300 dark:border-gray-600 pr-3">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`flex items-center gap-1 px-3 py-1 text-sm rounded transition-colors ${
              showSearch
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
            title="Search (Ctrl+F)"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1 px-3 py-1 text-sm rounded transition-colors ${
              showFilters
                ? "bg-purple-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        {/* Data Tools */}
        <div className="flex items-center gap-2 border-r border-gray-300 dark:border-gray-600 pr-3">
          <button
            onClick={validateData}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            Validate
          </button>
          <button
            onClick={handleAutoFormat}
            disabled={readOnly}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Type className="w-4 h-4" />
            Auto Format
          </button>
        </div>

        {/* Theme & Utilities */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={handleClearData}
            disabled={readOnly || currentData.length === 0}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        </div>

        <div className="flex-1" />
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {Math.max(currentData.length + MIN_VISIBLE_ROWS, MIN_VISIBLE_ROWS)}{" "}
          rows × {columns.length} columns
        </div>
      </div>

      {/* Validation Panel */}
      {showValidation && validationErrors.length > 0 && (
        <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-yellow-50 dark:bg-yellow-900/20">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Data Validation Issues ({validationErrors.length})
            </h4>
            <button
              onClick={() => setShowValidation(false)}
              className="text-yellow-600 hover:text-yellow-800"
            >
              <EyeOff className="w-4 h-4" />
            </button>
          </div>
          <div className="max-h-20 overflow-y-auto">
            {validationErrors.slice(0, 5).map((error, index) => (
              <div
                key={index}
                className="text-xs text-yellow-700 dark:text-yellow-300"
              >
                Row {error.row + 1}, Column "{error.col}": {error.error}
              </div>
            ))}
            {validationErrors.length > 5 && (
              <div className="text-xs text-yellow-600 dark:text-yellow-400">
                ...and {validationErrors.length - 5} more issues
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grid */}
      <div
        key={`grid-container-${theme}-${gridKey}`}
        className="flex-1 w-full overflow-hidden"
        tabIndex={0}
        onFocus={() => console.log("Grid container focused")}
      >
        <DataEditor
          key={`grid-${theme}-${gridKey}`}
          getCellContent={getCellContent}
          columns={columns}
          rows={Math.max(
            getFilteredData().length + MIN_VISIBLE_ROWS,
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
          // Track selection for fill operations
          gridSelection={gridSelection}
          onGridSelectionChange={setGridSelection}
          // Enable column resizing
          onColumnResize={onColumnResize}
          maxColumnWidth={2000}
          minColumnWidth={50}
          maxColumnAutoWidth={500}
          overscrollX={200}
          overscrollY={200}
          // Built-in search integration
          showSearch={showSearch}
          searchValue={searchValue}
          searchResults={searchResults}
          onSearchClose={handleSearchClose}
          onSearchValueChange={handleSearchValueChange}
          onSearchResultsChanged={handleSearchResultsChanged}
          // Row markers (silly numbers)
          rowMarkers="number"
          rowMarkerWidth={60}
          // Theme integration
          theme={gridTheme}
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
            search: false, // Disable grid's own search to use ours
          }}
          // Enable cell activation for editing
          onCellActivated={(cell: Item) => {
            console.log("🔥 Cell activated for editing:", cell);
          }}
        />
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-400 flex-shrink-0">
        {Math.max(
          getFilteredData().length + MIN_VISIBLE_ROWS,
          MIN_VISIBLE_ROWS
        )}{" "}
        rows × {columns.length} columns
        <span className="ml-4 text-gray-500">
          (
          {
            getFilteredData().filter((row) =>
              Object.keys(row).some((key) => {
                const value = row[key];
                return value !== "" && value !== null && value !== undefined;
              })
            ).length
          }{" "}
          filled rows)
        </span>
        {Object.keys(filters).length > 0 && (
          <span className="ml-4 text-blue-600">🔍 Filtered</span>
        )}
        {sortColumn && (
          <span className="ml-4 text-purple-600">
            ↕️ Sorted by {sortColumn}
          </span>
        )}
        {searchResults.length > 0 && (
          <span className="ml-4 text-green-600">
            🔍 {searchResults.length} search results
          </span>
        )}
      </div>
    </div>
  );
}
