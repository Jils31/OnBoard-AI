
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GitHubLogoIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { FileText, Clock, PlusCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { SubscriptionAlert } from "@/components/SubscriptionAlert";
import RepositoryForm from "@/components/RepositoryForm";

interface AnalyzedRepo {
  id: string;
  repository_name: string;
  repository_owner: string;
  repository_url: string;
  last_analyzed_at: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const subscription = useSubscription();
  const navigate = useNavigate();
  const [recentRepos, setRecentRepos] = useState<AnalyzedRepo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentAnalyses = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('analyzed_repositories')
          .select('*')
          .eq('user_id', user.id)
          .order('last_analyzed_at', { ascending: false })
          .limit(5);
          
        if (error) throw error;
        
        setRecentRepos(data || []);
      } catch (error) {
        console.error('Error fetching analyzed repositories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentAnalyses();
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl mt-24">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Analyze repositories and manage your onboarding tools
          </p>
        </div>
        
        {subscription && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border">
            <p className="text-sm font-medium mb-1">
              Current Plan: <span className="font-bold capitalize">{subscription.plan_type}</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {subscription.analysisCounts} / {subscription.analysisLimit} analyses used this month
            </p>
            {subscription.plan_type === 'free' && (
              <Link to="/pricing">
                <Button variant="outline" size="sm" className="mt-2">
                  Upgrade Plan
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
      
      {subscription && (
        <SubscriptionAlert 
          currentPlan={subscription.plan_type} 
          analysisCounts={subscription.analysisCounts} 
          analysisLimit={subscription.analysisLimit}
        />
      )}
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Analyze New Repository</CardTitle>
              <CardDescription>
                Enter a GitHub repository URL to start analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RepositoryForm />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Analyses</CardTitle>
                <CardDescription>
                  Your recently analyzed repositories
                </CardDescription>
              </div>
              <Link to="/history">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading recent analyses...</div>
              ) : recentRepos.length === 0 ? (
                <div className="text-center py-8">
                  <p>No repository analyses found</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Start by analyzing your first repository
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentRepos.map((repo) => (
                    <div 
                      key={repo.id} 
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      onClick={() => navigate(`/analysis?repo=${encodeURIComponent(repo.repository_url)}&t=${Date.now()}`)}
                    >
                      <div className="flex items-center">
                        <GitHubLogoIcon className="h-5 w-5 mr-3" />
                        <div>
                          <p className="font-medium">
                            {repo.repository_owner}/{repo.repository_name}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            Analyzed {formatDate(repo.last_analyzed_at)}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              {subscription ? (
                <div>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-500">Current Plan</p>
                    <p className="text-2xl font-bold capitalize">{subscription.plan_type}</p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-500">Usage This Month</p>
                    <div className="mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ 
                            width: `${(subscription.analysisCounts / subscription.analysisLimit) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <p className="text-sm mt-1">
                        {subscription.analysisCounts} of {subscription.analysisLimit} analyses used
                      </p>
                    </div>
                  </div>
                  
                  {subscription.plan_type === 'free' ? (
                    <Link to="/pricing">
                      <Button className="w-full">
                        Upgrade Plan
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="outline" className="w-full" onClick={async () => {
                      try {
                        const response = await fetch('/api/customer-portal', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
                          }
                        });
                        const { url } = await response.json();
                        if (url) window.location.href = url;
                      } catch (error) {
                        console.error('Error opening customer portal:', error);
                      }
                    }}>
                      Manage Subscription
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p>Loading subscription info...</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link to="/pricing">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Pricing Plans
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link to="/history">
                    <Clock className="h-4 w-4 mr-2" />
                    Analysis History
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href="https://github.com/features/copilot" target="_blank" rel="noopener noreferrer">
                    <GitHubLogoIcon className="h-4 w-4 mr-2" />
                    GitHub Integration
                    <ExternalLinkIcon className="h-3 w-3 ml-auto" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
