
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, FileCode, GitBranch, GitPullRequest } from "lucide-react";
import { githubService } from "@/services/GitHubService";
import { geminiService } from "@/services/GeminiService";
import { codeAnalysisService } from "@/services/CodeAnalysisService";
import ArchitectureMap from "@/components/analysis/ArchitectureMap";
import CriticalPathsView from "@/components/analysis/CriticalPathsView";
import DependencyGraph from "@/components/analysis/DependencyGraph";
import TutorialView from "@/components/analysis/TutorialView";
import LoadingState from "@/components/LoadingState";
import { useToast } from "@/components/ui/use-toast";

const AnalysisPage = () => {
  const [searchParams] = useSearchParams();
  const repoUrl = searchParams.get("repo") || "";
  const role = searchParams.get("role") || "full-stack";
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [repoInfo, setRepoInfo] = useState<any>(null);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [analysisProgress, setAnalysisProgress] = useState({
    structure: false,
    criticalPaths: false,
    dependencies: false,
    tutorials: false
  });
  
  useEffect(() => {
    const analyzeRepository = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setAnalysisData(null); // Reset any previous analysis data
        
        console.log("Starting repository analysis for:", repoUrl);
        
        // Parse repository URL
        const parsedRepo = githubService.parseRepoUrl(repoUrl);
        if (!parsedRepo) {
          throw new Error("Invalid repository URL");
        }
        
        const { owner, repo } = parsedRepo;
        console.log(`Parsed repo: ${owner}/${repo}`);
        
        toast({
          title: "Analysis Started",
          description: `Analyzing ${owner}/${repo}...`
        });
        
        // 1. Get repository information
        console.log("Fetching repository information...");
        const repoInfo = await githubService.getRepositoryInfo(owner, repo);
        setRepoInfo(repoInfo);
        console.log("Repository info fetched:", repoInfo.name);
        
        // 2. Get repository structure
        console.log("Fetching repository structure...");
        const repoStructure = await githubService.getRepositoryStructure(owner, repo);
        console.log("Repository structure fetched", repoStructure);
        
        // 3. Get most changed files
        console.log("Fetching most changed files...");
        const mostChangedFiles = await githubService.getMostChangedFiles(owner, repo, 10);
        console.log("Most changed files fetched:", mostChangedFiles);
        
        // 4. Analyze repository structure
        console.log("Analyzing repository structure with AI...");
        const structureAnalysis = await geminiService.analyzeRepositoryStructure({
          repositoryInfo: repoInfo,
          structure: repoStructure,
          mostChangedFiles: mostChangedFiles
        });
        console.log("Structure analysis complete:", structureAnalysis);
        setAnalysisProgress(prev => ({ ...prev, structure: true }));
        
        toast({
          title: "Structure Analysis Complete",
          description: "Analyzing code patterns..."
        });
        
        // 5. Get file contents for selected files (based on most changed files)
        console.log("Fetching file contents...");
        const fileContents = [];
        for (const file of mostChangedFiles.slice(0, 5)) {
          try {
            console.log(`Fetching content for ${file.filename}...`);
            const content = await githubService.getFileContent(owner, repo, file.filename);
            fileContents.push({
              path: file.filename,
              content,
              changeFrequency: file.count
            });
          } catch (err) {
            console.error(`Error fetching content for ${file.filename}:`, err);
          }
        }
        console.log(`Fetched contents for ${fileContents.length} files`);
        
        // 6. Analyze code structure
        console.log("Analyzing code structure...");
        let codeAnalysis = { dependencies: [] };
        try {
          codeAnalysis = await codeAnalysisService.analyzeCode(fileContents);
          console.log("Code analysis complete:", codeAnalysis);
        } catch (err) {
          console.error("Error in code analysis:", err);
        }
        
        // 7. Identify critical code paths
        console.log("Identifying critical code paths...");
        const criticalPathsAnalysis = await geminiService.identifyCriticalCodePaths({
          mostChangedFiles,
          fileContents,
          codeAnalysis,
          role
        });
        console.log("Critical paths identified:", criticalPathsAnalysis);
        setAnalysisProgress(prev => ({ ...prev, criticalPaths: true }));
        
        toast({
          title: "Critical Paths Identified",
          description: "Generating dependency graph..."
        });
        
        // 8. Generate dependency graph
        console.log("Generating dependency graph...");
        const dependencyGraphAnalysis = await geminiService.generateDependencyGraph({
          codeAnalysis: codeAnalysis.dependencies,
          repositoryStructure: repoStructure
        });
        console.log("Dependency graph generated:", dependencyGraphAnalysis);
        setAnalysisProgress(prev => ({ ...prev, dependencies: true }));
        
        toast({
          title: "Dependency Analysis Complete",
          description: "Creating interactive tutorials..."
        });
        
        // 9. Create tutorials based on critical paths
        console.log("Creating tutorials...");
        const tutorialsAnalysis = await geminiService.createTutorial({
          criticalPaths: criticalPathsAnalysis.criticalPaths,
          repositoryInfo: repoInfo,
          role
        });
        console.log("Tutorials created:", tutorialsAnalysis);
        setAnalysisProgress(prev => ({ ...prev, tutorials: true }));
        
        // Combine all analysis results
        const finalAnalysisData = {
          structureAnalysis,
          criticalPathsAnalysis,
          dependencyGraphAnalysis,
          tutorialsAnalysis,
          codeAnalysis
        };
        
        console.log("Setting final analysis data:", finalAnalysisData);
        setAnalysisData(finalAnalysisData);
        
        toast({
          title: "Analysis Complete",
          description: "All insights are ready to explore",
          variant: "default"
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error analyzing repository:", error);
        setError(error instanceof Error ? error.message : "Unknown error occurred");
        setIsLoading(false);
        
        toast({
          title: "Analysis Error",
          description: error instanceof Error ? error.message : "Unknown error occurred",
          variant: "destructive"
        });
      }
    };
    
    if (repoUrl) {
      analyzeRepository();
    }
  }, [repoUrl, role, toast]);
  
  if (isLoading) {
    return <LoadingState repo={repoUrl} progress={analysisProgress} />;
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="border-red-200">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-6 w-6 text-red-500" />
              <CardTitle>Analysis Error</CardTitle>
            </div>
            <CardDescription>
              We encountered an error while analyzing the repository.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">{error}</p>
            <Button className="mt-4" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {repoInfo && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{repoInfo.name}</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <FileCode className="h-4 w-4 mr-1" />
              {repoInfo.language}
            </div>
            <div className="flex items-center">
              <GitBranch className="h-4 w-4 mr-1" />
              {repoInfo.default_branch}
            </div>
            <div className="flex items-center">
              <GitPullRequest className="h-4 w-4 mr-1" />
              {repoInfo.open_issues_count} open issues
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
              Analysis complete
            </div>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            {repoInfo.description}
          </p>
        </div>
      )}
      
      <Tabs defaultValue="architecture">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="architecture">Architecture Map</TabsTrigger>
          <TabsTrigger value="critical-paths">Critical Paths</TabsTrigger>
          <TabsTrigger value="dependencies">Dependency Graph</TabsTrigger>
          <TabsTrigger value="tutorials">Interactive Tutorials</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="architecture">
            {analysisData ? (
              <ArchitectureMap data={analysisData.structureAnalysis} />
            ) : (
              <div className="space-y-4">
                <div className="h-64 w-full bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse"></div>
                <div className="h-32 w-full bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse"></div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="critical-paths">
            {analysisData ? (
              <CriticalPathsView 
                data={analysisData.criticalPathsAnalysis} 
                role={role} 
              />
            ) : (
              <div className="space-y-4">
                <div className="h-64 w-full bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse"></div>
                <div className="h-32 w-full bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse"></div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="dependencies">
            {analysisData ? (
              <DependencyGraph 
                data={analysisData.dependencyGraphAnalysis} 
                codeAnalysis={analysisData.codeAnalysis} 
              />
            ) : (
              <div className="space-y-4">
                <div className="h-64 w-full bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse"></div>
                <div className="h-32 w-full bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse"></div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="tutorials">
            {analysisData ? (
              <TutorialView 
                data={analysisData.tutorialsAnalysis} 
                role={role} 
              />
            ) : (
              <div className="space-y-4">
                <div className="h-64 w-full bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse"></div>
                <div className="h-32 w-full bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse"></div>
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default AnalysisPage;
