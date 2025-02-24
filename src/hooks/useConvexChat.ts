import { useCallback } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useConvexChat(sessionId: string) {
  const messages = useQuery(api.messages.list, { sessionId });
  const sendMessage = useMutation(api.messages.send);
  const finishStory = useMutation(api.messages.finishStory);

  const handleSendMessage = useCallback(
    async (message: string, userId: string, storyId: string) => {
      try {
        await sendMessage({
          sessionId,
          message,
          userId,
          storyId,
        });
      } catch (error) {
        console.error("Error sending message:", error);
        throw error;
      }
    },
    [sendMessage, sessionId]
  );

  const handleFinishStory = useCallback(
    async (userId: string, storyId: string) => {
      try {
        const result = await finishStory({
          sessionId,
          userId,
          storyId,
        });
        return result;
      } catch (error) {
        console.error("Error finishing story:", error);
        throw error;
      }
    },
    [finishStory, sessionId]
  );

  return {
    messages: messages || [],
    isLoading: messages === undefined,
    sendMessage: handleSendMessage,
    finishStory: handleFinishStory,
  };
}