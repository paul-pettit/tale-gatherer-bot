
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export function useFreeTier() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: freeTierInfo, isLoading } = useQuery({
    queryKey: ['freeTierInfo', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('single_user_stories, is_free_tier')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      // If no profile exists yet, return default values
      return data || { single_user_stories: 0, is_free_tier: true };
    },
    enabled: !!user,
  });

  const { mutate: incrementStoryCount } = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');
      const { error } = await supabase
        .from('profiles')
        .update({ single_user_stories: (freeTierInfo?.single_user_stories || 0) + 1 })
        .eq('id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['freeTierInfo'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const canCreateStory = freeTierInfo?.is_free_tier && (freeTierInfo?.single_user_stories || 0) < 5;
  const remainingStories = freeTierInfo?.is_free_tier ? 5 - (freeTierInfo?.single_user_stories || 0) : 0;

  return {
    isLoading,
    canCreateStory,
    remainingStories,
    incrementStoryCount,
    isFreeTier: freeTierInfo?.is_free_tier,
  };
}
