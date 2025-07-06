import React, { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "../ui/Button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Global Error Boundary caught an error:", error, errorInfo);

    // Log error to monitoring service in production
    if (import.meta.env.PROD) {
      this.logErrorToService(error, errorInfo);
    }

    this.setState({
      hasError: true,
      error,
      errorInfo,
    });
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // In a real app, you would send this to a service like Sentry, LogRocket, etc.
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // Store in localStorage as fallback
    try {
      const existingErrors = JSON.parse(
        localStorage.getItem("app_errors") || "[]"
      );
      existingErrors.push(errorData);
      // Keep only last 10 errors
      if (existingErrors.length > 10) {
        existingErrors.splice(0, existingErrors.length - 10);
      }
      localStorage.setItem("app_errors", JSON.stringify(existingErrors));
    } catch (e) {
      console.error("Failed to log error to localStorage:", e);
    }
  };

  private handleRefresh = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>

              <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Oops! Something went wrong
              </h1>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We're sorry, but something unexpected happened. The error has
                been logged and we'll look into it.
              </p>

              {import.meta.env.DEV && this.state.error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-left">
                  <h3 className="text-sm font-semibold text-red-800 dark:text-red-400 mb-2">
                    Error Details (Development Mode)
                  </h3>
                  <p className="text-xs text-red-700 dark:text-red-300 font-mono break-all">
                    {this.state.error.message}
                  </p>
                  {this.state.error.stack && (
                    <details className="mt-2">
                      <summary className="text-xs text-red-600 dark:text-red-400 cursor-pointer">
                        Stack Trace
                      </summary>
                      <pre className="text-xs text-red-700 dark:text-red-300 mt-1 overflow-x-auto">
                        {this.state.error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={this.handleRetry}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </Button>

                <Button
                  variant="outline"
                  onClick={this.handleGoHome}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </Button>
              </div>

              <button
                onClick={this.handleRefresh}
                className="mt-4 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                Or refresh the page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
