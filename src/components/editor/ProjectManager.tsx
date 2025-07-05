import React, { useState, useCallback } from "react";
import {
  FolderPlus,
  Folder,
  FileText,
  Trash2,
  Edit3,
  Calendar,
  Database,
  Search,
  MoreVertical,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { toast } from "../ui/ToastContainer";
import type { ProjectMetadata } from "../../types";

interface ProjectManagerProps {
  projects: ProjectMetadata[];
  currentProjectId?: string;
  onProjectSelect: (projectId: string) => void;
  onProjectCreate: (name: string, description?: string) => void;
  onProjectDelete: (projectId: string) => void;
  onProjectRename: (projectId: string, newName: string) => void;
  className?: string;
}

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, description?: string) => void;
}

function CreateProjectModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!name.trim()) {
        toast.error("Project name is required");
        return;
      }

      setIsSubmitting(true);
      try {
        await onSubmit(name.trim(), description.trim() || undefined);
        setName("");
        setDescription("");
        onClose();
        toast.success(`Project "${name}" created successfully`);
      } catch (error) {
        toast.error("Failed to create project");
      } finally {
        setIsSubmitting(false);
      }
    },
    [name, description, onSubmit, onClose]
  );

  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      setName("");
      setDescription("");
      onClose();
    }
  }, [isSubmitting, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Project">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="project-name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Project Name *
          </label>
          <input
            id="project-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter project name..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting}
            autoFocus
          />
        </div>

        <div>
          <label
            htmlFor="project-description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Description (optional)
          </label>
          <textarea
            id="project-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter project description..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={isSubmitting}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !name.trim()}
            className="min-w-[100px]"
          >
            {isSubmitting ? "Creating..." : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export function ProjectManager({
  projects,
  currentProjectId,
  onProjectSelect,
  onProjectCreate,
  onProjectDelete,
  onProjectRename,
  className = "",
}: ProjectManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isRenaming, setIsRenaming] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  // Filter projects based on search term
  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description &&
        project.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleProjectClick = useCallback(
    (projectId: string) => {
      if (projectId !== currentProjectId) {
        onProjectSelect(projectId);
        toast.success("Project switched successfully");
      }
    },
    [currentProjectId, onProjectSelect]
  );

  const handleDeleteProject = useCallback(
    (projectId: string, projectName: string) => {
      if (
        window.confirm(
          `Are you sure you want to delete "${projectName}"? This action cannot be undone.`
        )
      ) {
        onProjectDelete(projectId);
        toast.success(`Project "${projectName}" deleted`);
      }
    },
    [onProjectDelete]
  );

  const handleStartRename = useCallback(
    (projectId: string, currentName: string) => {
      setIsRenaming(projectId);
      setRenameValue(currentName);
    },
    []
  );

  const handleCancelRename = useCallback(() => {
    setIsRenaming(null);
    setRenameValue("");
  }, []);

  const handleSubmitRename = useCallback(
    (projectId: string) => {
      if (
        renameValue.trim() &&
        renameValue.trim() !== projects.find((p) => p.id === projectId)?.name
      ) {
        onProjectRename(projectId, renameValue.trim());
        toast.success("Project renamed successfully");
      }
      setIsRenaming(null);
      setRenameValue("");
    },
    [renameValue, projects, onProjectRename]
  );

  const formatDate = useCallback((date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }, []);

  return (
    <div className={`w-full h-full flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Folder className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Project Manager
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ({projects.length} project{projects.length !== 1 ? "s" : ""})
          </span>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          size="sm"
          className="flex items-center space-x-2"
        >
          <FolderPlus className="w-4 h-4" />
          <span>New Project</span>
        </Button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Project List */}
      <div className="flex-1 overflow-y-auto">
        {filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <Folder className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm ? "No matching projects" : "No projects yet"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Create your first project to get started"}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <FolderPlus className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            )}
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className={`group relative p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                  project.id === currentProjectId
                    ? "border-blue-300 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-600"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
                onClick={() => handleProjectClick(project.id)}
              >
                {/* Project Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <FileText
                      className={`w-5 h-5 flex-shrink-0 ${
                        project.id === currentProjectId
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-400"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      {isRenaming === project.id ? (
                        <input
                          type="text"
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onBlur={() => handleSubmitRename(project.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter")
                              handleSubmitRename(project.id);
                            if (e.key === "Escape") handleCancelRename();
                          }}
                          className="w-full px-2 py-1 text-sm font-medium bg-white dark:bg-gray-800 border border-blue-500 rounded"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {project.name}
                        </h3>
                      )}
                      {project.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartRename(project.id, project.name);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
                      title="Rename project"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProject(project.id, project.name);
                      }}
                      className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded"
                      title="Delete project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Project Stats */}
                <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Database className="w-3 h-3" />
                    <span>{project.rowCount} rows</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FileText className="w-3 h-3" />
                    <span>{project.columnCount} columns</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>Updated {formatDate(project.updatedAt)}</span>
                  </div>
                </div>

                {/* Current Project Indicator */}
                {project.id === currentProjectId && (
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={onProjectCreate}
      />
    </div>
  );
}
