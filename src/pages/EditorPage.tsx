import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Header } from "../components/shared/Header";
import { Footer } from "../components/shared/Footer";
import { JsonGrid } from "../components/editor/JsonGrid";
import { FileUpload } from "../components/editor/FileUpload";
import { ProjectManager } from "../components/editor/ProjectManager";
import { ExportButton } from "../components/editor/ExportButton";
import { Modal } from "../components/ui/Modal";
import { Button } from "../components/ui/Button";
import { useJsonData } from "../hooks/useJsonData";
import { useAutoSave } from "../hooks/useAutoSave";
import { useOfflineStorage } from "../hooks/useOfflineStorage";
import { ToastContainer, toast } from "../components/ui/ToastContainer";
import { OfflineIndicator } from "../components/shared/OfflineIndicator";
import { ErrorBoundary } from "../components/shared/ErrorBoundary";
import { FolderOpen, X } from "lucide-react";
import type { JsonArray } from "../types";

export function EditorPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("Untitled Project");
  const [projectId, setProjectId] = useState<string | undefined>(undefined);
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);
  const [isProjectManagerOpen, setIsProjectManagerOpen] = useState(false);
  const { data, setData } = useJsonData([
    { name: "John Doe", age: 30, city: "New York", active: true },
    { name: "Jane Smith", age: 25, city: "Los Angeles", active: false },
    { name: "Bob Johnson", age: 35, city: "Chicago", active: true },
  ]);
  const {
    projects,
    createProject,
    saveProject,
    loadProject,
    deleteProject,
    renameProject,
  } = useOfflineStorage();

  // Handle URL parameters and deep linking
  useEffect(() => {
    const projectParam = searchParams.get("project");
    const actionParam = searchParams.get("action");

    if (projectParam && projectParam !== projectId) {
      // Load project from URL parameter
      handleProjectSelect(projectParam);
    }

    if (actionParam === "upload") {
      setIsFileUploadOpen(true);
      // Clean up URL parameter
      setSearchParams((params) => {
        params.delete("action");
        return params;
      });
    }

    if (actionParam === "projects") {
      setIsProjectManagerOpen(true);
      // Clean up URL parameter
      setSearchParams((params) => {
        params.delete("action");
        return params;
      });
    }
  }, [searchParams, projectId, setSearchParams]);

  // Update URL when project changes
  useEffect(() => {
    if (projectId) {
      setSearchParams((params) => {
        params.set("project", projectId);
        return params;
      });
    } else {
      setSearchParams((params) => {
        params.delete("project");
        return params;
      });
    }
  }, [projectId, setSearchParams]);

  // Auto-save functionality
  useAutoSave({
    data,
    projectId: projectId || `temp-${Date.now()}`,
    projectName,
    enabled: !!projectId,
    interval: 5000,
  });

  const handleDataChange = (newData: JsonArray) => {
    setData(newData);
  };

  const handleNewProject = async () => {
    const newProjectName = `Project ${Date.now()}`;
    try {
      const newProjectId = await createProject(newProjectName, []);
      setProjectName(newProjectName);
      setProjectId(newProjectId);
      setData([]);
      toast.success(`Project "${newProjectName}" created`);
    } catch (error) {
      toast.error("Failed to create project");
    }
  };

  const handleProjectSelect = async (selectedProjectId: string) => {
    try {
      const projectData = await loadProject(selectedProjectId);
      if (projectData) {
        setProjectName(projectData.name);
        setProjectId(projectData.id);
        setData(projectData.data || []);
        setIsProjectManagerOpen(false);

        // Update browser history
        navigate(`/editor?project=${projectData.id}`, { replace: false });
      }
    } catch (error) {
      toast.error("Failed to load project");
    }
  };

  const handleProjectCreate = async (name: string, description?: string) => {
    try {
      const newProjectId = await createProject(name, [], description);
      setProjectName(name);
      setProjectId(newProjectId);
      setData([]);

      // Update browser history
      navigate(`/editor?project=${newProjectId}`, { replace: false });
    } catch (error) {
      throw error; // Re-throw to let ProjectManager handle it
    }
  };

  const handleProjectDelete = async (projectIdToDelete: string) => {
    try {
      await deleteProject(projectIdToDelete);
      // If we deleted the current project, reset to default
      if (projectIdToDelete === projectId) {
        setProjectName("Untitled Project");
        setProjectId(undefined);
        setData([
          { name: "John Doe", age: 30, city: "New York", active: true },
          { name: "Jane Smith", age: 25, city: "Los Angeles", active: false },
          { name: "Bob Johnson", age: 35, city: "Chicago", active: true },
        ]);
      }
    } catch (error) {
      throw error; // Re-throw to let ProjectManager handle it
    }
  };

  const handleProjectRename = async (
    projectIdToRename: string,
    newName: string
  ) => {
    try {
      await renameProject(projectIdToRename, newName);
      // If we renamed the current project, update the name
      if (projectIdToRename === projectId) {
        setProjectName(newName);
      }
    } catch (error) {
      throw error; // Re-throw to let ProjectManager handle it
    }
  };

  const handleExport = () => {
    // Export functionality is now handled by ExportButton component
    console.log("Export button clicked");
  };

  const handleImport = () => {
    setIsFileUploadOpen(true);
  };

  const handleFileUpload = (uploadedData: JsonArray, filename: string) => {
    setData(uploadedData);
    setProjectName(filename.replace(/\.[^/.]+$/, "")); // Remove file extension
    setIsFileUploadOpen(false);
    toast.success(`Successfully imported ${filename}`);
  };

  const handleFileUploadError = (error: string) => {
    toast.error(`Import failed: ${error}`);
  };

  const handleSettings = () => {
    setIsProjectManagerOpen(true);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        {/* Header */}
        <Header
          projectName={projectName}
          data={data}
          onExport={handleExport}
          onImport={handleImport}
          onSettings={handleSettings}
        />

        {/* Project Manager Button */}
        <div className="container mx-auto px-4 py-2">
          <div className="max-w-7xl mx-auto">
            <Button
              onClick={() => setIsProjectManagerOpen(true)}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <FolderOpen className="w-4 h-4" />
              <span>Projects ({projects.length})</span>
            </Button>
          </div>
        </div>

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

        {/* File Upload Modal */}
        <Modal
          isOpen={isFileUploadOpen}
          onClose={() => setIsFileUploadOpen(false)}
          title="Import JSON File"
        >
          <FileUpload
            onFileUpload={handleFileUpload}
            onError={handleFileUploadError}
            acceptedTypes={[".json", ".csv"]}
            maxFileSize={10}
            className="max-w-lg mx-auto"
          />
        </Modal>

        {/* Project Manager Modal */}
        <Modal
          isOpen={isProjectManagerOpen}
          onClose={() => setIsProjectManagerOpen(false)}
          title="Project Manager"
          className="max-w-4xl"
        >
          <div className="h-[600px]">
            <ProjectManager
              projects={projects}
              currentProjectId={projectId}
              onProjectSelect={handleProjectSelect}
              onProjectCreate={handleProjectCreate}
              onProjectDelete={handleProjectDelete}
              onProjectRename={handleProjectRename}
            />
          </div>
        </Modal>
      </div>
    </ErrorBoundary>
  );
}
