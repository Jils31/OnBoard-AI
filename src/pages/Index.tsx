
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GitHubLogoIcon, CodeIcon, RocketIcon, LightningBoltIcon } from "@radix-ui/react-icons";
import HeroSection from "@/components/HeroSection";
import RepositoryForm from "@/components/RepositoryForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <HeroSection />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="border-none shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-center">Start Your Codebase Analysis</CardTitle>
              <CardDescription className="text-center">
                Paste a GitHub repository URL or connect directly to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RepositoryForm />
            </CardContent>
          </Card>
          
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-8">How Onboarding Buddy Works</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                    <CodeIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle>Code Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>We analyze git history, data flow, and use Abstract Syntax Trees to identify critical code paths.</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4">
                    <RocketIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle>Visualization</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Generate interactive architectural maps, dependency graphs, and visual exploration tools.</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                    <LightningBoltIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle>Guided Learning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Interactive tutorials and step-by-step walkthroughs of key workflows to accelerate onboarding.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
