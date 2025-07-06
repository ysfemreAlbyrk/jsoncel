import React from "react";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "../ui/Button";

interface CTASectionProps {
  onGetStarted?: () => void;
}

export function CTASection({ onGetStarted }: CTASectionProps) {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who trust JSONcel for their data
            editing needs. Start organizing your JSON data like a pro today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              onClick={onGetStarted}
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
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
              className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-3 text-lg transition-all duration-300"
            >
              View on GitHub
            </Button>
          </div>

          <div className="text-center">
            <p className="text-blue-100 mb-4">
              No credit card required • Free forever • Open source
            </p>
            <div className="flex items-center justify-center space-x-1 text-yellow-300">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
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
