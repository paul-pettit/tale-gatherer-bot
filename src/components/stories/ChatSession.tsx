
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { useChat } from "@/hooks/useChat"
import { MessageInput } from "./MessageInput"
import { ChatMessages } from "./ChatMessages"

interface ChatSessionProps {
  sessionId: string
  question: string
  onStoryComplete: (content: string) => void
}

export function ChatSession({ sessionId, question, onStoryComplete }: ChatSessionProps) {
  const [newMessage, setNewMessage] = useState('')
  const { user } = useAuth()
  const { messages, isLoading, isFinishing, sendMessage, finishStory } = useChat(sessionId, question)

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

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>Interview Session</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <ChatMessages 
          messages={messages}
          isLoading={isLoading}
        />
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
