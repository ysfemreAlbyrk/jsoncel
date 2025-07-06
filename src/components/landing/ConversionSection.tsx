import React from "react";
import {
  ArrowRight,
  FileText,
  Table,
  Download,
  Grid3X3,
  MoveRight,
  Minus,
} from "lucide-react";

const inputFormat = {
  name: "JSON",
  icon: FileText,
  description: "JavaScript Object Notation",
  color: "text-blue-600 dark:text-blue-400",
  bgColor: "bg-blue-100 dark:bg-blue-900/20",
};

const outputFormats = [
  {
    name: "JSON",
    icon: FileText,
    description: "JavaScript Object Notation",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
    rotation: "-rotate-12",
    zIndex: "z-30",
  },
  {
    name: "CSV",
    icon: Table,
    description: "Comma Separated Values",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/20",
    rotation: "rotate-0",
    zIndex: "z-20",
  },
  {
    name: "Excel",
    icon: Download,
    description: "Microsoft Excel Format",
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-900/20",
    rotation: "rotate-12",
    zIndex: "z-10",
  },
];

export function ConversionSection() {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Seamless Format Conversion
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Import JSON data, visualize it in a table format, and export to
              multiple formats.
            </p>
          </div>

          {/* Visual Flow */}
          <div className="flex flex-col lg:flex-row items-center justify-center space-y-8 lg:space-y-0 lg:space-x-16 mb-12">
            {/* Input JSON */}
            <div className="flex flex-col items-center mt-12">
              {/* <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">
                INPUT
              </div> */}
              <div
                className={`w-24 h-24 ${inputFormat.bgColor} rounded-2xl flex items-center justify-center mb-4 shadow-lg border-2 border-dashed border-blue-300 dark:border-blue-700  hover:scale-105 transition-transform duration-300`}
              >
                <inputFormat.icon
                  className={`w-12 h-12 ${inputFormat.color}`}
                />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {inputFormat.name}
              </h4>
            </div>

            {/* Arrow 1 */}
            <div className="hidden lg:flex items-center">
              <div className="flex items-center">
                <div className="flex items-center">
                  <MoveRight className="h-10 w-10 text-gray-400 dark:text-gray-600 -ml-2" />
                </div>
              </div>
            </div>

            {/* Middle Table/Grid */}
            <div className="flex flex-col items-center">
              {/* <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">
                VISUALIZATION
              </div> */}
              <div className="mt-12 w-32 h-24 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl flex items-center justify-center mb-4 shadow-lg border border-purple-200 dark:border-purple-800 hover:scale-105 transition-transform duration-300">
                <Grid3X3 className="w-12 h-12 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Table View
              </h4>
              {/* <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-32">
                Interactive Grid Editor
              </p> */}
            </div>

            {/* Arrow 2 */}
            <div className="hidden lg:flex items-center">
              <div className="flex items-center">
                <MoveRight className="h-10 w-10 text-gray-400 dark:text-gray-600 -ml-2" />
              </div>
            </div>

            {/* Output Formats - Stack */}
            <div className="flex flex-col items-center">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">
                {/* OUTPUT */}
              </div>
              <div className="relative w-24 h-64 mb-4">
                {outputFormats.map((format, index) => (
                  <div
                    key={format.name}
                    className={`absolute ${format.zIndex} ${format.rotation} hover:rotate-0 hover:scale-110 hover:z-50 transition-all duration-300 cursor-pointer`}
                    style={{
                      top: `${index * 82}px`,
                      left: `${index * 0}px`,
                    }}
                  >
                    <div
                      className={`w-32 h-24 ${format.bgColor} rounded-xl flex flex-col items-center justify-center shadow-lg border border-opacity-20 border-gray-300 dark:border-gray-600 `}
                    >
                      <format.icon className={`w-6 h-6 ${format.color} mb-1`} />
                      <span className="text-xs font-semibold text-gray-900 dark:text-white">
                        {format.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
