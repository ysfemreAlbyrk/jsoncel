import React, { useState, useEffect } from "react";
import { Toast, type ToastProps } from "./Toast";

interface ToastData extends Omit<ToastProps, "onClose"> {
  id: string;
  duration?: number;
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = (toast: Omit<ToastData, "id">) => {
    const id = Date.now().toString();
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    // Auto remove after duration
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Global toast function
  useEffect(() => {
    (window as any).showToast = addToast;
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={removeToast} />
      ))}
    </div>
  );
}

// Helper functions for easy toast usage
export const toast = {
  success: (message: string, title?: string) => {
    (window as any).showToast?.({ type: "success", message, title });
  },
  error: (message: string, title?: string) => {
    (window as any).showToast?.({ type: "error", message, title });
  },
  warning: (message: string, title?: string) => {
    (window as any).showToast?.({ type: "warning", message, title });
  },
  info: (message: string, title?: string) => {
    (window as any).showToast?.({ type: "info", message, title });
  },
};
