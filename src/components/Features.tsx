import React from "react";
import {motion} from 'framer-motion'
import { BrainCog, Rocket, Code } from "lucide-react";

const Features: React.FC = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Features</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
            Powerful tools to help you understand any codebase faster and more
            efficiently
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Smart Repository Analysis",
              description:
                "Our AI analyzes repository structure, dependencies, and code paths to create a comprehensive understanding of your project.",
              icon: (
                <Code className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              ),
            },
            {
              title: "Interactive Documentation",
              description:
                "Generate visual maps, dependency graphs, and interactive guides that make understanding complex codebases intuitive.",
              icon: (
                <BrainCog className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              ),
            },
            {
              title: "Accelerated Onboarding",
              description:
                "Reduce onboarding time by 70% with personalized learning paths and step-by-step walkthroughs of critical workflows.",
              icon: (
                <Rocket className="h-8 w-8 text-green-600 dark:text-green-400" />
              ),
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <div className="mb-4 rounded-full bg-blue-100 p-3 w-fit dark:bg-blue-900/30">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features