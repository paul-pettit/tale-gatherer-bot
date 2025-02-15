
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

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
  const { user } = useAuth();

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
    } finally {
      setIsLoading(false);
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
        <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            Send
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
