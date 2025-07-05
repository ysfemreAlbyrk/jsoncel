import React from "react";
import { ArrowRight, Star, Users, Zap } from "lucide-react";
import { Button } from "../ui/Button";

interface CTASectionProps {
  onGetStarted?: () => void;
}

export function CTASection({ onGetStarted }: CTASectionProps) {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-700 dark:via-purple-700 dark:to-indigo-800">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main CTA */}
          <div className="mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your JSON Data?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of developers who trust JSONcel for their data
              editing needs. Start organizing your JSON data like a pro today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={onGetStarted}
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() =>
                  window.open("https://github.com/jsoncel/jsoncel", "_blank")
                }
                className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-4 text-lg transition-all duration-300"
              >
                View on GitHub
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">10K+</div>
              <div className="text-blue-100">Active Users</div>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">4.9/5</div>
              <div className="text-blue-100">User Rating</div>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">99.9%</div>
              <div className="text-blue-100">Uptime</div>
            </div>
          </div>

          {/* Features Summary */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-6">
              Everything You Need in One Place
            </h3>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-white mb-1">
                    Visual Editor
                  </h4>
                  <p className="text-sm text-blue-100">
                    Edit JSON data in a spreadsheet-like interface
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-white mb-1">
                    Format Support
                  </h4>
                  <p className="text-sm text-blue-100">
                    Import/export JSON, CSV, Excel files
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Auto-Save</h4>
                  <p className="text-sm text-blue-100">
                    Never lose your work with automatic saving
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-white mb-1">
                    Offline Ready
                  </h4>
                  <p className="text-sm text-blue-100">
                    Works perfectly without internet connection
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="mt-12">
            <p className="text-blue-100 mb-4">
              No credit card required • Free forever • Open source
            </p>
            <div className="flex items-center justify-center space-x-1 text-yellow-300">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
              <span className="ml-2 text-white font-medium">
                Trusted by developers worldwide
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
