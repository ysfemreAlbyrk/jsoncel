import React from "react";
import { Upload, FileText, Edit3, Download, Zap, Shield } from "lucide-react";
import { Button } from "../ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/Card";
import { ThemeToggle } from "../shared/ThemeToggle";
import { BenefitsSection } from "./BenefitsSection";

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              JSONcel
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Edit JSON Data Like a
            <span className="text-blue-600 dark:text-blue-400">
              {" "}
              Spreadsheet
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            JSONcel is a powerful, offline-first JSON table editor that makes
            working with JSON data as easy as using a spreadsheet. No servers,
            no sign-ups, just pure productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={onGetStarted}
              className="text-lg px-8 py-3"
            >
              Get Started Free
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose JSONcel?
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Built for developers, designers, and data analysts who work with
            JSON
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>Import & Export</CardTitle>
              <CardDescription>
                Support for JSON, CSV, and Excel files. Drag & drop or click to
                upload.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <Edit3 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>Intuitive Editing</CardTitle>
              <CardDescription>
                Edit JSON data with familiar spreadsheet-like interface. No more
                manual bracket matching.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>Privacy First</CardTitle>
              <CardDescription>
                100% offline. Your data never leaves your device. No servers, no
                tracking.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>
                Built with modern web technologies for instant loading and
                smooth performance.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4">
                <Download className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle>Auto-Save</CardTitle>
              <CardDescription>
                Never lose your work. Auto-save keeps your data safe in your
                browser.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <CardTitle>Multiple Formats</CardTitle>
              <CardDescription>
                Work with various data formats and export to the format you
                need.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <BenefitsSection />

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of developers who use JSONcel to work with JSON data
            efficiently.
          </p>
          <Button
            size="lg"
            onClick={onGetStarted}
            className="text-lg px-8 py-3"
          >
            Start Editing Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 JSONcel. Open source JSON table editor.</p>
        </div>
      </footer>
    </div>
  );
}
