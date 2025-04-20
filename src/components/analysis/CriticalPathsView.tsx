
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, ArrowRight, Code, GitCommit, FileCode } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

interface CriticalPathsViewProps {
  data: any;
  role: string;
}

const CriticalPathsView = ({ data, role }: CriticalPathsViewProps) => {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  
  // Use mock data if real data is not available yet
  const criticalPaths = data?.criticalPaths || [
    {
      name: "Authentication Flow",
      description: "Core user authentication process",
      importance: 9,
      files: [
        "src/services/auth.ts",
        "src/hooks/useAuth.tsx",
        "src/components/LoginForm.tsx"
      ],
      dataFlow: ["User credentials → Auth service → JWT token → User session"]
    },
    {
      name: "Data Fetching",
      description: "Primary data retrieval and state management",
      importance: 8,
      files: [
        "src/services/api.ts",
        "src/hooks/useFetch.tsx",
        "src/context/DataContext.tsx"
      ],
      dataFlow: ["API request → Data transformation → Context update → UI rendering"]
    },
    {
      name: "Form Processing",
      description: "Core business logic for form submissions",
      importance: 7,
      files: [
        "src/utils/validation.ts",
        "src/hooks/useForm.tsx",
        "src/components/Form.tsx"
      ],
      dataFlow: ["Form input → Validation → API submission → Response handling"]
    }
  ];
  
  const frequentlyChangedFiles = data?.frequentlyChangedFiles || [
    { filename: "src/components/App.tsx", count: 42 },
    { filename: "src/services/api.ts", count: 38 },
    { filename: "src/context/AppContext.tsx", count: 31 },
    { filename: "src/components/Dashboard.tsx", count: 27 },
    { filename: "src/utils/helpers.ts", count: 22 }
  ];
  
  const keyBusinessLogic = data?.keyBusinessLogic || [
    "User authentication and session management",
    "Data fetching and caching strategy",
    "Form validation and submission workflows",
    "Error handling and notification system"
  ];
  
  // Sample code for demonstration
  const sampleCode = {
    "Authentication Flow": `import { useState } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      localStorage.setItem('token', response.token);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // More authentication methods...
  
  return { user, loading, error, login };
}`,
    "Data Fetching": `import { useState, useEffect } from 'react';
import api from '../services/api';

export function useFetch(endpoint, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        const response = await api.get(endpoint, options);
        if (isMounted) {
          setData(response.data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };
    
    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [endpoint]);
  
  return { data, loading, error };
}`,
    "Form Processing": `import { useState } from 'react';
import { validate } from '../utils/validation';

export function useForm(initialValues, validationSchema) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };
  
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    
    const validationErrors = validate(values, validationSchema);
    setErrors(validationErrors);
  };
  
  const handleSubmit = async (callback) => {
    setIsSubmitting(true);
    
    const validationErrors = validate(values, validationSchema);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      await callback(values);
    }
    
    setIsSubmitting(false);
  };
  
  return { 
    values, 
    errors, 
    touched, 
    isSubmitting, 
    handleChange, 
    handleBlur, 
    handleSubmit 
  };
}`
  };
  
  return (
    <div className="space-y-6">
      <Card className="border-purple-100 dark:border-purple-900">
        <CardHeader>
          <CardTitle className="text-2xl">Critical Code Paths</CardTitle>
          <CardDescription>
            The most important code flows to understand for {role} developers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {criticalPaths.map((path, index) => (
              <Card 
                key={index} 
                className={`cursor-pointer hover:shadow-md transition-all ${selectedPath === path.name ? 'border-purple-500 shadow-md' : 'border-gray-200'}`}
                onClick={() => setSelectedPath(path.name)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{path.name}</CardTitle>
                    <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                      {path.importance}/10
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {path.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-2">Key files:</p>
                  <ul className="text-sm space-y-1">
                    {path.files.slice(0, 2).map((file, i) => (
                      <li key={i} className="truncate">
                        <FileCode className="h-3 w-3 inline mr-1" />
                        {file}
                      </li>
                    ))}
                    {path.files.length > 2 && (
                      <li className="text-gray-400">+{path.files.length - 2} more</li>
                    )}
                  </ul>
                  <Button
                    variant="link"
                    className="p-0 h-auto mt-2 text-purple-600 dark:text-purple-400"
                    onClick={() => setSelectedPath(path.name)}
                  >
                    Explore <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {selectedPath && (
            <Card className="border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle>{selectedPath}</CardTitle>
                <CardDescription>
                  {criticalPaths.find(p => p.name === selectedPath)?.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview">
                  <TabsList className="mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="files">Files</TabsTrigger>
                    <TabsTrigger value="code">Sample Code</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Data Flow</h3>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                          <div className="flex items-center">
                            {criticalPaths
                              .find(p => p.name === selectedPath)
                              ?.dataFlow[0]
                              .split(" → ")
                              .map((step, i, arr) => (
                                <React.Fragment key={i}>
                                  <div className="text-center px-2">
                                    <div className="bg-white dark:bg-gray-700 border rounded-md py-2 px-3">
                                      {step}
                                    </div>
                                  </div>
                                  {i < arr.length - 1 && (
                                    <ArrowRight className="h-4 w-4 text-gray-400" />
                                  )}
                                </React.Fragment>
                              ))}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Why it's important</h3>
                        <p className="text-gray-700 dark:text-gray-300">
                          This code path represents core functionality that handles {selectedPath.toLowerCase()}. 
                          Understanding this flow is essential for {role} developers because it shows how data moves 
                          through the application and affects the user experience.
                        </p>
                        <div className="mt-4 flex items-center text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          <p className="text-sm">
                            Changes to these files should be made with caution as they affect multiple parts of the application.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="files">
                    <div className="space-y-4">
                      <Accordion type="single" collapsible className="w-full">
                        {criticalPaths
                          .find(p => p.name === selectedPath)
                          ?.files.map((file, i) => (
                            <AccordionItem key={i} value={`file-${i}`}>
                              <AccordionTrigger>
                                <div className="flex items-center">
                                  <FileCode className="h-4 w-4 mr-2" />
                                  {file}
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-2">
                                  <div className="flex items-center text-sm text-gray-500">
                                    <GitCommit className="h-4 w-4 mr-2" />
                                    Changed 24 times in the last 6 months
                                  </div>
                                  <p className="text-sm">
                                    This file contains key functionality related to {selectedPath.toLowerCase()}.
                                    It handles data processing, validation, and connects to other system components.
                                  </p>
                                  <Button variant="outline" size="sm" className="mt-2">
                                    <Code className="h-4 w-4 mr-2" />
                                    View File Details
                                  </Button>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                      </Accordion>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="code">
                    <div className="border rounded-md">
                      <SyntaxHighlighter 
                        language="javascript" 
                        style={docco}
                        className="rounded-md max-h-96 overflow-auto"
                      >
                        {sampleCode[selectedPath as keyof typeof sampleCode] || '// No sample code available'}
                      </SyntaxHighlighter>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2">Code Explanation</h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        This is a key implementation of the {selectedPath.toLowerCase()} functionality. 
                        It demonstrates how data flows through the application and how different components interact.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Frequently Changed Files</CardTitle>
            <CardDescription>
              Based on git history analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {frequentlyChangedFiles.map((file, index) => (
                <li key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex items-center">
                    <FileCode className="h-4 w-4 mr-2 text-blue-500" />
                    <span className="text-sm truncate max-w-[250px]">{file.filename}</span>
                  </div>
                  <Badge variant="outline">{file.count} changes</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Key Business Logic</CardTitle>
            <CardDescription>
              Core functionality to understand
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {keyBusinessLogic.map((item, index) => (
                <li key={index} className="flex items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-3 text-purple-800 dark:text-purple-300 text-sm font-medium">
                    {index + 1}
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CriticalPathsView;
