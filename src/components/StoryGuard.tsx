
import { Navigate } from 'react-router-dom';
import { useFreeTier } from '@/hooks/useFreeTier';
import { toast } from 'sonner';

export function StoryGuard({ children }: { children: React.ReactNode }) {
  const { canCreateStory, isFreeTier, remainingStories } = useFreeTier();

  if (isFreeTier && !canCreateStory) {
    toast.error('You have reached the limit of 5 free stories. Please upgrade to continue.');
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
