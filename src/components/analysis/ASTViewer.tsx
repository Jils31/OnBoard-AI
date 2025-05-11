import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GitBranch, FileCode, Grid2X2, Copy, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Tree from 'react-d3-tree';
import { useToast } from "@/hooks/use-toast";

interface ASTViewerProps {
  ast: any;
}

const ASTViewer: React.FC<ASTViewerProps> = ({ ast }) => {
  const { toast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'tree' | 'json'>('tree');
  const [hasCopied, setHasCopied] = useState(false);
  
  // Get available languages
  const languages = ast ? Object.keys(ast) : [];
  
  // Use the first language as default if none selected
  const effectiveLanguage = selectedLanguage || (languages.length > 0 ? languages[0] : null);
  
  // Get available files for the selected language
  const files = effectiveLanguage && ast && ast[effectiveLanguage] 
    ? Object.keys(ast[effectiveLanguage]) 
    : [];
  
  // Use the first file as default if none selected
  const effectiveFile = selectedFile || (files.length > 0 ? files[0] : null);
  
  // Get the AST data for the selected file
  const astData = effectiveLanguage && effectiveFile && ast && ast[effectiveLanguage] && ast[effectiveLanguage][effectiveFile] 
    ? ast[effectiveLanguage][effectiveFile]
    : null;

  // Convert the AST to a format compatible with react-d3-tree
  const convertAstToTreeData = (astNode: any): any => {
    if (!astNode) return { name: 'No AST data available' };
    
    const result: any = {
      name: astNode.type || 'Unknown',
      attributes: {}
    };

    // Add relevant attributes
    if (astNode.name) result.attributes.name = astNode.name;
    if (astNode.path) result.attributes.path = astNode.path;
    if (astNode.value) result.attributes.value = astNode.value;
    if (astNode.count) result.attributes.count = astNode.count;
    if (astNode.extends) result.attributes.extends = astNode.extends;
    
    // Convert children if they exist
    if (astNode.children && Array.isArray(astNode.children) && astNode.children.length > 0) {
      result.children = astNode.children.map(convertAstToTreeData);
    }
    
    return result;
  };
  
  const treeData = astData ? convertAstToTreeData(astData) : null;
  
  const handleCopyJSON = async () => {
    if (astData) {
      await navigator.clipboard.writeText(JSON.stringify(astData, null, 2));
      setHasCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "AST JSON has been copied to your clipboard."
      });
      
      // Reset copy state after 2 seconds
      setTimeout(() => setHasCopied(false), 2000);
    }
  };
  
  if (!ast || Object.keys(ast).length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Abstract Syntax Tree</CardTitle>
          <CardDescription>
            No AST data available. Try analyzing more files.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Abstract Syntax Tree</CardTitle>
            <CardDescription>
              Visualize the code structure through AST
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="language-select">Language</Label>
            <Select 
              value={effectiveLanguage || ''} 
              onValueChange={setSelectedLanguage}
            >
              <SelectTrigger id="language-select">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="file-select">File</Label>
            <Select
              value={effectiveFile || ''}
              onValueChange={setSelectedFile}
              disabled={!effectiveLanguage || files.length === 0}
            >
              <SelectTrigger id="file-select">
                <SelectValue placeholder="Select a file" />
              </SelectTrigger>
              <SelectContent>
                {files.map((file) => (
                  <SelectItem key={file} value={file}>
                    {file.split('/').pop()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="tree" value={viewMode} onValueChange={(value) => setViewMode(value as 'tree' | 'json')}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="tree" className="flex-1">
              <GitBranch className="h-4 w-4 mr-2" />
              Tree View
            </TabsTrigger>
            <TabsTrigger value="json" className="flex-1">
              <FileCode className="h-4 w-4 mr-2" />
              JSON View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tree">
            {treeData ? (
              <div className="bg-secondary/20 rounded-lg h-[600px] border relative">
                <Tree 
                  data={treeData}
                  orientation="vertical" 
                  pathFunc="step"
                  translate={{ x: 300, y: 50 }}
                  separation={{ siblings: 1.5, nonSiblings: 2 }}
                  nodeSize={{ x: 200, y: 100 }}
                  collapsible={true}
                />
              </div>
            ) : (
              <EmptyState />
            )}
          </TabsContent>

          <TabsContent value="json">
            {astData ? (
              <div className="relative">
                <Button 
                  onClick={handleCopyJSON} 
                  variant="outline" 
                  className="absolute top-2 right-2 z-10"
                >
                  {hasCopied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy JSON
                    </>
                  )}
                </Button>
                <ScrollArea className="h-[600px] w-full rounded-lg border bg-muted/50">
                  <pre className="p-4 text-sm">
                    {JSON.stringify(astData, null, 2)}
                  </pre>
                </ScrollArea>
              </div>
            ) : (
              <EmptyState />
            )}
          </TabsContent>
        </Tabs>
        
        {!treeData && !astData && (
          <div className="flex flex-col items-center justify-center h-[300px] bg-secondary/20 rounded-md border">
            <Grid2X2 className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No AST data available for the selected file.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-[600px] bg-secondary/20 rounded-lg border">
    <Grid2X2 className="h-12 w-12 text-muted-foreground mb-4" />
    <p className="text-muted-foreground">No AST data available for the selected file.</p>
  </div>
);

export default ASTViewer;
