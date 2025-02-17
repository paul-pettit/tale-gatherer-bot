
import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function useChat(sessionId: string, question: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFinishing, setIsFinishing] = useState(false)
  const { user } = useAuth()
  
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
    if (!newMessage.trim() || isLoading || !user) return

    const userMessage = { role: 'user' as const, content: newMessage }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Get story ID from chat session
      const { data: session, error: sessionError } = await supabase
        .from('chat_sessions')
        .select('story_id')
        .eq('id', sessionId)
        .single()

      if (sessionError) throw sessionError

      // Save user message
      await supabase
        .from('chat_messages')
        .insert({
          session_id: sessionId,
          role: 'user',
          content: newMessage
        })

      // Get AI response
      const response = await supabase.functions.invoke('ai-interviewer', {
        body: {
          message: newMessage,
          messages: messages,
          context: question,
          userId: user.id,
          storyId: session.story_id
        },
      })

      if (response.error) throw new Error(response.error.message)
      
      const aiMessage = response.data.answer
      
      // Save AI message
      await supabase
        .from('chat_messages')
        .insert({
          session_id: sessionId,
          role: 'assistant',
          content: aiMessage
        })

      setMessages(prev => [...prev, { role: 'assistant', content: aiMessage }])
    } catch (error) {
      console.error('Error in chat:', error)
      toast.error('Failed to get AI response')
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
      // Get story ID from chat session
      const { data: session, error: sessionError } = await supabase
        .from('chat_sessions')
        .select('story_id')
        .eq('id', sessionId)
        .single()

      if (sessionError) throw sessionError

      // First, update the session status
      const { error: updateError } = await supabase
        .from('chat_sessions')
        .update({ status: 'finishing' })
        .eq('id', sessionId)

      if (updateError) throw updateError

      const response = await supabase.functions.invoke('ai-interviewer', {
        body: {
          message: "Please help me craft a coherent story from our conversation. Incorporate the details, emotions, and reflections we've discussed into a well-structured narrative.",
          messages,
          context: question,
          userId: user?.id,
          storyId: session.story_id,
          isFinishing: true
        },
      })

      if (response.error) throw new Error(response.error.message)

      // Update session status to completed
      await supabase
        .from('chat_sessions')
        .update({ status: 'completed' })
        .eq('id', sessionId)

      return response.data.answer
    } catch (error) {
      console.error('Error generating story:', error)
      // Update session status to failed
      await supabase
        .from('chat_sessions')
        .update({ 
          status: 'failed',
          last_error: error instanceof Error ? error.message : 'Unknown error'
        })
        .eq('id', sessionId)

      toast.error('Failed to generate story')
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
