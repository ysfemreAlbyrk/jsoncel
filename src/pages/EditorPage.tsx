import React, { useState } from "react";
import { Header } from "../components/shared/Header";
import { Footer } from "../components/shared/Footer";
import { JsonGrid } from "../components/editor/JsonGrid";
import { useJsonData } from "../hooks/useJsonData";
import { useAutoSave } from "../hooks/useAutoSave";
import { useOfflineStorage } from "../hooks/useOfflineStorage";
import { ToastContainer } from "../components/ui/ToastContainer";
import { OfflineIndicator } from "../components/shared/OfflineIndicator";
import { ErrorBoundary } from "../components/shared/ErrorBoundary";
import type { JsonArray } from "../types";

export function EditorPage() {
  const [projectName, setProjectName] = useState("Untitled Project");
  const [projectId, setProjectId] = useState(`project-${Date.now()}`);
  const { data, setData } = useJsonData([
    { name: "John Doe", age: 30, city: "New York", active: true },
    { name: "Jane Smith", age: 25, city: "Los Angeles", active: false },
    { name: "Bob Johnson", age: 35, city: "Chicago", active: true },
  ]);
  const { projects, createProject, saveProject, loadProject } =
    useOfflineStorage();

  // Auto-save functionality
  useAutoSave({
    data,
    projectId,
    projectName,
    enabled: true,
    interval: 5000,
  });

  const handleDataChange = (newData: JsonArray) => {
    setData(newData);
  };

  const handleNewProject = () => {
    const newProjectName = `Project ${Date.now()}`;
    const newProjectId = `project-${Date.now()}`;
    setProjectName(newProjectName);
    setProjectId(newProjectId);
    setData([]);
    createProject(newProjectName);
  };

  const handleLoadProject = async (name: string) => {
    const projectData = await loadProject(name);
    if (projectData) {
      setProjectName(name);
      setProjectId(projectData.id || `project-${Date.now()}`);
      setData(projectData.data || []);
    }
  };

  const handleExport = () => {
    // Export functionality will be implemented later
    console.log("Exporting data:", data);
  };

  const handleImport = () => {
    // Import functionality will be implemented later
    console.log("Import functionality");
  };

  const handleSettings = () => {
    console.log("Settings functionality");
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        {/* Header */}
        <Header
          projectName={projectName}
          onExport={handleExport}
          onImport={handleImport}
          onSettings={handleSettings}
        />

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 h-[600px]">
              {/* Editor */}
              <JsonGrid data={data} onChange={handleDataChange} />
            </div>
          </div>
        </main>

        {/* Footer */}
        <Footer />

        {/* Toast Notifications */}
        <ToastContainer />

        {/* Offline Indicator */}
        <OfflineIndicator />
      </div>
    </ErrorBoundary>
  );
}
