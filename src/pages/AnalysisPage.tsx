import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, FileCode, GitBranch, GitPullRequest } from "lucide-react";
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

const FALLBACK_ARCHITECTURE_PATTERN = "Modern Web Application Architecture";
const FALLBACK_CRITICAL_PATHS = [
  {
    name: "Core Application Flow",
    description: "The main application workflow that users interact with",
    importance: 9,
    files: ["src/App.tsx", "src/main.tsx", "src/pages/Index.tsx"],
    dataFlow: ["User accesses application", "App initializes", "Main functionality loads"]
  }
];
const FALLBACK_DEPENDENCY_GRAPH_LABEL = "App"; // from GeminiService fallback nodes
const FALLBACK_TUTORIAL_OVERVIEW_FRAGMENT = "introduction to the"; // starts with "This tutorial provides an introduction..."

const isArchitectureFallback = (structureAnalysis: any) => {
  return (
    structureAnalysis &&
    structureAnalysis.architecture &&
    structureAnalysis.architecture.pattern === FALLBACK_ARCHITECTURE_PATTERN
  );
};
const isCriticalPathsFallback = (criticalPathsAnalysis: any) => {
  return (
    criticalPathsAnalysis &&
    Array.isArray(criticalPathsAnalysis.criticalPaths) &&
    criticalPathsAnalysis.criticalPaths.length > 0 &&
    criticalPathsAnalysis.criticalPaths[0].name === FALLBACK_CRITICAL_PATHS[0].name
  );
};
const isDependencyGraphFallback = (dependencyGraphAnalysis: any) => {
  return (
    dependencyGraphAnalysis &&
    dependencyGraphAnalysis.dependencyGraph &&
    Array.isArray(dependencyGraphAnalysis.dependencyGraph.nodes) &&
    dependencyGraphAnalysis.dependencyGraph.nodes.length > 0 &&
    dependencyGraphAnalysis.dependencyGraph.nodes[0].label === FALLBACK_DEPENDENCY_GRAPH_LABEL
  );
};
// AST fallback: not needed (just won't show), Tutorials fallback:
const isTutorialsFallback = (tutorialsAnalysis: any) => {
  return (
    tutorialsAnalysis &&
    typeof tutorialsAnalysis.overview === "string" &&
    tutorialsAnalysis.overview.toLowerCase().includes(FALLBACK_TUTORIAL_OVERVIEW_FRAGMENT)
  );
};
// Documentation fallback: check for "Project Documentation" title
const isDocumentationFallback = (doc: any) => {
  return doc && typeof doc.title === "string" && doc.title.startsWith("Project Documentation");
};

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
    tutorials: false,
    ast: false
  });

  const [regenerating, setRegenerating] = useState({
    structure: false,
    criticalPaths: false,
    dependencies: false,
    documentation: false,
    tutorials: false,
  });

  // --- Add regenerate handlers ---
  // Each calls the relevant analysis step only
  const regenerateSection = async (section: string) => {
    setRegenerating(r => ({ ...r, [section]: true }));
    try {
      const parsedRepo = githubService.parseRepoUrl(repoUrl);
      const { owner, repo } = parsedRepo;
      const githubToken = await RepositoryAnalysisService.getGitHubToken();
      const githubServiceWithToken = githubToken
        ? new GitHubService(githubToken)
        : githubService;
      const repoInfoValue = repoInfo || (await githubServiceWithToken.getRepositoryInfo(owner, repo));
      // Only skip refetching repo info if already exists

      if (section === "structure") {
        // Redo only structureAnalysis and refresh UI
        const repoStructure = await githubServiceWithToken.getRepositoryStructure(owner, repo);
        const mostChangedFiles = await githubServiceWithToken.getMostChangedFiles(owner, repo, 10);
        const structureAnalysis = await geminiService.analyzeRepositoryStructure({
          repositoryInfo: repoInfoValue,
          structure: repoStructure,
          mostChangedFiles
        });
        setAnalysisData((ad: any) => ad
          ? { ...ad, structureAnalysis }
          : { structureAnalysis }
        );
      }
      if (section === "criticalPaths") {
        // Need mostChangedFiles and fileContents
        const mostChangedFiles = await githubServiceWithToken.getMostChangedFiles(owner, repo, 10);
        // reuse getting file contents logic
        const fileContents = [];
        for (const file of mostChangedFiles.slice(0, 5)) {
          try {
            const content = await githubServiceWithToken.getFileContent(owner, repo, file.filename);
            fileContents.push({
              path: file.filename,
              content,
              changeFrequency: file.count
            });
          } catch {}
        }
        const codeAnalysis = analysisData?.codeAnalysis
          ? analysisData.codeAnalysis
          : await codeAnalysisService.analyzeCode(fileContents);
        const criticalPathsAnalysis = await geminiService.identifyCriticalCodePaths({
          mostChangedFiles,
          fileContents,
          codeAnalysis,
          role
        });
        setAnalysisData((ad: any) => ad
          ? { ...ad, criticalPathsAnalysis }
          : { criticalPathsAnalysis }
        );
      }
      if (section === "dependencies") {
        // reuse codeAnalysis and repoStructure if present
        const codeAnalysis = analysisData?.codeAnalysis || {};
        const repoStructure = analysisData?.structureAnalysis?.repoStructure || [];
        const dependencyGraphAnalysis = await geminiService.generateDependencyGraph({
          codeAnalysis: codeAnalysis.dependencies,
          repositoryStructure: repoStructure
        });
        setAnalysisData((ad: any) => ad
          ? { ...ad, dependencyGraphAnalysis }
          : { dependencyGraphAnalysis }
        );
      }
      if (section === "documentation") {
        const doc = await geminiService.generateDocumentation({
          repositoryInfo: repoInfoValue,
          codeAnalysis: analysisData?.codeAnalysis,
          criticalPaths: analysisData?.criticalPathsAnalysis?.criticalPaths
        });
        setAnalysisData((ad: any) => ad
          ? { ...ad, documentation: doc }
          : { documentation: doc }
        );
      }
      if (section === "tutorials") {
        const tutorialsAnalysis = await geminiService.createTutorial({
          criticalPaths: analysisData?.criticalPathsAnalysis?.criticalPaths,
          repositoryInfo: repoInfoValue,
          role
        });
        setAnalysisData((ad: any) => ad
          ? { ...ad, tutorialsAnalysis }
          : { tutorialsAnalysis }
        );
      }
      toast({
        title: "Regeneration Complete",
        description: `The ${section} section was regenerated.`
      });
    } catch (error) {
      toast({
        title: `Error regenerating ${section}`,
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setRegenerating(r => ({ ...r, [section]: false }));
    }
  };
  
  useEffect(() => {
    const analyzeRepository = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setAnalysisData(null); // Reset any previous analysis data
        
        console.log("Starting repository analysis for:", repoUrl);

        // First, try to fetch stored analysis from database
        const { data: storedAnalysis, error: fetchError } = await supabase
          .from('analyzed_repositories')
          .select('*')
          .eq('repository_url', repoUrl)
          .order('last_analyzed_at', { ascending: false })
          .limit(1);

        if (fetchError) {
          console.error('Error fetching stored analysis:', fetchError);
        }

        // If we have stored analysis data, use it
        if (storedAnalysis && storedAnalysis.length > 0 && storedAnalysis[0].analysis_data) {
          console.log('Using stored analysis data');
          const analysisFromDb = storedAnalysis[0].analysis_data;
          
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
          if (typeof analysisFromDb === 'object') {
            setAnalysisData(analysisFromDb);
            
            // Set progress indicators to complete
            setAnalysisProgress({
              structure: true,
              criticalPaths: true,
              dependencies: true,
              tutorials: true,
              ast: true
            });
            
            setIsLoading(false);
            return;
          }
        }
        
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
        let codeAnalysis = { dependencies: [], ast: {} };
        try {
          codeAnalysis = await codeAnalysisService.analyzeCode(fileContents);
          console.log("Code analysis complete:", codeAnalysis);
          setAnalysisProgress(prev => ({ ...prev, ast: true }));
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
            {analysisData ? (
              isArchitectureFallback(analysisData.structureAnalysis) ? (
                <div className="flex flex-col items-center justify-center min-h-40 border rounded-md bg-muted/40 py-8">
                  <p className="mb-2 text-lg text-destructive font-medium">AI hit API limit for system architecture!</p>
                  <Button
                    onClick={() => regenerateSection("structure")}
                    disabled={regenerating.structure}
                  >
                    {regenerating.structure ? "Regenerating..." : "Regenerate Architecture"}
                  </Button>
                  <p className="mt-2 text-muted-foreground text-sm">
                    Try again in a few minutes to generate real insights.
                  </p>
                </div>
              ) : (
                <ArchitectureMap data={analysisData.structureAnalysis} />
              )
            ) : (
              <div className="space-y-4">
                <div className="h-64 w-full bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse"></div>
                <div className="h-32 w-full bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse"></div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="critical-paths">
            {analysisData ? (
              isCriticalPathsFallback(analysisData.criticalPathsAnalysis) ? (
                <div className="flex flex-col items-center justify-center min-h-40 border rounded-md bg-muted/40 py-8">
                  <p className="mb-2 text-lg text-destructive font-medium">AI hit API limit for critical paths!</p>
                  <Button
                    onClick={() => regenerateSection("criticalPaths")}
                    disabled={regenerating.criticalPaths}
                  >
                    {regenerating.criticalPaths ? "Regenerating..." : "Regenerate Critical Paths"}
                  </Button>
                  <p className="mt-2 text-muted-foreground text-sm">
                    Try again in a few minutes to generate real insights.
                  </p>
                </div>
              ) : (
                <CriticalPathsView 
                  data={analysisData.criticalPathsAnalysis} 
                  role={role} 
                />
              )
            ) : (
              <div className="space-y-4">
                <div className="h-64 w-full bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse"></div>
                <div className="h-32 w-full bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse"></div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="dependencies">
            {analysisData ? (
              isDependencyGraphFallback(analysisData.dependencyGraphAnalysis) ? (
                <div className="flex flex-col items-center justify-center min-h-40 border rounded-md bg-muted/40 py-8">
                  <p className="mb-2 text-lg text-destructive font-medium">AI hit API limit for dependency graph!</p>
                  <Button
                    onClick={() => regenerateSection("dependencies")}
                    disabled={regenerating.dependencies}
                  >
                    {regenerating.dependencies ? "Regenerating..." : "Regenerate Dependency Graph"}
                  </Button>
                  <p className="mt-2 text-muted-foreground text-sm">
                    Try again in a few minutes to generate real insights.
                  </p>
                </div>
              ) : (
                <DependencyGraph 
                  data={analysisData.dependencyGraphAnalysis} 
                  codeAnalysis={analysisData.codeAnalysis} 
                />
              )
            ) : (
              <div className="space-y-4">
                <div className="h-64 w-full bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse"></div>
                <div className="h-32 w-full bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse"></div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="ast">
            {analysisData && analysisData.codeAnalysis ? (
              <ASTViewer ast={analysisData.codeAnalysis.ast} />
            ) : (
              <div className="space-y-4">
                <div className="h-64 w-full bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse"></div>
                <div className="h-32 w-full bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse"></div>
              </div>
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
              <div className="space-y-4">
                <div className="h-64 w-full bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse"></div>
                <div className="h-32 w-full bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse"></div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="documentation">
            {analysisData && analysisData.documentation ? (
              isDocumentationFallback(analysisData.documentation) ? (
                <div className="flex flex-col items-center justify-center min-h-40 border rounded-md bg-muted/40 py-8">
                  <p className="mb-2 text-lg text-destructive font-medium">AI hit API limit for documentation!</p>
                  <Button
                    onClick={() => regenerateSection("documentation")}
                    disabled={regenerating.documentation}
                  >
                    {regenerating.documentation ? "Regenerating..." : "Regenerate Documentation"}
                  </Button>
                  <p className="mt-2 text-muted-foreground text-sm">
                    Try again in a few minutes to generate real documentation.
                  </p>
                </div>
              ) : (
                <DocumentationView
                  repositoryInfo={repoInfo}
                  codeAnalysis={analysisData.codeAnalysis}
                  criticalPaths={analysisData.criticalPathsAnalysis?.criticalPaths}
                />
              )
            ) : (
              <div className="space-y-4">
                <div className="h-64 w-full bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse"></div>
                <div className="h-32 w-full bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse"></div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="tutorials">
            {analysisData ? (
              isTutorialsFallback(analysisData.tutorialsAnalysis) ? (
                <div className="flex flex-col items-center justify-center min-h-40 border rounded-md bg-muted/40 py-8">
                  <p className="mb-2 text-lg text-destructive font-medium">AI hit API limit for tutorials!</p>
                  <Button
                    onClick={() => regenerateSection("tutorials")}
                    disabled={regenerating.tutorials}
                  >
                    {regenerating.tutorials ? "Regenerating..." : "Regenerate Tutorials"}
                  </Button>
                  <p className="mt-2 text-muted-foreground text-sm">
                    Try again in a few minutes to generate real tutorials.
                  </p>
                </div>
              ) : (
                <TutorialView 
                  data={analysisData.tutorialsAnalysis} 
                  role={role} 
                />
              )
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
