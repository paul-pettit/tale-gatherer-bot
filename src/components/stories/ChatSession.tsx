
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatSessionProps {
  sessionId: string;
  question: string;
  onStoryComplete: (content: string) => void;
}

export function ChatSession({ sessionId, question, onStoryComplete }: ChatSessionProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Let's talk about this: ${question}` }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Load existing messages when component mounts
    const loadMessages = async () => {
      if (!sessionId) return;

      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
        return;
      }

      if (data) {
        setMessages(data.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        })));
      }
    };

    loadMessages();
  }, [sessionId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading || !user) return;

    const userMessage = { role: 'user' as const, content: newMessage };
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    try {
      // Save user message
      await supabase
        .from('chat_messages')
        .insert([{
          session_id: sessionId,
          role: 'user',
          content: newMessage
        }]);

      // Get AI response
      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: newMessage,
          context: question,
          messages: messages
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');
      
      const { answer } = await response.json();
      const assistantMessage = { role: 'assistant' as const, content: answer };
      
      // Save assistant message
      await supabase
        .from('chat_messages')
        .insert([{
          session_id: sessionId,
          role: 'assistant',
          content: answer
        }]);

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error in chat:', error);
      toast.error('Failed to get AI response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinish = async () => {
    setIsFinishing(true);
    try {
      // Get AI to summarize the conversation into a coherent story
      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: "Please help me craft a coherent story from our conversation. Incorporate the details, emotions, and reflections we've discussed into a well-structured narrative.",
          context: question,
          messages: messages
        }),
      });

      if (!response.ok) throw new Error('Failed to generate story');
      
      const { answer } = await response.json();
      onStoryComplete(answer);
    } catch (error) {
      console.error('Error generating story:', error);
      toast.error('Failed to generate story. Please try again.');
    } finally {
      setIsFinishing(false);
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>Interview Session</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'assistant' ? 'justify-start' : 'justify-end'
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.role === 'assistant'
                      ? 'bg-muted'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="mt-4 space-y-2">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading || isFinishing}
            />
            <Button type="submit" disabled={isLoading || isFinishing}>
              Send
            </Button>
          </form>
          <Button 
            onClick={handleFinish} 
            variant="secondary" 
            className="w-full"
            disabled={isLoading || isFinishing || messages.length < 4}
          >
            {isFinishing ? "Generating Story..." : "Finish & Generate Story"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
