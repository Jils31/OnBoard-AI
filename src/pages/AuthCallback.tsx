import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import LoadingState from '@/components/LoadingState';
import { githubService } from '@/services/GitHubService';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (data?.session) {
          const { provider_token, expires_in } = data.session;
          
          if (provider_token) {
            // Store token with expiry
            const expiryTime = new Date().getTime() + (expires_in || 3600) * 1000;
            localStorage.setItem('github_token', provider_token);
            localStorage.setItem('github_token_expiry', expiryTime.toString());
            
            // Refresh GitHubService instance
            githubService.refreshToken(provider_token);
            
            toast({
              title: "Authentication successful",
              description: "Successfully connected to GitHub",
            });
          } else {
            throw new Error("No GitHub access token received");
          }
          
          navigate('/');
        } else {
          throw new Error("No session found");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        toast({
          title: "Authentication failed",
          description: error instanceof Error ? error.message : "Failed to connect to GitHub",
          variant: "destructive"
        });
        navigate('/auth');
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingState message="Completing authentication..." />
    </div>
  );
};

export default AuthCallback;
