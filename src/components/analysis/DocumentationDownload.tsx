
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Book, Loader2, CheckCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { geminiService } from "@/services/GeminiService";
import { useToast } from "@/components/ui/use-toast";

interface DocumentationDownloadProps {
  analysisData: any;
  repoInfo: any;
}

const DocumentationDownload = ({ analysisData, repoInfo }: DocumentationDownloadProps) => {
  const [generating, setGenerating] = useState(false);
  const [documentation, setDocumentation] = useState<any>(null);
  const { toast } = useToast();
  
  const handleGenerateDocumentation = async () => {
    setGenerating(true);
    
    try {
      toast({
        title: "Generating Documentation",
        description: "This may take a minute. Please wait...",
      });
      
      const docData = await geminiService.generateDocumentation({
        repositoryInfo: repoInfo,
        structureAnalysis: analysisData.structureAnalysis,
        criticalPathsAnalysis: analysisData.criticalPathsAnalysis,
        dependencyGraphAnalysis: analysisData.dependencyGraphAnalysis
      });
      
      setDocumentation(docData);
      
      toast({
        title: "Documentation Generated",
        description: "Your documentation is ready to download.",
        variant: "success"
      });
    } catch (error) {
      console.error("Error generating documentation:", error);
      
      toast({
        title: "Generation Failed",
        description: "Failed to generate documentation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };
  
  const handleDownloadMarkdown = () => {
    if (!documentation) return;
    
    const markdownContent = documentation.markdownContent;
    const blob = new Blob([markdownContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    
    a.href = url;
    a.download = `${repoInfo.name}-documentation.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: "Documentation downloaded as Markdown.",
    });
  };
  
  const handleDownloadHTML = () => {
    if (!documentation) return;
    
    // Convert markdown to simple HTML
    const markdownContent = documentation.markdownContent;
    let htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${documentation.title || 'Repository Documentation'}</title>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", sans-serif; 
      line-height: 1.6; 
      max-width: 800px; 
      margin: 0 auto; 
      padding: 20px;
      color: #333;
    }
    h1, h2, h3, h4 { margin-top: 1.5em; margin-bottom: 0.5em; }
    h1 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
    h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
    code { 
      background-color: #f6f8fa; 
      padding: 0.2em 0.4em; 
      border-radius: 3px; 
      font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace; 
      font-size: 85%;
    }
    pre { background-color: #f6f8fa; padding: 16px; border-radius: 6px; overflow: auto; }
    pre code { background-color: transparent; padding: 0; }
    a { color: #0366d6; text-decoration: none; }
    a:hover { text-decoration: underline; }
    blockquote { margin-left: 0; padding-left: 1em; border-left: 0.25em solid #dfe2e5; color: #6a737d; }
    hr { height: 0.25em; background-color: #e1e4e8; border: 0; }
    table { border-collapse: collapse; width: 100%; }
    table td, table th { border: 1px solid #dfe2e5; padding: 6px 13px; }
    table tr:nth-child(2n) { background-color: #f6f8fa; }
    img { max-width: 100%; }
    .footer { margin-top: 3em; color: #6a737d; font-size: 0.8em; text-align: center; }
  </style>
</head>
<body>`;

    // Very simple markdown to HTML conversion (a full converter would be more sophisticated)
    const content = markdownContent
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
      .replace(/^##### (.*$)/gm, '<h5>$1</h5>')
      .replace(/^###### (.*$)/gm, '<h6>$1</h6>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/```(.*?)\n([\s\S]*?)\n```/gm, '<pre><code>$2</code></pre>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
      .replace(/^\s*[-*+]\s+(.*)/gm, '<li>$1</li>')
      .replace(/<\/li>\n<li>/g, '</li><li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      .replace(/\n\n/g, '<br><br>');
    
    htmlContent += content;
    
    htmlContent += `
  <div class="footer">
    <p>Generated on ${new Date().toLocaleDateString()} | Repository: ${repoInfo.name}</p>
  </div>
</body>
</html>`;
    
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    
    a.href = url;
    a.download = `${repoInfo.name}-documentation.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: "Documentation downloaded as HTML.",
    });
  };
  
  // Handle PDF download (this is just a stub since client-side PDF generation can be complex)
  const handleDownloadPDF = () => {
    toast({
      title: "Not Yet Implemented",
      description: "PDF download will be available in a future update. Please use Markdown or HTML format.",
    });
  };
  
  return (
    <div className="space-y-6">
      <Card className="border-blue-100 dark:border-blue-900">
        <CardHeader>
          <CardTitle className="text-2xl">Documentation</CardTitle>
          <CardDescription>
            Generate comprehensive documentation for the codebase
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!documentation ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-blue-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">Generate Documentation</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Create comprehensive documentation based on the analysis of this repository.
                The documentation includes architecture overview, key components, workflows, and best practices.
              </p>
              <Button 
                onClick={handleGenerateDocumentation}
                disabled={generating}
                className="mx-auto"
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Book className="mr-2 h-4 w-4" />
                    Generate Documentation
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800 rounded-md p-4">
                <div className="flex">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-green-700 dark:text-green-300">
                      Documentation Ready!
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      Your documentation has been generated successfully. You can now download it in your preferred format.
                    </p>
                  </div>
                </div>
              </div>
              
              <Tabs defaultValue="preview">
                <TabsList className="mb-4">
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="download">Download</TabsTrigger>
                </TabsList>
                
                <TabsContent value="preview">
                  <div className="border rounded-md p-4 max-h-[500px] overflow-y-auto bg-white dark:bg-gray-800">
                    <h1 className="text-xl font-bold mb-4">{documentation.title}</h1>
                    <div className="text-sm text-gray-500 mb-6">
                      Version {documentation.version} | Generated on {documentation.generatedDate}
                    </div>
                    
                    {documentation.sections.map((section: any, index: number) => (
                      <div key={index} className="mb-6">
                        <h2 className="text-lg font-semibold border-b pb-2 mb-3">{section.title}</h2>
                        <div className="mb-4 whitespace-pre-wrap">{section.content.replace(/^# .*$/m, '')}</div>
                        
                        {section.subsections.map((subsection: any, subIndex: number) => (
                          <div key={subIndex} className="ml-4 mb-4">
                            <h3 className="text-md font-semibold mb-2">{subsection.title}</h3>
                            <div className="whitespace-pre-wrap">{subsection.content.replace(/^## .*$/m, '')}</div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="download">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="text-center hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="mx-auto bg-blue-100 dark:bg-blue-900 h-12 w-12 rounded-full flex items-center justify-center mb-2">
                          <FileText className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                        </div>
                        <CardTitle className="text-lg">Markdown</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-gray-500 mb-4">
                          Download as a Markdown file, perfect for GitHub or GitLab.
                        </p>
                        <Button onClick={handleDownloadMarkdown} className="w-full">
                          <Download className="mr-2 h-4 w-4" />
                          Download .md
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="text-center hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="mx-auto bg-orange-100 dark:bg-orange-900 h-12 w-12 rounded-full flex items-center justify-center mb-2">
                          <FileText className="h-6 w-6 text-orange-600 dark:text-orange-300" />
                        </div>
                        <CardTitle className="text-lg">HTML</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-gray-500 mb-4">
                          Download as an HTML file that can be viewed in any browser.
                        </p>
                        <Button onClick={handleDownloadHTML} className="w-full">
                          <Download className="mr-2 h-4 w-4" />
                          Download .html
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="text-center hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="mx-auto bg-red-100 dark:bg-red-900 h-12 w-12 rounded-full flex items-center justify-center mb-2">
                          <FileText className="h-6 w-6 text-red-600 dark:text-red-300" />
                        </div>
                        <CardTitle className="text-lg">PDF</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-gray-500 mb-4">
                          Download as a PDF document for easy sharing and printing.
                        </p>
                        <Button onClick={handleDownloadPDF} className="w-full">
                          <Download className="mr-2 h-4 w-4" />
                          Download .pdf
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentationDownload;
