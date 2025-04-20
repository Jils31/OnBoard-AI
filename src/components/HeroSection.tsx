
import React from "react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <div className="py-16 md:py-24 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Onboarding Buddy AI
            </h1>
            <p className="text-xl md:text-2xl mb-6 text-blue-100">
              Understand any codebase in minutes, not months.
            </p>
            <p className="mb-8 text-blue-100">
              Onboarding Buddy uses AI to analyze repositories, identify critical code paths, 
              and create interactive documentation that helps developers get productive quickly.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-700">
                Learn More
              </Button>
            </div>
          </div>
          
          <div className="md:w-5/12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-white/20">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm mb-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <span className="ml-2 text-blue-100">System Architecture Map</span>
                </div>
                <div className="h-6 bg-white/20 rounded w-full"></div>
                <div className="h-40 bg-white/20 rounded w-full"></div>
                <div className="h-6 bg-white/20 rounded w-3/4"></div>
                <div className="flex gap-3">
                  <div className="h-6 bg-white/20 rounded w-1/2"></div>
                  <div className="h-6 bg-white/20 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
