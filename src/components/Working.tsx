import React from "react";
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {Check, ArrowRight} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from "@/context/AuthContext";

const Working: React.FC = () => {
    const {user} = useAuth()
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center"
          >
            <h3 className="text-2xl font-bold mb-4">
              Analyze any repository instantly
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Simply connect your GitHub account or paste a repository URL. Our
              AI will analyze the codebase structure, identify key patterns, and
              generate comprehensive insights.
            </p>
            <ul className="space-y-3">
              {[
                "Identify critical code paths",
                "Map dependencies",
                "Document architecture",
                "Highlight important components",
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="bg-gray-100 dark:bg-gray-700 p-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-5/6"></div>
                  <div className="h-24 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex justify-center mt-16">
          <Link to={user ? "/dashboard" : "/auth"}>
            <Button size="lg" className="gap-2">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Working