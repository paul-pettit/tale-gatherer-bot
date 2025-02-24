import { Navigate } from 'react-router-dom';
import { useFreeTier } from '@/hooks/useFreeTier';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export function StoryGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { canCreateStory, isFreeTier, isLoading } = useFreeTier();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Only check story limits if we have loaded the data
  if (!isLoading && !canCreateStory) {
    const message = isFreeTier
      ? 'You have reached the limit of 5 free stories. Please upgrade to continue.'
      : 'You cannot create more stories at this time.';
    toast.error(message);
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
