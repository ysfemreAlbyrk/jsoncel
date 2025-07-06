import React, { useState, useEffect } from "react";
import { Download, X, Smartphone, Monitor } from "lucide-react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

interface PWAInstallPromptProps {
  className?: string;
}

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function PWAInstallPrompt({ className = "" }: PWAInstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;
    const isInWebAppChrome = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;

    if (isStandalone || isInWebAppiOS || isInWebAppChrome) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Don't show immediately, wait a bit for user to explore
      setTimeout(() => {
        const hasShownBefore = localStorage.getItem("pwa-install-prompt-shown");
        const hasDismissed = localStorage.getItem("pwa-install-dismissed");

        if (!hasShownBefore && !hasDismissed) {
          setShowPrompt(true);
          localStorage.setItem("pwa-install-prompt-shown", "true");
        }
      }, 10000); // Show after 10 seconds
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
        localStorage.setItem("pwa-install-dismissed", "true");
      }

      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error("Error during installation:", error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-install-dismissed", "true");
  };

  const getDeviceIcon = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (
      userAgent.includes("mobile") ||
      userAgent.includes("android") ||
      userAgent.includes("iphone")
    ) {
      return <Smartphone className="w-5 h-5" />;
    }
    return <Monitor className="w-5 h-5" />;
  };

  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 max-w-sm ${className}`}>
      <Card className="p-4 shadow-lg border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            {getDeviceIcon()}
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
              Install JSONcel
            </h3>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Install JSONcel for quick access and offline use. Works like a native
          app!
        </p>

        <div className="flex space-x-2">
          <Button
            onClick={handleInstallClick}
            size="sm"
            className="flex items-center space-x-2 flex-1"
          >
            <Download className="w-4 h-4" />
            <span>Install</span>
          </Button>
          <Button
            onClick={handleDismiss}
            variant="outline"
            size="sm"
            className="px-3"
          >
            Later
          </Button>
        </div>

        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          • Works offline • Fast loading • Native-like experience
        </div>
      </Card>
    </div>
  );
}
