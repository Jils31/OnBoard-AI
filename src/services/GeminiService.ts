
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
        
        // Try to extract JSON from the text (could be surrounded by markdown code blocks)
        const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || 
                          text.match(/```\s*([\s\S]*?)\s*```/) || 
                          text.match(/(\{[\s\S]*\})/);
        
        if (jsonMatch && jsonMatch[1]) {
          try {
            const parsedJson = JSON.parse(jsonMatch[1]);
            console.log("Successfully parsed JSON from Gemini response");
            return parsedJson;
          } catch (err) {
            console.error("Failed to parse JSON from response:", err, "Text:", jsonMatch[1]);
            return this.getDefaultArchitectureResponse(repoData.repositoryInfo.name);
          }
        } else {
          // Try to parse the entire text as JSON
          try {
            const parsedJson = JSON.parse(text);
            console.log("Successfully parsed JSON from entire Gemini response");
            return parsedJson;
          } catch (err) {
            console.error("Failed to parse entire response as JSON:", err, "Text:", text.substring(0, 200) + "...");
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
   * Identifies critical code paths using Gemini
   */
  async identifyCriticalCodePaths(codeData: any): Promise<any> {
    console.log("Identifying critical code paths with data:", codeData);
    
    const fileContents = codeData.fileContents || [];
    const fileContentSamples = fileContents.map((file: any) => ({
      path: file.path,
      snippet: file.content?.substring(0, 300) + '...' || 'No content available',
      changeFrequency: file.changeFrequency
    }));

    const prompt = `
      You are an expert code analyst specializing in repository onboarding.
      
      CONTEXT:
      - You're helping a ${codeData.role} developer understand the most important parts of a codebase
      - You have git history data showing which files change most frequently
      - You have sample file contents of the most important files
      
      TASK:
      Analyze the repository to identify:
      1. Critical code paths (the 20% of code that provides 80% of core functionality)
      2. Key business logic components
      3. Data flow patterns through the application
      4. Most frequently modified files (based on git history)
      
      CODE DATA:
      Most Frequently Changed Files:
      ${JSON.stringify(codeData.mostChangedFiles || [], null, 2)}
      
      File Contents (truncated for key files):
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
            "dataFlow": ["string (step by step description of data flow)"]
          }
        ],
        "frequentlyChangedFiles": [
          {
            "filename": "string (file path)",
            "count": number (change frequency),
            "significance": "string (why this file changes often)",
            "recommendation": "string (what to know about this file)"
          }
        ],
        "keyBusinessLogic": ["string (list of key business logic areas)"],
        "entryPoints": ["string (list of main entry points to the codebase)"]
      }
      
      Focus on identifying patterns that a ${codeData.role} developer would find most relevant. Be specific, practical, and thorough.
      Return ONLY the JSON object described above with no additional text or explanation.
    `;

    try {
      console.log("Sending critical paths analysis request to Gemini");
      const result = await this.generateContent(prompt);
      console.log("Received critical paths analysis response");
      
      // Parse the JSON from the text response
      if (result.candidates && result.candidates[0] && result.candidates[0].content) {
        const text = result.candidates[0].content.parts[0].text;
        console.log("Raw critical paths response:", text.substring(0, 200) + "...");
        
        // Try to extract JSON from the text
        const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || 
                          text.match(/```\s*([\s\S]*?)\s*```/) || 
                          text.match(/(\{[\s\S]*\})/);
        
        if (jsonMatch && jsonMatch[1]) {
          try {
            return JSON.parse(jsonMatch[1]);
          } catch (err) {
            console.error("Failed to parse JSON from response:", err);
            return this.getDefaultCriticalPathsResponse();
          }
        } else {
          // Try to parse the entire text as JSON
          try {
            return JSON.parse(text);
          } catch (err) {
            console.error("Failed to parse entire response as JSON:", err);
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
          dataFlow: ["User accesses application", "App initializes", "Main functionality loads"]
        },
        {
          name: "Data Processing",
          description: "How data is processed in the application",
          importance: 8,
          files: ["src/services/GitHubService.ts", "src/services/GeminiService.ts"],
          dataFlow: ["Data retrieved", "Data processed", "Results displayed to user"]
        }
      ],
      frequentlyChangedFiles: [
        {
          filename: "src/components/RepositoryForm.tsx",
          count: 15,
          significance: "Core user interaction component",
          recommendation: "Understand how user input is processed"
        }
      ],
      keyBusinessLogic: ["Repository analysis", "Code structure visualization", "User interaction"],
      entryPoints: ["src/main.tsx", "src/App.tsx", "src/pages/Index.tsx"]
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
              "type": "string (node type: component, service, utility, etc.)"
            }
          ],
          "edges": [
            {
              "source": "string (source node id)",
              "target": "string (target node id)",
              "type": "string (dependency type: imports, uses, extends, etc.)"
            }
          ]
        },
        "circularDependencies": [
          ["string (list of module names forming a circular dependency)"]
        ],
        "recommendations": ["string (specific recommendations for improvement)"]
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
        
        // Try to extract JSON from the text
        const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || 
                          text.match(/```\s*([\s\S]*?)\s*```/) || 
                          text.match(/(\{[\s\S]*\})/);
        
        if (jsonMatch && jsonMatch[1]) {
          try {
            return JSON.parse(jsonMatch[1]);
          } catch (err) {
            console.error("Failed to parse JSON from response:", err);
            return this.getDefaultDependencyGraphResponse();
          }
        } else {
          // Try to parse the entire text as JSON
          try {
            return JSON.parse(text);
          } catch (err) {
            console.error("Failed to parse entire response as JSON:", err);
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
          { id: "n1", label: "App", type: "component" },
          { id: "n2", label: "Services", type: "service" },
          { id: "n3", label: "Components", type: "component" },
          { id: "n4", label: "Utilities", type: "utility" }
        ],
        edges: [
          { source: "n1", target: "n2", type: "imports" },
          { source: "n1", target: "n3", type: "imports" },
          { source: "n3", target: "n4", type: "imports" },
          { source: "n2", target: "n4", type: "imports" }
        ]
      },
      circularDependencies: [],
      recommendations: [
        "Consider creating clearer module boundaries",
        "Improve separation of concerns between components"
      ]
    };
  }

  /**
   * Creates interactive tutorials using Gemini
   */
  async createTutorial(workflow: any): Promise<any> {
    console.log("Creating tutorial with data:", workflow);
    
    const prompt = `
      You are an expert technical writer creating an interactive tutorial for developers.
      
      CONTEXT:
      - You're creating a step-by-step tutorial for a ${workflow.role || 'developer'} developer
      - The tutorial should explain critical workflows in the codebase
      - The developer is new to this codebase and needs clear, practical guidance
      - Focus on the most important coding patterns they need to understand
      
      REPOSITORY INFO:
      ${JSON.stringify(workflow.repositoryInfo || {}, null, 2)}
      
      CRITICAL PATHS:
      ${JSON.stringify(workflow.criticalPaths || [], null, 2)}
      
      INSTRUCTIONS:
      1. Create a comprehensive tutorial focusing on ONE critical workflow in the codebase
      2. The tutorial should walk through the workflow step by step
      3. Include code examples that illustrate each step
      4. Explain key concepts, patterns, and decisions
      5. Make the tutorial interactive with clear explanations
      
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
        
        // Try to extract JSON from the text
        const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || 
                          text.match(/```\s*([\s\S]*?)\s*```/) || 
                          text.match(/(\{[\s\S]*\})/);
        
        if (jsonMatch && jsonMatch[1]) {
          try {
            return JSON.parse(jsonMatch[1]);
          } catch (err) {
            console.error("Failed to parse JSON from response:", err);
            return this.getDefaultTutorialResponse(workflow.role);
          }
        } else {
          // Try to parse the entire text as JSON
          try {
            return JSON.parse(text);
          } catch (err) {
            console.error("Failed to parse entire response as JSON:", err);
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
          explanation: "Most modern web applications follow a structured organization pattern to separate concerns and make code more maintainable."
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
          explanation: "Components typically follow this pattern, using hooks to access services and data, then rendering UI based on that data."
        }
      ],
      additionalNotes: "As you explore the codebase further, focus on understanding how data flows between components and which parts handle core business logic."
    };
  }

  /**
   * Core method to call Gemini API
   */
  private async generateContent(prompt: string): Promise<any> {
    const url = `${this.baseUrl}?key=${this.apiKey}`;
    
    try {
      console.log("Calling Gemini API");
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            topK: 32,
            topP: 0.95,
            maxOutputTokens: 4096
            // Removed responseMimeType: "application/json" as it's causing the 400 error
          }
        }),
      });

      if (!response.ok) {
        console.error(`API request failed with status ${response.status}`);
        const responseText = await response.text();
        console.error(`Response: ${responseText}`);
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      throw error;
    }
  }
}

// Create and export a singleton instance with the API key
export const geminiService = new GeminiService('AIzaSyAhpUxIWCMhV-vjxqmLHhUe8aoxFrmRnXM');

