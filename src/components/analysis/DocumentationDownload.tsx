
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Share2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface DocumentationDownloadProps {
  analysisData: any;
  repoInfo: any;
}

const DocumentationDownload = ({ analysisData, repoInfo }: DocumentationDownloadProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  
  // Documentation is generated from the analysis data
  const documentation = analysisData?.generateDocumentation || {
    title: `${repoInfo?.name || 'Repository'} Documentation`,
    version: "1.0.0",
    generatedDate: new Date().toLocaleDateString(),
    sections: [
      {
        title: "Introduction",
        content: `# Introduction\n\nThis documentation provides an overview of the ${repoInfo?.name || 'repository'}.`,
        subsections: []
      }
    ],
    markdownContent: `# ${repoInfo?.name || 'Repository'} Documentation\n\nThis documentation was automatically generated.`
  };
  
  const handleDownload = () => {
    setIsGenerating(true);
    
    try {
      // Create a Blob with the markdown content
      const blob = new Blob([documentation.markdownContent], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `${repoInfo?.name || 'repository'}-documentation.md`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Documentation Downloaded",
        description: "Documentation has been downloaded as a Markdown file",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download documentation. Please try again.",
        variant: "destructive"
      });
      console.error("Error downloading documentation:", error);
    }
    
    setIsGenerating(false);
  };
  
  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(documentation.markdownContent);
      toast({
        title: "Copied to Clipboard",
        description: "Documentation content has been copied to clipboard",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy documentation to clipboard",
        variant: "destructive"
      });
      console.error("Error copying to clipboard:", error);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-purple-100 dark:border-purple-900">
        <CardHeader>
          <CardTitle className="text-2xl">Documentation</CardTitle>
          <CardDescription>
            Download or copy documentation for the codebase
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-800">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium text-lg">{documentation.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Version {documentation.version} • Generated on {documentation.generatedDate}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyToClipboard}
                  >
                    <Share2 className="mr-1 h-4 w-4" />
                    Copy
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleDownload}
                    disabled={isGenerating}
                  >
                    <Download className="mr-1 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <div className="bg-white dark:bg-gray-900 p-4 max-h-96 overflow-y-auto">
                  <div className="prose dark:prose-invert prose-sm max-w-none">
                    {documentation.sections.map((section, index) => (
                      <div key={index} className="mb-6">
                        <h2 className="text-xl font-bold mb-2">{section.title}</h2>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                          {section.content.replace(/^#.*\n/, '')}
                        </p>
                        
                        {section.subsections && section.subsections.length > 0 && (
                          <div className="pl-4 mt-4 border-l-2 border-gray-200 dark:border-gray-700">
                            {section.subsections.map((subsection, subIndex) => (
                              <div key={subIndex} className="mb-4">
                                <h3 className="text-lg font-medium mb-2">{subsection.title}</h3>
                                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                                  {subsection.content.replace(/^##.*\n/, '')}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <FileText className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-gray-500 text-sm">
                Documentation is generated based on repository analysis
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentationDownload;
