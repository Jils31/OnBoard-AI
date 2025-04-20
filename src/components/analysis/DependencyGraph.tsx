
import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ArrowRightLeft } from "lucide-react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Panel,
  MarkerType
} from "reactflow";
import "reactflow/dist/style.css";

interface DependencyGraphProps {
  data: any;
  codeAnalysis: any;
}

const DependencyGraph = ({ data, codeAnalysis }: DependencyGraphProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const flowRef = useRef(null);
  
  // Process the dependency data into ReactFlow format
  useEffect(() => {
    if (data?.dependencyGraph) {
      // Convert the graph data to reactflow format
      const graphNodes = data.dependencyGraph.nodes.map((node: any, index: number) => {
        // Determine node type color based on node type
        let bgColor = '#3b82f6'; // blue for components (default)
        if (node.type === 'service') bgColor = '#10b981'; // green for services
        if (node.type === 'utility') bgColor = '#f59e0b'; // yellow for utilities
        
        return {
          id: node.id,
          data: { label: node.label, type: node.type },
          position: { 
            x: 100 + (index % 3) * 250, 
            y: 100 + Math.floor(index / 3) * 150 
          },
          style: {
            background: `${bgColor}20`,
            border: `1px solid ${bgColor}`,
            borderRadius: '8px',
            padding: '10px',
            width: 150,
            color: 'inherit'
          }
        };
      });
      
      // Convert the edges to reactflow format
      const graphEdges = data.dependencyGraph.edges.map((edge: any) => {
        // Determine if this is a circular dependency
        const isCircular = data.circularDependencies?.some((cycle: string[]) => {
          // Check if both source and target are in any cycle next to each other
          for (let i = 0; i < cycle.length - 1; i++) {
            const sourceNode = graphNodes.find((n: any) => n.data.label === cycle[i]);
            const targetNode = graphNodes.find((n: any) => n.data.label === cycle[i + 1]);
            if (sourceNode && targetNode && 
                sourceNode.id === edge.source && targetNode.id === edge.target) {
              return true;
            }
          }
          return false;
        });
        
        return {
          id: `e-${edge.source}-${edge.target}`,
          source: edge.source,
          target: edge.target,
          animated: isCircular,
          style: { stroke: isCircular ? '#f97316' : '#64748b' },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: isCircular ? '#f97316' : '#64748b',
          }
        };
      });
      
      setNodes(graphNodes);
      setEdges(graphEdges);
    } else if (codeAnalysis?.dependencies) {
      // If no pre-generated graph, try to create one from code analysis
      const depNodes: any[] = [];
      const depEdges: any[] = [];
      const nodeMap = new Map();
      let nodeId = 1;
      
      // First pass to collect all modules
      codeAnalysis.dependencies.forEach((dep: any) => {
        if (dep.source && !nodeMap.has(dep.source)) {
          nodeMap.set(dep.source, `n${nodeId++}`);
          depNodes.push({
            id: nodeMap.get(dep.source),
            data: { label: dep.source.split('/').pop(), type: 'component' },
            position: { x: 0, y: 0 } // Will position in second pass
          });
        }
        
        if (dep.target && !nodeMap.has(dep.target)) {
          nodeMap.set(dep.target, `n${nodeId++}`);
          depNodes.push({
            id: nodeMap.get(dep.target),
            data: { label: dep.target.split('/').pop(), type: 'component' },
            position: { x: 0, y: 0 } // Will position in second pass
          });
        }
      });
      
      // Position nodes in a grid
      depNodes.forEach((node, index) => {
        node.position = { 
          x: 100 + (index % 3) * 250, 
          y: 100 + Math.floor(index / 3) * 150 
        };
        
        // Set node style based on filename pattern
        const label = node.data.label.toLowerCase();
        if (label.includes('service')) {
          node.data.type = 'service';
          node.style = {
            background: '#10b98120',
            border: '1px solid #10b981',
            borderRadius: '8px',
            padding: '10px',
            width: 150
          };
        } else if (label.includes('util')) {
          node.data.type = 'utility';
          node.style = {
            background: '#f59e0b20',
            border: '1px solid #f59e0b',
            borderRadius: '8px',
            padding: '10px',
            width: 150
          };
        } else {
          node.style = {
            background: '#3b82f620',
            border: '1px solid #3b82f6',
            borderRadius: '8px',
            padding: '10px',
            width: 150
          };
        }
      });
      
      // Create edges
      codeAnalysis.dependencies.forEach((dep: any, index: number) => {
        if (dep.source && dep.target && nodeMap.has(dep.source) && nodeMap.has(dep.target)) {
          depEdges.push({
            id: `e${index}`,
            source: nodeMap.get(dep.source),
            target: nodeMap.get(dep.target),
            markerEnd: {
              type: MarkerType.ArrowClosed,
            }
          });
        }
      });
      
      setNodes(depNodes);
      setEdges(depEdges);
    }
  }, [data, codeAnalysis, setNodes, setEdges]);

  // Determine if we have any circular dependencies
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
            <h3 className="font-medium mb-4">Module Dependencies</h3>
            
            <div className="h-80 rounded-md bg-white dark:bg-gray-700 border relative">
              <ReactFlow
                ref={flowRef}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                fitView
                className="bg-white dark:bg-gray-800"
              >
                <Controls />
                <MiniMap 
                  nodeColor={(node) => {
                    if (node.data?.type === 'service') return '#10b981';
                    if (node.data?.type === 'utility') return '#f59e0b';
                    return '#3b82f6';
                  }} 
                />
                <Background gap={16} />
                <Panel position="bottom-center" className="bg-white dark:bg-gray-800 p-2 rounded shadow-md">
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-blue-500 bg-opacity-20 border border-blue-500 mr-1"></div>
                      <span>Components</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-green-500 bg-opacity-20 border border-green-500 mr-1"></div>
                      <span>Services</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-yellow-500 bg-opacity-20 border border-yellow-500 mr-1"></div>
                      <span>Utilities</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-0 border-t border-gray-400 mr-1"></div>
                      <span>Dependency</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-0 border-t border-orange-400 mr-1"></div>
                      <span>Circular Dependency</span>
                    </div>
                  </div>
                </Panel>
              </ReactFlow>
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
          
          {data?.recommendations && data.recommendations.length > 0 && (
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-lg">Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {data.recommendations.map((recommendation: string, index: number) => (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DependencyGraph;
