
import React, { useState } from 'react';
import { SendIcon, Loader2, Code } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { geminiService } from '@/services/GeminiService';
import ReactMarkdown from 'react-markdown';
import { useToast } from "@/hooks/use-toast";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodebaseChatViewProps {
  codebaseData: any;
  repositoryName?: string;
}

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const CodebaseChatView: React.FC<CodebaseChatViewProps> = ({ codebaseData, repositoryName }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: `Hi there! I'm your AI assistant for the ${repositoryName || 'repository'}. Ask me anything about this codebase and I'll help you understand it better.`,
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await geminiService.answerCodebaseQuestion(inputValue, codebaseData);
      
      const aiMessage = {
        text: response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        title: "Error",
        description: "Failed to get response from AI. Please try again.",
        variant: "destructive"
      });
      
      setMessages(prev => [...prev, {
        text: "I'm sorry, I encountered an error trying to answer your question. Please try again.",
        isUser: false,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Custom renderer components for ReactMarkdown
  const MarkdownComponents = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <div className="relative group">
          <div className="absolute right-2 top-2 opacity-50 hover:opacity-100">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0"
              onClick={() => {
                navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
                toast({
                  title: "Copied to clipboard",
                  description: "Code snippet copied to clipboard"
                });
              }}
            >
              <Code className="h-4 w-4" />
            </Button>
          </div>
          <SyntaxHighlighter
            style={oneDark}
            language={match[1]}
            PreTag="div"
            className="rounded-md text-sm"
            customStyle={{
              padding: '1rem',
              borderRadius: '0.375rem',
              margin: '1rem 0'
            }}
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code className="bg-muted px-1 py-0.5 rounded text-sm" {...props}>
          {children}
        </code>
      );
    },
    p({ children }: any) {
      return <p className="mb-4 last:mb-0">{children}</p>;
    },
    ul({ children }: any) {
      return <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>;
    },
    ol({ children }: any) {
      return <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>;
    },
    li({ children }: any) {
      return <li className="mb-1">{children}</li>;
    },
    h1({ children }: any) {
      return <h1 className="text-2xl font-bold mt-6 mb-4">{children}</h1>;
    },
    h2({ children }: any) {
      return <h2 className="text-xl font-bold mt-5 mb-3">{children}</h2>;
    },
    h3({ children }: any) {
      return <h3 className="text-lg font-bold mt-4 mb-2">{children}</h3>;
    },
    blockquote({ children }: any) {
      return <blockquote className="border-l-4 border-muted pl-4 italic mb-4">{children}</blockquote>;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Card className="flex-grow flex flex-col">
        <CardHeader>
          <CardTitle>Codebase Assistant</CardTitle>
          <CardDescription>
            Ask questions about the codebase to better understand it
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col">
          <ScrollArea className="flex-grow p-4 mb-4 bg-secondary/30 rounded-md">
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.isUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card shadow border'
                    }`}
                  >
                    {message.isUser ? (
                      <p className="whitespace-pre-wrap">{message.text}</p>
                    ) : (
                      <div className="prose dark:prose-invert max-w-none prose-headings:mt-4 prose-headings:mb-2">
                        <ReactMarkdown components={MarkdownComponents}>{message.text}</ReactMarkdown>
                      </div>
                    )}
                    <p className="text-xs opacity-70 mt-2 text-right">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg p-4 bg-card shadow border">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <p>Thinking...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="flex gap-2 mt-4">
            <Input
              placeholder="Ask a question about the codebase..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              disabled={isLoading}
              className="flex-grow"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <SendIcon className="h-4 w-4" />
              )}
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CodebaseChatView;
