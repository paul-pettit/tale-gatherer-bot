
import { Navigate } from 'react-router-dom';
import { useFreeTier } from '@/hooks/useFreeTier';
import { toast } from 'sonner';

export function StoryGuard({ children }: { children: React.ReactNode }) {
  const { canCreateStory, isFreeTier, remainingStories } = useFreeTier();

  if (!canCreateStory) {
    const message = isFreeTier 
      ? 'You have reached the limit of 5 free stories. Please upgrade to continue.'
      : 'You cannot create more stories at this time.';
    toast.error(message);
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
