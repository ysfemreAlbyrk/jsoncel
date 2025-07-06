import React from "react";
import { FileText, Upload, Settings, FolderOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { ThemeToggle } from "./ThemeToggle";
import { ExportButton } from "../editor/ExportButton";
import { toast } from "../ui/ToastContainer";
import type { JsonArray } from "../../types";

interface HeaderProps {
  onImport?: () => void;
  onExport?: () => void;
  onSettings?: () => void;
  onProjectsClick?: () => void;
  projectName?: string;
  data?: JsonArray;
  projectsCount?: number;
}

export function Header({
  onImport,
  onExport,
  onSettings,
  onProjectsClick,
  projectName,
  data = [],
  projectsCount = 0,
}: HeaderProps) {
  const navigate = useNavigate();

  const handleImport = () => {
    onImport?.();
  };

  const handleSettings = () => {
    onSettings?.();
  };

  const handleProjectsClick = () => {
    onProjectsClick?.();
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Logo and Project Name */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLogoClick}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              JSONcel
            </h1>
          </button>

          {projectName && (
            <div className="hidden sm:flex items-center space-x-2">
              <span className="text-gray-400">•</span>
              <span className="text-gray-600 dark:text-gray-300">
                {projectName}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleProjectsClick}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <FolderOpen className="w-4 h-4" />
            <span>Projects ({projectsCount})</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleImport}
            className="hidden sm:flex"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>

          <ExportButton
            data={data}
            projectName={projectName || "Untitled Project"}
            className="hidden sm:flex"
          />

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSettings}
            className="hidden sm:flex"
          >
            <Settings className="w-4 h-4" />
          </Button>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
