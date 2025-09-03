import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Bot, User, Send, Sparkles } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { WebsiteAnalysisResponse, ChatResponse } from "@shared/schema";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

export default function InteractiveDemo() {
  const [url, setUrl] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "👋 Hi there! I'm your friendly AI customer support assistant. I'm here to help you learn about any business by analyzing their website. Simply paste a website URL above and click 'Bot It!' to get started. I'll be happy to answer any questions you have about that company!",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));
  const [currentWebsiteData, setCurrentWebsiteData] = useState<WebsiteAnalysisResponse | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const analyzeWebsiteMutation = useMutation({
    mutationFn: async (websiteUrl: string) => {
      const response = await apiRequest("POST", "/api/analyze-website", { url: websiteUrl });
      return response.json() as Promise<WebsiteAnalysisResponse>;
    },
    onSuccess: (data) => {
      setCurrentWebsiteData(data);
      const newMessage: Message = {
        id: Date.now().toString(),
        content: `🎉 Perfect! I've successfully analyzed ${data.domain} for you. This appears to be a ${data.business_type}. I'm now ready to answer any questions you have about their business, services, products, or anything else you'd like to know. How can I help you today?`,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, newMessage]);
    },
    onError: () => {
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "I apologize, but I'm having trouble accessing that website right now. This could be due to the website's security settings or temporary connectivity issues. Please double-check the URL and try again, or feel free to try a different website. I'm here to help! 😊",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      toast({
        title: "Website Analysis Issue",
        description: "Let's try again with a different URL!",
        variant: "destructive",
      });
    },
  });

  const chatMutation = useMutation({
    mutationFn: async ({ message, websiteUrl }: { message: string; websiteUrl?: string }) => {
      const response = await apiRequest("POST", "/api/chat", {
        message,
        session_id: sessionId,
        website_url: websiteUrl,
      });
      return response.json() as Promise<ChatResponse>;
    },
    onSuccess: (data) => {
      setIsTyping(false);
      const botMessage: Message = {
        id: Date.now().toString(),
        content: data.message,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    },
    onError: () => {
      setIsTyping(false);
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "I apologize for the technical difficulty! I'm having a temporary issue processing your request. Please try asking your question again, and I'll do my best to help you right away. Thank you for your patience! 🙏",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    },
  });

  const handleAnalyzeWebsite = () => {
    if (!url.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a valid website URL first!",
        variant: "destructive",
      });
      return;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      toast({
        title: "Invalid URL",
        description: "Please enter a complete URL starting with http:// or https://",
        variant: "destructive",
      });
      return;
    }

    analyzeWebsiteMutation.mutate(url);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim() || !currentWebsiteData) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: chatInput.trim(),
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setChatInput("");
    setIsTyping(true);

    chatMutation.mutate({
      message: chatInput.trim(),
      websiteUrl: currentWebsiteData.domain,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <section id="demo" className="py-20 bg-card" data-testid="interactive-demo-section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-8 text-foreground">
            Try Here How Your <span className="text-primary">Chatbot Will Work</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-demo-intro">
            See your future chatbot in action! Paste any website URL below and experience exactly how your customers will interact with your intelligent assistant. This is how your business will handle customer queries 24/7.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-background border-border card-tilt relative">
            <CardContent className="p-8">
              {/* URL Input Section */}
              <div className="mb-8">
                <Label className="block text-sm font-medium text-muted-foreground mb-4">
                  Enter a website URL to analyze:
                </Label>
                <div className="flex gap-4">
                  <Input
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1 bg-input border-border text-foreground placeholder-muted-foreground focus:ring-primary"
                    data-testid="input-website-url"
                  />
                  <Button
                    onClick={handleAnalyzeWebsite}
                    disabled={analyzeWebsiteMutation.isPending}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 btn-micro-animation"
                    data-testid="button-bot-it"
                  >
                    {analyzeWebsiteMutation.isPending ? (
                      <>
                        <span className="animate-spin mr-2">⚡</span>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Bot It!
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Chat Interface */}
              <div className="bg-muted/30 rounded-xl p-6 min-h-[400px] flex flex-col">
                <div className="flex-1 space-y-4 mb-4 overflow-y-auto max-h-80" data-testid="chat-messages">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start space-x-3 ${!message.isBot ? 'flex-row-reverse space-x-reverse' : ''}`}
                      data-testid={`message-${message.isBot ? 'bot' : 'user'}-${message.id}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.isBot ? 'bg-primary' : 'bg-muted'
                      }`}>
                        {message.isBot ? (
                          <Bot className="text-primary-foreground text-sm" />
                        ) : (
                          <User className="text-muted-foreground text-sm" />
                        )}
                      </div>
                      <div className={`p-4 rounded-lg max-w-md ${
                        message.isBot 
                          ? 'bg-card rounded-tl-none' 
                          : 'bg-primary text-primary-foreground rounded-tr-none'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex items-start space-x-3" data-testid="typing-indicator">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <Bot className="text-primary-foreground text-sm" />
                      </div>
                      <div className="bg-card p-4 rounded-lg rounded-tl-none">
                        <div className="flex space-x-1">
                          <div className="typing-indicator"></div>
                          <div className="typing-indicator" style={{ animationDelay: '-0.16s' }}></div>
                          <div className="typing-indicator" style={{ animationDelay: '-0.32s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input */}
                <div className="flex gap-3">
                  <Input
                    type="text"
                    placeholder={currentWebsiteData ? `Ask me about ${currentWebsiteData.domain}...` : "Ask me anything about the website..."}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={!currentWebsiteData || chatMutation.isPending}
                    className="flex-1 bg-input border-border text-foreground placeholder-muted-foreground focus:ring-primary"
                    data-testid="input-chat-message"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!currentWebsiteData || chatMutation.isPending || !chatInput.trim()}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 btn-micro-animation"
                    data-testid="button-send-message"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
