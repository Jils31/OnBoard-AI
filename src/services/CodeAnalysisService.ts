
/**
 * Service for analyzing code using Abstract Syntax Trees
 */
export class CodeAnalysisService {
  /**
   * Analyze code files to extract important patterns and structures
   */
  async analyzeCode(
    files: Array<{ path: string; content: string; language?: string }>
  ): Promise<any> {
    const results: any = {
      modules: [],
      dependencies: [],
      patterns: [],
      complexity: {}
    };

    try {
      // Group files by language
      const filesByLanguage: Record<string, Array<{ path: string; content: string }>> = {};
      
      for (const file of files) {
        const language = file.language || this.detectLanguage(file.path);
        if (!filesByLanguage[language]) {
          filesByLanguage[language] = [];
        }
        filesByLanguage[language].push(file);
      }
      
      // Process each language group
      for (const [language, languageFiles] of Object.entries(filesByLanguage)) {
        const languageResults = await this.processLanguageFiles(language, languageFiles);
        
        // Merge results
        results.modules = [...results.modules, ...languageResults.modules];
        results.dependencies = [...results.dependencies, ...languageResults.dependencies];
        results.patterns = [...results.patterns, ...languageResults.patterns];
        results.complexity = { ...results.complexity, ...languageResults.complexity };
      }
      
      return results;
    } catch (error) {
      console.error("Error analyzing code:", error);
      throw error;
    }
  }

  /**
   * Detect programming language based on file extension
   */
  private detectLanguage(filePath: string): string {
    const extension = filePath.split('.').pop()?.toLowerCase();
    
    const languageMap: Record<string, string> = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'rb': 'ruby',
      'java': 'java',
      'go': 'go',
      'php': 'php',
      'cs': 'csharp',
      'cpp': 'cpp',
      'c': 'c',
      'swift': 'swift',
      'kt': 'kotlin',
      'rs': 'rust',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'json': 'json',
      'md': 'markdown',
      'yml': 'yaml',
      'yaml': 'yaml',
    };
    
    return extension ? (languageMap[extension] || 'unknown') : 'unknown';
  }

  /**
   * Process files of a specific programming language
   */
  private async processLanguageFiles(
    language: string, 
    files: Array<{ path: string; content: string }>
  ): Promise<any> {
    // This would be replaced with actual AST parsing for each language
    // For now, we'll do basic pattern matching
    
    const results: any = {
      modules: [],
      dependencies: [],
      patterns: [],
      complexity: {}
    };
    
    for (const file of files) {
      try {
        // Extract imports/dependencies (basic pattern matching)
        const dependencies = this.extractDependencies(language, file.content);
        
        // Detect common patterns
        const patterns = this.detectPatterns(language, file.content);
        
        // Calculate complexity metrics
        const complexity = this.calculateComplexity(file.content);
        
        // Add to results
        results.modules.push({
          path: file.path,
          name: file.path.split('/').pop(),
          type: this.guessModuleType(file.path, file.content),
        });
        
        results.dependencies.push({
          source: file.path,
          targets: dependencies
        });
        
        if (patterns.length > 0) {
          results.patterns.push({
            path: file.path,
            patterns
          });
        }
        
        results.complexity[file.path] = complexity;
      } catch (error) {
        console.error(`Error processing ${file.path}:`, error);
        // Continue with next file
      }
    }
    
    return results;
  }

  /**
   * Extract dependencies from file content (basic implementation)
   */
  private extractDependencies(language: string, content: string): string[] {
    const dependencies: string[] = [];
    
    try {
      // Very basic pattern matching - would be replaced with proper AST parsing
      if (language === 'javascript' || language === 'typescript') {
        // Match import statements
        const importRegex = /import\s+(?:{[^}]+}|\*\s+as\s+\w+|\w+)\s+from\s+['"]([^'"]+)['"]/g;
        let match;
        while ((match = importRegex.exec(content)) !== null) {
          if (match[1]) dependencies.push(match[1]);
        }
        
        // Match require statements
        const requireRegex = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
        while ((match = requireRegex.exec(content)) !== null) {
          if (match[1]) dependencies.push(match[1]);
        }
      } else if (language === 'python') {
        // Match import statements
        const importRegex = /(?:from\s+(\S+)\s+import)|(?:import\s+(\S+))/g;
        let match;
        while ((match = importRegex.exec(content)) !== null) {
          const module = match[1] || match[2];
          if (module) dependencies.push(module);
        }
      }
      // Add more languages as needed
    } catch (error) {
      console.error("Error extracting dependencies:", error);
    }
    
    return dependencies;
  }

  /**
   * Detect common patterns in code (basic implementation)
   */
  private detectPatterns(language: string, content: string): string[] {
    const patterns: string[] = [];
    
    try {
      if (language === 'javascript' || language === 'typescript') {
        // Detect React components
        if (content.includes('React') && 
            (content.includes('extends Component') || content.includes('function') && content.includes('return ('))) {
          patterns.push('ReactComponent');
        }
        
        // Detect Redux patterns
        if (content.includes('createStore') || content.includes('useReducer') || 
            content.includes('useDispatch') || content.includes('useSelector')) {
          patterns.push('ReduxPattern');
        }
        
        // Detect class-based structures
        if (content.includes('class ') && content.includes('constructor')) {
          patterns.push('ClassBasedArchitecture');
        }
      } else if (language === 'python') {
        // Detect Flask patterns
        if (content.includes('from flask import')) {
          patterns.push('FlaskWebApp');
        }
        
        // Detect Django patterns
        if (content.includes('from django import')) {
          patterns.push('DjangoApp');
        }
      }
      // Add more pattern detection as needed
    } catch (error) {
      console.error("Error detecting patterns:", error);
    }
    
    return patterns;
  }

  /**
   * Calculate complexity metrics (basic implementation)
   */
  private calculateComplexity(content: string): any {
    try {
      // Very basic complexity metrics
      const lines = content.split('\n').length;
      const functions = (content.match(/function\s+\w+\s*\(/g) || []).length;
      const classes = (content.match(/class\s+\w+/g) || []).length;
      const conditionals = (content.match(/if\s*\(/g) || []).length;
      const loops = (content.match(/for\s*\(/g) || []).length + (content.match(/while\s*\(/g) || []).length;
      
      // Calculate cognitive complexity (very simplified)
      const cognitiveComplexity = conditionals + loops * 2 + functions + classes;
      
      return {
        lines,
        functions,
        classes,
        conditionals,
        loops,
        cognitiveComplexity
      };
    } catch (error) {
      console.error("Error calculating complexity:", error);
      return {
        lines: 0,
        functions: 0,
        classes: 0,
        conditionals: 0,
        loops: 0,
        cognitiveComplexity: 0
      };
    }
  }

  /**
   * Guess module type based on file path and content
   */
  private guessModuleType(path: string, content: string): string {
    // Simple heuristics to guess module type
    if (path.includes('test') || path.includes('spec')) {
      return 'test';
    } else if (path.includes('component') || content.includes('React') || 
               content.includes('render') || path.endsWith('.jsx') || path.endsWith('.tsx')) {
      return 'component';
    } else if (path.includes('controller') || path.includes('route')) {
      return 'controller';
    } else if (path.includes('model') || content.includes('schema')) {
      return 'model';
    } else if (path.includes('util') || path.includes('helper')) {
      return 'utility';
    } else if (path.includes('service')) {
      return 'service';
    } else if (path.includes('config')) {
      return 'configuration';
    } else {
      return 'unknown';
    }
  }
}

// Create and export a singleton instance
export const codeAnalysisService = new CodeAnalysisService();
