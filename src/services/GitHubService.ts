
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
        // Remove any query parameters
        repo = repo.split("?")[0];
        
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
   * Recursively retrieves the full directory structure
   */
  async getRepositoryStructure(owner: string, repo: string, path: string = "", maxDepth: number = 3): Promise<any> {
    try {
      if (!this.octokit) throw new Error("GitHub client not initialized");
      
      const { data } = await this.octokit.rest.repos.getContent({
        owner,
        repo,
        path,
      });
      
      // If it's a single file, return it as an array for consistency
      const contents = Array.isArray(data) ? data : [data];
      
      // For directories, recursively get their contents (up to maxDepth)
      if (maxDepth > 0) {
        const result = [];
        
        for (const item of contents) {
          if (item.type === 'dir') {
            try {
              // Skip common directories we don't need to analyze deeply
              if (['node_modules', '.git', 'dist', 'build', 'coverage'].includes(item.name)) {
                result.push({
                  ...item,
                  children: [{ name: '...', path: `${item.path}/...`, type: 'summary' }]
                });
              } else {
                // Recursively get the contents of this directory
                const children = await this.getRepositoryStructure(
                  owner, 
                  repo, 
                  item.path, 
                  maxDepth - 1
                );
                result.push({ ...item, children });
              }
            } catch (err) {
              // If there's an error getting the contents of this directory, just add it without children
              result.push(item);
            }
          } else {
            // For files, just add them as is
            result.push(item);
          }
        }
        
        return result;
      }
      
      return contents;
    } catch (error) {
      console.error(`Error getting repository structure for ${path}:`, error);
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
        // Use atob to decode base64 content instead of Buffer
        if (data.encoding === 'base64') {
          return atob(data.content.replace(/\n/g, ''));
        }
        return data.content;
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
  async getFileCommitHistory(owner: string, repo: string, path: string, maxCommits: number = 50): Promise<any> {
    try {
      if (!this.octokit) throw new Error("GitHub client not initialized");
      
      const { data } = await this.octokit.rest.repos.listCommits({
        owner,
        repo,
        path,
        per_page: maxCommits
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
      
      // Get recent commits (up to 100)
      const { data: commits } = await this.octokit.rest.repos.listCommits({
        owner,
        repo,
        per_page: 100, // Maximum allowed by GitHub API
      });
      
      // Process commits to count file changes
      const fileChangeCount: Record<string, number> = {};
      const commitPromises: Promise<any>[] = [];
      
      // To avoid rate limiting, we'll process only recent commits (max 30)
      const recentCommits = commits.slice(0, 30);
      
      // For each commit, get the details including changed files
      for (const commit of recentCommits) {
        const commitPromise = this.octokit.rest.repos.getCommit({
          owner,
          repo,
          ref: commit.sha,
        }).then(({ data }) => {
          // Count each file change
          data.files?.forEach(file => {
            const filePath = file.filename;
            fileChangeCount[filePath] = (fileChangeCount[filePath] || 0) + 1;
          });
        }).catch(err => {
          console.error(`Error processing commit ${commit.sha}:`, err);
        });
        
        commitPromises.push(commitPromise);
      }
      
      // Wait for all commit processing to complete
      await Promise.allSettled(commitPromises);
      
      // Filter out common files that are less interesting for analysis
      const filteredFiles = Object.entries(fileChangeCount).filter(([filename]) => {
        // Exclude common files like package-lock.json, yarn.lock, etc.
        const excludePatterns = [
          /package-lock\.json$/,
          /yarn\.lock$/,
          /\.gitignore$/,
          /\.env$/,
          /\.DS_Store$/,
          /node_modules\//,
          /dist\//,
          /build\//,
          /\.lock$/
        ];
        
        return !excludePatterns.some(pattern => pattern.test(filename));
      });
      
      // Sort files by change count
      const sortedFiles = filteredFiles
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([filename, count]) => ({ filename, count }));
        
      return sortedFiles;
    } catch (error) {
      console.error("Error getting most changed files:", error);
      throw error;
    }
  }
  
  /**
   * Get repository contributors
   */
  async getRepositoryContributors(owner: string, repo: string): Promise<any> {
    try {
      if (!this.octokit) throw new Error("GitHub client not initialized");
      
      const { data } = await this.octokit.rest.repos.listContributors({
        owner,
        repo,
        per_page: 10 // Limit to top contributors
      });
      
      return data;
    } catch (error) {
      console.error("Error getting repository contributors:", error);
      throw error;
    }
  }
  
  /**
   * Get repository languages
   */
  async getRepositoryLanguages(owner: string, repo: string): Promise<any> {
    try {
      if (!this.octokit) throw new Error("GitHub client not initialized");
      
      const { data } = await this.octokit.rest.repos.listLanguages({
        owner,
        repo
      });
      
      return data;
    } catch (error) {
      console.error("Error getting repository languages:", error);
      throw error;
    }
  }
}

// Create and export a singleton instance
export const githubService = new GitHubService();
