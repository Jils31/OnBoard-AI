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
    toast({
      title: "Generating Documentation",
      description: "Please wait while we analyze the codebase and generate documentation..."
    });
    
    try {
      const result = await geminiService.generateDocumentation({
        repositoryInfo,
        codeAnalysis,
        criticalPaths
      });
      
      setDocumentation(result);
      setActiveSection(result.sections[0]?.title || null);
      
      toast({
        title: "Documentation Generated",
        description: "Documentation has been successfully generated.",
        variant: "default"
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
            <div className="grid md:grid-cols-[250px_1fr] gap-4 h-[600px]">
              {/* Table of contents */}
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Table of Contents</h3>
                <ScrollArea className="h-[520px]">
                  <ul className="space-y-1">
                    {documentation.sections.map((section: any) => (
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
                    ))}
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
                <Tabs defaultValue="preview">
                  <ScrollArea className="h-[520px]">
                    {activeSection === "code-examples" ? (
                      <div className="p-6">
                        <h2 className="text-2xl font-bold mb-4">Code Examples</h2>
                        {documentation.codeExamples && documentation.codeExamples.length > 0 ? (
                          <div className="space-y-6">
                            {documentation.codeExamples.map((example: any, index: number) => (
                              <div key={index} className="bg-secondary/20 p-4 rounded-md">
                                <h3 className="text-xl font-medium mb-2">{example.title}</h3>
                                <p className="mb-4 text-muted-foreground">{example.description}</p>
                                <pre className="bg-secondary/30 p-4 rounded-md overflow-x-auto">
                                  <code>{example.code}</code>
                                </pre>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p>No code examples available.</p>
                        )}
                      </div>
                    ) : activeSection === "key-takeaways" ? (
                      <div className="p-6">
                        <h2 className="text-2xl font-bold mb-4">Key Takeaways</h2>
                        {documentation.keyTakeaways && documentation.keyTakeaways.length > 0 ? (
                          <div className="space-y-6">
                            {documentation.keyTakeaways.map((item: any, index: number) => (
                              <div key={index} className="bg-secondary/20 p-4 rounded-md">
                                <h3 className="text-lg font-medium mb-2">{item.topic}</h3>
                                <p className="mb-2 text-muted-foreground">{item.details}</p>
                                {item.relatedFiles && item.relatedFiles.length > 0 && (
                                  <div className="mt-2">
                                    <p className="font-medium">Related Files:</p>
                                    <ul className="list-disc pl-6">
                                      {item.relatedFiles.map((file: string, fileIndex: number) => (
                                        <li key={fileIndex} className="text-sm text-muted-foreground">
                                          {file}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {item.importance && (
                                  <Badge variant="secondary" className="mt-2">
                                    Importance: {item.importance}
                                  </Badge>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p>No key takeaways available.</p>
                        )}
                      </div>
                    ) : (
                      <TabsContent value="preview" className="p-6 relative">
                        {activeContent ? (
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <h2 className="text-2xl font-bold">{activeContent.title}</h2>
                              {activeContent.importance >= 8 && (
                                <Badge className="bg-amber-500">Important Section</Badge>
                              )}
                            </div>
                            <div className="prose dark:prose-invert max-w-none">
                              <ReactMarkdown>
                                {activeContent.content}
                              </ReactMarkdown>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center p-8 text-muted-foreground">
                            Select a section from the table of contents
                          </div>
                        )}
                      </TabsContent>
                    )}
                    
                    <TabsContent value="markdown" className="relative">
                      {activeContent && (
                        <pre className="p-6 whitespace-pre-wrap font-mono text-sm">
                          {activeContent.content}
                        </pre>
                      )}
                    </TabsContent>
                  </ScrollArea>
                </Tabs>
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
