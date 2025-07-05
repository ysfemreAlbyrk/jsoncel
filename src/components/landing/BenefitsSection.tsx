import React from "react";
import { Check } from "lucide-react";

const benefits = [
  "No server required - works completely offline",
  "Your data never leaves your device",
  "Familiar spreadsheet-like interface",
  "Support for large datasets",
  "Import/export multiple formats",
  "Automatic data validation",
  "Dark mode support",
  "Mobile-friendly responsive design",
  "Open source and free forever",
  "No registration or login required",
];

export function BenefitsSection() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Developers Love JSONcel
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Built with privacy, performance, and productivity in mind
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mt-0.5">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  {benefit}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                100% Client-side • Zero Server Dependency
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
