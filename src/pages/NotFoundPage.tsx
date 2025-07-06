import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft, FileQuestion } from "lucide-react";
import { Button } from "../components/ui/Button";

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <FileQuestion className="w-12 h-12 text-gray-400 dark:text-gray-500" />
          </div>
        </div>

        {/* 404 Text */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-2">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link to="/" className="block">
            <Button className="w-full flex items-center justify-center space-x-2">
              <Home className="w-4 h-4" />
              <span>Go to Home</span>
            </Button>
          </Link>

          <Link to="/editor" className="block">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go to Editor</span>
            </Button>
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>
            If you think this is a mistake, please{" "}
            <a
              href="https://github.com/yourusername/jsoncel/issues"
              className="text-blue-600 dark:text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              report an issue
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
