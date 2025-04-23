
import { supabase } from '@/integrations/supabase/client';
import { useSubscription } from '@/hooks/useSubscription';
import { GitHubService } from '@/services/GitHubService';

export class RepositoryAnalysisService {
  static async saveRepositoryAnalysis(
    repositoryUrl: string, 
    analysisData: any
  ) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { owner, repo } = this.parseRepoUrl(repositoryUrl);

    const { data, error } = await supabase
      .from('analyzed_repositories')
      .insert({
        user_id: user.id,
        repository_owner: owner,
        repository_name: repo,
        repository_url: repositoryUrl,
        last_analyzed_at: new Date().toISOString(),
        analysis_data: analysisData
      })
      .select();

    if (error) {
      console.error('Repository analysis save error:', error);
      throw error;
    }

    return data;
  }

  static parseRepoUrl(url: string): { owner: string; repo: string } {
    const githubRegex = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)/;
    const match = url.match(githubRegex);
    
    if (!match) {
      throw new Error('Invalid GitHub repository URL');
    }

    return { 
      owner: match[1], 
      repo: match[2] 
    };
  }

  static async getGitHubToken() {
    // First try to get token from session
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.provider_token) {
      return session.provider_token;
    }
    
    // Then try to get stored token from localStorage
    const storedToken = localStorage.getItem('github_token');
    if (storedToken) {
      return storedToken;
    }
    
    return null;
  }
}
