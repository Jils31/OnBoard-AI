
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// This would be replaced with an actual visualization library
// For now, we'll use a placeholder visualization
const ArchitectureMap = ({ data }: { data: any }) => {
  // Use mock data if real data is not available yet
  const architecture = data?.architecture || {
    pattern: "Model-View-Controller",
    description: "This app uses a classic MVC architecture with React components.",
    mainComponents: ["UI Components", "Services", "Models", "Controllers"]
  };
  
  const systemMap = data?.systemMap || {
    nodes: [
      { id: "n1", label: "Frontend", type: "container" },
      { id: "n2", label: "API Layer", type: "container" },
      { id: "n3", label: "Database", type: "database" },
      { id: "n4", label: "Authentication", type: "service" },
      { id: "n5", label: "Components", type: "group", parent: "n1" },
      { id: "n6", label: "Services", type: "group", parent: "n1" },
      { id: "n7", label: "Controllers", type: "group", parent: "n2" },
      { id: "n8", label: "Models", type: "group", parent: "n2" },
    ],
    connections: [
      { from: "n1", to: "n2", label: "API Calls" },
      { from: "n2", to: "n3", label: "Queries" },
      { from: "n1", to: "n4", label: "Auth" },
      { from: "n2", to: "n4", label: "Auth" },
      { from: "n5", to: "n6", label: "Uses" },
      { from: "n7", to: "n8", label: "Uses" },
    ]
  };
  
  const criticalComponents = data?.criticalComponents || [
    "Authentication Service",
    "API Client",
    "Core Components",
    "Data Models"
  ];
  
  return (
    <div className="space-y-6">
      <Card className="border-blue-100 dark:border-blue-900">
        <CardHeader>
          <CardTitle className="text-2xl">System Architecture</CardTitle>
          <CardDescription>
            Overall architectural pattern: <strong>{architecture.pattern}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <p className="text-gray-700 dark:text-gray-300">{architecture.description}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {architecture.mainComponents.map((component: string, index: number) => (
                <Badge key={index} variant="outline" className="bg-blue-50 dark:bg-blue-900">
                  {component}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-800">
            <h3 className="font-medium mb-4">Architecture Diagram</h3>
            
            {/* This would be replaced with a real visualization component */}
            <div className="h-80 rounded-md bg-white dark:bg-gray-700 border relative mb-6">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <p className="text-center">
                  Interactive architecture visualization would render here with nodes and connections.<br />
                  Using react-flow-renderer or D3.js in the full implementation.
                </p>
              </div>
              
              {/* Basic visualization mockup */}
              <svg width="100%" height="100%" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
                {/* Render some basic shapes to represent the architecture */}
                <rect x="100" y="50" width="200" height="100" rx="5" fill="#3b82f6" fillOpacity="0.2" stroke="#3b82f6" />
                <text x="200" y="100" textAnchor="middle" fill="currentColor">Frontend</text>
                
                <rect x="500" y="50" width="200" height="100" rx="5" fill="#10b981" fillOpacity="0.2" stroke="#10b981" />
                <text x="600" y="100" textAnchor="middle" fill="currentColor">API Layer</text>
                
                <rect x="300" y="250" width="200" height="100" rx="5" fill="#f59e0b" fillOpacity="0.2" stroke="#f59e0b" />
                <text x="400" y="300" textAnchor="middle" fill="currentColor">Database</text>
                
                {/* Connection lines */}
                <path d="M 300 100 L 500 100" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5,5" />
                <text x="400" y="90" textAnchor="middle" fill="currentColor" fontSize="12">API Calls</text>
                
                <path d="M 600 150 L 400 250" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5,5" />
                <text x="500" y="200" textAnchor="middle" fill="currentColor" fontSize="12">Queries</text>
              </svg>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium mb-2">Critical Components</h3>
            <ul className="list-disc pl-5 space-y-1">
              {criticalComponents.map((component: string, index: number) => (
                <li key={index}>{component}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Architecture Analysis</CardTitle>
          <CardDescription>
            Strengths and potential improvements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2 text-green-600 dark:text-green-400">Strengths</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Clear separation of concerns</li>
                <li>Modular component structure</li>
                <li>Consistent data flow patterns</li>
                <li>Reusable service layer</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-2 text-amber-600 dark:text-amber-400">Improvement Opportunities</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Increase test coverage in core modules</li>
                <li>Consider implementing caching strategy</li>
                <li>Reduce coupling between service layers</li>
                <li>Improve error handling consistency</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArchitectureMap;
