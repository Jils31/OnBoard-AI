
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ArrowRightLeft } from "lucide-react";

interface DependencyGraphProps {
  data: any;
  codeAnalysis: any;
}

const DependencyGraph = ({ data, codeAnalysis }: DependencyGraphProps) => {
  // Use mock data if real data is not available yet
  const dependencyGraph = data?.dependencyGraph || {
    nodes: [
      { id: "n1", label: "App", type: "component" },
      { id: "n2", label: "UserContext", type: "context" },
      { id: "n3", label: "AuthService", type: "service" },
      { id: "n4", label: "ApiService", type: "service" },
      { id: "n5", label: "Dashboard", type: "component" },
      { id: "n6", label: "DataProvider", type: "context" },
      { id: "n7", label: "UserProfile", type: "component" },
      { id: "n8", label: "Utils", type: "utility" },
    ],
    edges: [
      { source: "n1", target: "n2" },
      { source: "n1", target: "n5" },
      { source: "n2", target: "n3" },
      { source: "n3", target: "n4" },
      { source: "n5", target: "n6" },
      { source: "n6", target: "n4" },
      { source: "n5", target: "n7" },
      { source: "n7", target: "n2" },
      { source: "n4", target: "n8" },
      { source: "n6", target: "n8" },
    ]
  };
  
  const circularDependencies = data?.circularDependencies || [
    ["UserContext", "UserProfile", "Dashboard", "UserContext"],
    ["ApiService", "DataProvider", "ApiService"]
  ];
  
  const recommendations = data?.recommendations || [
    "Extract shared logic from ApiService and DataProvider into a separate utility",
    "Consider using dependency injection to reduce tight coupling",
    "Refactor circular dependencies between UserContext and UserProfile"
  ];

  return (
    <div className="space-y-6">
      <Card className="border-green-100 dark:border-green-900">
        <CardHeader>
          <CardTitle className="text-2xl">Dependency Graph</CardTitle>
          <CardDescription>
            Visualizing how components and modules depend on each other
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-800 mb-6">
            <h3 className="font-medium mb-4">Module Dependencies</h3>
            
            {/* This would be replaced with a real visualization component */}
            <div className="h-80 rounded-md bg-white dark:bg-gray-700 border relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <p className="text-center">
                  Interactive dependency graph would render here using react-flow-renderer or D3.js.<br />
                  Nodes represent modules and edges represent dependencies.
                </p>
              </div>
              
              {/* Basic visualization mockup */}
              <svg width="100%" height="100%" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
                {/* Circles representing modules */}
                <circle cx="150" cy="100" r="40" fill="#3b82f6" fillOpacity="0.2" stroke="#3b82f6" />
                <text x="150" y="100" textAnchor="middle" fill="currentColor">App</text>
                
                <circle cx="300" cy="100" r="40" fill="#3b82f6" fillOpacity="0.2" stroke="#3b82f6" />
                <text x="300" y="100" textAnchor="middle" fill="currentColor">UserContext</text>
                
                <circle cx="450" cy="100" r="40" fill="#10b981" fillOpacity="0.2" stroke="#10b981" />
                <text x="450" y="100" textAnchor="middle" fill="currentColor">AuthService</text>
                
                <circle cx="600" cy="100" r="40" fill="#10b981" fillOpacity="0.2" stroke="#10b981" />
                <text x="600" y="100" textAnchor="middle" fill="currentColor">ApiService</text>
                
                <circle cx="150" cy="250" r="40" fill="#3b82f6" fillOpacity="0.2" stroke="#3b82f6" />
                <text x="150" y="250" textAnchor="middle" fill="currentColor">Dashboard</text>
                
                <circle cx="300" cy="250" r="40" fill="#3b82f6" fillOpacity="0.2" stroke="#3b82f6" />
                <text x="300" y="250" textAnchor="middle" fill="currentColor">DataProvider</text>
                
                <circle cx="450" cy="250" r="40" fill="#3b82f6" fillOpacity="0.2" stroke="#3b82f6" />
                <text x="450" y="250" textAnchor="middle" fill="currentColor">UserProfile</text>
                
                <circle cx="600" cy="250" r="40" fill="#f59e0b" fillOpacity="0.2" stroke="#f59e0b" />
                <text x="600" y="250" textAnchor="middle" fill="currentColor">Utils</text>
                
                {/* Arrows between modules */}
                <line x1="190" y1="100" x2="260" y2="100" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                <line x1="340" y1="100" x2="410" y2="100" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                <line x1="490" y1="100" x2="560" y2="100" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                <line x1="150" y1="140" x2="150" y2="210" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                <line x1="190" y1="250" x2="260" y2="250" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                <line x1="340" y1="250" x2="410" y2="250" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                <line x1="340" y1="250" x2="600" y2="210" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                <line x1="600" y1="140" x2="600" y2="210" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                <line x1="450" y1="210" x2="340" y2="120" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrowhead)" strokeDasharray="5,5" />
                
                {/* Define arrowhead marker */}
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
                  </marker>
                </defs>
              </svg>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-blue-500 bg-opacity-20 border border-blue-500 mr-1"></div>
                <span className="text-sm">Components</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-green-500 bg-opacity-20 border border-green-500 mr-1"></div>
                <span className="text-sm">Services</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-yellow-500 bg-opacity-20 border border-yellow-500 mr-1"></div>
                <span className="text-sm">Utilities</span>
              </div>
              <div className="flex items-center ml-4">
                <div className="w-8 h-0 border-t border-gray-400 mr-1"></div>
                <span className="text-sm">Direct dependency</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-0 border-t border-gray-400 border-dashed mr-1"></div>
                <span className="text-sm">Circular dependency</span>
              </div>
            </div>
          </div>
          
          {circularDependencies.length > 0 && (
            <Card className="border-amber-200 dark:border-amber-900 mb-6">
              <CardHeader className="py-3">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                  <CardTitle className="text-lg">Circular Dependencies Detected</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-amber-800 dark:text-amber-300 mb-3">
                  Circular dependencies can lead to tight coupling and make code harder to maintain and test.
                </p>
                
                {circularDependencies.map((cycle, index) => (
                  <div key={index} className="flex items-center mb-2 overflow-x-auto pb-2">
                    {cycle.map((module, i) => (
                      <React.Fragment key={i}>
                        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 whitespace-nowrap">
                          {module}
                        </Badge>
                        {i < cycle.length - 1 && (
                          <ArrowRightLeft className="h-4 w-4 mx-1 text-amber-500" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-lg">Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-800 dark:text-green-300 text-xs font-medium mr-2 mt-0.5">
                      {index + 1}
                    </div>
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
        </CardContent>
      </Card>
    </div>
  );
};

export default DependencyGraph;
