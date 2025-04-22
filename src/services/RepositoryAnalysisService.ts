
import { supabase } from '@/integrations/supabase/client';
import { useSubscription } from '@/hooks/useSubscription';

export class RepositoryAnalysisService {
  static async saveRepositoryAnalysis(
    repositoryUrl: string,
    analysisData: any,
    chatHistory: any[] = []
  ) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const { owner, repo } = this.parseRepoUrl(repositoryUrl);

    // Upsert based on user+repo
    const { data, error } = await supabase
      .from('analyzed_repositories')
      .upsert({
        user_id: user.id,
        repository_owner: owner,
        repository_name: repo,
        repository_url: repositoryUrl,
        last_analyzed_at: new Date().toISOString(),
        analysis_data: analysisData,
        chat_history: chatHistory
      }, { onConflict: ['user_id', 'repository_url'] })
      .select();

    if (error) {
      console.error('Repository analysis save error:', error);
      throw error;
    }

    return data && data[0];
  }

  static async getRepositoryAnalysis(repositoryUrl: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    const { owner, repo } = this.parseRepoUrl(repositoryUrl);

    const { data, error } = await supabase
      .from('analyzed_repositories')
      .select('*')
      .eq('user_id', user.id)
      .eq('repository_owner', owner)
      .eq('repository_name', repo)
      .maybeSingle();

    if (error) {
      console.error('Repository analysis fetch error:', error);
      throw error;
    }
    return data;
  }

  static async updateChatHistory(repositoryUrl: string, chatHistory: any[]) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    const { owner, repo } = this.parseRepoUrl(repositoryUrl);

    const { data, error } = await supabase
      .from('analyzed_repositories')
      .update({ chat_history: chatHistory, updated_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('repository_owner', owner)
      .eq('repository_name', repo)
      .select();

    if (error) throw error;
    return data && data[0];
  }

  static async incrementChatCount(repositoryId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    // Check record; if not exist, create; else increment
    const { data, error } = await supabase
      .from('user_chat_usage')
      .select('*')
      .eq('user_id', user.id)
      .eq('repository_id', repositoryId)
      .maybeSingle();

    if (error) throw error;

    if (data) {
      // Update count
      const { error: updateError } = await supabase
        .from('user_chat_usage')
        .update({ message_count: data.message_count + 1, updated_at: new Date().toISOString() })
        .eq('id', data.id);
      if (updateError) throw updateError;
    } else {
      // Insert new
      const { error: insertError } = await supabase
        .from('user_chat_usage')
        .insert({ user_id: user.id, repository_id: repositoryId, message_count: 1 });
      if (insertError) throw insertError;
    }
  }

  static async getChatCount(repositoryId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    const { data, error } = await supabase
      .from('user_chat_usage')
      .select('message_count')
      .eq('user_id', user.id)
      .eq('repository_id', repositoryId)
      .maybeSingle();
    if (error) throw error;
    return data?.message_count || 0;
  }

  static parseRepoUrl(url: string): { owner: string; repo: string } {
    const githubRegex = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)/;
    const match = url.match(githubRegex);
    if (!match) {
      throw new Error('Invalid GitHub repository URL');
    }
    return { owner: match[1], repo: match[2] };
  }
}

