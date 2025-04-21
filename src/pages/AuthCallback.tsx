
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import LoadingState from '@/components/LoadingState';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth error:", error);
          toast({
            title: "Authentication error",
            description: error.message,
            variant: "destructive"
          });
          navigate('/auth');
        } else if (data?.session) {
          toast({
            title: "Authentication successful",
            description: "You have been signed in",
          });
          navigate('/');
        } else {
          // No session found, redirect to auth page
          navigate('/auth');
        }
      } catch (err) {
        console.error("Error in auth callback:", err);
        navigate('/auth');
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingState repo="" progress={{
        structure: true,
        criticalPaths: false,
        dependencies: false,
        tutorials: false
      }} />
    </div>
  );
};

export default AuthCallback;
