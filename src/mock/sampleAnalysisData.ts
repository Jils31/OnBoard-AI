
// Sample data for development and demo purposes

export const sampleRepoInfo = {
  name: "react-dashboard-app",
  description: "A modern React dashboard application with authentication and data visualization",
  language: "JavaScript",
  default_branch: "main",
  open_issues_count: 12,
  stargazers_count: 45,
  forks_count: 12,
  license: {
    key: "mit",
    name: "MIT License"
  }
};

export const sampleAnalysisData = {
  structureAnalysis: {
    architecture: {
      pattern: "Feature-based Architecture with React",
      description: "This application uses a feature-based architecture where code is organized by feature rather than by type. It combines React hooks with context for state management and follows a service-based approach for API interactions.",
      mainComponents: ["React Components", "Context Providers", "API Services", "Utility Functions"]
    },
    systemMap: {
      nodes: [
        { id: "n1", label: "UI Layer", type: "container" },
        { id: "n2", label: "State Management", type: "container" },
        { id: "n3", label: "API Layer", type: "container" },
        { id: "n4", label: "Auth", type: "service" },
        { id: "n5", label: "Components", type: "group", parent: "n1" },
        { id: "n6", label: "Hooks", type: "group", parent: "n1" },
        { id: "n7", label: "Context", type: "group", parent: "n2" },
        { id: "n8", label: "Services", type: "group", parent: "n3" }
      ],
      connections: [
        { from: "n1", to: "n2", label: "Consumes" },
        { from: "n2", to: "n3", label: "Calls" },
        { from: "n5", to: "n6", label: "Uses" },
        { from: "n7", to: "n8", label: "Uses" }
      ]
    },
    criticalComponents: [
      "Authentication Context",
      "Data Fetching Services",
      "Dashboard Components",
      "Form Validation Utilities"
    ]
  },
  
  criticalPathsAnalysis: {
    criticalPaths: [
      {
        name: "Authentication Flow",
        description: "Core user authentication process",
        importance: 9,
        files: [
          "src/context/AuthContext.js",
          "src/services/authService.js",
          "src/components/Auth/LoginForm.js",
          "src/routes/ProtectedRoute.js"
        ],
        dataFlow: ["User Credentials → Auth Service → JWT Token → Auth Context → Protected Routes"]
      },
      {
        name: "Data Fetching Pattern",
        description: "Main pattern for retrieving and displaying data",
        importance: 8,
        files: [
          "src/hooks/useFetch.js",
          "src/services/api.js",
          "src/context/DataContext.js",
          "src/components/Dashboard/DashboardStats.js"
        ],
        dataFlow: ["API Service → Custom Hook → Component State → UI Rendering"]
      },
      {
        name: "Form Submission Logic",
        description: "How forms are validated and submitted",
        importance: 7,
        files: [
          "src/utils/validation.js",
          "src/hooks/useForm.js",
          "src/components/Common/Form.js",
          "src/services/formSubmissionService.js"
        ],
        dataFlow: ["Form Input → Validation → Form Hook → API Submission → Response Handling"]
      }
    ],
    frequentlyChangedFiles: [
      { filename: "src/components/Dashboard/Dashboard.js", count: 42 },
      { filename: "src/context/AuthContext.js", count: 38 },
      { filename: "src/services/api.js", count: 35 },
      { filename: "src/hooks/useFetch.js", count: 31 },
      { filename: "src/components/Auth/LoginForm.js", count: 28 }
    ],
    keyBusinessLogic: [
      "User authentication and authorization flow",
      "Data fetching and caching strategy",
      "Dashboard metrics calculation",
      "Form validation and submission"
    ]
  },
  
  dependencyGraphAnalysis: {
    dependencyGraph: {
      nodes: [
        { id: "n1", label: "App", type: "component" },
        { id: "n2", label: "AuthContext", type: "context" },
        { id: "n3", label: "AuthService", type: "service" },
        { id: "n4", label: "ApiService", type: "service" },
        { id: "n5", label: "Dashboard", type: "component" },
        { id: "n6", label: "DataContext", type: "context" },
        { id: "n7", label: "useFetch", type: "hook" },
        { id: "n8", label: "Utils", type: "utility" }
      ],
      edges: [
        { source: "n1", target: "n2" },
        { source: "n1", target: "n5" },
        { source: "n2", target: "n3" },
        { source: "n3", target: "n4" },
        { source: "n5", target: "n6" },
        { source: "n6", target: "n4" },
        { source: "n5", target: "n7" },
        { source: "n7", target: "n4" },
        { source: "n4", target: "n8" },
        { source: "n6", target: "n8" },
        { source: "n7", target: "n6" }
      ]
    },
    circularDependencies: [
      ["DataContext", "useFetch", "DataContext"],
      ["ApiService", "Utils", "ApiService"]
    ],
    recommendations: [
      "Extract shared logic between DataContext and useFetch to break circular dependency",
      "Move utility functions used by ApiService to a separate module",
      "Consider implementing a more explicit dependency injection pattern",
      "Split the Dashboard component into smaller, more focused components"
    ]
  },
  
  tutorialsAnalysis: {
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
  },
  
  codeAnalysis: {
    modules: [
      { path: "src/App.js", name: "App.js", type: "component" },
      { path: "src/context/AuthContext.js", name: "AuthContext.js", type: "context" },
      { path: "src/services/authService.js", name: "authService.js", type: "service" },
      { path: "src/hooks/useFetch.js", name: "useFetch.js", type: "hook" }
    ],
    dependencies: [
      { source: "src/App.js", targets: ["react", "react-router-dom", "src/context/AuthContext"] },
      { source: "src/context/AuthContext.js", targets: ["react", "src/services/authService"] },
      { source: "src/services/authService.js", targets: ["axios", "src/utils/helpers"] }
    ],
    patterns: [
      { path: "src/App.js", patterns: ["ReactComponent"] },
      { path: "src/context/AuthContext.js", patterns: ["ContextPattern"] },
      { path: "src/hooks/useFetch.js", patterns: ["CustomHook"] }
    ],
    complexity: {
      "src/App.js": { lines: 120, functions: 5, classes: 1, conditionals: 8, loops: 3, cognitiveComplexity: 18 },
      "src/context/AuthContext.js": { lines: 80, functions: 3, classes: 0, conditionals: 6, loops: 1, cognitiveComplexity: 10 }
    }
  }
};
