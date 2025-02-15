
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
        // Get or create personal family
        let { data: families } = await supabase
          .from('families')
          .select('id')
          .eq('created_by', userId)
          .limit(1);

        let familyId;

        if (!families || families.length === 0) {
          const { data: newFamily, error: familyError } = await supabase
            .from('families')
            .insert({
              name: 'Personal Stories',
              created_by: userId,
              subscription_tier: 'free'
            })
            .select('id')
            .single();

          if (familyError) throw familyError;
          familyId = newFamily.id;

          await supabase
            .from('family_members')
            .insert({
              family_id: familyId,
              profile_id: userId,
              is_admin: true,
              role: 'owner'
            });
        } else {
          familyId = families[0].id;
        }

        // Create initial draft
        const { data: draft, error } = await supabase
          .from('stories')
          .insert({
            title: '',
            content: '',
            author_id: userId,
            family_id: familyId,
            status: 'draft',
          })
          .select('id')
          .single();

        if (error) throw error;
        setDraftId(draft.id);
      } catch (error) {
        console.error('Error creating initial draft:', error);
        toast.error('Failed to initialize draft');
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
        .eq('id', draftId);

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
