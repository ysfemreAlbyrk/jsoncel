import { useState, useEffect } from "react";
import { storageManager } from "../utils/storageManager";
import type { Project, ProjectMetadata } from "../types";

export function useOfflineStorage() {
  const [projects, setProjects] = useState<ProjectMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const projectList = storageManager.listProjects();
      setProjects(projectList);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  };

  const createProject = async (name: string, data: any[] = []) => {
    try {
      const project: Project = {
        id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name,
        data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      storageManager.saveProject(project);
      await loadProjects();
      return project.id;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project");
      throw err;
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      storageManager.deleteProject(projectId);
      await loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete project");
      throw err;
    }
  };

  const loadProject = async (projectId: string): Promise<Project | null> => {
    try {
      return storageManager.loadProject(projectId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load project");
      return null;
    }
  };

  const saveProject = async (project: Project) => {
    try {
      storageManager.saveProject(project);
      await loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save project");
      throw err;
    }
  };

  const getStorageInfo = () => {
    return storageManager.getStorageInfo();
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return {
    projects,
    isLoading,
    error,
    createProject,
    deleteProject,
    loadProject,
    saveProject,
    loadProjects,
    getStorageInfo,
  };
}
