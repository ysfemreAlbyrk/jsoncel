import React, { useState, useEffect } from "react";
import { WifiOff, Wifi, RefreshCw } from "lucide-react";
import { cn } from "../../utils/cn";
import { toast } from "../ui/ToastContainer";

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOnlineNotification, setShowOnlineNotification] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      const wasOffline = !isOnline;
      setIsOnline(true);

      if (wasOffline) {
        setShowOnlineNotification(true);
        toast.success("Back online! All features are available.");

        // Hide online notification after 3 seconds
        setTimeout(() => {
          setShowOnlineNotification(false);
        }, 3000);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOnlineNotification(false);
      toast.warning(
        "You're offline. Don't worry, JSONcel works completely offline!"
      );
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isOnline]);

  // Show online notification briefly
  if (showOnlineNotification) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <div
          className={cn(
            "flex items-center space-x-2 px-3 py-2 rounded-lg shadow-lg",
            "bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800",
            "text-green-800 dark:text-green-200"
          )}
        >
          <Wifi className="w-4 h-4" />
          <span className="text-sm font-medium">Back Online</span>
        </div>
      </div>
    );
  }

  // Show offline indicator when offline
  if (!isOnline) {
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
          <div className="text-xs opacity-75">
            • Full functionality available
          </div>
        </div>
      </div>
    );
  }

  return null;
}
