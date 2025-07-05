import React from "react";
import { ArrowRight, FileText, Table, Download } from "lucide-react";

const formats = [
  {
    name: "JSON",
    icon: FileText,
    description: "JavaScript Object Notation",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
  },
  {
    name: "CSV",
    icon: Table,
    description: "Comma Separated Values",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/20",
  },
  {
    name: "Excel",
    icon: Download,
    description: "Microsoft Excel Format",
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-900/20",
  },
];

export function ConversionSection() {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Seamless Format Conversion
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Import and export your data in multiple formats. No more manual
              conversion headaches.
            </p>
          </div>

          {/* Visual Flow */}
          <div className="flex flex-col lg:flex-row items-center justify-center space-y-8 lg:space-y-0 lg:space-x-8 mb-12">
            {formats.map((format, index) => (
              <React.Fragment key={format.name}>
                {/* Format Card */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-20 h-20 ${format.bgColor} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}
                  >
                    <format.icon className={`w-10 h-10 ${format.color}`} />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {format.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    {format.description}
                  </p>
                </div>

                {/* Arrow (except for last item) */}
                {index < formats.length - 1 && (
                  <div className="hidden lg:flex items-center">
                    <ArrowRight className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Interactive Demo */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Input */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Input (JSON)
                </h4>
                <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <pre className="text-sm text-gray-700 dark:text-gray-300 overflow-x-auto">
                    {`[
  {
    "name": "John Doe",
    "age": 30,
    "city": "New York"
  },
  {
    "name": "Jane Smith", 
    "age": 25,
    "city": "Los Angeles"
  }
]`}
                  </pre>
                </div>
              </div>

              {/* Output */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Output (CSV)
                </h4>
                <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <pre className="text-sm text-gray-700 dark:text-gray-300 overflow-x-auto">
                    {`name,age,city
John Doe,30,New York
Jane Smith,25,Los Angeles`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Preserve Structure
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Table className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Auto Headers
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Download className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Instant Download
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <ArrowRight className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Batch Convert
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
