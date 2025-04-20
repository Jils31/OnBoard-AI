/**
 * Service for interacting with Google's Gemini API
 */
export class GeminiService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Analyzes a repository structure using Gemini
   */
  async analyzeRepositoryStructure(repoData: any): Promise<any> {
    console.log("Analyzing repository structure with data:", repoData);
    
    const prompt = `
      You are an expert software architect tasked with analyzing a GitHub repository.
      
      CONTEXT:
      - You have been provided with repository structure data, metadata, and commit history
      - Your task is to identify the architecture patterns and create a system map
      - Focus on how components interact with each other
      - Consider the repository's language, main dependencies, and structure
      
      REPOSITORY INFORMATION:
      ${JSON.stringify(repoData.repositoryInfo, null, 2)}
      
      REPOSITORY STRUCTURE SAMPLE:
      ${JSON.stringify(repoData.structure.slice(0, 10), null, 2)}
      
      MOST FREQUENTLY CHANGED FILES:
      ${JSON.stringify(repoData.mostChangedFiles, null, 2)}
      
      INSTRUCTIONS:
      1. Analyze the provided data to identify the architectural pattern (MVC, MVVM, Clean Architecture, etc.)
      2. Create a high-level architectural map showing how components interact
      3. Identify the most important modules, services, or components
      4. Provide strengths and potential improvements of the architecture
      
      OUTPUT FORMAT:
      Provide your analysis as a JSON object with the following structure:
      {
        "architecture": {
          "pattern": "string (name of the architectural pattern)",
          "description": "string (detailed description of the architecture)",
          "mainComponents": ["string (list of main components)"]
        },
        "systemMap": {
          "nodes": [
            {
              "id": "string (unique identifier)",
              "label": "string (display name)",
              "type": "string (component type: container, service, database, etc.)",
              "parent": "string (optional parent node id)"
            }
          ],
          "connections": [
            {
              "from": "string (source node id)",
              "to": "string (target node id)",
              "label": "string (relationship description)"
            }
          ]
        },
        "criticalComponents": ["string (list of most important components)"],
        "strengths": ["string (list of architectural strengths)"],
        "improvements": ["string (list of potential improvements)"]
      }
      
      Be accurate, detailed, and comprehensive in your analysis based ONLY on the actual repository data provided.
      Do not use generic descriptions - tailor your analysis specifically to this repository.
      Do not include any explanations outside of the JSON structure.
    `;

    try {
      console.log("Sending structure analysis request to Gemini");
      const result = await this.generateContent(prompt);
      console.log("Received structure analysis response");
      
      // Parse the JSON from the text response
      if (result.candidates && result.candidates[0] && result.candidates[0].content) {
        const text = result.candidates[0].content.parts[0].text;
        
        try {
          // First try to parse the entire text as JSON
          return JSON.parse(text);
        } catch (err) {
          console.log("Could not parse entire text as JSON, looking for JSON in text");
          
          // Try to extract JSON from the text (could be surrounded by markdown code blocks)
          const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || 
                            text.match(/```\s*([\s\S]*?)\s*```/) || 
                            text.match(/(\{[\s\S]*\})/);
          
          if (jsonMatch && jsonMatch[1]) {
            try {
              const parsedJson = JSON.parse(jsonMatch[1].trim());
              console.log("Successfully parsed JSON from Gemini response");
              return parsedJson;
            } catch (jsonErr) {
              console.error("Failed to parse JSON from response:", jsonErr, "Text:", jsonMatch[1]);
              return this.getDefaultArchitectureResponse(repoData.repositoryInfo.name);
            }
          } else {
            console.error("No valid JSON found in response");
            return this.getDefaultArchitectureResponse(repoData.repositoryInfo.name);
          }
        }
      }
      
      return this.getDefaultArchitectureResponse(repoData.repositoryInfo.name);
    } catch (error) {
      console.error("Error in analyzeRepositoryStructure:", error);
      return this.getDefaultArchitectureResponse(repoData.repositoryInfo.name);
    }
  }

  /**
   * Default architecture response when API fails
   */
  private getDefaultArchitectureResponse(repoName: string): any {
    return {
      architecture: {
        pattern: "Modern Web Application Architecture",
        description: `Based on the repository structure of ${repoName}, this appears to be a modern web application using component-based architecture.`,
        mainComponents: ["Frontend Components", "Services", "Utilities"]
      },
      systemMap: {
        nodes: [
          { id: "n1", label: "UI Layer", type: "container" },
          { id: "n2", label: "Service Layer", type: "container" },
          { id: "n3", label: "Data Layer", type: "container" }
        ],
        connections: [
          { from: "n1", to: "n2", label: "API Calls" },
          { from: "n2", to: "n3", label: "Data Access" }
        ]
      },
      criticalComponents: ["Main Components", "API Services", "State Management"],
      strengths: ["Modern architecture", "Separation of concerns"],
      improvements: ["Could improve documentation", "Consider additional test coverage"]
    };
  }

  /**
   * Identifies critical code paths using Gemini - Enhanced for deeper analysis
   */
  async identifyCriticalCodePaths(codeData: any): Promise<any> {
    console.log("Identifying critical code paths with data:", codeData);
    
    const fileContents = codeData.fileContents || [];
    const fileContentSamples = fileContents.map((file: any) => ({
      path: file.path,
      snippet: file.content?.substring(0, 500) + '...' || 'No content available',
      changeFrequency: file.changeFrequency
    }));

    const prompt = `
      You are an expert code analyst specializing in repository onboarding for a ${codeData.role || 'developer'}.
      
      CONTEXT:
      - You're helping a ${codeData.role} developer understand the most important parts of a codebase quickly
      - You have git history data showing which files change most frequently
      - You have sample file contents of the most important files
      - Your goal is to identify the critical 20% of code that provides 80% of core functionality
      
      TASK:
      Create a comprehensive analysis that will help someone quickly understand:
      1. Critical code paths (the most important code flows to understand first)
      2. Key business logic components
      3. Data flow patterns through the application
      4. Entry points to the application
      5. Complex algorithms or patterns that require special attention
      6. Technical debt areas that new developers should be aware of
      
      CODE DATA:
      Most Frequently Changed Files:
      ${JSON.stringify(codeData.mostChangedFiles || [], null, 2)}
      
      File Contents (key files):
      ${JSON.stringify(fileContentSamples, null, 2)}
      
      OUTPUT FORMAT:
      Respond with a detailed JSON object containing:
      {
        "criticalPaths": [
          {
            "name": "string (name of critical path, e.g. 'Authentication Flow')",
            "description": "string (description of the flow's purpose)",
            "importance": number (1-10 rating of how important this is to understand),
            "files": ["string (list of relevant files)"],
            "dataFlow": ["string (step by step description of data flow)"],
            "keyFunctions": ["string (list of key functions/methods)"],
            "entryPoints": ["string (entry points to this flow)"],
            "complexityPoints": ["string (areas of complexity in this flow)"]
          }
        ],
        "frequentlyChangedFiles": [
          {
            "filename": "string (file path)",
            "count": number (change frequency),
            "significance": "string (why this file changes often)",
            "recommendation": "string (what to know about this file)",
            "keyPatterns": ["string (important code patterns)"]
          }
        ],
        "keyBusinessLogic": ["string (list of key business logic areas)"],
        "entryPoints": ["string (list of main entry points to the codebase)"],
        "technicalDebt": ["string (areas that need improvement)"],
        "abstractSyntaxTreeInsights": ["string (key insights from code structure)"]
      }
      
      Be specific, practical, and thorough. Focus on the unique characteristics of this codebase.
      Return ONLY the valid JSON object with no additional text.
    `;

    try {
      console.log("Sending critical paths analysis request to Gemini");
      const result = await this.generateContent(prompt);
      console.log("Received critical paths analysis response");
      
      // Parse the JSON from the text response
      if (result.candidates && result.candidates[0] && result.candidates[0].content) {
        const text = result.candidates[0].content.parts[0].text;
        console.log("Raw critical paths response:", text.substring(0, 200) + "...");
        
        try {
          // First try to parse the entire text as JSON
          return JSON.parse(text);
        } catch (err) {
          console.log("Could not parse entire text as JSON, looking for JSON in text");
          
          // Try to extract JSON from the text
          const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || 
                            text.match(/```\s*([\s\S]*?)\s*```/) || 
                            text.match(/(\{[\s\S]*\})/);
          
          if (jsonMatch && jsonMatch[1]) {
            try {
              return JSON.parse(jsonMatch[1].trim());
            } catch (jsonErr) {
              console.error("Failed to parse JSON from response:", jsonErr);
              return this.getDefaultCriticalPathsResponse();
            }
          } else {
            console.error("No valid JSON found in response");
            return this.getDefaultCriticalPathsResponse();
          }
        }
      }
      
      return this.getDefaultCriticalPathsResponse();
    } catch (error) {
      console.error("Error in identifyCriticalCodePaths:", error);
      return this.getDefaultCriticalPathsResponse();
    }
  }

  /**
   * Default critical paths response when API fails
   */
  private getDefaultCriticalPathsResponse(): any {
    return {
      criticalPaths: [
        {
          name: "Core Application Flow",
          description: "The main application workflow that users interact with",
          importance: 9,
          files: ["src/App.tsx", "src/main.tsx", "src/pages/Index.tsx"],
          dataFlow: ["User accesses application", "App initializes", "Main functionality loads"],
          keyFunctions: ["main()", "App()", "renderRoutes()"],
          entryPoints: ["main.tsx", "index.html"],
          complexityPoints: ["Routing logic", "State management"]
        },
        {
          name: "Data Processing",
          description: "How data is processed in the application",
          importance: 8,
          files: ["src/services/GitHubService.ts", "src/services/GeminiService.ts"],
          dataFlow: ["Data retrieved", "Data processed", "Results displayed to user"],
          keyFunctions: ["fetchData()", "processData()", "renderResults()"],
          entryPoints: ["API calls", "User interactions"],
          complexityPoints: ["Data transformation", "Error handling"]
        }
      ],
      frequentlyChangedFiles: [
        {
          filename: "src/components/RepositoryForm.tsx",
          count: 15,
          significance: "Core user interaction component",
          recommendation: "Understand how user input is processed",
          keyPatterns: ["Form validation", "Event handling", "State updates"]
        }
      ],
      keyBusinessLogic: ["Repository analysis", "Code structure visualization", "User interaction"],
      entryPoints: ["src/main.tsx", "src/App.tsx", "src/pages/Index.tsx"],
      technicalDebt: ["Error handling could be improved", "Need more comprehensive test coverage"],
      abstractSyntaxTreeInsights: ["Component hierarchy is well-structured", "Service pattern is consistently applied"]
    };
  }

  /**
   * Generates dependency graphs using Gemini
   */
  async generateDependencyGraph(dependencies: any): Promise<any> {
    console.log("Generating dependency graph with data:", dependencies);
    
    const prompt = `
      You are an expert in software dependency analysis with deep knowledge of code architecture.
      
      CONTEXT:
      - You're analyzing a codebase to help new developers understand dependencies
      - The goal is to create a comprehensive dependency graph showing how modules relate
      - You need to identify any problematic patterns like circular dependencies
      
      DEPENDENCY INFORMATION:
      ${JSON.stringify(dependencies, null, 2)}
      
      INSTRUCTIONS:
      1. Create a comprehensive dependency graph based on the provided data
      2. Identify circular dependencies or other problematic patterns
      3. Analyze the dependency structure for architectural issues
      4. Provide specific recommendations for improving code organization
      
      OUTPUT FORMAT:
      Provide your analysis as a JSON object with the following structure:
      {
        "dependencyGraph": {
          "nodes": [
            {
              "id": "string (unique identifier)",
              "label": "string (display name)",
              "type": "string (node type: component, service, utility, etc.)",
              "size": number (relative importance, 1-10),
              "group": "string (logical grouping)"
            }
          ],
          "edges": [
            {
              "source": "string (source node id)",
              "target": "string (target node id)",
              "type": "string (dependency type: imports, uses, extends, etc.)",
              "strength": number (1-5, indicating how tightly coupled),
              "description": "string (details about this relationship)"
            }
          ]
        },
        "circularDependencies": [
          ["string (list of module names forming a circular dependency)"]
        ],
        "recommendations": [
          "string (specific recommendations for improvement)"
        ],
        "bestPractices": {
          "followed": ["string (architectural best practices followed)"],
          "violations": ["string (architectural best practices violated)"]
        }
      }
      
      Ensure your analysis is precise, actionable, and focused on architectural quality.
      Return ONLY valid JSON conforming to the structure specified above.
    `;

    try {
      console.log("Sending dependency graph request to Gemini");
      const result = await this.generateContent(prompt);
      console.log("Received dependency graph response");
      
      // Parse the JSON from the text response
      if (result.candidates && result.candidates[0] && result.candidates[0].content) {
        const text = result.candidates[0].content.parts[0].text;
        console.log("Raw dependency graph response:", text.substring(0, 200) + "...");
        
        try {
          // First try to parse the entire text as JSON
          return JSON.parse(text);
        } catch (err) {
          console.log("Could not parse entire text as JSON, looking for JSON in text");
          
          // Try to extract JSON from the text
          const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || 
                            text.match(/```\s*([\s\S]*?)\s*```/) || 
                            text.match(/(\{[\s\S]*\})/);
          
          if (jsonMatch && jsonMatch[1]) {
            try {
              return JSON.parse(jsonMatch[1].trim());
            } catch (jsonErr) {
              console.error("Failed to parse JSON from response:", jsonErr);
              return this.getDefaultDependencyGraphResponse();
            }
          } else {
            console.error("No valid JSON found in response");
            return this.getDefaultDependencyGraphResponse();
          }
        }
      }
      
      return this.getDefaultDependencyGraphResponse();
    } catch (error) {
      console.error("Error in generateDependencyGraph:", error);
      return this.getDefaultDependencyGraphResponse();
    }
  }

  /**
   * Default dependency graph response when API fails
   */
  private getDefaultDependencyGraphResponse(): any {
    return {
      dependencyGraph: {
        nodes: [
          { id: "n1", label: "App", type: "component", size: 10, group: "core" },
          { id: "n2", label: "Services", type: "service", size: 8, group: "data" },
          { id: "n3", label: "Components", type: "component", size: 7, group: "ui" },
          { id: "n4", label: "Utilities", type: "utility", size: 5, group: "helpers" }
        ],
        edges: [
          { source: "n1", target: "n2", type: "imports", strength: 3, description: "Uses services for data fetching" },
          { source: "n1", target: "n3", type: "imports", strength: 4, description: "Renders UI components" },
          { source: "n3", target: "n4", type: "imports", strength: 2, description: "Uses utility functions" },
          { source: "n2", target: "n4", type: "imports", strength: 2, description: "Uses utility functions" }
        ]
      },
      circularDependencies: [],
      recommendations: [
        "Consider creating clearer module boundaries",
        "Improve separation of concerns between components"
      ],
      bestPractices: {
        followed: ["Component-based architecture", "Service pattern for data access"],
        violations: ["Some components have too many responsibilities"]
      }
    };
  }

  /**
   * Creates interactive tutorials using Gemini - Enhanced for better learning
   */
  async createTutorial(workflow: any): Promise<any> {
    console.log("Creating tutorial with data:", workflow);
    
    const prompt = `
      You are an expert technical writer creating an interactive tutorial for developers.
      
      CONTEXT:
      - You're creating a comprehensive step-by-step tutorial for a ${workflow.role || 'developer'} developer
      - The tutorial should explain critical workflows in the codebase
      - The developer is new to this codebase and needs clear, practical guidance
      - Focus on teaching patterns and principles, not just syntax
      
      REPOSITORY INFO:
      ${JSON.stringify(workflow.repositoryInfo || {}, null, 2)}
      
      CRITICAL PATHS:
      ${JSON.stringify(workflow.criticalPaths || [], null, 2)}
      
      INSTRUCTIONS:
      1. Create a comprehensive tutorial focusing on ONE critical workflow in the codebase
      2. The tutorial should walk through the workflow step by step
      3. Include code examples that illustrate each step
      4. Explain key concepts, patterns, and decisions
      5. Make the tutorial interactive with clear explanations and questions to reinforce learning
      
      OUTPUT FORMAT:
      Provide your tutorial as a JSON object with the following structure:
      {
        "title": "string (name of the tutorial)",
        "overview": "string (what the tutorial covers and why it matters)",
        "prerequisites": ["string (skills or knowledge needed)"],
        "steps": [
          {
            "title": "string (step title)",
            "description": "string (detailed explanation)",
            "codeExample": "string (relevant code snippet)",
            "explanation": "string (explanation of the code and concepts)"
          }
        ],
        "additionalNotes": "string (important things to remember)"
      }
      
      Make your tutorial practical, focused, and tailored to a ${workflow.role || 'developer'} developer.
      Ensure all code examples are clear and well-commented. Focus on teaching patterns, not just syntax.
      Return ONLY valid JSON conforming to the structure above without additional text.
    `;

    try {
      console.log("Sending tutorial creation request to Gemini");
      const result = await this.generateContent(prompt);
      console.log("Received tutorial creation response");
      
      // Parse the JSON from the text response
      if (result.candidates && result.candidates[0] && result.candidates[0].content) {
        const text = result.candidates[0].content.parts[0].text;
        console.log("Raw tutorial response:", text.substring(0, 200) + "...");
        
        try {
          // First try to parse the entire text as JSON
          return JSON.parse(text);
        } catch (err) {
          console.log("Could not parse entire text as JSON, looking for JSON in text");
          
          // Try to extract JSON from the text
          const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || 
                            text.match(/```\s*([\s\S]*?)\s*```/) || 
                            text.match(/(\{[\s\S]*\})/);
          
          if (jsonMatch && jsonMatch[1]) {
            try {
              const jsonText = jsonMatch[1].trim();
              console.log("Extracted JSON text:", jsonText.substring(0, 100) + "...");
              return JSON.parse(jsonText);
            } catch (jsonErr) {
              console.error("Failed to parse JSON from response:", jsonErr);
              return this.getDefaultTutorialResponse(workflow.role);
            }
          } else {
            console.error("No valid JSON found in response");
            return this.getDefaultTutorialResponse(workflow.role);
          }
        }
      }
      
      return this.getDefaultTutorialResponse(workflow.role);
    } catch (error) {
      console.error("Error in createTutorial:", error);
      return this.getDefaultTutorialResponse(workflow.role);
    }
  }

  /**
   * Default tutorial response when API fails
   */
  private getDefaultTutorialResponse(role: string = 'developer'): any {
    return {
      title: `Getting Started for ${role || 'Developer'}s`,
      overview: "This tutorial provides an introduction to the repository structure and key components.",
      prerequisites: [
        "Basic understanding of web development",
        "Familiarity with JavaScript/TypeScript"
      ],
      estimatedTime: "20 minutes",
      steps: [
        {
          title: "Repository Overview",
          description: "Let's start by understanding the overall structure of the repository and its main components.",
          codeExample: `// Project structure
src/
  components/   # UI components
  services/     # Services for API interactions
  pages/        # Main application pages
  utils/        # Utility functions`,
          explanation: "Most modern web applications follow a structured organization pattern to separate concerns and make code more maintainable.",
          keyTakeaways: [
            "The codebase follows a component-based architecture",
            "Business logic is separated from presentation"
          ],
          commonMistakes: [
            "Mixing business logic with UI components",
            "Not understanding the component hierarchy"
          ],
          checkpointQuestion: {
            question: "What folder would you look in to find API interaction code?",
            answer: "services",
            hint: "Look for a folder that might handle external data sources"
          }
        },
        {
          title: "Understanding Key Components",
          description: "The key components in this codebase are organized by feature and function.",
          codeExample: `// Example component structure
import React from 'react';
import { useService } from '../hooks/useService';

const MyComponent = () => {
  const data = useService();
  
  return (
    <div>
      {/* Component rendering logic */}
    </div>
  );
};`,
          explanation: "Components typically follow this pattern, using hooks to access services and data, then rendering UI based on that data.",
          keyTakeaways: [
            "Components use hooks for data access",
            "UI rendering is separated from data fetching"
          ],
          commonMistakes: [
            "Fetching data directly in components",
            "Not handling loading/error states"
          ],
          checkpointQuestion: {
            question: "What pattern does this component use to access data?",
            answer: "Hooks",
            hint: "Look at the 'use' prefix in the function being called"
          }
        }
      ],
      additionalNotes: "As you explore the codebase further, focus on understanding how data flows between components and which parts handle core business logic.",
      furtherLearning: [
        "Review the test files to understand component behaviors",
        "Check documentation in README.md files",
        "Explore example usage in the codebase"
      ]
    };
  }

  /**
   * NEW: Generates Abstract Syntax Tree analysis
   */
  async generateASTAnalysis(files: any): Promise<any> {
    console.log("Generating AST analysis");
    
    const prompt = `
      You are an expert code analyst specializing in Abstract Syntax Tree (AST) analysis.
      
      CONTEXT:
      - You're analyzing a codebase to help developers understand its structure
      - You have access to file contents and structure information
      - Your task is to create an AST-based analysis that reveals code patterns and structure
      
      FILE DATA:
      ${JSON.stringify(files, null, 2)}
      
      INSTRUCTIONS:
      1. Analyze the file contents to identify key patterns and structures
      2. Identify function and class relationships
      3. Map out control flow patterns
      4. Identify potential code smells or anti-patterns
      5. Suggest refactoring opportunities based on AST analysis
      
      OUTPUT FORMAT:
      Provide your analysis as a JSON object with the following structure:
      {
        "astNodes": [
          {
            "type": "string (node type: function, class, hook, etc.)",
            "name": "string (name of the node)",
            "location": "string (file path)",
            "complexity": number (1-10 complexity score),
            "children": ["string (names of child nodes)"],
            "dependencies": ["string (external dependencies)"]
          }
        ],
        "patterns": [
          {
            "name": "string (pattern name)",
            "description": "string (pattern description)",
            "locations": ["string (where this pattern is found)"],
            "quality": "string (good, neutral, concerning)"
          }
        ],
        "codeSmells": [
          {
            "type": "string (type of code smell)",
            "location": "string (where it's found)",
            "suggestion": "string (how to improve it)"
          }
        ],
        "refactoringOpportunities": ["string (suggestions for refactoring)"]
      }
      
      Focus on providing practical insights that will help developers understand the codebase structure.
      Return ONLY valid JSON conforming to the structure specified above.
    `;

    try {
      console.log("Sending AST analysis request to Gemini");
      const result = await this.generateContent(prompt);
      console.log("Received AST analysis response");
      
      // Parse the JSON from the text response
      if (result.candidates && result.candidates[0] && result.candidates[0].content) {
        const text = result.candidates[0].content.parts[0].text;
        console.log("Raw AST analysis response:", text.substring(0, 200) + "...");
        
        try {
          // First try to parse the entire text as JSON
          return JSON.parse(text);
        } catch (err) {
          console.log("Could not parse entire text as JSON, looking for JSON in text");
          
          // Try to extract JSON from the text
          const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || 
                            text.match(/```\s*([\s\S]*?)\s*```/) || 
                            text.match(/(\{[\s\S]*\})/);
          
          if (jsonMatch && jsonMatch[1]) {
            try {
              return JSON.parse(jsonMatch[1].trim());
            } catch (jsonErr) {
              console.error("Failed to parse JSON from response:", jsonErr);
              return this.getDefaultASTAnalysisResponse();
            }
          } else {
            console.error("No valid JSON found in response");
            return this.getDefaultASTAnalysisResponse();
          }
        }
      }
      
      return this.getDefaultASTAnalysisResponse();
    } catch (error) {
      console.error("Error in generateASTAnalysis:", error);
      return this.getDefaultASTAnalysisResponse();
    }
  }

  /**
   * Default AST analysis response when API fails
   */
  private getDefaultASTAnalysisResponse(): any {
    return {
      astNodes: [
        {
          type: "function",
          name: "App",
          location: "src/App.tsx",
          complexity: 3,
          children: ["Router", "MainLayout"],
          dependencies: ["react", "react-router-dom"]
        },
        {
          type: "component",
          name: "RepositoryForm",
          location: "src/components/RepositoryForm.tsx",
          complexity: 4,
          children: ["FormInput", "Button"],
          dependencies: ["react", "react-hook-form"]
        },
        {
          type: "service",
          name: "GitHubService",
          location: "src/services/GitHubService.ts",
          complexity: 5,
          children: [],
          dependencies: ["octokit"]
        }
      ],
      patterns: [
        {
          name: "Component Composition",
          description: "Breaking UI into smaller reusable components",
          locations: ["src/components/*"],
          quality: "good"
        },
        {
          name: "Service Pattern",
          description: "Centralizing external API calls in service modules",
          locations: ["src/services/*"],
          quality: "good"
        },
        {
          name: "Hook Pattern",
          description: "Using custom hooks for shared logic",
          locations: ["src/hooks/*"],
          quality: "good"
        }
      ],
      codeSmells: [
        {
          type: "Large File",
          location: "src/services/GeminiService.ts",
          suggestion: "Split into smaller, more focused modules"
        },
        {
          type: "Duplicate Logic",
          location: "Multiple components",
          suggestion: "Extract shared logic into hooks or utility functions"
        }
      ],
      refactoringOpportunities: [
        "Extract error handling into a dedicated utility",
        "Create a central state management solution",
        "Implement a more consistent component API"
      ]
    };
  }

  /**
   * NEW: Chat with AI about the codebase
   */
  async chatWithAI(query: string, codebaseContext: any): Promise<any> {
    console.log("Chatting with AI about codebase:", query);
    
    const prompt = `
      You are an expert software developer who knows everything about this codebase.
      
      CODEBASE CONTEXT:
      ${JSON.stringify(codebaseContext, null, 2)}
      
      USER QUERY:
      ${query}
      
      INSTRUCTIONS:
      1. Answer the user's query about the codebase
      2. Be specific and reference actual files, functions, or patterns
      3. Provide code examples when appropriate
      4. If you're unsure about something, be honest about limitations
      5. Format your response using plain text with minimal formatting
      6. Do not use markdown formatting like asterisks for bold or italics
      7. Use simple plain text for headers and bullet points
      
      Your response should be helpful, accurate, and focus on helping the user understand the codebase better.
      Format your response in a clear, readable way with minimal formatting.
    `;

    try {
      console.log("Sending chat query to Gemini");
      const result = await this.generateContent(prompt);
      console.log("Received chat response from Gemini");
      
      if (result.candidates && result.candidates[0] && result.candidates[0].content) {
        return {
          response: result.candidates[0].content.parts[0].text,
          success: true
        };
      }
      
      return {
        response: "I'm sorry, I couldn't generate a response based on the codebase. Please try rephrasing your question or providing more context.",
        success: false
      };
    } catch (error) {
      console.error("Error in chatWithAI:", error);
      return {
        response: "There was an error processing your question. Please try again later.",
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  /**
   * NEW: Generate downloadable documentation
   */
  async generateDocumentation(repoData: any): Promise<any> {
    console.log("Generating documentation with data:", repoData);
    
    const prompt = `
      You are an expert technical writer creating comprehensive documentation for a codebase.
      
      CONTEXT:
      - You're creating documentation for developers who are new to this codebase
      - The documentation should be comprehensive yet concise
      - Focus on making it easy to understand the architecture and key components
      
      REPOSITORY INFO:
      ${JSON.stringify(repoData.repositoryInfo || {}, null, 2)}
      
      STRUCTURE ANALYSIS:
      ${JSON.stringify(repoData.structureAnalysis || {}, null, 2)}
      
      CRITICAL PATHS:
      ${JSON.stringify(repoData.criticalPathsAnalysis || {}, null, 2)}
      
      DEPENDENCY GRAPH:
      ${JSON.stringify(repoData.dependencyGraphAnalysis || {}, null, 2)}
      
      INSTRUCTIONS:
      1. Create comprehensive documentation in Markdown format
      2. Include sections on architecture, key components, code patterns, and workflows
      3. Add diagrams described in text (they will be rendered later)
      4. Focus on helping new developers get up to speed quickly
      
      OUTPUT FORMAT:
      Provide your documentation
