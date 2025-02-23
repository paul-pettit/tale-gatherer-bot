import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { useChat } from "@/hooks/useChat"
import { MessageInput } from "./MessageInput"
import { ChatMessages } from "./ChatMessages"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog"
import { PreviewDialog } from "./PreviewDialog"
import { useFreeTier } from "@/hooks/useFreeTier"

interface ChatSessionProps {
  sessionId: string
  question: string
  onStoryComplete: (content: string) => void
}

export function ChatSession({ sessionId: initialSessionId, question, onStoryComplete }: ChatSessionProps) {
  const [newMessage, setNewMessage] = useState('')
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false)
  const [showPreviewDialog, setShowPreviewDialog] = useState(false)
  const [previewContent, setPreviewContent] = useState('')
  const { user } = useAuth()
  const { remainingStories } = useFreeTier()
  
  const storedSessionId = localStorage.getItem('chatSessionId') || initialSessionId;
  const [sessionId, setSessionId] = useState(storedSessionId);

  useEffect(() => {
    if (sessionId) {
      localStorage.setItem('chatSessionId', sessionId);
    }
  }, [sessionId]);

  const {
    messages,
    isLoading,
    isFinishing,
    sendMessage,
    finishStory,
    showCreditConfirmation,
    handleConfirmCredit,
    handleCancelCredit
  } = useChat(sessionId, question);

  const [storyContent, setStoryContent] = useState('');

  useEffect(() => {
    const checkFailedSession = async () => {
      if (!sessionId) return

      const { data: session } = await supabase
        .from('chat_sessions')
        .select('status, last_error, preview_content')
        .eq('id', sessionId)
        .maybeSingle()

      if (session?.status === 'failed') {
        setShowRecoveryDialog(true)
      } else if (session?.preview_content) {
        setPreviewContent(session.preview_content)
        setShowPreviewDialog(true)
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
      const { answer, storyContent } = await finishStory()

      await supabase
        .from('chat_sessions')
        .update({
          preview_content: storyContent,
          status: 'preview'
        })
        .eq('id', sessionId)

      setPreviewContent(storyContent || "")
      setShowPreviewDialog(true)
    } catch (error) {
      // Error is already handled in the hook
    }
  }

  const handleStoryDelete = async () => {
    try {
      await supabase
        .from('chat_sessions')
        .update({ 
          status: 'failed',
          last_error: 'User deleted story during preview'
        })
        .eq('id', sessionId)

      setShowPreviewDialog(false)
      toast.success('Story deleted')
      window.location.href = '/stories'
    } catch (error) {
      console.error('Error deleting story:', error)
      toast.error('Failed to delete story')
    }
  }

  const handleStorySave = async (title: string, content: string) => {
    try {
      await supabase
        .from('chat_sessions')
        .update({ 
          status: 'completed',
          preview_content: content
        })
        .eq('id', sessionId)

      onStoryComplete(content)
      setShowPreviewDialog(false)
      toast.success('Story saved to library')
    } catch (error) {
      console.error('Error saving story:', error)
      toast.error('Failed to save story')
    }
  }

  const handleRecoveryAttempt = async () => {
    try {
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
              {isFinishing ? "Generating Story..." : "Finish & Preview Story"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showCreditConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start AI Interview</AlertDialogTitle>
            <AlertDialogDescription>
              Starting this conversation will use 1 credit from your {remainingStories} remaining credits. 
              Would you like to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelCredit}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCredit}>Start Interview</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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

      <PreviewDialog
        isOpen={showPreviewDialog}
        onClose={() => setShowPreviewDialog(false)}
        previewContent={previewContent}
        title={`Story about ${question}`}
        onSave={handleStorySave}
        onDelete={handleStoryDelete}
      />
    </>
  )
}
