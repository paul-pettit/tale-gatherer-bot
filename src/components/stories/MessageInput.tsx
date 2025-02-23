import React from 'react';

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
    <form className="flex gap-2">
      <Input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type your message..."
        disabled={isDisabled}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend(e);
          }
        }}
      />
      <Button type="submit" disabled={isDisabled}>
        Send
      </Button>
    </form>
  );
}
