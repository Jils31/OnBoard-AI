
import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Code, BrainCog, Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center text-center">
            <Badge className="mb-4 px-3 py-1 text-sm" variant="secondary">
              Now Available
            </Badge>
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Onboarding Buddy
              <span className="text-blue-600 dark:text-blue-400"> AI</span>
            </h1>
            <p className="mb-8 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              The AI-powered tool that accelerates developer onboarding by
              analyzing repositories and generating interactive documentation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {user ? (
                <Link to="/dashboard">
                  <Button size="lg" className="gap-2">
                    Go to Dashboard <ArrowRight size={16} />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/auth">
                    <Button size="lg" className="gap-2">
                      Get Started <ArrowRight size={16} />
                    </Button>
                  </Link>
                  <Link to="/pricing">
                    <Button variant="outline" size="lg">
                      View Pricing
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold sm:text-4xl">
            How Onboarding Buddy Works
          </h2>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                <Code className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Smart Repository Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our AI analyzes repository structure, dependencies, and code paths
                to create a comprehensive understanding of your project.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-purple-100 p-3 dark:bg-purple-900">
                <BrainCog className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Interactive Documentation</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Generate visual maps, dependency graphs, and interactive guides
                that make understanding complex codebases intuitive.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-green-100 p-3 dark:bg-green-900">
                <Rocket className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Accelerated Onboarding</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Reduce onboarding time by 70% with personalized learning paths
                and step-by-step walkthroughs of critical workflows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold sm:text-4xl">
            Trusted by Developers
          </h2>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                "Onboarding Buddy cut our new developer ramp-up time in half. The
                visual repository maps are incredibly helpful."
              </p>
              <div className="flex items-center">
                <div>
                  <p className="font-bold">Sarah Chen</p>
                  <p className="text-sm text-gray-500">CTO at DevFlow</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                "As a new developer, the guided walkthroughs helped me understand
                our complex codebase in days instead of weeks."
              </p>
              <div className="flex items-center">
                <div>
                  <p className="font-bold">Marcus Johnson</p>
                  <p className="text-sm text-gray-500">Software Engineer</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                "The dependency mapping feature alone is worth the subscription.
                It's like having a senior developer guide you through the code."
              </p>
              <div className="flex items-center">
                <div>
                  <p className="font-bold">Aisha Patel</p>
                  <p className="text-sm text-gray-500">Lead Developer at TechSprint</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="rounded-xl bg-blue-600 p-8 text-center text-white dark:bg-blue-800 sm:p-12">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Ready to accelerate your team's onboarding?
            </h2>
            <p className="mb-8 text-lg text-blue-100">
              Join thousands of developers who are using Onboarding Buddy to understand
              codebases faster and more efficiently.
            </p>
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" variant="secondary" className="gap-2">
                  Go to Dashboard <ArrowRight size={16} />
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button size="lg" variant="secondary" className="gap-2">
                  Start Free Trial <ArrowRight size={16} />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
