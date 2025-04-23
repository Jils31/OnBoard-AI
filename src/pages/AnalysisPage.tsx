import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, FileCode, GitBranch, GitPullRequest, RefreshCw } from "lucide-react";
import { githubService, GitHubService } from "@/services/GitHubService";
import { geminiService } from "@/services/GeminiService";
import { codeAnalysisService } from "@/services/CodeAnalysisService";
import ArchitectureMap from "@/components/analysis/ArchitectureMap";
import CriticalPathsView from "@/components/analysis/CriticalPathsView";
import DependencyGraph from "@/components/analysis/DependencyGraph";
import TutorialView from "@/components/analysis/TutorialView";
import ASTViewer from "@/components/analysis/ASTViewer";
import CodebaseChatView from "@/components/analysis/CodebaseChatView";
import DocumentationView from "@/components/analysis/DocumentationView";
import LoadingState from "@/components/LoadingState";
import { useToast } from "@/hooks/use-toast";
import { RepositoryAnalysisService } from "@/services/RepositoryAnalysisService";
import { supabase } from "@/integrations/supabase/client";

const AnalysisPage = () => {
  const [searchParams] = useSearchParams();
  const repoUrl = searchParams.get("repo") || "";
  const role = searchParams.get("role") || "full-stack";
  const source = searchParams.get("source") || "";
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStoredAnalysis, setLoadingStoredAnalysis] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [repoInfo, setRepoInfo] = useState<any>(null);
  const [analysisInitialized, setAnalysisInitialized] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState({
    structure: false,
    criticalPaths: false,
    dependencies: false,
    tutorials: false,
    ast: false
  });
  
  // Add more granular loading and error state per analysis section
  const [analysisData, setAnalysisData] = useState<any>(null);

  // New: section-specific error/loading states
  const [sectionStatus, setSectionStatus] = useState({
    structure: { loading: false, error: null },
    criticalPaths: { loading: false, error: null },
    dependencies: { loading: false, error: null },
    tutorials: { loading: false, error: null },
    ast: { loading: false, error: null }
  });

  // Helper to update section status
  const updateSectionStatus = useCallback((section, newStatus) => {
    setSectionStatus(prev => ({
      ...prev,
      [section]: { ...prev[section], ...newStatus }
    }));
  }, []);

  // Function to handle section (re-)generation with error boundary
  const regenerateSection = useCallback(async (sectionName: keyof typeof sectionStatus) => {
    updateSectionStatus(sectionName, { loading: true, error: null });
    try {
      // Fetch fresh token each time just in case (same as useEffect)
      const githubToken = await RepositoryAnalysisService.getGitHubToken();
      const githubServiceWithToken = githubToken ? 
        new GitHubService(githubToken) : 
        githubService;

      // Parse repository URL
      const parsedRepo = githubService.parseRepoUrl(repoUrl);
      if (!parsedRepo) throw new Error("Invalid repository URL");
      const { owner, repo } = parsedRepo;

      // Reload repo info if needed
      let repoInfoLocal = repoInfo;
      if (!repoInfo) {
        repoInfoLocal = await githubServiceWithToken.getRepositoryInfo(owner, repo);
        setRepoInfo(repoInfoLocal);
      }

      // On regeneration, use existing data if available.
      let currentData = analysisData || {};

      switch (sectionName) {
        case "structure":
          // 2. Get repository structure
          updateSectionStatus("structure", { loading: true, error: null });
          const repoStructure = await githubServiceWithToken.getRepositoryStructure(owner, repo);
          // 3. Get most changed files
          const mostChangedFiles = await githubServiceWithToken.getMostChangedFiles(owner, repo, 10);
          // 4. Analyze repository structure
          const structureAnalysis = await geminiService.analyzeRepositoryStructure({
            repositoryInfo: repoInfoLocal,
            structure: repoStructure,
            mostChangedFiles
          });
          setAnalysisData({
            ...currentData,
            structureAnalysis
          });
          break;
        case "criticalPaths":
          // Need supporting data for context
          if (!currentData.structureAnalysis) throw new Error("Structure data missing");
          const critPaths = await geminiService.identifyCriticalCodePaths({
            mostChangedFiles: currentData.structureAnalysis.mostChangedFiles || [],
            fileContents: [],
            codeAnalysis: currentData.codeAnalysis || {},
            role
          });
          setAnalysisData({
            ...currentData,
            criticalPathsAnalysis: critPaths
          });
          break;
        case "dependencies":
          if (!currentData.codeAnalysis) throw new Error("Code analysis missing");
          const dependencyGraph = await geminiService.generateDependencyGraph({
            codeAnalysis: currentData.codeAnalysis.dependencies,
            repositoryStructure: currentData.structureAnalysis?.repoStructure
          });
          setAnalysisData({
            ...currentData,
            dependencyGraphAnalysis: dependencyGraph
          });
          break;
        case "ast":
          // This block assumes a code analysis step exists
          if (!currentData.structureAnalysis || !currentData.structureAnalysis.mostChangedFiles) {
            throw new Error("Structure data missing");
          }
          // Only fetch content of the most changed files
          const { owner: ownerAst, repo: repoAst } = parsedRepo;
          const githubTokenAst = await RepositoryAnalysisService.getGitHubToken();
          const githubServiceAst = githubTokenAst ? new GitHubService(githubTokenAst) : githubService;
          const fileContents = [];
          for (const file of currentData.structureAnalysis.mostChangedFiles.slice(0, 5)) {
            try {
              const content = await githubServiceAst.getFileContent(ownerAst, repoAst, file.filename);
              fileContents.push({
                path: file.filename,
                content,
                changeFrequency: file.count
              });
            } catch (err) {}
          }
          const codeAnalysis = await codeAnalysisService.analyzeCode(fileContents);
          setAnalysisData({
            ...currentData,
            codeAnalysis
          });
          break;
        case "tutorials":
          if (!currentData.criticalPathsAnalysis) throw new Error("Critical paths missing");
          const tutorialsAnalysis = await geminiService.createTutorial({
            criticalPaths: currentData.criticalPathsAnalysis.criticalPaths,
            repositoryInfo: repoInfoLocal,
            role
          });
          setAnalysisData({
            ...currentData,
            tutorialsAnalysis
          });
          break;
        default:
          throw new Error("Unknown analysis section");
      }
      updateSectionStatus(sectionName, { loading: false, error: null });
      toast({
        title: `Section "${sectionName}" regenerated`,
        description: "Analysis for this section has been regenerated."
      });
    } catch (error: any) {
      updateSectionStatus(sectionName, { loading: false, error: error?.message || "API error" });
      toast({
        title: "AI API Limit Hit",
        description: error?.message || "The AI API limit was reached. Please try again shortly.",
        variant: "destructive"
      });
    }
  }, [repoUrl, repoInfo, analysisData, updateSectionStatus, toast, role, setAnalysisData]);

  useEffect(() => {
    // Prevent multiple initializations - only run this effect once per URL
    if (analysisInitialized || !repoUrl) return;
    
    const analyzeRepository = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setAnalysisData(null);
        setAnalysisInitialized(true);
        
        console.log("Starting repository analysis for:", repoUrl);
        console.log("Source:", source);

        // Check if we're coming from history
        const isFromHistory = source === "history";
        setLoadingStoredAnalysis(isFromHistory);

        // Try to fetch stored analysis
        let storedAnalysis = null;
        let shouldPerformNewAnalysis = true;
        
        try {
          console.log("Attempting to fetch stored analysis for:", repoUrl);
          storedAnalysis = await RepositoryAnalysisService.getRepositoryAnalysis(repoUrl);
          
          // If we have stored analysis data, use it
          if (storedAnalysis && storedAnalysis.analysis_data) {
            console.log('Using stored analysis data');
            shouldPerformNewAnalysis = false;
            
            // Get GitHub token for private repo access
            const githubToken = await RepositoryAnalysisService.getGitHubToken();
            const githubServiceWithToken = githubToken ? 
              new GitHubService(githubToken) : 
              githubService;
            
            // Parse repository URL
            const parsedRepo = githubService.parseRepoUrl(repoUrl);
            if (!parsedRepo) {
              throw new Error("Invalid repository URL");
            }
            
            const { owner, repo } = parsedRepo;
            console.log(`Parsed repo: ${owner}/${repo}`);
            
            // Get repository information using authenticated GitHub service
            console.log("Fetching repository information...");
            const repoInfo = await githubServiceWithToken.getRepositoryInfo(owner, repo);
            setRepoInfo(repoInfo);
            
            // Set analysis data from database
            if (typeof storedAnalysis.analysis_data === 'object') {
              setAnalysisData(storedAnalysis.analysis_data);
              
              // Set progress indicators to complete
              setAnalysisProgress({
                structure: true,
                criticalPaths: true,
                dependencies: true,
                tutorials: true,
                ast: true
              });
              
              setLoadingStoredAnalysis(false);
              setIsLoading(false);
            }
          }
        } catch (fetchError) {
          console.error("Error fetching stored analysis:", fetchError);
          shouldPerformNewAnalysis = true;
        }
        
        // If we've already loaded stored analysis successfully, exit early
        if (!shouldPerformNewAnalysis) {
          return;
        }
        
        setLoadingStoredAnalysis(false);
        
        // Otherwise perform a new analysis
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

        // Get GitHub token for private repo access
        const githubToken = await RepositoryAnalysisService.getGitHubToken();
        const githubServiceWithToken = githubToken ? 
          new GitHubService(githubToken) : 
          githubService;
        
        // 1. Get repository information
        console.log("Fetching repository information...");
        const repoInfo = await githubServiceWithToken.getRepositoryInfo(owner, repo);
        setRepoInfo(repoInfo);
        console.log("Repository info fetched:", repoInfo.name);
        
        // 2. Get repository structure
        console.log("Fetching repository structure...");
        updateSectionStatus("structure", { loading: true, error: null });
        const repoStructure = await githubServiceWithToken.getRepositoryStructure(owner, repo);
        console.log("Repository structure fetched", repoStructure);
        
        // 3. Get most changed files
        console.log("Fetching most changed files...");
        const mostChangedFiles = await githubServiceWithToken.getMostChangedFiles(owner, repo, 10);
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
        setAnalysisData(prev => ({ ...prev, structureAnalysis, structureAnalysisMostChangedFiles: mostChangedFiles, structureAnalysisRepoStructure: repoStructure }));
        updateSectionStatus("structure", { loading: false, error: null });
        
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
            const content = await githubServiceWithToken.getFileContent(owner, repo, file.filename);
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
        updateSectionStatus("ast", { loading: true, error: null });
        let codeAnalysis = { dependencies: [], ast: {} };
        try {
          codeAnalysis = await codeAnalysisService.analyzeCode(fileContents);
          console.log("Code analysis complete:", codeAnalysis);
          setAnalysisProgress(prev => ({ ...prev, ast: true }));
          setAnalysisData(prev => ({ ...prev, codeAnalysis }));
          updateSectionStatus("ast", { loading: false, error: null });
        } catch (err) {
          console.error("Error in code analysis:", err);
          updateSectionStatus("ast", { loading: false, error: err?.message || "Code analysis failed" });
        }
        
        // 7. Identify critical code paths
        console.log("Identifying critical code paths...");
        updateSectionStatus("criticalPaths", { loading: true, error: null });
        let criticalPathsAnalysis = null;
        try {
          criticalPathsAnalysis = await geminiService.identifyCriticalCodePaths({
            mostChangedFiles,
            fileContents,
            codeAnalysis,
            role
          });
          console.log("Critical paths identified:", criticalPathsAnalysis);
          setAnalysisProgress(prev => ({ ...prev, criticalPaths: true }));
          setAnalysisData(prev => ({ ...prev, criticalPathsAnalysis }));
          updateSectionStatus("criticalPaths", { loading: false, error: null });
        } catch (err) {
          console.error("Error identifying critical paths:", err);
          updateSectionStatus("criticalPaths", { loading: false, error: err?.message || "Critical paths analysis failed" });
        }
        
        toast({
          title: "Critical Paths Identified",
          description: "Generating dependency graph..."
        });
        
        // 8. Generate dependency graph
        console.log("Generating dependency graph...");
        updateSectionStatus("dependencies", { loading: true, error: null });
        let dependencyGraphAnalysis = null;
        try {
          dependencyGraphAnalysis = await geminiService.generateDependencyGraph({
            codeAnalysis: codeAnalysis.dependencies,
            repositoryStructure: repoStructure
          });
          console.log("Dependency graph generated:", dependencyGraphAnalysis);
          setAnalysisProgress(prev => ({ ...prev, dependencies: true }));
          setAnalysisData(prev => ({ ...prev, dependencyGraphAnalysis }));
          updateSectionStatus("dependencies", { loading: false, error: null });
        } catch (err) {
          console.error("Error generating dependency graph:", err);
          updateSectionStatus("dependencies", { loading: false, error: err?.message || "Dependency graph generation failed" });
        }
        
        toast({
          title: "Dependency Analysis Complete",
          description: "Creating interactive tutorials..."
        });
        
        // 9. Create tutorials based on critical paths
        console.log("Creating tutorials...");
        updateSectionStatus("tutorials", { loading: true, error: null });
        let tutorialsAnalysis = null;
        try {
          tutorialsAnalysis = await geminiService.createTutorial({
            criticalPaths: criticalPathsAnalysis?.criticalPaths || [],
            repositoryInfo: repoInfo,
            role
          });
          console.log("Tutorials created:", tutorialsAnalysis);
          setAnalysisProgress(prev => ({ ...prev, tutorials: true }));
          setAnalysisData(prev => ({ ...prev, tutorialsAnalysis }));
          updateSectionStatus("tutorials", { loading: false, error: null });
        } catch (err) {
          console.error("Error creating tutorials:", err);
          updateSectionStatus("tutorials", { loading: false, error: err?.message || "Tutorial generation failed" });
        }
        
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
        
        // Save analysis to database
        try {
          await RepositoryAnalysisService.saveRepositoryAnalysis(repoUrl, finalAnalysisData);
          console.log("Analysis saved to database");
        } catch (saveError) {
          console.error("Error saving analysis:", saveError);
          // Continue even if saving fails
        }
        
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
        setLoadingStoredAnalysis(false);
        
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
    
    // Only include repoUrl in the dependency array to prevent re-running when other states change
    // Use analysisInitialized to ensure this only runs once per URL
  }, [repoUrl, source, analysisInitialized]);

  // Helper UI for error status + regenerate
  const errorBlock = (section: keyof typeof sectionStatus) => {
    const status = sectionStatus[section];
    if (status.error) {
      return (
        <div className="flex flex-col items-center p-4 border rounded bg-muted my-2">
          <p className="text-red-600 mb-2 text-center">
            <strong>AI API Limit Hit</strong><br/>
            <span className="text-xs">{status.error}</span>
          </p>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => regenerateSection(section)}
            disabled={status.loading}
          >
            {status.loading ? "Regenerating..." : (
              <><RefreshCw className="h-4 w-4 mr-1" /> Regenerate</>
            )}
          </Button>
        </div>
      );
    }
    return null;
  };
  
  if (isLoading) {
    return <LoadingState repo={repoUrl} progress={analysisProgress} isStoredAnalysis={loadingStoredAnalysis} />;
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
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
          <TabsTrigger value="critical-paths">Critical Paths</TabsTrigger>
          <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
          <TabsTrigger value="ast">AST</TabsTrigger>
          <TabsTrigger value="chat">Ask AI</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="architecture">
            {errorBlock("structure")}
            {analysisData && analysisData.structureAnalysis ? (
              <ArchitectureMap data={analysisData.structureAnalysis} />
            ) : (
              !sectionStatus.structure.error && (
                <div className="flex flex-col items-center p-4 border rounded bg-muted my-2">
                  <p className="text-amber-600 mb-2 text-center">
                    <strong>AI API Limit Hit</strong><br/>
                    <span className="text-xs">The AI API limit was reached while generating architecture analysis</span>
                  </p>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => regenerateSection("structure")}
                    disabled={sectionStatus.structure.loading}
                  >
                    {sectionStatus.structure.loading ? "Generating..." : (
                      <><RefreshCw className="h-4 w-4 mr-1" /> Generate Architecture Analysis</>
                    )}
                  </Button>
                </div>
              )
            )}
          </TabsContent>
          
          <TabsContent value="critical-paths">
            {errorBlock("criticalPaths")}
            {analysisData && analysisData.criticalPathsAnalysis ? (
              <CriticalPathsView 
                data={analysisData.criticalPathsAnalysis} 
                role={role} 
              />
            ) : (
              !sectionStatus.criticalPaths.error && (
                <div className="flex flex-col items-center p-4 border rounded bg-muted my-2">
                  <p className="text-amber-600 mb-2 text-center">
                    <strong>AI API Limit Hit</strong><br/>
                    <span className="text-xs">The AI API limit was reached while generating critical paths analysis</span>
                  </p>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => regenerateSection("criticalPaths")}
                    disabled={sectionStatus.criticalPaths.loading}
                  >
                    {sectionStatus.criticalPaths.loading ? "Generating..." : (
                      <><RefreshCw className="h-4 w-4 mr-1" /> Generate Critical Paths</>
                    )}
                  </Button>
                </div>
              )
            )}
          </TabsContent>
          
          <TabsContent value="dependencies">
            {errorBlock("dependencies")}
            {analysisData && analysisData.dependencyGraphAnalysis ? (
              <DependencyGraph 
                data={analysisData.dependencyGraphAnalysis} 
                codeAnalysis={analysisData.codeAnalysis} 
              />
            ) : (
              !sectionStatus.dependencies.error && (
                <div className="flex flex-col items-center p-4 border rounded bg-muted my-2">
                  <p className="text-amber-600 mb-2 text-center">
                    <strong>AI API Limit Hit</strong><br/>
                    <span className="text-xs">The AI API limit was reached while generating dependency graph</span>
                  </p>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => regenerateSection("dependencies")}
                    disabled={sectionStatus.dependencies.loading}
                  >
                    {sectionStatus.dependencies.loading ? "Generating..." : (
                      <><RefreshCw className="h-4 w-4 mr-1" /> Generate Dependency Graph</>
                    )}
                  </Button>
                </div>
              )
            )}
          </TabsContent>

          <TabsContent value="ast">
            {errorBlock("ast")}
            {analysisData && analysisData.codeAnalysis ? (
              <ASTViewer ast={analysisData.codeAnalysis.ast} />
            ) : (
              !sectionStatus.ast.error && (
                <div className="flex flex-col items-center p-4 border rounded bg-muted my-2">
                  <p className="text-amber-600 mb-2 text-center">
                    <strong>AI API Limit Hit</strong><br/>
                    <span className="text-xs">The AI API limit was reached while generating AST analysis</span>
                  </p>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => regenerateSection("ast")}
                    disabled={sectionStatus.ast.loading}
                  >
                    {sectionStatus.ast.loading ? "Generating..." : (
                      <><RefreshCw className="h-4 w-4 mr-1" /> Generate AST Analysis</>
                    )}
                  </Button>
                </div>
              )
            )}
          </TabsContent>
          
          <TabsContent value="chat">
            {analysisData ? (
              <CodebaseChatView 
                codebaseData={{
                  repositoryInfo: repoInfo,
                  codeAnalysis: analysisData.codeAnalysis,
                  criticalPaths: analysisData.criticalPathsAnalysis?.criticalPaths
                }}
                repositoryName={repoInfo.name}
              />
            ) : (
              <div className="flex flex-col items-center p-4 border rounded bg-muted my-2">
                <p className="text-amber-600 mb-2 text-center">
                  <strong>Missing Analysis Data</strong><br/>
                  <span className="text-xs">The analysis data is required to use the chat feature</span>
                </p>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="h-4 w-4 mr-1" /> Reload Analysis
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="documentation">
            {analysisData ? (
              <DocumentationView 
                repositoryInfo={repoInfo}
                codeAnalysis={analysisData.codeAnalysis}
                criticalPaths={analysisData.criticalPathsAnalysis?.criticalPaths}
              />
            ) : (
              <div className="flex flex-col items-center p-4 border rounded bg-muted my-2">
                <p className="text-amber-600 mb-2 text-center">
                  <strong>Missing Analysis Data</strong><br/>
                  <span className="text-xs">The analysis data is required to generate documentation</span>
                </p>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="h-4 w-4 mr-1" /> Reload Analysis
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="tutorials">
            {errorBlock("tutorials")}
            {analysisData && analysisData.tutorialsAnalysis ? (
              <TutorialView 
                data={analysisData.tutorialsAnalysis} 
                role={role} 
              />
            ) : (
              !sectionStatus.tutorials.error && (
                <div className="flex flex-col items-center p-4 border rounded bg-muted my-2">
                  <p className="text-amber-600 mb-2 text-center">
                    <strong>AI API Limit Hit</strong><br/>
                    <span className="text-xs">The AI API limit was reached while generating tutorials</span>
                  </p>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => regenerateSection("tutorials")}
                    disabled={sectionStatus.tutorials.loading}
                  >
                    {sectionStatus.tutorials.loading ? "Generating..." : (
                      <><RefreshCw className="h-4 w-4 mr-1" /> Generate Tutorials</>
                    )}
                  </Button>
                </div>
              )
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default AnalysisPage;
