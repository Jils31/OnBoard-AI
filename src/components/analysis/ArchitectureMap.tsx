
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const ArchitectureMap = ({ data }: { data: any }) => {
  // Make sure we're using the real data from the API
  if (!data) {
    console.error("Architecture data is missing");
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Architecture Analysis</CardTitle>
            <CardDescription>No architecture data available</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-amber-600">
              Unable to generate architecture map. Please try analyzing the repository again.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  console.log("Architecture map data:", data);
  
  const architecture = data?.architecture || {
    pattern: "Could not determine pattern",
    description: "Analysis could not determine the architecture pattern.",
    mainComponents: []
  };
  
  const systemMap = data?.systemMap || {
    nodes: [],
    connections: []
  };
  
  const criticalComponents = data?.criticalComponents || [];
  const strengths = data?.strengths || [];
  const improvements = data?.improvements || [];
  
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
              {architecture.mainComponents && architecture.mainComponents.length > 0 ? (
                architecture.mainComponents.map((component: string, index: number) => (
                  <Badge key={index} variant="outline" className="bg-blue-50 dark:bg-blue-900">
                    {component}
                  </Badge>
                ))
              ) : (
                <div className="text-sm text-gray-500">No component data available</div>
              )}
            </div>
          </div>
          
          <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-800">
            <h3 className="font-medium mb-4">Architecture Diagram</h3>
            
            <div className="h-80 rounded-md bg-white dark:bg-gray-700 border relative mb-6">
              {/* Dynamic visualization based on the provided data */}
              {systemMap.nodes && systemMap.nodes.length > 0 ? (
                <svg width="100%" height="100%" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
                  {/* Render nodes as shapes */}
                  {systemMap.nodes.slice(0, 12).map((node: any, index: number) => {
                    // Generate positions based on index
                    const x = 80 + (index % 4) * 180;
                    const y = 40 + Math.floor(index / 4) * 120;
                    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];
                    const color = colors[index % colors.length];
                    
                    return (
                      <g key={node.id}>
                        <rect 
                          x={x} 
                          y={y} 
                          width={160} 
                          height={80} 
                          rx={5} 
                          fill={color} 
                          fillOpacity={0.2} 
                          stroke={color} 
                        />
                        <text 
                          x={x + 80} 
                          y={y + 35} 
                          textAnchor="middle" 
                          fill="currentColor"
                          fontSize="12"
                          fontWeight="bold"
                        >
                          {node.label}
                        </text>
                        <text 
                          x={x + 80} 
                          y={y + 55} 
                          textAnchor="middle" 
                          fill="currentColor" 
                          fontSize="10"
                        >
                          {node.type}
                        </text>
                      </g>
                    );
                  })}
                  
                  {/* Render connections between nodes */}
                  {systemMap.connections && systemMap.connections.slice(0, 20).map((connection: any, index: number) => {
                    // Find source and target nodes
                    const sourceIndex = systemMap.nodes.findIndex((n: any) => n.id === connection.from);
                    const targetIndex = systemMap.nodes.findIndex((n: any) => n.id === connection.to);
                    
                    if (sourceIndex >= 0 && targetIndex >= 0 && sourceIndex < 12 && targetIndex < 12) {
                      const sourceX = 80 + (sourceIndex % 4) * 180 + 80;
                      const sourceY = 40 + Math.floor(sourceIndex / 4) * 120 + 40;
                      const targetX = 80 + (targetIndex % 4) * 180 + 80;
                      const targetY = 40 + Math.floor(targetIndex / 4) * 120 + 40;
                      
                      // Calculate control points for curved lines
                      const dx = targetX - sourceX;
                      const dy = targetY - sourceY;
                      const midX = (sourceX + targetX) / 2;
                      const midY = (sourceY + targetY) / 2;
                      const offset = 40;
                      
                      // Create curved path
                      let path = `M ${sourceX} ${sourceY} Q ${midX + offset} ${midY} ${targetX} ${targetY}`;
                      
                      // Calculate label position
                      const labelX = midX + offset / 2;
                      const labelY = midY - 10;
                      
                      return (
                        <g key={`${connection.from}-${connection.to}-${index}`}>
                          <path 
                            d={path} 
                            stroke="currentColor" 
                            strokeWidth="1.5" 
                            fill="none"
                            markerEnd="url(#arrowhead)"
                          />
                          <text 
                            x={labelX} 
                            y={labelY} 
                            textAnchor="middle" 
                            fill="currentColor" 
                            fontSize="10"
                            className="select-none"
                          >
                            {connection.label?.substring(0, 20)}
                          </text>
                        </g>
                      );
                    }
                    return null;
                  })}
                  
                  {/* Define arrowhead marker */}
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
                    </marker>
                  </defs>
                </svg>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <p>No architecture visualization data available</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium mb-2">Critical Components</h3>
            {criticalComponents && criticalComponents.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {criticalComponents.map((component: string, index: number) => (
                  <li key={index}>{component}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No critical components identified</p>
            )}
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
              {strengths && strengths.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {strengths.map((strength: string, index: number) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No strengths identified</p>
              )}
            </div>
            
            <div>
              <h3 className="font-medium mb-2 text-amber-600 dark:text-amber-400">Improvement Opportunities</h3>
              {improvements && improvements.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {improvements.map((improvement: string, index: number) => (
                    <li key={index}>{improvement}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No improvement opportunities identified</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArchitectureMap;
