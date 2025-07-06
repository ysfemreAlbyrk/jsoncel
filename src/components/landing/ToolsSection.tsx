import React from "react";
import { motion } from "framer-motion";
import {
  FileJson,
  Table,
  Download,
  Upload,
  Search,
  Filter,
  Edit3,
  Database,
} from "lucide-react";
import { Card } from "../ui/Card";

const tools = [
  {
    icon: FileJson,
    title: "JSON Editor",
    description: "Edit JSON data with a powerful table interface",
    color: "text-blue-500",
  },
  {
    icon: Table,
    title: "Excel-like Grid",
    description: "Familiar spreadsheet experience for JSON data",
    color: "text-green-500",
  },
  {
    icon: Upload,
    title: "File Import",
    description: "Import JSON and CSV files with drag & drop",
    color: "text-purple-500",
  },
  {
    icon: Download,
    title: "Multi-format Export",
    description: "Export to JSON, CSV, and Excel formats",
    color: "text-orange-500",
  },
  {
    icon: Search,
    title: "Smart Search",
    description: "Find and filter data across all columns",
    color: "text-red-500",
  },
  {
    icon: Filter,
    title: "Advanced Filtering",
    description: "Apply complex filters to your data",
    color: "text-indigo-500",
  },
  {
    icon: Edit3,
    title: "Inline Editing",
    description: "Edit cells directly with type validation",
    color: "text-teal-500",
  },
  {
    icon: Database,
    title: "Offline Storage",
    description: "Work offline with automatic data persistence",
    color: "text-pink-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export const ToolsSection: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Powerful Tools for JSON Management
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to work with JSON data efficiently and
            effectively
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {tools.map((tool, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 },
              }}
              className="h-full"
            >
              <Card className="h-full p-6 hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-gray-800 group">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div
                    className={`p-3 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <tool.icon className={`w-8 h-8 ${tool.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Ready to experience the power of JSONcel?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
            onClick={() => (window.location.href = "/editor")}
          >
            Try All Tools Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};
