import { supabase } from '@/integrations/supabase/client';

export class RepositoryAnalysisService {
  static async saveRepositoryAnalysis(
    repositoryUrl: string,
    analysisData: any
  ) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user) {
      console.error('User not authenticated:', userError);
      throw new Error('User not authenticated');
    }

    // Ensure user exists in the profiles table
    const { error: profileError } = await supabase.from('profiles').upsert({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name ?? null,
      avatar_url: user.user_metadata?.avatar_url ?? null,
      github_username: user.user_metadata?.user_name ?? null,
      updated_at: new Date().toISOString(),
    });

    if (profileError) {
      console.error('Failed to upsert user profile:', profileError);
      throw new Error('Failed to upsert user profile');
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
        analysis_data: analysisData,
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
      repo: match[2],
    };
  }
}
