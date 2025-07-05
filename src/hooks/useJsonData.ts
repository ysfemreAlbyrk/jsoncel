import { useState, useCallback } from "react";
import type { JsonArray, JsonData } from "../types";

export function useJsonData(initialData: JsonArray = []) {
  const [data, setData] = useState<JsonArray>(initialData);

  const addRow = useCallback((row: JsonData) => {
    setData((prev) => [...prev, row]);
  }, []);

  const removeRow = useCallback((index: number) => {
    setData((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateRow = useCallback((index: number, row: JsonData) => {
    setData((prev) => prev.map((item, i) => (i === index ? row : item)));
  }, []);

  const addColumn = useCallback((key: string, defaultValue: any = null) => {
    setData((prev) =>
      prev.map((item) => ({
        ...item,
        [key]: defaultValue,
      }))
    );
  }, []);

  const removeColumn = useCallback((key: string) => {
    setData((prev) =>
      prev.map((item) => {
        const newItem = { ...item };
        delete newItem[key];
        return newItem;
      })
    );
  }, []);

  const clear = useCallback(() => {
    setData([]);
  }, []);

  const updateCell = useCallback(
    (rowIndex: number, key: string, value: any) => {
      setData((prev) =>
        prev.map((item, i) =>
          i === rowIndex ? { ...item, [key]: value } : item
        )
      );
    },
    []
  );

  return {
    data,
    setData,
    addRow,
    removeRow,
    updateRow,
    addColumn,
    removeColumn,
    clear,
    updateCell,
  };
}
