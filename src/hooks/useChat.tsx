
import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function useChat(sessionId: string, question: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFinishing, setIsFinishing] = useState(false)

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

  const sendMessage = async (newMessage: string) => {
    if (!newMessage.trim() || isLoading) return

    const userMessage = { role: 'user' as const, content: newMessage }
    setMessages(prev => [...prev, userMessage])
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
      // Remove the user message if we failed to get a response
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
    }
  }

  const finishStory = async (): Promise<string> => {
    if (messages.length < 4) {
      toast.error('Please have a longer conversation before finishing')
      throw new Error('Conversation too short')
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
      return storyContent
    } catch (error) {
      console.error('Error generating story:', error)
      toast.error('Failed to generate story. Please try again.')
      throw error
    } finally {
      setIsFinishing(false)
    }
  }

  return {
    messages,
    isLoading,
    isFinishing,
    sendMessage,
    finishStory
  }
}
