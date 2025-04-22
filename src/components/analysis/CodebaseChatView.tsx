import React, { useState, useEffect } from 'react';
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
import { RepositoryAnalysisService } from '@/services/RepositoryAnalysisService';
import { useAuth } from "@/context/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";

interface CodebaseChatViewProps {
  codebaseData: any;
  repositoryName?: string;
  chatHistory?: any[];
  repositoryId?: string;
  planType?: string;
}

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const MAX_FREE_CHAT_MESSAGES = 5;

const CodebaseChatView: React.FC<CodebaseChatViewProps> = ({
  codebaseData,
  repositoryName,
  chatHistory = [],
  repositoryId,
  planType
}) => {
  const [messages, setMessages] = useState<Message[]>(
    chatHistory.length > 0 ? chatHistory : [{
      text: `Hi there! I'm your AI assistant for the ${repositoryName || 'repository'}. Ask me anything about this codebase and I'll help you understand it better.`,
      isUser: false,
      timestamp: new Date()
    }]
  );
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const subscription = useSubscription();
  const [chatCount, setChatCount] = useState(0);
  
  // Load current chat usage on mount
  useEffect(() => {
    let ignore = false;
    async function fetchCount() {
      if (!repositoryId) return;
      try {
        const count = await RepositoryAnalysisService.getChatCount(repositoryId);
        if (!ignore) setChatCount(count);
      } catch (err) {
        console.error('Failed to get chat usage:', err);
      }
    }
    fetchCount();
    return () => { ignore = true };
  }, [repositoryId, user]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Enforce free plan chat limit
      const isFree = (subscription?.plan_type ?? planType) === 'free';
      if (isFree && chatCount >= MAX_FREE_CHAT_MESSAGES) {
        toast({
          title: "Free Chat Limit Reached",
          description: `You've used ${MAX_FREE_CHAT_MESSAGES} free messages for this repo. Upgrade to continue!`,
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // AI response:
      const response = await geminiService.answerCodebaseQuestion(userMessage.text, codebaseData);
      const aiMessage: Message = {
        text: response,
        isUser: false,
        timestamp: new Date()
      };
      const nextChat = [...messages, aiMessage];

      // Save chat to Supabase (for repo)
      await RepositoryAnalysisService.updateChatHistory(codebaseData.repositoryInfo?.html_url, nextChat);
      
      // Increment chat usage for free plan
      if (isFree && repositoryId) {
        await RepositoryAnalysisService.incrementChatCount(repositoryId);
        setChatCount(c => c + 1);
      }

      setMessages(nextChat);
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

  // Add handler to start a new chat
  const handleNewChat = async () => {
    const starterMsg = {
      text: `New chat started for the ${repositoryName || 'repository'}.`,
      isUser: false,
      timestamp: new Date()
    };
    setMessages([starterMsg]);
    if (repositoryId) {
      await RepositoryAnalysisService.updateChatHistory(
        codebaseData.repositoryInfo?.html_url,
        [starterMsg]
      );
      if ((subscription?.plan_type ?? planType) === 'free') {
        setChatCount(0); // Reset chat count when new chat
        // Optionally reset usage in DB
        await RepositoryAnalysisService.incrementChatCount(repositoryId);
      }
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
              placeholder={`Ask a question about the codebase...${subscription?.plan_type === 'free' ? ` (${chatCount}/${MAX_FREE_CHAT_MESSAGES} free messages used)` : ""}`}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(); }}
              disabled={isLoading || ((subscription?.plan_type ?? planType) === 'free' && chatCount >= MAX_FREE_CHAT_MESSAGES)}
              className="flex-grow"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading || ((subscription?.plan_type ?? planType) === 'free' && chatCount >= MAX_FREE_CHAT_MESSAGES)}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <SendIcon className="h-4 w-4" />
              )}
              <span className="sr-only">Send</span>
            </Button>
            <Button type="button" variant="outline" className="ml-2" onClick={handleNewChat}>
              New Chat
            </Button>
          </div>
          {((subscription?.plan_type ?? planType) === 'free' && chatCount >= MAX_FREE_CHAT_MESSAGES) && (
            <div className="text-red-600 text-xs mt-2">
              Free users can send up to {MAX_FREE_CHAT_MESSAGES} messages per repo. Please upgrade your plan to continue!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CodebaseChatView;
