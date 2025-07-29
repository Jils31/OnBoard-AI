import React from "react";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const { toast } = useToast();

  const handleGitHubSignIn = async () => {
    try {
      const redirectUrl = new URL(
        "/auth/callback",
        window.location.origin
      ).toString();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          scopes: "repo read:user user:email",
          redirectTo: redirectUrl,
        },
      });
      if (error) {
        toast({
          title: "GitHub Sign In Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side: background image and permissions at the bottom */}
      <div
        className="hidden md:flex flex-col justify-between w-1/2 bg-cover bg-center p-10"
        style={{
          backgroundImage: "url(./mohammad-rahmani-DwDZ5mgwhsc-unsplash.jpg)",
        }}
      >
        <div className="flex-1" />
        <div>
          <h2 className="text-white text-2xl font-bold mb-8 drop-shadow-lg">
            This app will be able to:
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white/20 backdrop-blur-md rounded-lg p-4 text-white shadow-md shadow-white/10">
              <div className="text-xl mb-2">⚡</div>
              <div className="font-semibold">Instant Repo Summaries</div>
              <div className="text-sm opacity-80">
                Get the big picture in minutes
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-md rounded-lg p-4 text-white shadow">
              <div className="text-xl mb-2">🧭</div>
              <div className="font-semibold">Codebase Navigation</div>
              <div className="text-sm opacity-80">
                Understand structure and flow effortlessly
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-lg p-4 text-white shadow">
              <div className="text-xl mb-2">🤖</div>
              <div className="font-semibold">AI-Powered Insights</div>
              <div className="text-sm opacity-80">
                Highlights key files, logic, and roles
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-lg p-4 text-white shadow">
              <div className="text-xl mb-2">📄</div>
              <div className="font-semibold">Smart Docs & FAQs</div>
              <div className="text-sm opacity-80">
                Auto-generate onboarding docs & answers
              </div>
            </div>
          </div>
          <div className="text-white text-xs opacity-80">
            &copy; {new Date().getFullYear()} OnBoard AI
          </div>
        </div>
      </div>
      {/* Right side: login form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white dark:bg-gray-900 px-8 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">OnBoard AI</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Sign in to analyze repositories and accelerate your development
            </p>
          </div>
          <Button
            onClick={handleGitHubSignIn}
            className="w-full gap-2 text-lg py-6 rounded-full bg-black text-white hover:bg-gray-800"
          >
            <GithubIcon className="h-6 w-6" />
            Continue with GitHub
          </Button>
          <div className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
            By continuing, you agree to emergent{" "}
            <a href="#" className="underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline">
              Privacy Policy
            </a>
            .
          </div>
          <div className="flex flex-col items-center mt-8">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>LOG IN SECURED BY GITHUB OAUTH</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
