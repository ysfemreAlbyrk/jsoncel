import React from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "../../utils/cn";

export interface ToastProps {
  id: string;
  title?: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
  onClose: (id: string) => void;
}

export function Toast({ id, title, message, type, onClose }: ToastProps) {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800";
      case "error":
        return "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800";
      case "info":
        return "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800";
    }
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg border shadow-lg animate-slide-up",
        getBackgroundColor()
      )}
    >
      {getIcon()}
      <div className="flex-1">
        {title && (
          <h4 className="font-medium text-sm text-gray-900 dark:text-white mb-1">
            {title}
          </h4>
        )}
        <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>
      </div>
      <button
        onClick={() => onClose(id)}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
