
import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const HeroSection = () => {
  return (
    <div className="relative min-h-screen bg-gray-900 overflow-hidden">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 to-gray-900/50" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 2 }}
          className="absolute top-20 right-20 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"
        />
      </div>

      <div className="container relative mx-auto px-4 py-32">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          {/* New Feature Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Badge className="bg-blue-500/10 text-blue-300 border border-blue-500/20 px-4 py-1">
              New Feature: AI Code Analysis 2.0
            </Badge>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600"
          >
            Understand Codebases in Minutes
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl"
          >
            Our AI analyzes repositories, generates documentation, and helps developers understand complex code structures faster than ever.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link to="/auth">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 text-lg"
              >
                Get Started Free <ArrowRight className="ml-2" />
              </Button>
            </Link>
            <Button 
              size="lg"
              variant="outline"
              className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 px-8 h-12 text-lg"
            >
              View Demo <Download className="ml-2" />
            </Button>
          </motion.div>

          {/* Feature Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {[
              { label: "Repositories Analyzed", value: "10,000+" },
              { label: "Time Saved", value: "1000+ hrs" },
              { label: "Active Users", value: "5,000+" },
              { label: "Code Understanding", value: "3x Faster" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="p-6 rounded-lg bg-blue-500/5 border border-blue-500/10 backdrop-blur-sm"
              >
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
