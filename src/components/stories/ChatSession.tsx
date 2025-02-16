
import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { MessageInput } from "./MessageInput"
import { ChatMessage } from "./ChatMessage"
import { TypingIndicator } from "./TypingIndicator"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatSessionProps {
  sessionId: string
  question: string
  onStoryComplete: (content: string) => void
}

export function ChatSession({ sessionId, question, onStoryComplete }: ChatSessionProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isFinishing, setIsFinishing] = useState(false)
  const { user } = useAuth()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load initial messages
  useEffect(() => {
    const loadMessages = async () => {
      if (!sessionId) return
      
      try {
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: true })

        if (error) throw error

        if (data) {
          const existingMessages = data.map(msg => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content
          }))
          
          if (existingMessages.length === 0) {
            // Add initial assistant message if no messages exist
            setMessages([{
              role: 'assistant',
              content: `Let's talk about this: ${question}`
            }])
          } else {
            setMessages(existingMessages)
          }
        }
      } catch (error) {
        console.error('Error loading messages:', error)
        toast.error('Failed to load chat history')
      }
    }

    loadMessages()
  }, [sessionId, question])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || isLoading || !user) return

    const userMessage = { role: 'user' as const, content: newMessage }
    setMessages(prev => [...prev, userMessage])
    setNewMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/interview-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await supabase.auth.getSession()}`
        },
        body: JSON.stringify({
          message: newMessage,
          sessionId,
          context: question
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to get response: ${response.statusText}`)
      }

      const { message: aiResponse, error } = await response.json()
      
      if (error) throw new Error(error)

      const assistantMessage = { role: 'assistant' as const, content: aiResponse }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error in chat:', error)
      toast.error('Failed to get AI response. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFinish = async () => {
    if (messages.length < 4) {
      toast.error('Please have a longer conversation before finishing')
      return
    }

    setIsFinishing(true)
    try {
      const response = await fetch('/api/interview-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await supabase.auth.getSession()}`
        },
        body: JSON.stringify({
          message: "Please help me craft a coherent story from our conversation. Incorporate the details, emotions, and reflections we've discussed into a well-structured narrative.",
          sessionId,
          context: question,
          isFinishing: true
        }),
      })

      if (!response.ok) throw new Error('Failed to generate story')
      
      const { message: storyContent } = await response.json()
      onStoryComplete(storyContent)
    } catch (error) {
      console.error('Error generating story:', error)
      toast.error('Failed to generate story. Please try again.')
    } finally {
      setIsFinishing(false)
    }
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>Interview Session</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                role={message.role}
                content={message.content}
                isLast={index === messages.length - 1}
              />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
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
  )
}
