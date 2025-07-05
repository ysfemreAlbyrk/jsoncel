import type {
  Project,
  ProjectMetadata,
  StorageData,
  AppSettings,
} from "../types";

const STORAGE_KEY = "jsoncel-data";
const SETTINGS_KEY = "jsoncel-settings";
const VERSION = "1.0.0";

const DEFAULT_SETTINGS: AppSettings = {
  theme: "system",
  autoSave: true,
  autoSaveInterval: 5000,
  defaultFormat: "json",
  maxProjects: 50,
};

export class StorageManager {
  private static instance: StorageManager;

  private constructor() {}

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  getSettings(): AppSettings {
    try {
      const settings = localStorage.getItem(SETTINGS_KEY);
      if (settings) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(settings) };
      }
      return DEFAULT_SETTINGS;
    } catch (error) {
      console.error("Error loading settings:", error);
      return DEFAULT_SETTINGS;
    }
  }

  saveSettings(settings: Partial<AppSettings>): void {
    try {
      const currentSettings = this.getSettings();
      const newSettings = { ...currentSettings, ...settings };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  }

  saveProject(project: Project): void {
    try {
      const data = this.getStorageData();
      const existingIndex = data.projects.findIndex((p) => p.id === project.id);

      if (existingIndex >= 0) {
        data.projects[existingIndex] = project;
      } else {
        data.projects.push(project);
      }

      const settings = this.getSettings();
      if (data.projects.length > settings.maxProjects) {
        data.projects = data.projects
          .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
          .slice(0, settings.maxProjects);
      }

      this.saveStorageData(data);
    } catch (error) {
      console.error("Error saving project:", error);
      throw new Error("Failed to save project");
    }
  }

  loadProject(projectId: string): Project | null {
    try {
      const data = this.getStorageData();
      return data.projects.find((p) => p.id === projectId) || null;
    } catch (error) {
      console.error("Error loading project:", error);
      return null;
    }
  }

  deleteProject(projectId: string): void {
    try {
      const data = this.getStorageData();
      data.projects = data.projects.filter((p) => p.id !== projectId);
      this.saveStorageData(data);
    } catch (error) {
      console.error("Error deleting project:", error);
      throw new Error("Failed to delete project");
    }
  }

  listProjects(): ProjectMetadata[] {
    try {
      const data = this.getStorageData();
      return data.projects.map((project) => ({
        id: project.id,
        name: project.name,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        rowCount: project.data.length,
        columnCount:
          project.data.length > 0 ? Object.keys(project.data[0]).length : 0,
        description: project.description,
      }));
    } catch (error) {
      console.error("Error listing projects:", error);
      return [];
    }
  }

  private getStorageData(): StorageData {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed: StorageData = JSON.parse(data);

        parsed.projects = parsed.projects.map((project) => ({
          ...project,
          createdAt: new Date(project.createdAt),
          updatedAt: new Date(project.updatedAt),
        }));

        return parsed;
      }

      return {
        projects: [],
        settings: DEFAULT_SETTINGS,
        version: VERSION,
      };
    } catch (error) {
      console.error("Error getting storage data:", error);
      return {
        projects: [],
        settings: DEFAULT_SETTINGS,
        version: VERSION,
      };
    }
  }

  getStorageInfo(): { used: number; total: number; percentage: number } {
    try {
      const data = this.getStorageData();
      const dataSize = JSON.stringify(data).length;
      const totalSize = 5 * 1024 * 1024; // 5MB typical localStorage limit

      return {
        used: dataSize,
        total: totalSize,
        percentage: (dataSize / totalSize) * 100,
      };
    } catch (error) {
      console.error("Error getting storage info:", error);
      return { used: 0, total: 0, percentage: 0 };
    }
  }

  private saveStorageData(data: StorageData): void {
    try {
      data.version = VERSION;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving storage data:", error);
      throw new Error("Failed to save data to storage");
    }
  }
}

export const storageManager = StorageManager.getInstance();
