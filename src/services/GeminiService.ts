
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
    const prompt = `
      You are an expert software architecture analyst tasked with understanding a code repository.
      Analyze the provided repository structure and information to:
      1. Identify the overall architectural pattern and system design
      2. Create a high-level architectural map showing how components interact
      3. Highlight the most important modules, services, or components

      Repository Information:
      ${JSON.stringify(repoData, null, 2)}
      
      Provide your analysis in JSON format with the following structure:
      {
        "architecture": {
          "pattern": "string",
          "description": "string",
          "mainComponents": []
        },
        "systemMap": {
          "nodes": [],
          "connections": []
        },
        "criticalComponents": []
      }
    `;

    return this.generateContent(prompt);
  }

  /**
   * Identifies critical code paths using Gemini
   */
  async identifyCriticalCodePaths(codeData: any): Promise<any> {
    const prompt = `
      You are an expert code analyst tasked with identifying the most important code paths in a repository.
      Analyze the provided code data, which includes git history, file structure, and code samples to:
      1. Identify the 20% of code that implements 80% of core functionality
      2. Determine the most frequently changed or updated files (based on git history)
      3. Map the main data flow through the application
      4. Identify key business logic components
      
      Code Data:
      ${JSON.stringify(codeData, null, 2)}
      
      Provide your analysis in JSON format with the following structure:
      {
        "criticalPaths": [
          {
            "name": "string",
            "description": "string",
            "files": [],
            "importance": "number (1-10)",
            "dataFlow": []
          }
        ],
        "frequentlyChangedFiles": [],
        "keyBusinessLogic": []
      }
    `;

    return this.generateContent(prompt);
  }

  /**
   * Generates dependency graphs using Gemini
   */
  async generateDependencyGraph(dependencies: any): Promise<any> {
    const prompt = `
      You are an expert in software dependency analysis.
      Analyze the provided dependency information to:
      1. Create a comprehensive dependency graph
      2. Identify circular dependencies or potential issues
      3. Suggest improvements to the dependency structure
      
      Dependency Information:
      ${JSON.stringify(dependencies, null, 2)}
      
      Provide your analysis in JSON format with the following structure:
      {
        "dependencyGraph": {
          "nodes": [],
          "edges": []
        },
        "circularDependencies": [],
        "recommendations": []
      }
    `;

    return this.generateContent(prompt);
  }

  /**
   * Creates interactive tutorials using Gemini
   */
  async createTutorial(workflow: any): Promise<any> {
    const prompt = `
      You are an expert technical writer creating an interactive tutorial for developers.
      Based on the provided workflow information, create a step-by-step tutorial that:
      1. Explains each step clearly with code examples
      2. Highlights important concepts and patterns
      3. Provides context for why certain approaches are taken
      
      Workflow Information:
      ${JSON.stringify(workflow, null, 2)}
      
      Provide your tutorial in JSON format with the following structure:
      {
        "title": "string",
        "overview": "string",
        "prerequisites": [],
        "steps": [
          {
            "title": "string",
            "description": "string",
            "codeExample": "string",
            "explanation": "string"
          }
        ],
        "additionalNotes": "string"
      }
    `;

    return this.generateContent(prompt);
  }

  /**
   * Core method to call Gemini API
   */
  private async generateContent(prompt: string): Promise<any> {
    const url = `${this.baseUrl}?key=${this.apiKey}`;
    
    try {
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
            maxOutputTokens: 8192
          }
        }),
      });

      if (!response.ok) {
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

// Create and export a singleton instance
export const geminiService = new GeminiService('AIzaSyAhpUxIWCMhV-vjxqmLHhUe8aoxFrmRnXM');
