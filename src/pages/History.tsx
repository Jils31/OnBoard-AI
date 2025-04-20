
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Search, GitBranch, Calendar, ExternalLink } from "lucide-react";

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
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const filteredRepositories = repositories.filter(repo => {
    const searchLower = searchQuery.toLowerCase();
    return (
      repo.repository_name.toLowerCase().includes(searchLower) ||
      repo.repository_owner.toLowerCase().includes(searchLower) ||
      repo.repository_url.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Analysis History</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            View and access all your previously analyzed repositories
          </p>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Search repositories..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Analyzed Repositories</CardTitle>
          <CardDescription>
            {repositories.length} total repositories analyzed
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">Loading repository history...</div>
          ) : repositories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl font-medium mb-2">No repositories analyzed yet</p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                When you analyze repositories, they will appear here
              </p>
              <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
            </div>
          ) : filteredRepositories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg font-medium">No matching repositories found</p>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Try adjusting your search query
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Repository</th>
                    <th className="text-left py-3 px-4 hidden md:table-cell">Owner</th>
                    <th className="text-left py-3 px-4 hidden lg:table-cell">Analyzed Date</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRepositories.map((repo) => (
                    <tr key={repo.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <GitBranch className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="font-medium">{repo.repository_name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell text-gray-600 dark:text-gray-300">
                        {repo.repository_owner}
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell text-gray-600 dark:text-gray-300">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          {formatDate(repo.last_analyzed_at)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => window.open(repo.repository_url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Source
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => navigate(`/analysis?repo=${encodeURIComponent(repo.repository_url)}&t=${Date.now()}`)}
                          >
                            View Analysis
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default History;
