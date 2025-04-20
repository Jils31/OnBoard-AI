
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// This would be replaced with an actual visualization library
// For now, we'll use a placeholder visualization
const ArchitectureMap = ({ data }: { data: any }) => {
  // Use data from AI analysis, not mock data
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
  
  const strengths = data?.strengths || [
    "Clear separation of concerns",
    "Modular component structure",
    "Consistent data flow patterns",
    "Reusable service layer"
  ];
  
  const improvements = data?.improvements || [
    "Increase test coverage in core modules",
    "Consider implementing caching strategy",
    "Reduce coupling between service layers",
    "Improve error handling consistency"
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
              {/* Basic visualization mockup based on the provided data */}
              <svg width="100%" height="100%" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
                {/* Render nodes as shapes */}
                {systemMap.nodes.slice(0, 5).map((node: any, index: number) => {
                  // Generate positions based on index
                  const x = 100 + (index % 3) * 250;
                  const y = 50 + Math.floor(index / 3) * 150;
                  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
                  const color = colors[index % colors.length];
                  
                  return (
                    <g key={node.id}>
                      <rect 
                        x={x} 
                        y={y} 
                        width={200} 
                        height={100} 
                        rx={5} 
                        fill={color} 
                        fillOpacity={0.2} 
                        stroke={color} 
                      />
                      <text 
                        x={x + 100} 
                        y={y + 50} 
                        textAnchor="middle" 
                        fill="currentColor"
                      >
                        {node.label}
                      </text>
                      <text 
                        x={x + 100} 
                        y={y + 75} 
                        textAnchor="middle" 
                        fill="currentColor" 
                        fontSize="12"
                      >
                        {node.type}
                      </text>
                    </g>
                  );
                })}
                
                {/* Render connections between nodes */}
                {systemMap.connections.slice(0, 5).map((connection: any, index: number) => {
                  // Find source and target nodes
                  const sourceIndex = systemMap.nodes.findIndex((n: any) => n.id === connection.from);
                  const targetIndex = systemMap.nodes.findIndex((n: any) => n.id === connection.to);
                  
                  if (sourceIndex >= 0 && targetIndex >= 0 && sourceIndex < 5 && targetIndex < 5) {
                    const sourceX = 100 + (sourceIndex % 3) * 250 + 200;
                    const sourceY = 50 + Math.floor(sourceIndex / 3) * 150 + 50;
                    const targetX = 100 + (targetIndex % 3) * 250;
                    const targetY = 50 + Math.floor(targetIndex / 3) * 150 + 50;
                    
                    // Calculate midpoint for label
                    const midX = (sourceX + targetX) / 2;
                    const midY = (sourceY + targetY) / 2;
                    
                    return (
                      <g key={`${connection.from}-${connection.to}`}>
                        <path 
                          d={`M ${sourceX} ${sourceY} L ${targetX} ${targetY}`} 
                          stroke="currentColor" 
                          strokeWidth="1.5" 
                          strokeDasharray="5,5" 
                        />
                        <text 
                          x={midX} 
                          y={midY - 10} 
                          textAnchor="middle" 
                          fill="currentColor" 
                          fontSize="12"
                        >
                          {connection.label}
                        </text>
                      </g>
                    );
                  }
                  return null;
                })}
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
                {strengths.map((strength: string, index: number) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-2 text-amber-600 dark:text-amber-400">Improvement Opportunities</h3>
              <ul className="list-disc pl-5 space-y-1">
                {improvements.map((improvement: string, index: number) => (
                  <li key={index}>{improvement}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArchitectureMap;
