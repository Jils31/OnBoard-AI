import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { githubService, GitHubService } from "@/services/GitHubService";
import { AlertCircle, Loader, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { useSubscription } from "@/hooks/useSubscription";
// import { SubscriptionAlert } from "@/components/SubscriptionAlert";
import { RepositoryAnalysisService } from "@/services/RepositoryAnalysisService";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useGitHubToken } from "@/hooks/useGitHubToken";

interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  private: boolean;
  owner: {
    login: string;
  };
  updated_at: string;
}

const RepositoryForm = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [role, setRole] = useState("full-stack");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);
  const [userRepos, setUserRepos] = useState<GithubRepo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>("");
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [githubToken, setGithubToken] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useAuth();

  // const subscription = useSubscription();
  const subscription = true;
  const isGitHubTokenValid = useGitHubToken();

  // Fetch GitHub token and repositories on component mount
  useEffect(() => {
    if (!isGitHubTokenValid) {
      setGithubToken(null);
      setUserRepos([]);
    } else if (session?.provider_token) {
      setGithubToken(session.provider_token);
      fetchUserRepositories(session.provider_token);
    }
  }, [isGitHubTokenValid, session]);

  const fetchUserRepositories = async (token: string) => {
    setIsLoadingRepos(true);
    setConnectError(null);

    try {
      // Create a GitHub service instance with the user's token
      const githubServiceWithToken = GitHubService.withToken(token);
      const repos = await githubServiceWithToken.getUserRepositories();

      setUserRepos(repos);
    } catch (error) {
      console.error("Error fetching user repositories:", error);
      setConnectError(
        "Failed to fetch your GitHub repositories. Please try again."
      );

      toast({
        title: "GitHub Error",
        description:
          "Failed to fetch your repositories. Please reconnect your GitHub account.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingRepos(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let repositoryUrl = repoUrl;

    // If a repo is selected from dropdown, use that instead of URL input
    if (selectedRepo && userRepos.length > 0) {
      const selected = userRepos.find(
        (repo) => repo.full_name === selectedRepo
      );
      if (selected) {
        repositoryUrl = selected.html_url;
      }
    }

    if (!repositoryUrl) {
      toast({
        title: "Missing Repository URL",
        description:
          "Please enter a valid GitHub repository URL or select one from your repositories.",
        variant: "destructive",
      });
      return;
    }

    // Validate subscription
    if (!subscription) {
      toast({
        title: "Authentication Required",
        description: "Please log in to analyze repositories.",
        variant: "destructive",
      });
      return;
    }

    // if (subscription.analysisCounts >= subscription.analysisLimit) {
    //   toast({
    //     title: "Analysis Limit Reached",
    //     description:
    //       "You have reached your monthly analysis limit. Please upgrade your plan.",
    //     variant: "destructive",
    //   });
    //   return;
    // }

    setIsAnalyzing(true);
    setConnectError(null);

    try {
      // Validate the repository URL
      const parsedRepo = githubService.parseRepoUrl(repositoryUrl);
      if (!parsedRepo) {
        throw new Error(
          "Invalid GitHub repository URL. Please use a URL like https://github.com/username/repo"
        );
      }

      const { owner, repo } = parsedRepo;

      // Use authenticated service for accessing private repositories
      let service = githubToken
        ? GitHubService.withToken(githubToken)
        : githubService;

      console.log("Using GitHub token:", !!githubToken);

      // Quick validation check by fetching repo info
      await service.getRepositoryInfo(owner, repo);

      toast({
        title: "Repository Validated",
        description: `Starting analysis for ${owner}/${repo}...`,
      });

      // TODO: Replace with actual analysis data from your analysis service
      const analysisData = {
        // Placeholder for actual analysis result
        repository: repositoryUrl,
        analyzedAt: new Date().toISOString(),
      };

      // Save repository analysis
      await RepositoryAnalysisService.saveRepositoryAnalysis(
        repositoryUrl,
        analysisData
      );

      // Navigate to the analysis page with fresh parameters
      const encodedUrl = encodeURIComponent(repositoryUrl);
      const timestamp = Date.now();
      navigate(`/analysis?repo=${encodedUrl}&role=${role}&t=${timestamp}`);
    } catch (error) {
      console.error("Error validating repository:", error);
      setIsAnalyzing(false);

      let errorMessage = "Failed to validate repository URL";
      if (error instanceof Error) {
        if (error.message.includes("Not Found")) {
          errorMessage =
            "Repository not found. If this is a private repository, please ensure you've connected your GitHub account and have access to it.";
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: "Repository Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleConnectGitHub = async () => {
    try {
      const redirectUrl =
        window.location.hostname === "localhost"
          ? "http://localhost:5173/auth/callback" // your local callback route
          : "https://on-board-ai.vercel.app/auth/callback"; // deployed callback route

      const scopes =
        import.meta.env.VITE_GITHUB_OAUTH_SCOPES || "repo read:user user:email";

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          scopes,
          redirectTo: redirectUrl,
          queryParams: {
            prompt: "consent", // Always show consent screen
          },
        },
      });

      if (error) throw error;
    } catch (error) {
      setConnectError("Failed to connect to GitHub. Please try again.");
      toast({
        title: "Connection Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to connect to GitHub",
        variant: "destructive",
      });
    }
  };

  const handleRefreshRepos = () => {
    if (githubToken) {
      fetchUserRepositories(githubToken);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* {subscription && (
        <SubscriptionAlert
          currentPlan={subscription.plan_type}
          analysisCounts={subscription.analysisCounts}
          analysisLimit={subscription.analysisLimit}
        />
      )} */}

      <Tabs defaultValue={githubToken ? "repos" : "url"} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="url">GitHub URL</TabsTrigger>
          <TabsTrigger value="repos">
            {githubToken ? "My Repositories" : "Connect GitHub"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="url" className="space-y-4">
          <div className="flex items-center space-x-2">
            <GitHubLogoIcon className="h-5 w-5" />
            <Input
              placeholder="Paste GitHub repository URL (e.g., https://github.com/username/repo)"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="flex-1"
            />
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            Enter the full URL of a public GitHub repository to analyze its
            architecture and code patterns.
          </div>
        </TabsContent>

        <TabsContent value="repos" className="space-y-4">
          {!githubToken ? (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-6 text-center">
              <GitHubLogoIcon className="h-8 w-8 mx-auto mb-2" />
              <h3 className="text-lg font-medium mb-2">
                Connect GitHub Repository
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Authorize Onboarding Buddy to access your GitHub repositories
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleConnectGitHub}
                type="button"
              >
                <GitHubLogoIcon className="mr-2 h-4 w-4" />
                Connect to GitHub
              </Button>
              {connectError && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Connection Error</AlertTitle>
                  <AlertDescription>{connectError}</AlertDescription>
                </Alert>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  Your GitHub Repositories
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshRepos}
                  disabled={isLoadingRepos}
                  type="button"
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${
                      isLoadingRepos ? "animate-spin" : ""
                    }`}
                  />
                  Refresh
                </Button>
              </div>

              {isLoadingRepos ? (
                <div className="flex justify-center py-8">
                  <Loader className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : userRepos.length > 0 ? (
                <div className="max-h-64 overflow-y-auto border rounded-md">
                  <div className="divide-y">
                    {userRepos.map((repo) => (
                      <div
                        key={repo.id}
                        className={`p-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${
                          selectedRepo === repo.full_name
                            ? "bg-gray-100 dark:bg-gray-800"
                            : ""
                        }`}
                        onClick={() => setSelectedRepo(repo.full_name)}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            checked={selectedRepo === repo.full_name}
                            readOnly
                            className="w-4 h-4 text-blue-600"
                          />
                          <div>
                            <p className="font-medium">{repo.name}</p>
                            <p className="text-xs text-gray-500">
                              {repo.owner.login}/{repo.name}
                            </p>
                          </div>
                          <div>
                            {repo.private ? (
                              <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                                Private
                              </span>
                            ) : (
                              <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-1 rounded">
                                Public
                              </span>
                            )}
                          </div>
                        </div>
                        {repo.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {repo.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Updated{" "}
                          {new Date(repo.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 border rounded-md">
                  <p className="text-gray-500">No repositories found</p>
                  <p className="text-sm text-gray-400 mt-1">
                    We couldn't find any repositories in your GitHub account.
                  </p>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Button
        type="submit"
        className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
        disabled={(!repoUrl && !selectedRepo) || isAnalyzing || !subscription}
      >
        {isAnalyzing ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Validating Repository...
          </>
        ) : (
          "Analyze Repository"
        )}
      </Button>
    </form>
  );
};

export default RepositoryForm;
