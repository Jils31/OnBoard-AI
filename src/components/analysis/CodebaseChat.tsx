
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Bot } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { geminiService } from "@/services/GeminiService";
import { useToast } from "@/components/ui/use-toast";

interface CodebaseChatProps {
  codebaseContext: any;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const CodebaseChat = ({ codebaseContext }: CodebaseChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your codebase assistant. Ask me anything about this repository and I'll try to help you understand it better.",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Scroll to bottom of messages whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Format text to remove markdown asterisks
  const formatText = (text: string): string => {
    // Replace markdown patterns with clean text
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold asterisks
      .replace(/\*(.*?)\*/g, '$1')     // Remove italic asterisks
      .replace(/^- /gm, '• ');         // Replace dash lists with bullet points
  };

  // Format code blocks
  const formatContent = (content: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    
    // Regular expression to match code blocks
    const codeBlockRegex = /```([a-z]*)\n([\s\S]*?)```/g;
    let match;
    
    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before the code block
      if (match.index > lastIndex) {
        parts.push(
          <p key={`text-${lastIndex}`} className="whitespace-pre-wrap mb-4">
            {formatText(content.substring(lastIndex, match.index))}
          </p>
        );
      }
      
      // Add the code block
      const language = match[1] || 'javascript';
      const code = match[2];
      
      parts.push(
        <div key={`code-${match.index}`} className="bg-gray-100 dark:bg-gray-800 rounded-md p-4 mb-4 overflow-x-auto">
          <pre className="text-sm">
            <code>{code}</code>
          </pre>
        </div>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add any remaining text
    if (lastIndex < content.length) {
      parts.push(
        <p key={`text-${lastIndex}`} className="whitespace-pre-wrap mb-4">
          {formatText(content.substring(lastIndex))}
        </p>
      );
    }
    
    return parts;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) {
      return;
    }
    
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    
    try {
      const response = await geminiService.chatWithAI(inputValue, codebaseContext);
      
      if (response.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: response.response,
            timestamp: new Date(),
          },
        ]);
      } else {
        throw new Error(response.error || "Failed to get a response");
      }
    } catch (error) {
      console.error("Error in chat:", error);
      toast({
        title: "Error",
        description: "Sorry, I couldn't process your question. Please try again.",
        variant: "destructive",
      });
      
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          content: "Sorry, I couldn't process your question. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-indigo-100 dark:border-indigo-900">
        <CardHeader>
          <CardTitle className="text-2xl">Codebase Chat</CardTitle>
          <CardDescription>
            Ask questions about the codebase and get AI-powered answers
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[60vh] flex flex-col">
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === "user"
                        ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-100"
                        : "bg-gray-100 dark:bg-gray-800"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex items-center mb-2">
                        <Bot className="h-5 w-5 mr-2" />
                        <span className="font-medium">AI Assistant</span>
                      </div>
                    )}
                    <div className="chat-message">
                      {formatContent(message.content)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 text-right">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <Separator />
            <div className="p-4">
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about the codebase..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading}>
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </form>
            </div>
          </div>
        </CardContent>
        <CardFooter className="text-xs text-gray-500">
          The AI assistant uses the repository analysis data to provide insights about the codebase.
        </CardFooter>
      </Card>
    </div>
  );
};

export default CodebaseChat;
