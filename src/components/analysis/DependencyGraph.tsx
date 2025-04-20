
import React, { useEffect, useState, useCallback, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ArrowRightLeft, Info } from "lucide-react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType
} from 'react-flow-renderer';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DependencyGraphProps {
  data: any;
  codeAnalysis: any;
}

const DependencyGraph = ({ data, codeAnalysis }: DependencyGraphProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isGraphReady, setIsGraphReady] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Convert dependency graph data to ReactFlow format
  const createDependencyGraph = useCallback(() => {
    if (!data?.dependencyGraph?.nodes || !data?.dependencyGraph?.edges) {
      console.log("No dependency graph data available, using default");
      return { nodes: [], edges: [] };
    }

    console.log("Creating dependency graph with data:", data.dependencyGraph);

    // Group colors for different node types
    const groupColors: Record<string, string> = {
      core: '#3b82f6',     // blue
      ui: '#3b82f6',       // blue
      component: '#3b82f6', // blue
      data: '#10b981',     // green
      service: '#10b981',  // green
      helpers: '#f59e0b',  // yellow
      utility: '#f59e0b',  // yellow
      unknown: '#9ca3af',  // gray
    };

    // Create nodes
    const flowNodes = data.dependencyGraph.nodes.map((node: any, index: number) => {
      const groupKey = node.group?.toLowerCase() || 'unknown';
      const type = node.type?.toLowerCase() || 'unknown';
      
      // Calculate color based on group or type
      const color = groupColors[groupKey] || groupColors[type] || groupColors.unknown;
      
      return {
        id: node.id || `node-${index}`,
        position: { 
          x: 150 + (index % 3) * 250, 
          y: 100 + Math.floor(index / 3) * 150 
        },
        data: { 
          label: node.label || `Node ${index + 1}`,
          type: node.type || 'component',
          size: node.size || 5
        },
        style: {
          width: Math.max(50, (node.size || 5) * 15),
          height: Math.max(50, (node.size || 5) * 15),
          backgroundColor: `${color}20`,
          border: `1px solid ${color}`,
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '12px',
          textAlign: 'center',
          padding: '10px',
        },
      };
    });

    // Create edges
    const flowEdges = data.dependencyGraph.edges.map((edge: any, index: number) => {
      const isCircular = data.circularDependencies?.some((cycle: string[]) => 
        cycle.includes(edge.source) && cycle.includes(edge.target)
      );

      return {
        id: `edge-${index}`,
        source: edge.source,
        target: edge.target,
        label: edge.description || '',
        labelStyle: { fontSize: '8px', fill: '#666' },
        style: { 
          stroke: isCircular ? '#f59e0b' : '#aaa',
          strokeDasharray: isCircular ? '5 5' : 'none',
          strokeWidth: Math.max(1, edge.strength || 1),
        },
        markerEnd: {
          type: MarkerType.Arrow,
          width: 15,
          height: 15,
          color: isCircular ? '#f59e0b' : '#aaa',
        },
        animated: isCircular,
      };
    });

    return { nodes: flowNodes, edges: flowEdges };
  }, [data]);

  // Initialize or update the graph when data changes
  useEffect(() => {
    try {
      const { nodes: flowNodes, edges: flowEdges } = createDependencyGraph();
      
      if (flowNodes.length > 0 && flowEdges.length > 0) {
        setNodes(flowNodes);
        setEdges(flowEdges);
        setIsGraphReady(true);
      } else {
        console.log("Graph data is empty, using placeholder");
        setIsGraphReady(false);
      }
    } catch (error) {
      console.error("Error creating dependency graph:", error);
      setIsGraphReady(false);
    }
  }, [data, createDependencyGraph, setNodes, setEdges]);

  // Extract recommendations and circular dependencies
  const recommendations = data?.recommendations || [
    "Extract shared logic from ApiService and DataProvider into a separate utility",
    "Consider using dependency injection to reduce tight coupling",
    "Refactor circular dependencies between components"
  ];

  const circularDependencies = data?.circularDependencies || [];

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
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Module Dependencies</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      This graph shows module dependencies. Nodes represent modules and edges represent dependencies.
                      Circular dependencies are highlighted with dotted lines.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div ref={reactFlowWrapper} className="h-96 rounded-md bg-white dark:bg-gray-700 border">
              {isGraphReady ? (
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  fitView
                  attributionPosition="top-right"
                  className="bg-white dark:bg-gray-700"
                >
                  <MiniMap 
                    nodeStrokeColor={(n) => {
                      return n.style?.border?.replace('1px solid ', '') || '#eee';
                    }}
                    nodeColor={(n) => {
                      return n.style?.backgroundColor || '#fff';
                    }}
                    nodeBorderRadius={50}
                  />
                  <Controls />
                  <Background color="#aaa" gap={16} />
                </ReactFlow>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  <p className="text-center">
                    Dependency graph could not be generated from the current repository data.<br />
                    Try analyzing a repository with more code files.
                  </p>
                </div>
              )}
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
                <div className="w-8 h-0 border-t border-yellow-500 border-dashed mr-1"></div>
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
                
                {circularDependencies.map((cycle: string[], index: number) => (
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
                {recommendations.map((recommendation: string, index: number) => (
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
