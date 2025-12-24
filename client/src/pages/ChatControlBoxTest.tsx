/**
 * ChatControlBox Test Page
 * 
 * This page demonstrates the ChatControlBox reusable component.
 * It shows how to integrate the component with minimal setup.
 */

import { useState, useCallback } from 'react';
import { ChatControlBox, Message, Attachment } from '@/components/ChatControlBox';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2, Info } from 'lucide-react';
import { Link } from 'wouter';
import { toast } from 'sonner';

export default function ChatControlBoxTest() {
  // State that would typically come from a parent component or context
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [conversationTitle, setConversationTitle] = useState('Test Conversation');
  const [isLoading, setIsLoading] = useState(false);

  // Handle sending a message
  const handleSendMessage = useCallback((text: string, attachments: Attachment[]) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: text,
      timestamp: new Date(),
      attachments,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponses: Message[] = selectedModels.map((modelKey, index) => {
        const [provider, model] = modelKey.split(':');
        return {
          id: Date.now() + index + 1,
          type: 'ai' as const,
          content: `This is a simulated response from ${model} (${provider}). You said: "${text}"`,
          timestamp: new Date(),
          provider,
          model,
          confidence: Math.random() * 0.3 + 0.7,
          responseTime: Math.random() * 2000 + 500,
        };
      });
      
      setMessages(prev => [...prev, ...aiResponses]);
      setIsLoading(false);
      toast.success('Responses received');
    }, 1500);
  }, [selectedModels]);

  // Handle synthesis request
  const handleSynthesize = useCallback(() => {
    if (messages.length === 0) {
      toast.error('No messages to synthesize');
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      const synthesisMessage: Message = {
        id: Date.now(),
        type: 'synthesis',
        content: 'This is a synthesized response combining insights from all AI models in the conversation.',
        timestamp: new Date(),
        provider: 'synthesis',
        model: 'Multi-AI Synthesis',
      };
      
      setMessages(prev => [...prev, synthesisMessage]);
      setIsLoading(false);
      toast.success('Synthesis complete');
    }, 2000);
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold">ChatControlBox Test</h1>
            <p className="text-xs text-muted-foreground">Reusable component demonstration</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setMessages([]);
              toast.success('Messages cleared');
            }}
            disabled={messages.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="px-4 py-2 bg-primary/10 border-b border-primary/20">
        <div className="flex items-center gap-2 text-sm text-primary">
          <Info className="h-4 w-4" />
          <span>
            This page tests the ChatControlBox component. Select models and send messages to see it in action.
          </span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm">Select AI models and send a message to get started</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.type === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : msg.type === 'synthesis'
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30'
                    : 'bg-muted'
                }`}
              >
                {msg.type !== 'user' && (
                  <div className="text-xs font-medium mb-1 opacity-70">
                    {msg.model} {msg.provider && `(${msg.provider})`}
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                {msg.confidence && (
                  <div className="text-xs opacity-50 mt-1">
                    Confidence: {(msg.confidence * 100).toFixed(0)}%
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 border-t border-border bg-muted/50 text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>Messages: {messages.length}</span>
          <span>Models: {selectedModels.length > 0 ? selectedModels.join(', ') : 'None selected'}</span>
          <span>Title: {conversationTitle}</span>
        </div>
      </div>

      {/* ChatControlBox Component */}
      <ChatControlBox
        messages={messages}
        onMessagesChange={setMessages}
        selectedModels={selectedModels}
        onModelsChange={setSelectedModels}
        onSendMessage={handleSendMessage}
        conversationTitle={conversationTitle}
        onTitleChange={setConversationTitle}
        isLoading={isLoading}
        onSynthesize={handleSynthesize}
        onNewChat={() => {
          setMessages([]);
          setConversationTitle('New Chat');
          toast.success('New chat started');
        }}
      />
    </div>
  );
}
