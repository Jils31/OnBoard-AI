
import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="py-16 md:py-24 px-4 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 text-white relative overflow-hidden">
      {/* Background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl"></div>
        <div className="absolute top-1/2 -left-24 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-60 h-60 rounded-full bg-purple-500/20 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="md:w-1/2 mb-8 md:mb-0"
          >
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-4 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Understand codebases in{" "}
              <span className="text-blue-200 relative">
                minutes not weeks
                <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 5.5C36.8333 3.16667 153.8 0.5 299 8.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl mb-6 text-blue-100 font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Onboarding Buddy uses AI to analyze repositories.
            </motion.p>
            
            <motion.p 
              className="mb-8 text-blue-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Identify critical code paths, understand architecture patterns, 
              and create interactive documentation that helps developers get productive quickly.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Link to="/dashboard">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>
              <Link to="#features">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-700 backdrop-blur-sm bg-white/10">
                    Learn More
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="md:w-5/12"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl blur-lg opacity-30"></div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-2xl border border-white/20 relative">
                <div className="flex items-center gap-2 text-sm mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <span className="ml-2 text-blue-100">System Architecture Map</span>
                </div>
                
                <div className="space-y-3">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                    className="h-6 bg-white/20 rounded"
                  ></motion.div>
                  
                  <div className="h-40 bg-white/20 rounded w-full relative overflow-hidden">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      {/* Simple code architecture visualization */}
                      <svg width="200" height="120" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="70" y="10" width="60" height="30" rx="4" fill="rgba(255,255,255,0.3)" />
                        <rect x="20" y="70" width="50" height="30" rx="4" fill="rgba(255,255,255,0.3)" />
                        <rect x="130" y="70" width="50" height="30" rx="4" fill="rgba(255,255,255,0.3)" />
                        <rect x="75" y="70" width="50" height="30" rx="4" fill="rgba(255,255,255,0.5)" />
                        <path d="M100 40L100 70" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
                        <path d="M100 70L45 70" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
                        <path d="M100 70L155 70" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
                      </svg>
                    </motion.div>
                  </div>
                  
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "75%" }}
                    transition={{ duration: 0.7, delay: 1.1 }}
                    className="h-6 bg-white/20 rounded"
                  ></motion.div>
                  
                  <div className="flex gap-3">
                    <motion.div 
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.7, delay: 1.3 }}
                      className="h-6 bg-white/20 rounded w-1/2"
                    ></motion.div>
                    
                    <motion.div 
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.7, delay: 1.5 }}
                      className="h-6 bg-white/20 rounded w-1/2"
                    ></motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
