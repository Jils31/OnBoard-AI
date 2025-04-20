
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, ChevronRight, Lightbulb, Bookmark } from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface TutorialViewProps {
  data: any;
  role: string;
}

const TutorialView = ({ data, role }: TutorialViewProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  // Default tutorial data to handle when data is undefined or missing required properties
  const defaultTutorial = {
    title: "Exploring the Codebase",
    overview: "This tutorial provides an introduction to the repository structure and key components.",
    prerequisites: [
      "Basic understanding of the project's programming language",
      "Familiarity with version control systems"
    ],
    steps: [
      {
        title: "Repository Overview",
        description: "Let's start by understanding the overall structure of the repository and its main components.",
        codeExample: `// Repository structure example
src/
  components/   # UI components
  services/     # Services for API interactions
  utils/        # Utility functions
  pages/        # Application pages or views
  styles/       # CSS or styling files`,
        explanation: "Most modern codebases follow a structured organization pattern to separate concerns and make code more maintainable."
      }
    ],
    additionalNotes: "As you explore the codebase further, focus on understanding how data flows between components and which parts handle core business logic."
  };
  
  // Safely parse the data and provide defaults if missing
  const parsedData = (() => {
    if (!data) return defaultTutorial;
    
    try {
      // If data is already an object with the necessary structure, use it
      if (data.title && Array.isArray(data.steps)) {
        return data;
      }
      
      // If data is a string (JSON), try to parse it
      if (typeof data === 'string') {
        try {
          const parsed = JSON.parse(data);
          if (parsed.title && Array.isArray(parsed.steps)) {
            return parsed;
          }
        } catch (e) {
          console.error('Failed to parse tutorial data as JSON:', e);
        }
      }
      
      return defaultTutorial;
    } catch (error) {
      console.error('Error processing tutorial data:', error);
      return defaultTutorial;
    }
  })();
  
  // Extract properties with safe fallbacks
  const tutorial = {
    title: parsedData.title || defaultTutorial.title,
    overview: parsedData.overview || defaultTutorial.overview,
    prerequisites: Array.isArray(parsedData.prerequisites) ? parsedData.prerequisites : defaultTutorial.prerequisites,
    steps: Array.isArray(parsedData.steps) && parsedData.steps.length > 0 ? 
      parsedData.steps : defaultTutorial.steps,
    additionalNotes: parsedData.additionalNotes || defaultTutorial.additionalNotes
  };
  
  const handleNextStep = () => {
    if (currentStep < tutorial.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      // Scroll to top when changing steps
      window.scrollTo(0, 0);
    }
  };
  
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Scroll to top when changing steps
      window.scrollTo(0, 0);
    }
  };

  // Get language for current code example
  const getLanguageFromCodeExample = (codeExample: string) => {
    const extensionMap: { [key: string]: string } = {
      'tsx': 'typescript',
      'ts': 'typescript',
      'jsx': 'javascript',
      'js': 'javascript',
      'css': 'css',
      'html': 'html',
      'json': 'json',
    };

    // Check for import statements which usually indicate TypeScript/JavaScript
    if (codeExample.includes('import ') || codeExample.includes('export ')) {
      return codeExample.includes('React') ? 'typescript' : 'javascript';
    }

    // Check for file path structure indicators
    if (codeExample.match(/src\/.*\.(tsx?|jsx?)$/)) {
      return 'typescript';
    }

    // Look for markdown-style code block language indicators
    const langMatch = codeExample.match(/^```(\w+)/);
    if (langMatch) {
      return langMatch[1];
    }

    // Check for file extensions in comments
    const fileExtMatch = codeExample.match(/\/\/\s*.*\.(tsx?|jsx?|css|html|json)/i);
    if (fileExtMatch) {
      const ext = fileExtMatch[1].toLowerCase();
      return extensionMap[ext] || 'javascript';
    }

    // Default to JavaScript for code that looks like code
    if (codeExample.match(/{|function|const|let|var|=>|class/)) {
      return 'javascript';
    }

    // If it's a directory structure
    if (codeExample.match(/\w+\//)) {
      return 'bash';
    }

    return 'javascript';
  };
  
  return (
    <div className="space-y-6">
      <Card className="border-blue-100 dark:border-blue-900">
        <CardHeader>
          <CardTitle className="text-2xl">{tutorial.title}</CardTitle>
          <CardDescription>
            Interactive tutorial for {role} developers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="font-medium mb-2">Overview</h3>
            <p className="text-gray-700 dark:text-gray-300">{tutorial.overview}</p>
            
            <h3 className="font-medium mt-4 mb-2">Prerequisites</h3>
            <ul className="list-disc pl-5 space-y-1">
              {tutorial.prerequisites.map((prereq: string, index: number) => (
                <li key={index} className="text-gray-700 dark:text-gray-300">{prereq}</li>
              ))}
            </ul>
          </div>
          
          <Separator className="my-6" />
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 h-8 w-8 rounded-full flex items-center justify-center font-medium mr-3">
                {currentStep + 1}
              </div>
              <div>
                <h2 className="font-bold text-lg">{tutorial.steps[currentStep]?.title || 'Step'}</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Step {currentStep + 1} of {tutorial.steps.length}
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevStep}
                disabled={currentStep === 0}
                className="mr-2"
              >
                Previous
              </Button>
              <Button
                size="sm"
                onClick={handleNextStep}
                disabled={currentStep === tutorial.steps.length - 1}
              >
                Next
              </Button>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                {tutorial.steps[currentStep]?.description || ''}
              </p>
            </div>
            
            <div className="relative border rounded-md overflow-hidden">
              <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b flex justify-between items-center">
                <div className="font-medium">Code Example</div>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  {tutorial.steps[currentStep]?.title || 'Example'}
                </Badge>
              </div>
              <SyntaxHighlighter
                language={getLanguageFromCodeExample(tutorial.steps[currentStep]?.codeExample || '')}
                style={oneDark}
                showLineNumbers
                customStyle={{ 
                  margin: 0,
                  borderRadius: '0 0 0.375rem 0.375rem',
                  maxHeight: '24rem'
                }}
              >
                {tutorial.steps[currentStep]?.codeExample || '// No code example available'}
              </SyntaxHighlighter>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-md p-4">
              <div className="flex">
                <Lightbulb className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium mb-2 text-blue-700 dark:text-blue-300">Explanation</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {tutorial.steps[currentStep]?.explanation || 'No explanation available.'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePrevStep}
                disabled={currentStep === 0}
              >
                Previous Step
              </Button>
              <Button
                onClick={handleNextStep}
                disabled={currentStep === tutorial.steps.length - 1}
              >
                Next Step {currentStep < tutorial.steps.length - 1 && <ChevronRight className="ml-1 h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          {currentStep === tutorial.steps.length - 1 && (
            <div className="mt-8 bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800 rounded-md p-4">
              <div className="flex">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium mb-2 text-green-700 dark:text-green-300">Tutorial Complete!</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    You've completed this tutorial on {tutorial.title}. Here are some additional notes:
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {tutorial.additionalNotes}
                  </p>
                  <Button variant="outline" className="mt-4">
                    <Bookmark className="mr-2 h-4 w-4" />
                    Save for Reference
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TutorialView;
