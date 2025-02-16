
import { cn } from "@/lib/utils"

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  isLast?: boolean
}

export function ChatMessage({ role, content, isLast }: ChatMessageProps) {
  const isUser = role === 'user'
  
  return (
    <div
      className={cn(
        "flex w-full",
        isUser ? "justify-end" : "justify-start",
        isLast && "mb-4"
      )}
    >
      <div
        className={cn(
          "rounded-lg px-4 py-2 max-w-[80%] break-words",
          isUser 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted text-foreground"
        )}
      >
        {content}
      </div>
    </div>
  )
}
