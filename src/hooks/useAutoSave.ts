import { useEffect, useRef } from "react";
import type { JsonArray } from "../types";
import { storageManager } from "../utils/storageManager";

interface UseAutoSaveProps {
  data: JsonArray;
  projectId: string;
  projectName: string;
  enabled?: boolean;
  interval?: number;
}

export function useAutoSave({
  data,
  projectId,
  projectName,
  enabled = true,
  interval = 5000,
}: UseAutoSaveProps) {
  const intervalRef = useRef<number | null>(null);
  const lastSavedData = useRef<string>("");

  const saveProject = () => {
    try {
      const currentDataString = JSON.stringify(data);

      // Only save if data has changed
      if (currentDataString !== lastSavedData.current) {
        const project = {
          id: projectId,
          name: projectName,
          data,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        storageManager.saveProject(project);
        lastSavedData.current = currentDataString;

        console.log(`Auto-saved project: ${projectName}`);
      }
    } catch (error) {
      console.error("Auto-save failed:", error);
    }
  };

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set up new interval
    intervalRef.current = setInterval(saveProject, interval);

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [data, projectId, projectName, enabled, interval]);

  // Manual save function
  const forceSave = () => {
    saveProject();
  };

  return {
    forceSave,
    isEnabled: enabled,
  };
}
