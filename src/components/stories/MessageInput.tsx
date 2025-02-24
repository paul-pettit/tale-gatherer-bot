import React from 'react';
import { useChatContext } from '@/context/ChatContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MessageInputProps {
  isDisabled: boolean;
}

export function MessageInput({
  isDisabled
}: MessageInputProps) {
  const {  setChatSessionId } = useChatContext();
  const [newMessage, setNewMessage] = React.useState('');

  const handleSend = () => {
    if (!newMessage.trim()) return;
    // Send message logic here (to be implemented later)
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  return (
    <div className="flex gap-2">
      <Input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type your message..."
        disabled={isDisabled}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
      />
      <Button type="button" disabled={isDisabled} onClick={handleSend}>
        Send
      </Button>
    </div>
  );
}
