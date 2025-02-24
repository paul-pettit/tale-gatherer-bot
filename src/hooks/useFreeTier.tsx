
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
        .select('monthly_story_tokens, tokens_reset_date, is_free_tier, purchased_story_credits')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      // If no profile exists yet, return default values
      return data || { 
        monthly_story_tokens: 5, 
        tokens_reset_date: new Date().toISOString(),
        is_free_tier: true,
        purchased_story_credits: 0
      };
    },
    enabled: !!user,
  });

  const { mutate: decrementStoryToken } = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const newTokenCount = (freeTierInfo?.monthly_story_tokens || 0) - 1;
      
      const { error } = await supabase
        .from('profiles')
        .update({ monthly_story_tokens: newTokenCount })
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

  // Calculate available tokens only if we have data
  const availableTokens = freeTierInfo
    ? (freeTierInfo.monthly_story_tokens || 0) + (freeTierInfo.purchased_story_credits || 0)
    : null;

  // Can create story if we're loading or have tokens
  const canCreateStory = isLoading || (availableTokens !== null && availableTokens > 0);
  
  // Return remaining tokens including both monthly and purchased credits
  const remainingStories = availableTokens ?? 0;

  return {
    isLoading,
    canCreateStory,
    remainingStories,
    decrementStoryToken,
    isFreeTier: freeTierInfo?.is_free_tier,
  };
}
