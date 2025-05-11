import { useState, useEffect } from 'react';
import { githubService } from '@/services/GitHubService';
import { useAuth } from '@/context/AuthContext';

export function useGitHubToken() {
  const [isValid, setIsValid] = useState(false);
  const { session } = useAuth();

  useEffect(() => {
    const validateToken = async () => {
      try {
        const token = localStorage.getItem('github_token');
        const expiry = localStorage.getItem('github_token_expiry');
        
        if (!token || !expiry) {
          setIsValid(false);
          return;
        }

        // Check if token is expired
        if (new Date().getTime() > parseInt(expiry)) {
          githubService.clearToken();
          setIsValid(false);
          return;
        }

        // Verify token with a simple API call
        const service = githubService;
        await service.getUserRepositories(1, 1);
        setIsValid(true);
      } catch (error) {
        console.error('Token validation failed:', error);
        githubService.clearToken();
        setIsValid(false);
      }
    };

    validateToken();
  }, [session]);

  return isValid;
}