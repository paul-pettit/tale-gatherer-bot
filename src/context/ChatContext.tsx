import React, { createContext, useState, useContext } from 'react';

interface ChatContextProps {
  chatSessionId: string | null;
  setChatSessionId: (sessionId: string | null) => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);

  return (
    <ChatContext.Provider value={{ chatSessionId, setChatSessionId }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};