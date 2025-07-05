import React, { useState, useEffect } from "react";
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
        <div className="bg-destructive/10 text-destructive text-sm p-2 mb-2 rounded">
          {error}
        </div>
      )}

      <textarea
        value={jsonString}
        onChange={(e) => handleChange(e.target.value)}
        readOnly={readOnly}
        className="flex-1 w-full p-4 font-mono text-sm bg-background border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring"
        placeholder="Enter JSON data..."
        spellCheck={false}
      />

      <div className="mt-2 text-xs text-muted-foreground">
        {data.length} items
      </div>
    </div>
  );
}
