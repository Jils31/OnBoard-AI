import React, { useState, useEffect, useRef } from 'react';
import { SendIcon, Loader2, Code, AtSign } from 'lucide-react';
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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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

interface FileOrDirectory {
  path: string;
  type: 'file' | 'directory';
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
      text: `Hi there! I'm your AI assistant for the ${repositoryName || 'repository'}. Ask me anything about this codebase and I'll help you understand it better. You can @mention specific files or directories for detailed information.`,
      isUser: false,
      timestamp: new Date()
    }]
  );
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatCount, setChatCount] = useState(0);
  const [mentionOpen, setMentionOpen] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [filesAndDirs, setFilesAndDirs] = useState<FileOrDirectory[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const subscription = useSubscription();
  
  // Extract files and directories from codebaseData
  useEffect(() => {
    if (codebaseData?.structureAnalysis?.structure) {
      const extractPaths = (structure: any, prefix = ''): FileOrDirectory[] => {
        let results: FileOrDirectory[] = [];
        
        if (Array.isArray(structure)) {
          structure.forEach(item => {
            if (typeof item === 'string') {
              results.push({ 
                path: prefix ? `${prefix}/${item}` : item, 
                type: 'file' 
              });
            } else if (typeof item === 'object' && item !== null) {
              Object.entries(item).forEach(([key, value]) => {
                const newPrefix = prefix ? `${prefix}/${key}` : key;
                results.push({ path: newPrefix, type: 'directory' });
                results = [...results, ...extractPaths(value, newPrefix)];
              });
            }
          });
        } else if (typeof structure === 'object' && structure !== null) {
          Object.entries(structure).forEach(([key, value]) => {
            const newPrefix = prefix ? `${prefix}/${key}` : key;
            results.push({ path: newPrefix, type: 'directory' });
            results = [...results, ...extractPaths(value, newPrefix)];
          });
        }
        
        return results;
      };
      
      setFilesAndDirs(extractPaths(codebaseData.structureAnalysis.structure));
    }
  }, [codebaseData]);
  
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Check if we need to open the mention popup
    const lastAtPos = value.lastIndexOf('@', e.target.selectionStart);
    const cursorAfterAt = lastAtPos !== -1 && e.target.selectionStart > lastAtPos;
    
    if (cursorAfterAt) {
      const searchText = value.substring(lastAtPos + 1, e.target.selectionStart);
      setMentionSearch(searchText);
      setCursorPosition(e.target.selectionStart);
      setMentionOpen(true);
    } else {
      setMentionOpen(false);
    }
  };

  const handleSelectMention = (path: string) => {
    if (!inputRef.current) return;
    
    const beforeAt = inputValue.substring(0, inputValue.lastIndexOf('@', cursorPosition));
    const afterCursor = inputValue.substring(cursorPosition);
    
    setInputValue(`${beforeAt}@${path}${afterCursor}`);
    setMentionOpen(false);
    
    // Focus back on input
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

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
      const nextChat = [...messages, userMessage, aiMessage];

      // Save chat to Supabase (for repo)
      await RepositoryAnalysisService.updateChatHistory(codebaseData.repositoryInfo?.html_url, nextChat);
      
      // Increment chat usage for free plan
      if (isFree && repositoryId) {
        await RepositoryAnalysisService.incrementChatCount(repositoryId);
        setChatCount(c => c + 1);
      }

      setMessages([...messages, userMessage, aiMessage]);
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
      text: `New chat started for the ${repositoryName || 'repository'}. You can @mention specific files or directories for detailed information.`,
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

  // Filter files and directories for @mentions
  const filteredFilesAndDirs = mentionSearch.trim() 
    ? filesAndDirs.filter(item => 
        item.path.toLowerCase().includes(mentionSearch.toLowerCase()))
    : filesAndDirs;

  return (
    <div className="flex flex-col h-full">
      <Card className="flex-grow flex flex-col">
        <CardHeader>
          <CardTitle>Codebase Assistant</CardTitle>
          <CardDescription>
            Ask questions about the codebase to better understand it. Use @mentions to reference specific files or directories.
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
            <div className="relative flex-grow">
              <Input
                ref={inputRef}
                placeholder={`Ask a question about the codebase...${subscription?.plan_type === 'free' ? ` (${chatCount}/${MAX_FREE_CHAT_MESSAGES} free messages used)` : ""}`}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={e => { 
                  if (e.key === 'Enter' && !mentionOpen) handleSendMessage();
                  if (e.key === 'Escape' && mentionOpen) setMentionOpen(false);
                }}
                disabled={isLoading || ((subscription?.plan_type ?? planType) === 'free' && chatCount >= MAX_FREE_CHAT_MESSAGES)}
                className="flex-grow pr-8"
              />
              <Popover open={mentionOpen} onOpenChange={setMentionOpen}>
                <PopoverTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-1"
                  >
                    <AtSign className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-64" align="start" side="bottom" sideOffset={4}>
                  <Command>
                    <CommandInput placeholder="Search files..." />
                    <CommandList>
                      <CommandEmpty>No files found.</CommandEmpty>
                      <CommandGroup heading="Files and Directories">
                        {filteredFilesAndDirs.slice(0, 10).map((item, i) => (
                          <CommandItem 
                            key={i} 
                            onSelect={() => handleSelectMention(item.path)}
                            className="flex items-center"
                          >
                            {item.type === 'file' ? (
                              <Code className="mr-2 h-4 w-4" />
                            ) : (
                              <svg 
                                className="mr-2 h-4 w-4" 
                                width="24" height="24" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                              >
                                <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
                              </svg>
                            )}
                            <span className="text-sm truncate">{item.path}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
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
