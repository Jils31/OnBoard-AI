
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";

const RepositoryForm = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [role, setRole] = useState("full-stack");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl) return;
    
    setIsAnalyzing(true);
    
    try {
      // This would be replaced with actual repository validation and analysis
      // For now, we'll just simulate the process and navigate to results
      setTimeout(() => {
        const encodedUrl = encodeURIComponent(repoUrl);
        navigate(`/analysis?repo=${encodedUrl}&role=${role}`);
      }, 1000);
    } catch (error) {
      console.error("Error analyzing repository:", error);
      setIsAnalyzing(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="url" className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="url">GitHub URL</TabsTrigger>
          <TabsTrigger value="connect">Connect Repository</TabsTrigger>
        </TabsList>
        
        <TabsContent value="url" className="space-y-4">
          <div className="flex items-center space-x-2">
            <GitHubLogoIcon className="h-5 w-5" />
            <Input 
              placeholder="Paste GitHub repository URL (e.g., https://github.com/username/repo)"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="flex-1"
              required
            />
          </div>
        </TabsContent>
        
        <TabsContent value="connect" className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-6 text-center">
            <GitHubLogoIcon className="h-8 w-8 mx-auto mb-2" />
            <h3 className="text-lg font-medium mb-2">Connect GitHub Repository</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Authorize Onboarding Buddy to access your GitHub repositories
            </p>
            <Button variant="outline" className="w-full">
              <GitHubLogoIcon className="mr-2 h-4 w-4" />
              Connect to GitHub
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6">
        <label className="text-sm font-medium mb-2 block">Select Your Role</label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="frontend">Frontend Developer</SelectItem>
            <SelectItem value="backend">Backend Developer</SelectItem>
            <SelectItem value="full-stack">Full Stack Developer</SelectItem>
            <SelectItem value="devops">DevOps Engineer</SelectItem>
            <SelectItem value="mobile">Mobile Developer</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        type="submit" 
        className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
        disabled={!repoUrl || isAnalyzing}
      >
        {isAnalyzing ? "Analyzing..." : "Analyze Repository"}
      </Button>
    </form>
  );
};

export default RepositoryForm;
