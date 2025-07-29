import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Loader2, Check } from "lucide-react";

interface RepositoryAnalysisLoadingProps {
  repo: string;
  progress: {
    structure: boolean;
    criticalPaths: boolean;
    dependencies: boolean;
    tutorials: boolean;
  };
}

const RepositoryAnalysisLoading = ({ repo, progress }: RepositoryAnalysisLoadingProps) => {
  const [progressValue, setProgressValue] = useState(0);
  
  useEffect(() => {
    // Calculate progress percentage based on completed steps
    const completedSteps = Object.values(progress).filter(Boolean).length;
    const totalSteps = Object.values(progress).length;
    const newProgress = Math.floor((completedSteps / totalSteps) * 100);
    
    setProgressValue(newProgress);
  }, [progress]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Analyzing Repository</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {repo.length > 50 ? repo.substring(0, 50) + "..." : repo}
          </p>
          <Progress value={progressValue} className="h-2 mb-4" />
          <p className="text-sm text-gray-500">{progressValue}% Complete</p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center">
            {progress.structure ? (
              <Check className="h-5 w-5 text-green-500 mr-3" />
            ) : (
              <Loader2 className="h-5 w-5 text-blue-500 animate-spin mr-3" />
            )}
            <div>
              <p className="font-medium">Analyzing System Architecture</p>
              <p className="text-sm text-gray-500">Identifying components and patterns</p>
            </div>
          </div>
          
          <div className="flex items-center">
            {progress.criticalPaths ? (
              <Check className="h-5 w-5 text-green-500 mr-3" />
            ) : (
              <Loader2 className="h-5 w-5 text-blue-500 animate-spin mr-3" />
            )}
            <div>
              <p className="font-medium">Identifying Critical Code Paths</p>
              <p className="text-sm text-gray-500">Finding the most important code</p>
            </div>
          </div>
          
          <div className="flex items-center">
            {progress.dependencies ? (
              <Check className="h-5 w-5 text-green-500 mr-3" />
            ) : (
              <Loader2 className="h-5 w-5 text-blue-500 animate-spin mr-3" />
            )}
            <div>
              <p className="font-medium">Generating Dependency Graphs</p>
              <p className="text-sm text-gray-500">Mapping relationships between components</p>
            </div>
          </div>
          
          <div className="flex items-center">
            {progress.tutorials ? (
              <Check className="h-5 w-5 text-green-500 mr-3" />
            ) : (
              <Loader2 className="h-5 w-5 text-blue-500 animate-spin mr-3" />
            )}
            <div>
              <p className="font-medium">Creating Interactive Tutorials</p>
              <p className="text-sm text-gray-500">Building step-by-step guides</p>
            </div>
          </div>
        </div>
        
        <p className="mt-8 text-sm text-center text-gray-500">
          This may take a few minutes for large repositories.
          We're using AI to analyze patterns and extract insights.
        </p>
      </div>
    </div>
  );
};

export default RepositoryAnalysisLoading; 