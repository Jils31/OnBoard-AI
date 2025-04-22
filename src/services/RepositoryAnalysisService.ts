
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AnalysisData {
  [key: string]: any;
}

export class RepositoryAnalysisService {
  /**
   * Save repository analysis to the database
   * @param repositoryUrl The GitHub repository URL
   * @param analysisData The analysis data to save
   * @returns The saved repository data or null if an error occurred
   */
  static async saveRepositoryAnalysis(repositoryUrl: string, analysisData: AnalysisData) {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be logged in to save repository analysis');
      }
      
      // Parse repository details from URL
      const parsedRepo = this.parseRepositoryUrl(repositoryUrl);
      if (!parsedRepo) {
        throw new Error('Invalid repository URL format');
      }
      
      const { owner, repo } = parsedRepo;
      
      // Check if repository already exists
      const { data: existingRepo, error: findError } = await supabase
        .from('analyzed_repositories')
        .select('id')
        .eq('repository_url', repositoryUrl)
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (findError) {
        console.error('Error checking existing repository:', findError);
        throw findError;
      }
      
      const now = new Date().toISOString();
      
      if (existingRepo) {
        // Update existing repository
        const { data, error } = await supabase
          .from('analyzed_repositories')
          .update({
            last_analyzed_at: now,
            analysis_data: analysisData
          })
          .eq('id', existingRepo.id)
          .select()
          .single();
          
        if (error) throw error;
        return data;
      } else {
        // Insert new repository
        const { data, error } = await supabase
          .from('analyzed_repositories')
          .insert({
            user_id: user.id,
            repository_owner: owner,
            repository_name: repo,
            repository_url: repositoryUrl,
            last_analyzed_at: now,
            analysis_data: analysisData,
            chat_history: []
          })
          .select()
          .single();
          
        if (error) throw error;
        
        // Initialize chat usage tracker
        await supabase
          .from('user_chat_usage')
          .insert({
            user_id: user.id,
            repository_id: data.id,
            message_count: 0
          })
          .select();
          
        return data;
      }
    } catch (error) {
      console.error('Error saving repository analysis:', error);
      toast.error('Failed to save repository analysis');
      return null;
    }
  }
  
  /**
   * Get repository analysis by URL
   * @param repositoryUrl The GitHub repository URL
   * @returns The repository analysis or null if not found
   */
  static async getRepositoryAnalysis(repositoryUrl: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be logged in to retrieve repository analysis');
      }
      
      const { data, error } = await supabase
        .from('analyzed_repositories')
        .select('*')
        .eq('repository_url', repositoryUrl)
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting repository analysis:', error);
      return null;
    }
  }
  
  /**
   * Parse GitHub repository URL to extract owner and repo name
   * @param url The GitHub repository URL
   * @returns The owner and repo name, or null if invalid
   */
  static parseRepositoryUrl(url: string) {
    try {
      // Handle both HTTPS and SSH URLs
      if (url.includes('github.com')) {
        // For HTTPS URLs
        const match = url.match(/github\.com\/([^\/]+)\/([^\/\.]+)/);
        if (match && match.length >= 3) {
          return { owner: match[1], repo: match[2] };
        }
      } else if (url.includes('git@github.com')) {
        // For SSH URLs
        const match = url.match(/git@github\.com:([^\/]+)\/([^\/\.]+)\.git/);
        if (match && match.length >= 3) {
          return { owner: match[1], repo: match[2] };
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error parsing repository URL:', error);
      return null;
    }
  }
  
  /**
   * Update chat history for a repository
   * @param repositoryUrl The GitHub repository URL
   * @param chatMessages The chat messages to save
   * @returns Success status
   */
  static async updateChatHistory(repositoryUrl: string, chatMessages: any[]) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be logged in to update chat history');
      }
      
      const { error } = await supabase
        .from('analyzed_repositories')
        .update({
          chat_history: chatMessages
        })
        .eq('repository_url', repositoryUrl)
        .eq('user_id', user.id);
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating chat history:', error);
      return false;
    }
  }
  
  /**
   * Get current chat message count for a repository
   * @param repositoryId The repository ID
   * @returns The current message count or 0 if an error occurred
   */
  static async getChatCount(repositoryId: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be logged in to check chat usage');
      }
      
      const { data, error } = await supabase
        .from('user_chat_usage')
        .select('message_count')
        .eq('repository_id', repositoryId)
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (error) throw error;
      
      return data ? data.message_count : 0;
    } catch (error) {
      console.error('Error getting chat message count:', error);
      return 0;
    }
  }
  
  /**
   * Increment chat message count for a user and repository
   * @param repositoryId The repository ID
   * @returns The updated message count or null if an error occurred
   */
  static async incrementChatMessageCount(repositoryId: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be logged in to update chat usage');
      }
      
      // Check if usage record exists
      const { data: existingUsage, error: findError } = await supabase
        .from('user_chat_usage')
        .select('*')
        .eq('repository_id', repositoryId)
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (findError) throw findError;
      
      if (existingUsage) {
        // Update existing usage record
        const { data, error } = await supabase
          .from('user_chat_usage')
          .update({
            message_count: existingUsage.message_count + 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingUsage.id)
          .select()
          .single();
          
        if (error) throw error;
        return data.message_count;
      } else {
        // Create new usage record
        const { data, error } = await supabase
          .from('user_chat_usage')
          .insert({
            user_id: user.id,
            repository_id: repositoryId,
            message_count: 1
          })
          .select()
          .single();
          
        if (error) throw error;
        return data.message_count;
      }
    } catch (error) {
      console.error('Error incrementing chat message count:', error);
      return null;
    }
  }
  
  /**
   * Check if a user has reached their message limit for a repository
   * @param repositoryId The repository ID
   * @param userPlan The user's subscription plan
   * @returns Boolean indicating if the limit has been reached
   */
  static async hasReachedMessageLimit(repositoryId: string, userPlan: string) {
    try {
      // If user has premium plan, they have no limit
      if (userPlan === 'premium' || userPlan === 'unlimited') {
        return false;
      }
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be logged in to check message limit');
      }
      
      const { data, error } = await supabase
        .from('user_chat_usage')
        .select('message_count')
        .eq('repository_id', repositoryId)
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (error) throw error;
      
      // Free users are limited to 5 messages per repository
      const FREE_USER_MESSAGE_LIMIT = 5;
      return data && data.message_count >= FREE_USER_MESSAGE_LIMIT;
    } catch (error) {
      console.error('Error checking message limit:', error);
      return true; // Fail safe: assume limit is reached if there's an error
    }
  }
  
  /**
   * Alternative name for incrementChatMessageCount to match the function call in the component
   */
  static async incrementChatCount(repositoryId: string) {
    return this.incrementChatMessageCount(repositoryId);
  }
}
