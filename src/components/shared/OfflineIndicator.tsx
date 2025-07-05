import React, { useState, useEffect } from "react";
import { WifiOff, Wifi } from "lucide-react";
import { cn } from "../../utils/cn";

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) {
    return null; // Don't show indicator when online
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div
        className={cn(
          "flex items-center space-x-2 px-3 py-2 rounded-lg shadow-lg",
          "bg-orange-100 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800",
          "text-orange-800 dark:text-orange-200"
        )}
      >
        <WifiOff className="w-4 h-4" />
        <span className="text-sm font-medium">Offline Mode</span>
      </div>
    </div>
  );
}
