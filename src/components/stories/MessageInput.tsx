
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  onSend: (e: React.FormEvent) => void;
  isDisabled: boolean;
}

export function MessageInput({ 
  newMessage, 
  setNewMessage, 
  onSend, 
  isDisabled 
}: MessageInputProps) {
  return (
    <form onSubmit={onSend} className="flex gap-2">
      <Input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type your message..."
        disabled={isDisabled}
      />
      <Button type="submit" disabled={isDisabled}>
        Send
      </Button>
    </form>
  );
}
