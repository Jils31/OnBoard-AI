
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, ChevronRight, Lightbulb, Bookmark } from "lucide-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

interface TutorialViewProps {
  data: any;
  role: string;
}

const TutorialView = ({ data, role }: TutorialViewProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  // Use mock data if real data is not available yet
  const tutorial = data || {
    title: "Authentication Workflow",
    overview: "This tutorial walks through the authentication flow in the application, covering login, session management, and protected routes.",
    prerequisites: [
      "Basic understanding of React hooks",
      "Familiarity with context API",
      "Understanding of JWT authentication"
    ],
    steps: [
      {
        title: "Setting up Authentication Context",
        description: "First, we'll explore how the authentication context is set up to manage user state across the application. This provides a centralized way to handle authentication state.",
        codeExample: `import React, { createContext, useReducer, useContext } from 'react';

// Initial state for auth context
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

// Create the auth context
export const AuthContext = createContext(initialState);

// Auth reducer to handle state changes
function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false
      };
    // More cases...
    default:
      return state;
  }
}

// Auth provider component
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  
  // Provide the context value
  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for using auth context
export function useAuth() {
  return useContext(AuthContext);
}`,
        explanation: "This code establishes the authentication context using React's Context API and useReducer hook. It creates a central store for user authentication state and provides a way to update it through dispatched actions. The useAuth custom hook makes it easy to access this context from any component."
      },
      {
        title: "Implementing Login Functionality",
        description: "Next, we'll see how the login functionality is implemented using the authentication service and context.",
        codeExample: `import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/authService';

function LoginForm() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { dispatch } = useAuth();
  
  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Call authentication service
      const response = await login(credentials);
      
      // Store token in localStorage
      localStorage.setItem('token', response.token);
      
      // Update auth context
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: response.user
      });
    } catch (err) {
      setError(err.message || 'Failed to login');
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: err.message
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Form JSX...
}`,
        explanation: "The login form component manages its own local state for the form inputs while also interacting with the global authentication context. When a user submits their credentials, the component calls the authentication service, stores the returned JWT token in localStorage for persistence, and updates the auth context with the user information. Error handling ensures users get feedback if something goes wrong."
      },
      {
        title: "Creating Protected Routes",
        description: "Now we'll see how to create protected routes that require authentication.",
        codeExample: `import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Component that renders children only if user is authenticated
function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  
  // Show loading indicator while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Render the protected content
  return <Outlet />;
}

// Usage in router
/*
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route element={<ProtectedRoute />}>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/profile" element={<Profile />} />
  </Route>
</Routes>
*/`,
        explanation: "The ProtectedRoute component serves as a wrapper that checks if a user is authenticated before rendering protected content. It uses the useAuth hook to access the authentication state from the context. If the user isn't authenticated, they're redirected to the login page. This component works with React Router's nested routes using the Outlet component to render the child routes when authentication is successful."
      },
      {
        title: "Authentication Service Implementation",
        description: "Finally, let's look at the authentication service that handles API calls.",
        codeExample: `import axios from 'axios';

const API_URL = '/api/auth';

// Create axios instance with defaults
const authClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
authClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

// Login user
export const login = async (credentials) => {
  try {
    const response = await authClient.post('/login', credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

// Register user
export const register = async (userData) => {
  try {
    const response = await authClient.post('/register', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const response = await authClient.get('/me');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user');
  }
};`,
        explanation: "The authentication service provides an abstraction layer for all API calls related to authentication. It uses axios for HTTP requests and includes interceptors to automatically add the JWT token to requests when available. The service handles login, registration, logout, and fetching the current user's data, while also providing appropriate error handling."
      }
    ],
    additionalNotes: "This authentication flow follows best practices for React applications. The separation of concerns between the AuthContext (state management), AuthService (API calls), and components ensures the code is maintainable and testable. For production applications, consider adding token refresh functionality and more robust error handling."
  };
  
  const handleNextStep = () => {
    if (currentStep < tutorial.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      // Scroll to top when changing steps
      window.scrollTo(0, 0);
    }
  };
  
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Scroll to top when changing steps
      window.scrollTo(0, 0);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card className="border-blue-100 dark:border-blue-900">
        <CardHeader>
          <CardTitle className="text-2xl">{tutorial.title}</CardTitle>
          <CardDescription>
            Interactive tutorial for {role} developers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="font-medium mb-2">Overview</h3>
            <p className="text-gray-700 dark:text-gray-300">{tutorial.overview}</p>
            
            <h3 className="font-medium mt-4 mb-2">Prerequisites</h3>
            <ul className="list-disc pl-5 space-y-1">
              {tutorial.prerequisites.map((prereq, index) => (
                <li key={index} className="text-gray-700 dark:text-gray-300">{prereq}</li>
              ))}
            </ul>
          </div>
          
          <Separator className="my-6" />
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 h-8 w-8 rounded-full flex items-center justify-center font-medium mr-3">
                {currentStep + 1}
              </div>
              <div>
                <h2 className="font-bold text-lg">{tutorial.steps[currentStep].title}</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Step {currentStep + 1} of {tutorial.steps.length}
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevStep}
                disabled={currentStep === 0}
                className="mr-2"
              >
                Previous
              </Button>
              <Button
                size="sm"
                onClick={handleNextStep}
                disabled={currentStep === tutorial.steps.length - 1}
              >
                Next
              </Button>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                {tutorial.steps[currentStep].description}
              </p>
            </div>
            
            <div className="border rounded-md overflow-hidden">
              <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b">
                <div className="flex justify-between items-center">
                  <div className="font-medium">Code Example</div>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    {tutorial.steps[currentStep].title}
                  </Badge>
                </div>
              </div>
              <SyntaxHighlighter
                language="javascript"
                style={docco}
                className="rounded-b-md max-h-96"
                showLineNumbers
              >
                {tutorial.steps[currentStep].codeExample}
              </SyntaxHighlighter>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-md p-4">
              <div className="flex">
                <Lightbulb className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium mb-2 text-blue-700 dark:text-blue-300">Explanation</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {tutorial.steps[currentStep].explanation}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePrevStep}
                disabled={currentStep === 0}
              >
                Previous Step
              </Button>
              <Button
                onClick={handleNextStep}
                disabled={currentStep === tutorial.steps.length - 1}
              >
                Next Step {currentStep < tutorial.steps.length - 1 && <ChevronRight className="ml-1 h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          {currentStep === tutorial.steps.length - 1 && (
            <div className="mt-8 bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800 rounded-md p-4">
              <div className="flex">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium mb-2 text-green-700 dark:text-green-300">Tutorial Complete!</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    You've completed this tutorial on {tutorial.title}. Here are some additional notes:
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {tutorial.additionalNotes}
                  </p>
                  <Button variant="outline" className="mt-4">
                    <Bookmark className="mr-2 h-4 w-4" />
                    Save for Reference
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TutorialView;
