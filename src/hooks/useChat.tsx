import { useState } from "react"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import { useConvexChat } from "./useConvexChat"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

export function useChat(sessionId: string, question: string) {
  const [showCreditConfirmation, setShowCreditConfirmation] = useState(false)
  const [pendingMessage, setPendingMessage] = useState<string | null>(null)
  const { user } = useAuth()
  
  const { 
    messages, 
    isLoading, 
    sendMessage: sendConvexMessage,
    finishStory: finishConvexStory 
  } = useConvexChat(sessionId)

  const sendMessage = async (newMessage: string) => {
    if (!newMessage.trim() || isLoading || !user) return

    // If this is the first user message (excluding the initial AI greeting)
    if (messages.length === 1 && messages[0].role === 'assistant') {
      setPendingMessage(newMessage)
      setShowCreditConfirmation(true)
      return
    }

    // Otherwise, process message normally
    setPendingMessage(newMessage)
    await processPendingMessage()
  }

  const processPendingMessage = async () => {
    if (!pendingMessage || !user) return;
    
    const message = pendingMessage;
    setPendingMessage(null);
    setShowCreditConfirmation(false);

    try {
      await sendConvexMessage(message, user.id, sessionId);
    } catch (error) {
      console.error('Error in chat:', error)
      toast.error('Failed to send message')
    }
  }

  const handleConfirmCredit = () => {
    processPendingMessage()
  }

  const handleCancelCredit = () => {
    setPendingMessage(null)
    setShowCreditConfirmation(false)
    toast.info('Message cancelled')
  }

  const finishStory = async () => {
    if (messages.length < 4) {
      toast.error('Please have a longer conversation before finishing')
      throw new Error('Conversation too short')
    }

    try {
      const result = await finishConvexStory(user?.id || "", sessionId);
      return result;
    } catch (error) {
      console.error('Error generating story:', error)
      toast.error('Failed to generate story')
      throw error;
    }
  }

  return {
    messages,
    isLoading,
    sendMessage,
    finishStory,
    showCreditConfirmation,
    handleConfirmCredit,
    handleCancelCredit
  }
}
