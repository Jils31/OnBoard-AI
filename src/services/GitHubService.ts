
import { Octokit } from "octokit";

/**
 * Service for interacting with GitHub repositories
 */
export class GitHubService {
  private octokit: Octokit | null = null;
  
  /**
   * Initialize with optional access token for authenticated requests
   */
  constructor(accessToken?: string) {
    if (accessToken) {
      this.octokit = new Octokit({ auth: accessToken });
    } else {
      this.octokit = new Octokit();
    }
  }

  /**
   * Parse a GitHub repository URL to extract owner and repo name
   */
  parseRepoUrl(url: string): { owner: string; repo: string } | null {
    try {
      // Handle various GitHub URL formats
      const githubUrlRegex = /github\.com\/([^/]+)\/([^/]+)/;
      const match = url.match(githubUrlRegex);
      
      if (match && match.length >= 3) {
        // Clean up repo name (remove .git suffix if present)
        let repo = match[2].replace(/\.git$/, "");
        // Remove any trailing slash
        repo = repo.replace(/\/$/, "");
        
        return { owner: match[1], repo };
      }
      
      return null;
    } catch (error) {
      console.error("Error parsing repository URL:", error);
      return null;
    }
  }

  /**
   * Get repository metadata
   */
  async getRepositoryInfo(owner: string, repo: string): Promise<any> {
    try {
      if (!this.octokit) throw new Error("GitHub client not initialized");
      
      const { data } = await this.octokit.rest.repos.get({
        owner,
        repo,
      });
      
      return data;
    } catch (error) {
      console.error("Error getting repository info:", error);
      throw error;
    }
  }

  /**
   * Get repository structure (files and directories)
   */
  async getRepositoryStructure(owner: string, repo: string, path: string = ""): Promise<any> {
    try {
      if (!this.octokit) throw new Error("GitHub client not initialized");
      
      const { data } = await this.octokit.rest.repos.getContent({
        owner,
        repo,
        path,
      });
      
      return Array.isArray(data) ? data : [data];
    } catch (error) {
      console.error("Error getting repository structure:", error);
      throw error;
    }
  }

  /**
   * Get file content from repository
   */
  async getFileContent(owner: string, repo: string, path: string): Promise<string> {
    try {
      if (!this.octokit) throw new Error("GitHub client not initialized");
      
      const { data } = await this.octokit.rest.repos.getContent({
        owner,
        repo,
        path,
      });
      
      if ('content' in data && 'encoding' in data) {
        // Content is base64 encoded
        return Buffer.from(data.content, 'base64').toString();
      }
      
      throw new Error("Received unexpected response format");
    } catch (error) {
      console.error(`Error getting file content for ${path}:`, error);
      throw error;
    }
  }

  /**
   * Get commit history for a file
   */
  async getFileCommitHistory(owner: string, repo: string, path: string): Promise<any> {
    try {
      if (!this.octokit) throw new Error("GitHub client not initialized");
      
      const { data } = await this.octokit.rest.repos.listCommits({
        owner,
        repo,
        path,
      });
      
      return data;
    } catch (error) {
      console.error(`Error getting commit history for ${path}:`, error);
      throw error;
    }
  }

  /**
   * Get most frequently changed files in repository
   */
  async getMostChangedFiles(owner: string, repo: string, limit: number = 10): Promise<any> {
    try {
      if (!this.octokit) throw new Error("GitHub client not initialized");
      
      // Get recent commits
      const { data: commits } = await this.octokit.rest.repos.listCommits({
        owner,
        repo,
        per_page: 100, // Maximum allowed by GitHub API
      });
      
      // Process commits to count file changes
      const fileChangeCount: Record<string, number> = {};
      
      for (const commit of commits) {
        // Get the commit details including changed files
        const { data: commitData } = await this.octokit.rest.repos.getCommit({
          owner,
          repo,
          ref: commit.sha,
        });
        
        // Count each file change
        commitData.files?.forEach(file => {
          const filePath = file.filename;
          fileChangeCount[filePath] = (fileChangeCount[filePath] || 0) + 1;
        });
      }
      
      // Sort files by change count
      const sortedFiles = Object.entries(fileChangeCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([filename, count]) => ({ filename, count }));
        
      return sortedFiles;
    } catch (error) {
      console.error("Error getting most changed files:", error);
      throw error;
    }
  }
}

// Create and export a singleton instance
export const githubService = new GitHubService();
