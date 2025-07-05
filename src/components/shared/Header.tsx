import React from "react";
import { FileText, Download, Upload, Settings } from "lucide-react";
import { Button } from "../ui/Button";
import { ThemeToggle } from "./ThemeToggle";
import { toast } from "../ui/ToastContainer";

interface HeaderProps {
  onImport?: () => void;
  onExport?: () => void;
  onSettings?: () => void;
  projectName?: string;
}

export function Header({
  onImport,
  onExport,
  onSettings,
  projectName,
}: HeaderProps) {
  const handleImport = () => {
    onImport?.();
    toast.info("Import functionality coming soon!");
  };

  const handleExport = () => {
    onExport?.();
    toast.info("Export functionality coming soon!");
  };

  const handleSettings = () => {
    onSettings?.();
    toast.info("Settings panel coming soon!");
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Logo and Project Name */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              JSONcel
            </h1>
          </div>

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
            variant="ghost"
            size="sm"
            onClick={handleImport}
            className="hidden sm:flex"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleExport}
            className="hidden sm:flex"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>

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
