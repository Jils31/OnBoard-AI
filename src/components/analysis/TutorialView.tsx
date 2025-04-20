
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, ChevronRight, Lightbulb, Bookmark } from "lucide-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

interface TutorialViewProps {
  data: any;
  role: string;
}

const TutorialView = ({ data, role }: TutorialViewProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  // Default tutorial data to handle when data is undefined or missing required properties
  const defaultTutorial = {
    title: "Authentication Workflow",
    overview: "This tutorial walks through the authentication flow in the application, covering login, session management, and protected routes.",
    prerequisites: [
      "Basic understanding of React hooks",
      "Familiarity with context API",
      "Understanding of JWT authentication"
    ],
    steps: [
      {
        title: "Setting up Authentication Context",
        description: "First, we'll explore how the authentication context is set up to manage user state across the application. This provides a centralized way to handle authentication state.",
        codeExample: `import React, { createContext, useReducer, useContext } from 'react';

// Initial state for auth context
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

// Create the auth context
export const AuthContext = createContext(initialState);`,
        explanation: "This code establishes the authentication context using React's Context API and useReducer hook."
      }
    ],
    additionalNotes: "This authentication flow follows best practices for React applications."
  };
  
  // Use data if provided and valid, otherwise use default tutorial
  const tutorial = data && data.title && data.steps && Array.isArray(data.steps) ? data : defaultTutorial;
  
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
  
  // Make sure we have valid prerequisites array
  const prerequisites = tutorial.prerequisites && Array.isArray(tutorial.prerequisites) 
    ? tutorial.prerequisites 
    : ["No prerequisites specified"];
  
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
              {prerequisites.map((prereq, index) => (
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
                <h2 className="font-bold text-lg">{tutorial.steps[currentStep].title}</h2>
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
                {tutorial.steps[currentStep].description}
              </p>
            </div>
            
            <div className="border rounded-md overflow-hidden">
              <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b">
                <div className="flex justify-between items-center">
                  <div className="font-medium">Code Example</div>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    {tutorial.steps[currentStep].title}
                  </Badge>
                </div>
              </div>
              <SyntaxHighlighter
                language="javascript"
                style={docco}
                className="rounded-b-md max-h-96"
                showLineNumbers
              >
                {tutorial.steps[currentStep].codeExample}
              </SyntaxHighlighter>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-md p-4">
              <div className="flex">
                <Lightbulb className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium mb-2 text-blue-700 dark:text-blue-300">Explanation</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {tutorial.steps[currentStep].explanation}
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
