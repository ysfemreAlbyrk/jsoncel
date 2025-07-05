import { useState, useEffect } from "react";
import { formatJson } from "../../utils/jsonParser";
import type { JsonArray } from "../../types";

interface JsonEditorProps {
  data: JsonArray;
  onChange: (data: JsonArray) => void;
  readOnly?: boolean;
}

export function JsonEditor({
  data,
  onChange,
  readOnly = false,
}: JsonEditorProps) {
  const [jsonString, setJsonString] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const formatted = formatJson(data, true);
      setJsonString(formatted);
      setError(null);
    } catch (err) {
      setError("Failed to format JSON");
    }
  }, [data]);

  const handleChange = (value: string) => {
    setJsonString(value);

    try {
      const parsed = JSON.parse(value);
      const arrayData = Array.isArray(parsed) ? parsed : [parsed];
      onChange(arrayData);
      setError(null);
    } catch (err) {
      setError("Invalid JSON format");
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-2 mb-2 rounded border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      <textarea
        value={jsonString}
        onChange={(e) => handleChange(e.target.value)}
        readOnly={readOnly}
        className="flex-1 w-full p-4 font-mono text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
        placeholder="Enter JSON data..."
        spellCheck={false}
      />

      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        {data.length} items
      </div>
    </div>
  );
}
