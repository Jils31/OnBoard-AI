
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Send, Bot, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { geminiService } from "@/services/GeminiService";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

interface CodebaseChatProps {
  codebaseContext: any;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const CodebaseChat = ({ codebaseContext }: CodebaseChatProps) => {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hi! I'm your AI codebase assistant. Ask me anything about this repository, its structure, patterns, or how specific features work.",
      timestamp: new Date()
    }
  ]);
  
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  // Handle sending a message
  const handleSendMessage = async () => {
    if (!query.trim()) return;
    
    const userMessage: ChatMessage = {
      role: "user",
      content: query.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setQuery("");
    setLoading(true);
    
    try {
      // Send the entire conversation history for context
      const conversationContext = {
        ...codebaseContext,
        conversationHistory: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      };
      
      const response = await geminiService.chatWithAI(query.trim(), conversationContext);
      
      if (response.success) {
        setMessages(prev => [
          ...prev, 
          {
            role: "assistant",
            content: response.response,
            timestamp: new Date()
          }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            role: "assistant",
            content: "I'm sorry, I couldn't generate a response based on the codebase. Please try rephrasing your question or providing more context.",
            timestamp: new Date()
          }
        ]);
        
        toast({
          title: "Error",
          description: "Failed to generate a response. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error in chat:", error);
      
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "I'm sorry, there was an error processing your request. Please try again later.",
          timestamp: new Date()
        }
      ]);
      
      toast({
        title: "Error",
        description: "An error occurred while communicating with the AI.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      
      // Focus back on textarea
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };
  
  // Handle textarea key press (Enter to send, Shift+Enter for new line)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Format the message content with markdown and code highlighting
  const formatMessageContent = (content: string) => {
    // Extract code blocks with language specified
    const codeBlockRegex = /```(\w+)?\s*([\s\S]*?)```/g;
    const parts: JSX.Element[] = [];
    
    let lastIndex = 0;
    let match;
    
    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before the code block
      if (match.index > lastIndex) {
        parts.push(
          <div key={`text-${lastIndex}`} className="mb-2 whitespace-pre-wrap">
            {content.slice(lastIndex, match.index)}
          </div>
        );
      }
      
      // Add the code block
      const language = match[1] || "typescript";
      const code = match[2].trim();
      
      parts.push(
        <div key={`code-${match.index}`} className="mb-4">
          <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs text-gray-500 rounded-t-md border-b border-gray-200 dark:border-gray-700">
            {language}
          </div>
          <SyntaxHighlighter
            language={language}
            style={docco}
            className="rounded-b-md"
          >
            {code}
          </SyntaxHighlighter>
        </div>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add the remaining text
    if (lastIndex < content.length) {
      parts.push(
        <div key={`text-${lastIndex}`} className="whitespace-pre-wrap">
          {content.slice(lastIndex)}
        </div>
      );
    }
    
    // If no code blocks were found, return the content as is
    if (parts.length === 0) {
      return <div className="whitespace-pre-wrap">{content}</div>;
    }
    
    return <>{parts}</>;
  };
  
  return (
    <Card className="border-green-100 dark:border-green-900 h-[80vh] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle>Code Assistant</CardTitle>
        <CardDescription>
          Ask questions about the codebase and get AI-powered answers
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-hidden p-0 relative">
        <ScrollArea className="h-full px-4">
          <div className="space-y-4 pb-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex max-w-[80%] ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <Avatar className={`h-8 w-8 ${message.role === "user" ? "ml-2" : "mr-2"}`}>
                    {message.role === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </Avatar>
                  
                  <div
                    className={`rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <div className="prose dark:prose-invert prose-sm max-w-none">
                      {formatMessageContent(message.content)}
                    </div>
                    
                    <div
                      className={`text-xs mt-1 ${
                        message.role === "user"
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        {loading && (
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-background/80 backdrop-blur-sm">
            <div className="flex items-center justify-center">
              <div className="flex space-x-1">
                <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <Separator />
      
      <CardFooter className="p-3">
        <div className="w-full flex gap-2">
          <Textarea
            ref={textareaRef}
            placeholder="Ask about the codebase (press Enter to send)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            className="min-h-10 resize-none"
            disabled={loading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={loading || query.trim() === ""}
            className="shrink-0"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
        
        <div className="w-full mt-2 flex justify-between items-center text-xs text-gray-500">
          <div className="flex items-center">
            <Badge variant="outline" className="mr-2">AI Assistant</Badge>
            <span>Powered by Gemini</span>
          </div>
          
          <div className="flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            <span>
              AI may provide inaccurate information
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CodebaseChat;
