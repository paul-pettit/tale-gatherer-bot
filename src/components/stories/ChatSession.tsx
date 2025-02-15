
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setMessages([{ role: 'assistant', content: `Let's talk about this: ${question}` }]);
  }, [question]);

  useEffect(() => {
    const loadMessages = async () => {
      if (!sessionId) return;

      try {
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: true });

        if (error) throw error;

        if (data) {
          const existingMessages = data.map(msg => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content
          }));
          
          if (existingMessages.length > 0) {
            setMessages(existingMessages);
          }
        }
      } catch (error) {
        console.error('Error loading messages:', error);
        toast.error('Failed to load chat history');
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
      const { error: saveError } = await supabase
        .from('chat_messages')
        .insert({
          session_id: sessionId,
          role: 'user',
          content: newMessage
        });

      if (saveError) throw saveError;

      const { data: sessionData, error: sessionError } = await supabase
        .from('chat_sessions')
        .select('story_id')
        .eq('id', sessionId)
        .single();

      if (sessionError) throw sessionError;

      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: newMessage,
          context: question,
          messages: messages,
          userId: user.id,
          storyId: sessionData.story_id
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get response: ${response.statusText}`);
      }
      
      const { answer } = await response.json();
      
      const { error: assistantError } = await supabase
        .from('chat_messages')
        .insert({
          session_id: sessionId,
          role: 'assistant',
          content: answer
        });

      if (assistantError) throw assistantError;

      const assistantMessage = { role: 'assistant' as const, content: answer };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error in chat:', error);
      toast.error('Failed to get AI response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinish = async () => {
    if (messages.length < 4) {
      toast.error('Please have a longer conversation before finishing');
      return;
    }

    setIsFinishing(true);
    try {
      const { data: sessionData, error: sessionError } = await supabase
        .from('chat_sessions')
        .select('story_id')
        .eq('id', sessionId)
        .single();

      if (sessionError) throw sessionError;

      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: "Please help me craft a coherent story from our conversation. Incorporate the details, emotions, and reflections we've discussed into a well-structured narrative.",
          context: question,
          messages: messages,
          userId: user?.id,
          storyId: sessionData.story_id
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
        <MessageList messages={messages} />
        <div className="mt-4 space-y-2">
          <MessageInput
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            onSend={handleSendMessage}
            isDisabled={isLoading || isFinishing}
          />
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
