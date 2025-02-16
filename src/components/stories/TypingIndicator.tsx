
export function TypingIndicator() {
  return (
    <div className="flex space-x-2 p-4">
      <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
      <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
      <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" />
    </div>
  )
}
