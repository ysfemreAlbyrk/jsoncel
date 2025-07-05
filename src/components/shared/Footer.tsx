import React from "react";
import { Heart, Github, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Copyright */}
          <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
            <span>&copy; 2024 JSONcel. Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>for developers</span>
          </div>

          {/* Links */}
          <div className="flex items-center space-x-6">
            <a
              href="#"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Terms of Service
            </a>
            <div className="flex items-center space-x-3">
              <a
                href="#"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center text-xs text-gray-500 dark:text-gray-500">
            <p>
              JSONcel is an open-source, offline-first JSON table editor. Your
              data never leaves your device.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
