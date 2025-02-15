
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import debounce from 'lodash/debounce';

export function useStoryDraft(userId: string | undefined) {
  const [draftId, setDraftId] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    const createInitialDraft = async () => {
      if (!userId) return;

      try {
        // Create initial draft
        const { data: draft, error: draftError } = await supabase
          .from('stories')
          .insert({
            title: '',
            content: '',
            author_id: userId,
            status: 'draft',
          })
          .select('id')
          .single();

        if (draftError) throw draftError;
        setDraftId(draft.id);
      } catch (error: any) {
        console.error('Error creating initial draft:', error);
        toast.error('Failed to initialize draft: ' + error.message);
      }
    };

    createInitialDraft();
  }, [userId]);

  const saveChanges = useCallback(async (draftId: string, title: string, content: string) => {
    if (!draftId || !userId) return;

    try {
      const { error } = await supabase
        .from('stories')
        .update({ title, content })
        .eq('id', draftId)
        .eq('author_id', userId);

      if (error) throw error;
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save error:', error);
    }
  }, [userId]);

  const debouncedSave = useCallback(
    debounce((draftId: string, title: string, content: string) => {
      saveChanges(draftId, title, content);
    }, 2000),
    [saveChanges]
  );

  return {
    draftId,
    lastSaved,
    debouncedSave
  };
}
