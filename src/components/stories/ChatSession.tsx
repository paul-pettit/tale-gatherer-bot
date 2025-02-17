
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { useChat } from "@/hooks/useChat"
import { MessageInput } from "./MessageInput"
import { ChatMessages } from "./ChatMessages"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

interface ChatSessionProps {
  sessionId: string
  question: string
  onStoryComplete: (content: string) => void
}

export function ChatSession({ sessionId, question, onStoryComplete }: ChatSessionProps) {
  const [newMessage, setNewMessage] = useState('')
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false)
  const { user } = useAuth()
  const { messages, isLoading, isFinishing, sendMessage, finishStory } = useChat(sessionId, question)

  // Check for failed sessions on mount
  useEffect(() => {
    const checkFailedSession = async () => {
      if (!sessionId) return

      const { data: session } = await supabase
        .from('chat_sessions')
        .select('status, last_error')
        .eq('id', sessionId)
        .single()

      if (session?.status === 'failed') {
        setShowRecoveryDialog(true)
      }
    }

    checkFailedSession()
  }, [sessionId])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newMessage.trim()) return
    
    await sendMessage(newMessage)
    setNewMessage('')
  }

  const handleFinish = async () => {
    try {
      const storyContent = await finishStory()
      onStoryComplete(storyContent)
    } catch (error) {
      // Error is already handled in the hook
    }
  }

  const handleRecoveryAttempt = async () => {
    try {
      // Reset session status
      await supabase
        .from('chat_sessions')
        .update({ status: 'active', last_error: null })
        .eq('id', sessionId)

      setShowRecoveryDialog(false)
      toast.success('Chat session recovered successfully')
    } catch (error) {
      console.error('Error recovering session:', error)
      toast.error('Failed to recover chat session')
    }
  }

  return (
    <>
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="flex-none">
          <CardTitle>Interview Session</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col overflow-hidden p-4">
          <div className="flex-1 overflow-hidden mb-4">
            <ChatMessages 
              messages={messages}
              isLoading={isLoading}
            />
          </div>
          <div className="flex-none space-y-2">
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

      <AlertDialog open={showRecoveryDialog} onOpenChange={setShowRecoveryDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Previous Session Recovery</AlertDialogTitle>
            <AlertDialogDescription>
              It looks like your previous story generation attempt was interrupted. 
              Would you like to continue from where you left off?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowRecoveryDialog(false)}>
              Start New Chat
            </Button>
            <Button onClick={handleRecoveryAttempt}>
              Recover Session
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
