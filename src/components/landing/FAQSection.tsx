import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "What is JSONcel and how does it work?",
    answer:
      "JSONcel is a web-based JSON table editor that transforms JSON data into an Excel-like spreadsheet interface. It allows you to edit, manipulate, and visualize JSON data in a familiar tabular format, making it easier to work with complex data structures.",
  },
  {
    question: "Can I import existing JSON and CSV files?",
    answer:
      "Yes! JSONcel supports importing both JSON and CSV files. You can drag and drop files directly into the editor or use the file upload button. The tool automatically parses and converts your data into an editable table format.",
  },
  {
    question: "What export formats are supported?",
    answer:
      "JSONcel supports exporting your data in three formats: JSON (original format), CSV (comma-separated values), and Excel (.xlsx). This gives you flexibility to use your data in different applications and workflows.",
  },
  {
    question: "Does JSONcel work offline?",
    answer:
      "Yes! JSONcel is a Progressive Web App (PWA) that works completely offline. Your data is stored locally in your browser, and you can continue working even without an internet connection. You can also install it as a desktop app.",
  },
  {
    question: "Is my data secure and private?",
    answer:
      "Absolutely! JSONcel runs entirely in your browser - no data is sent to external servers. All your JSON data is stored locally on your device, ensuring complete privacy and security. Your data never leaves your computer.",
  },
  {
    question: "Can I handle large JSON files?",
    answer:
      "JSONcel is optimized for performance and can handle moderately large JSON files (up to 10MB). The tool uses efficient rendering techniques to ensure smooth performance even with thousands of rows and columns.",
  },
  {
    question: "What data types are supported?",
    answer:
      "JSONcel automatically detects and handles various data types including strings, numbers, booleans, arrays, and objects. It provides appropriate editing interfaces for each data type and maintains data integrity during editing.",
  },
  {
    question: "Can I collaborate with others on JSON data?",
    answer:
      "Currently, JSONcel is designed for individual use with local storage. However, you can easily share your work by exporting files and sharing them with colleagues. Team collaboration features are planned for future releases.",
  },
];

interface FAQItemProps {
  faq: (typeof faqs)[0];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ faq, index, isOpen, onToggle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800"
    >
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
          {faq.question}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-4 pt-2">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const FAQSection: React.FC = () => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to know about JSONcel and how it can help you
            work with JSON data
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              index={index}
              isOpen={openItems.has(index)}
              onToggle={() => toggleItem(index)}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Still have questions? Get started and explore JSONcel yourself!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
            onClick={() => (window.location.href = "/editor")}
          >
            Try JSONcel Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};
