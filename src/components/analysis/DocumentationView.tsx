import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Download, Loader2, FileText, Check } from "lucide-react";
import { geminiService } from '@/services/GeminiService';
import ReactMarkdown from 'react-markdown';
import { useToast } from "@/hooks/use-toast";
import { jsPDF } from "jspdf";
import { BookOpen, Lightbulb } from 'lucide-react';
import SystemMap from '@/components/SystemMap';

interface CodeExample {
  title: string;
  description: string;
  code: string;
}

interface KeyTakeaway {
  topic: string;
  details: string;
  importance?: string;
  relatedFiles?: string[];
}

interface Documentation {
  title: string;
  components: {
    pages: Array<{
      name: string;
      description: string;
      filePath: string;
    }>;
    features: Array<{
      name: string;
      description: string;
      filePath: string;
    }>;
    ui: Array<{
      name: string;
      description: string;
      filePath: string;
    }>;
    services: Array<{
      name: string;
      description: string;
      filePath: string;
    }>;
  };
  architecture: {
    overview: string;
    patterns: string[];
    dataFlow: string[];
    keyDecisions: Array<{
      decision: string;
      rationale: string;
      impact: string;
    }>;
  };
  setup: {
    prerequisites: string[];
    environmentSetup: string[];
    configuration: {
      required: string[];
      optional: string[];
    };
  };
  features: Array<{
    name: string;
    description: string;
    implementation: string;
    codeExample: string;
    dependencies: string[];
  }>;
}

interface DocumentationViewProps {
  repositoryInfo: any;
  codeAnalysis: any;
  criticalPaths: any;
}

const DocumentationView: React.FC<DocumentationViewProps> = ({ 
  repositoryInfo, 
  codeAnalysis, 
  criticalPaths 
}) => {
  const { toast } = useToast();
  const [documentation, setDocumentation] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  const generateDocumentation = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    try {
      const result = await geminiService.generateDocumentation({
        repositoryInfo,
        codeAnalysis,
        criticalPaths
      });
      
      // Add null checks for all properties
      const transformedDoc = {
        title: result?.title || 'Documentation',
        sections: [
          {
            title: "Overview",
            content: result?.architecture?.overview || 'No overview available',
            importance: 10
          },
          {
            title: "Architecture Patterns",
            content: result?.architecture?.patterns?.map(p => `- ${p}`).join('\n') || 'No patterns defined',
            importance: 9
          },
          {
            title: "Data Flow",
            content: result?.architecture?.dataFlow?.map(d => `${d}`).join('\n\n') || 'No data flow defined',
            importance: 8
          },
          {
            title: "Key Decisions",
            content: result?.architecture?.keyDecisions?.map(d => 
              `### ${d.decision}\n\n**Rationale:** ${d.rationale}\n\n**Impact:** ${d.impact}`
            ).join('\n\n') || 'No key decisions documented',
            importance: 8
          },
          {
            title: "Setup Guide",
            content: `### Prerequisites\n${result?.setup?.prerequisites?.map(p => `- ${p}`).join('\n') || 'No prerequisites defined'}\n\n### Environment Setup\n${result?.setup?.environmentSetup?.map(e => `- ${e}`).join('\n') || 'No setup steps defined'}`,
            importance: 7
          }
        ],
        components: {
          pages: result?.components?.pages || [],
          features: result?.components?.features || [],
          ui: result?.components?.ui || [],
          services: result?.components?.services || []
        },
        architecture: {
          overview: result?.architecture?.overview || '',
          patterns: result?.architecture?.patterns || [],
          dataFlow: result?.architecture?.dataFlow || [],
          keyDecisions: result?.architecture?.keyDecisions || []
        },
        codeExamples: (result?.features || []).map(f => ({
          title: f.name || 'Untitled Example',
          description: f.description || '',
          code: f.codeExample || ''
        })),
        keyTakeaways: (result?.architecture?.keyDecisions || []).map(d => ({
          topic: d.decision || '',
          details: d.rationale || '',
          importance: "High",
          relatedFiles: []
        }))
      };

      setDocumentation(transformedDoc);
      setActiveSection(transformedDoc.sections[0].title);
      
      toast({
        title: "Documentation Generated",
        description: "Documentation has been successfully generated."
      });
    } catch (error) {
      console.error("Error generating documentation:", error);
      toast({
        title: "Error",
        description: "Failed to generate documentation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const downloadPDF = async () => {
    if (!documentation || isDownloading) return;
    
    setIsDownloading(true);
    
    try {
      const doc = new jsPDF();
      
      let yPosition = 10;
      
      // Title
      doc.setFontSize(20);
      doc.text(documentation.title, 20, yPosition);
      yPosition += 10;
      
      // For each section
      documentation.sections.forEach((section: any) => {
        // Add page if needed
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 10;
        }
        
        // Section title
        doc.setFontSize(16);
        doc.text(section.title, 20, yPosition);
        yPosition += 10;
        
        // Section content - simple text extraction from markdown
        doc.setFontSize(12);
        const contentLines = section.content.split('\n');
        contentLines.forEach((line: string) => {
          // Simple handling of headers
          if (line.startsWith('#')) {
            doc.setFontSize(14);
            doc.text(line.replace(/^#+\s/, ''), 20, yPosition);
            doc.setFontSize(12);
          } else {
            // Wrap text to fit page width
            const textLines = doc.splitTextToSize(line, 180);
            textLines.forEach((textLine: string) => {
              if (yPosition > 280) {
                doc.addPage();
                yPosition = 10;
              }
              doc.text(textLine, 20, yPosition);
              yPosition += 6;
            });
          }
          yPosition += 2;
        });
        
        yPosition += 10;
      });
      
      // Add code examples
      if (documentation.codeExamples && documentation.codeExamples.length > 0) {
        doc.addPage();
        yPosition = 10;
        
        doc.setFontSize(16);
        doc.text("Code Examples", 20, yPosition);
        yPosition += 10;
        
        documentation.codeExamples.forEach((example: any) => {
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 10;
          }
          
          doc.setFontSize(14);
          doc.text(example.title, 20, yPosition);
          yPosition += 8;
          
          doc.setFontSize(10);
          doc.text(example.description, 20, yPosition);
          yPosition += 8;
          
          const codeLines = example.code.split('\n');
          codeLines.forEach((line: string) => {
            if (yPosition > 280) {
              doc.addPage();
              yPosition = 10;
            }
            doc.text(`  ${line}`, 20, yPosition);
            yPosition += 5;
          });
          
          yPosition += 10;
        });
      }
      
      // Add key takeaways
      if (documentation.keyTakeaways && documentation.keyTakeaways.length > 0) {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 10;
        } else {
          yPosition += 10;
        }
        
        doc.setFontSize(16);
        doc.text("Key Takeaways", 20, yPosition);
        yPosition += 10;
        
        doc.setFontSize(12);
        documentation.keyTakeaways.forEach((takeaway: string) => {
          if (yPosition > 280) {
            doc.addPage();
            yPosition = 10;
          }
          doc.text(`• ${takeaway}`, 20, yPosition);
          yPosition += 8;
        });
      }
      
      // Save the PDF
      doc.save(`${repositoryInfo.name || 'repository'}-documentation.pdf`);
      
      toast({
        title: "PDF Downloaded",
        description: "Documentation PDF has been downloaded successfully."
      });
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast({
        title: "Error",
        description: "Failed to download PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };
  
  // Find a section by title
  const findSection = (title: string) => {
    if (!documentation || !documentation.sections) return null;
    return documentation.sections.find((s: any) => s.title === title) || null;
  };
  
  // Get the active section content
  const activeContent = activeSection ? findSection(activeSection) : null;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Documentation Generator</CardTitle>
        <CardDescription>
          Generate comprehensive documentation for the codebase
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!documentation ? (
          <div className="flex flex-col items-center justify-center p-8">
            <FileText className="w-16 h-16 mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No Documentation Generated Yet</h3>
            <p className="text-center text-muted-foreground mb-6">
              Generate comprehensive documentation to help new developers understand this codebase.
            </p>
            <Button 
              onClick={generateDocumentation} 
              disabled={isGenerating}
              className="min-w-[200px]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  Generate Documentation
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            <div className="grid md:grid-cols-[300px_1fr] gap-4 h-[600px]">
              {/* Table of contents */}
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Table of Contents</h3>
                <ScrollArea className="h-[520px]">
                  <ul className="space-y-1">
                    {documentation?.sections?.map((section: any) => (
                      <li key={section.title}>
                        <Button 
                          variant={activeSection === section.title ? "default" : "ghost"}
                          className="w-full justify-start text-left"
                          onClick={() => setActiveSection(section.title)}
                        >
                          {section.title}
                          {section.importance >= 8 && (
                            <Badge variant="secondary" className="ml-2">Important</Badge>
                          )}
                        </Button>
                      </li>
                    )) || null}
                    <li className="mt-4 pt-4 border-t">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-left"
                        onClick={() => setActiveSection("code-examples")}
                      >
                        Code Examples
                      </Button>
                    </li>
                    <li>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-left"
                        onClick={() => setActiveSection("key-takeaways")}
                      >
                        Key Takeaways
                      </Button>
                    </li>
                  </ul>
                </ScrollArea>
              </div>
              
              {/* Content area */}
              <div className="border rounded-md">
                <ScrollArea className="h-[520px]">
                  {activeSection === "code-examples" ? (
                    <div className="p-6">
                      <div className="flex items-center mb-6">
                        <FileText className="w-6 h-6 mr-2 text-primary" />
                        <h2 className="text-2xl font-bold">Code Examples</h2>
                      </div>
                      {documentation.codeExamples?.length > 0 ? (
                        <div className="space-y-8">
                          {documentation.codeExamples.map((example: CodeExample, index: number) => (
                            <div key={index} className="bg-card border rounded-lg p-6">
                              <h3 className="text-xl font-medium mb-3">{example.title}</h3>
                              <p className="mb-4 text-muted-foreground">{example.description}</p>
                              <div className="relative">
                                <pre className="bg-secondary/20 p-4 rounded-md overflow-x-auto">
                                  <code className="text-sm">{example.code}</code>
                                </pre>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="absolute top-2 right-2"
                                  onClick={() => navigator.clipboard.writeText(example.code)}
                                >
                                  Copy Code
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <EmptyState message="No code examples available" />
                      )}
                    </div>
                  ) : activeSection === "key-takeaways" ? (
                    <div className="p-6">
                      <div className="flex items-center mb-6">
                        <Lightbulb className="w-6 h-6 mr-2 text-primary" />
                        <h2 className="text-2xl font-bold">Key Takeaways</h2>
                      </div>
                      <div className="grid gap-6">
                        {documentation.keyTakeaways?.map((item: KeyTakeaway, index: number) => (
                          <div key={index} className="bg-card border rounded-lg p-6">
                            <div className="flex items-start justify-between">
                              <h3 className="text-lg font-medium">{item.topic}</h3>
                              {item.importance && (
                                <Badge variant="secondary">
                                  {item.importance}
                                </Badge>
                              )}
                            </div>
                            <p className="mt-2 text-muted-foreground">{item.details}</p>
                            {item.relatedFiles?.length > 0 && (
                              <div className="mt-4 bg-secondary/20 p-3 rounded-md">
                                <p className="font-medium text-sm mb-2">Related Files:</p>
                                <div className="grid gap-1">
                                  {item.relatedFiles.map((file, fileIndex) => (
                                    <code key={fileIndex} className="text-xs">{file}</code>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : activeContent?.title === "Architecture Patterns" ? (
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                          <BookOpen className="w-6 h-6 mr-2 text-primary" />
                          <h2 className="text-2xl font-bold">{activeContent.title}</h2>
                        </div>
                        {activeContent.importance >= 8 && (
                          <Badge className="bg-amber-500">Important Section</Badge>
                        )}
                      </div>
                      
                      <div className="space-y-8">
                        {/* Architecture Overview */}
                        <div className="prose dark:prose-invert max-w-none">
                          <div className="bg-card border rounded-lg p-6">
                            <ReactMarkdown>{activeContent?.content || 'No content available'}</ReactMarkdown>
                          </div>
                        </div>

                        {/* System Map */}
                        {documentation?.components && (
                          <div className="bg-card border rounded-lg p-6">
                            <h3 className="text-xl font-semibold mb-4">System Component Map</h3>
                            <SystemMap 
                              nodes={[
                                ...(documentation.components?.pages || []).map(page => ({
                                  id: page.name || 'unnamed',
                                  label: page.name || 'Unnamed Page',
                                  type: 'Page',
                                  description: page.description || '',
                                  filePath: page.filePath || ''
                                })),
                                ...(documentation.components?.features || []).map(feature => ({
                                  id: feature.name || 'unnamed',
                                  label: feature.name || 'Unnamed Feature',
                                  type: 'Feature',
                                  description: feature.description || '',
                                  filePath: feature.filePath || ''
                                })),
                                ...(documentation.components?.ui || []).map(ui => ({
                                  id: ui.name || 'unnamed',
                                  label: ui.name || 'Unnamed UI',
                                  type: 'UI',
                                  description: ui.description || '',
                                  filePath: ui.filePath || ''
                                })),
                                ...(documentation.components?.services || []).map(service => ({
                                  id: service.name || 'unnamed',
                                  label: service.name || 'Unnamed Service',
                                  type: 'Service',
                                  description: service.description || '',
                                  filePath: service.filePath || ''
                                }))
                              ].filter(Boolean)}
                              connections={
                                ((documentation.architecture?.dataFlow || []).map((flow, index) => {
                                  try {
                                    const parts = flow?.split(' ') || [];
                                    if (parts.length < 3) return null;
                                    return {
                                      from: parts[0],
                                      to: parts[parts.length - 1],
                                      label: flow
                                    };
                                  } catch (error) {
                                    console.error("Error processing data flow:", error);
                                    return null;
                                  }
                                }) || []).filter(Boolean)
                              }
                            />
                          </div>
                        )}

                        {/* Data Flow Section */}
                        {documentation.architecture?.dataFlow && documentation.architecture.dataFlow.length > 0 && (
                          <div className="bg-card border rounded-lg p-6">
                            <h3 className="text-xl font-semibold mb-4">Data Flow</h3>
                            <div className="space-y-2">
                              {documentation.architecture.dataFlow.map((flow, index) => (
                                <div key={index} className="flex items-start gap-2">
                                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-0.5 rounded text-sm">
                                    {index + 1}
                                  </span>
                                  <p className="text-muted-foreground">{flow}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Key Decisions Section */}
                        {documentation?.architecture?.keyDecisions?.length > 0 && (
                          <div className="bg-card border rounded-lg p-6">
                            <h3 className="text-xl font-semibold mb-4">Key Architecture Decisions</h3>
                            <div className="space-y-4">
                              {documentation.architecture.keyDecisions.map((decision, index) => (
                                <div key={index} className="border rounded-lg p-4">
                                  <h4 className="font-medium text-lg mb-2">{decision.decision}</h4>
                                  <div className="grid gap-2 text-sm">
                                    <div>
                                      <span className="font-medium">Rationale: </span>
                                      <span className="text-muted-foreground">{decision.rationale}</span>
                                    </div>
                                    <div>
                                      <span className="font-medium">Impact: </span>
                                      <span className="text-muted-foreground">{decision.impact}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-6">
                      {activeContent && (
                        <>
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                              <BookOpen className="w-6 h-6 mr-2 text-primary" />
                              <h2 className="text-2xl font-bold">{activeContent.title}</h2>
                            </div>
                            {activeContent.importance >= 8 && (
                              <Badge className="bg-amber-500">Important Section</Badge>
                            )}
                          </div>
                          <div className="prose dark:prose-invert max-w-none">
                            <div className="bg-card border rounded-lg p-6">
                              <ReactMarkdown 
                                components={{
                                  h1: ({node, ...props}) => <h1 className="text-2xl font-bold mb-4" {...props} />,
                                  h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-6 mb-3" {...props} />,
                                  h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-4 mb-2" {...props} />,
                                  p: ({node, ...props}) => <p className="mb-4 text-muted-foreground" {...props} />,
                                  ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4" {...props} />,
                                  ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4" {...props} />,
                                  li: ({node, ...props}) => <li className="mb-1" {...props} />,
                                  code: ({node, ...props}) => (
                                    <code className="bg-secondary/20 px-1.5 py-0.5 rounded" {...props} />
                                  ),
                                  pre: ({node, ...props}) => (
                                    <pre className="bg-secondary/20 p-4 rounded-md overflow-x-auto mb-4" {...props} />
                                  ),
                                }}
                              >
                                {activeContent.content}
                              </ReactMarkdown>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </ScrollArea>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      {documentation && (
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={generateDocumentation}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Regenerating...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Regenerate
              </>
            )}
          </Button>
          
          <Button 
            onClick={downloadPDF}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Preparing PDF...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default DocumentationView;
