
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Search, GitBranch, Calendar, ExternalLink, ArrowRight, Clock, TrendingUp, Star, Activity, Zap, Users, FolderOpen } from "lucide-react";

interface AnalyzedRepo {
  id: string;
  repository_name: string;
  repository_owner: string;
  repository_url: string;
  last_analyzed_at: string;
}

const History = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [repositories, setRepositories] = useState<AnalyzedRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    const fetchAnalyzedRepositories = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('analyzed_repositories')
          .select('*')
          .eq('user_id', user.id)
          .order('last_analyzed_at', { ascending: false });
          
        if (error) throw error;
        
        setRepositories(data || []);
      } catch (error) {
        console.error('Error fetching analyzed repositories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyzedRepositories();
  }, [user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      });
    }
  };

  // Generate monthly analysis data for the chart
  const getMonthlyAnalysisData = () => {
    const months = [];
    const data = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      months.push(monthName);
      
      // Count repositories analyzed in this month
      const monthCount = repositories.filter(repo => {
        const repoDate = new Date(repo.last_analyzed_at);
        return repoDate.getMonth() === date.getMonth() && repoDate.getFullYear() === date.getFullYear();
      }).length;
      
      data.push(monthCount);
    }
    
    return { months, data };
  };

  // Get top repositories by analysis frequency
  const getTopRepositories = () => {
    const repoCounts = repositories.reduce((acc, repo) => {
      const key = `${repo.repository_owner}/${repo.repository_name}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(repoCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([repo, count]) => ({ repo, count }));
  };

  // Get recent activity (last 5 analyses)
  const getRecentActivity = () => {
    return repositories.slice(0, 5);
  };

  const { months, data } = getMonthlyAnalysisData();
  const maxValue = Math.max(...data, 1);
  const topRepositories = getTopRepositories();
  const recentActivity = getRecentActivity();
  
  const filteredRepositories = repositories.filter(repo => {
    const searchLower = searchQuery.toLowerCase();
    return (
      repo.repository_name.toLowerCase().includes(searchLower) ||
      repo.repository_owner.toLowerCase().includes(searchLower) ||
      repo.repository_url.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-24">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span>Dashboard</span>
            <ArrowRight className="h-3 w-3" />
            <span className="text-gray-900 dark:text-gray-100 font-medium">History</span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Analysis History
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {repositories.length} repositories analyzed
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search repositories..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-80 border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500"
                />
              </div>
              <Button 
                onClick={() => navigate('/dashboard')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Zap className="h-4 w-4 mr-2" />
                New Analysis
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Repository List */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 animate-pulse">
                    <div className="flex items-center justify-between">
                      <div className="space-y-3 flex-1">
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                      </div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : repositories.length === 0 ? (
              <Card className="border-gray-200 dark:border-gray-800">
                <CardContent className="p-12 text-center">
                  <div className="max-w-sm mx-auto">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <GitBranch className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      No repositories analyzed yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Start by analyzing your first repository to see it here
                    </p>
                    <Button 
                      onClick={() => navigate('/dashboard')}
                      className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200"
                    >
                      Go to Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : filteredRepositories.length === 0 ? (
              <Card className="border-gray-200 dark:border-gray-800">
                <CardContent className="p-12 text-center">
                  <div className="max-w-sm mx-auto">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      No matching repositories
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Try adjusting your search query
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredRepositories.map((repo, index) => (
                  <div 
                    key={repo.id} 
                    className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                          <GitBranch className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                            {repo.repository_name}
                          </h3>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              @{repo.repository_owner}
                            </span>
                            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                              <Clock className="h-3 w-3" />
                              <span>{formatDate(repo.last_analyzed_at)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => window.open(repo.repository_url, '_blank')}
                          className="border-gray-200 dark:border-gray-700"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Source
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => navigate(`/analysis?repo=${encodeURIComponent(repo.repository_url)}&t=${Date.now()}`)}
                          className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200"
                        >
                          View Analysis
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Stats and Charts */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Analyzed</span>
                  </div>
                  <span className="font-semibold">{repositories.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Unique Owners</span>
                  </div>
                  <span className="font-semibold">
                    {new Set(repositories.map(r => r.repository_owner)).size}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">This Month</span>
                  </div>
                  <span className="font-semibold">
                    {repositories.filter(repo => {
                      const date = new Date(repo.last_analyzed_at);
                      const now = new Date();
                      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                    }).length}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Chart */}
            <Card className="border-gray-200 dark:border-gray-800">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">Monthly Activity</CardTitle>
                </div>
                <CardDescription>
                  Analysis trends over 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-end justify-between gap-1">
                  {data.map((value, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        {value}
                      </div>
                      <div 
                        className="w-full bg-blue-600 dark:bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-700 dark:hover:bg-blue-600"
                        style={{ 
                          height: `${(value / maxValue) * 120}px`,
                          minHeight: value > 0 ? '4px' : '0px'
                        }}
                      />
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {months[index]}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Repositories */}
            <Card className="border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Top Repositories
                </CardTitle>
                <CardDescription>
                  Most frequently analyzed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topRepositories.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {item.repo}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {item.count} times
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-500" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Latest analyses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((repo, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {repo.repository_name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(repo.last_analyzed_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
