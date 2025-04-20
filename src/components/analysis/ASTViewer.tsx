
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileCode, AlertCircle, CodeIcon } from "lucide-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

interface ASTViewerProps {
  data: any;
}

const ASTViewer = ({ data }: ASTViewerProps) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  
  // Default data if none is provided or if it's invalid
  const astData = data || {
    astNodes: [
      {
        type: "function",
        name: "App",
        location: "src/App.tsx",
        complexity: 3,
        children: ["Router", "MainLayout"],
        dependencies: ["react", "react-router-dom"]
      }
    ],
    patterns: [
      {
        name: "Component Composition",
        description: "Breaking UI into smaller reusable components",
        locations: ["src/components/*"],
        quality: "good"
      }
    ],
    codeSmells: [
      {
        type: "Large File",
        location: "src/services/GeminiService.ts",
        suggestion: "Split into smaller, more focused modules"
      }
    ],
    refactoringOpportunities: [
      "Extract error handling into a dedicated utility",
      "Create a central state management solution"
    ]
  };

  const getComplexityColor = (complexity: number) => {
    if (complexity <= 3) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    if (complexity <= 6) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
  };

  const getQualityColor = (quality: string) => {
    if (quality === "good") return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    if (quality === "neutral") return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
  };

  return (
    <div className="space-y-6">
      <Card className="border-purple-100 dark:border-purple-900">
        <CardHeader>
          <CardTitle className="text-2xl">Abstract Syntax Tree Analysis</CardTitle>
          <CardDescription>
            Deep structural analysis of the codebase
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="nodes">
            <TabsList className="mb-4">
              <TabsTrigger value="nodes">Code Nodes</TabsTrigger>
              <TabsTrigger value="patterns">Patterns</TabsTrigger>
              <TabsTrigger value="smells">Code Smells</TabsTrigger>
              <TabsTrigger value="refactoring">Refactoring</TabsTrigger>
            </TabsList>
            
            <TabsContent value="nodes">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {astData.astNodes.map((node: any, index: number) => (
                  <Card 
                    key={index}
                    className={`cursor-pointer hover:shadow-md transition-shadow ${
                      selectedNode === node.name ? 'border-purple-500' : ''
                    }`}
                    onClick={() => setSelectedNode(node.name === selectedNode ? null : node.name)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <FileCode className="h-4 w-4 mr-2 text-purple-500" />
                          <CardTitle className="text-lg">{node.name}</CardTitle>
                        </div>
                        <Badge className={getComplexityColor(node.complexity)}>
                          Complexity: {node.complexity}/10
                        </Badge>
                      </div>
                      <CardDescription className="text-sm">
                        {node.type} in {node.location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {node.children.length > 0 && (
                        <div className="mb-2">
                          <p className="text-xs text-gray-500 mb-1">Children:</p>
                          <div className="flex flex-wrap gap-1">
                            {node.children.map((child: string, i: number) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {child}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {node.dependencies.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Dependencies:</p>
                          <div className="flex flex-wrap gap-1">
                            {node.dependencies.map((dep: string, i: number) => (
                              <Badge key={i} variant="outline" className="text-xs bg-gray-50 dark:bg-gray-800">
                                {dep}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {selectedNode && (
                <Card className="mt-4 border-purple-200 dark:border-purple-800">
                  <CardHeader>
                    <CardTitle>{selectedNode} Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium">Code Structure</h3>
                        <SyntaxHighlighter 
                          language="typescript" 
                          style={docco}
                          className="rounded-md mt-2"
                        >
                          {`// This is a representation of ${selectedNode}'s structure
const ${selectedNode} = ${astData.astNodes.find((n: any) => n.name === selectedNode)?.type === 'function' 
                          ? '() => {\n  // Function implementation\n}' 
                          : '{\n  // Component or class implementation\n}'
                         }`}
                        </SyntaxHighlighter>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium">Relationships</h3>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mt-2">
                          <p className="text-sm">
                            This {astData.astNodes.find((n: any) => n.name === selectedNode)?.type} has relationships with:
                          </p>
                          <ul className="text-sm mt-2 space-y-1">
                            {astData.astNodes.find((n: any) => n.name === selectedNode)?.children.map((child: string, i: number) => (
                              <li key={i}>→ Contains or renders <strong>{child}</strong></li>
                            ))}
                            {astData.astNodes.find((n: any) => n.name === selectedNode)?.dependencies.map((dep: string, i: number) => (
                              <li key={i}>→ Depends on <strong>{dep}</strong></li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="patterns">
              <div className="space-y-4">
                {astData.patterns.map((pattern: any, index: number) => (
                  <Card key={index}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{pattern.name}</CardTitle>
                        <Badge className={getQualityColor(pattern.quality)}>
                          {pattern.quality}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        {pattern.description}
                      </p>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Found in:</h4>
                        <div className="flex flex-wrap gap-2">
                          {pattern.locations.map((location: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {location}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="smells">
              <div className="space-y-4">
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-md p-4 mb-4">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-2 text-amber-700 dark:text-amber-300">Code Smells</h3>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">
                        These are potential issues in the codebase that might benefit from refactoring.
                        They don't necessarily indicate bugs, but may impact maintainability.
                      </p>
                    </div>
                  </div>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  {astData.codeSmells.map((smell: any, index: number) => (
                    <AccordionItem key={index} value={`smell-${index}`}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center text-left">
                          <span className="font-medium">{smell.type}</span>
                          <Badge className="ml-3 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                            {smell.location}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-2 pb-4">
                          <p className="text-gray-700 dark:text-gray-300">
                            <strong>Suggestion:</strong> {smell.suggestion}
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </TabsContent>
            
            <TabsContent value="refactoring">
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-md p-4 mb-4">
                  <div className="flex">
                    <CodeIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-2 text-blue-700 dark:text-blue-300">Refactoring Opportunities</h3>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">
                        These are suggestions for improving the code structure and design without changing functionality.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {astData.refactoringOpportunities.map((opportunity: string, index: number) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-start">
                          <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 h-6 w-6 rounded-full flex items-center justify-center font-medium mr-3 flex-shrink-0 mt-0.5">
                            {index + 1}
                          </div>
                          <p className="text-gray-700 dark:text-gray-300">{opportunity}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ASTViewer;
