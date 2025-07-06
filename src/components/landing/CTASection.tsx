import React from "react";
import { ArrowRight, Star, Sparkles, CheckCircle } from "lucide-react";
import { Button } from "../ui/Button";

interface CTASectionProps {
  onGetStarted?: () => void;
}

export function CTASection({ onGetStarted }: CTASectionProps) {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Main CTA Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 px-8 py-12 text-center relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-600/20"></div>
              <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
              <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-300"></div>

              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                  Ready to Transform Your
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200">
                    JSON Workflow?
                  </span>
                </h2>
                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Join thousands of developers who trust JSONcel for their data
                  editing needs. Start organizing your JSON data like a pro
                  today.
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="px-8 py-12">
              {/* Features Grid */}
              <div className="grid md:grid-cols-3 gap-6 mb-10">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Free Forever
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    No credit card required
                  </p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4">
                    <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Open Source
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Transparent & community-driven
                  </p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full mb-4">
                    <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Privacy First
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Your data stays on your device
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button
                  size="lg"
                  onClick={onGetStarted}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-10 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Sparkles className="mr-2 w-5 h-5" />
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() =>
                    window.open("https://github.com/jsoncel/jsoncel", "_blank")
                  }
                  className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold px-10 py-4 text-lg transition-all duration-300 transform hover:scale-105"
                >
                  View on GitHub
                </Button>
              </div>

              {/* Social Proof */}
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 text-yellow-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                  <span className="ml-2 text-gray-700 dark:text-gray-300 font-medium">
                    4.9/5 from 1,000+ developers
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Trusted by developers at Google, Microsoft, and hundreds of
                  startups
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
