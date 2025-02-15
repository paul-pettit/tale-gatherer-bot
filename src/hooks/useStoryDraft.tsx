
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
        // First check if user already has a personal family
        const { data: families, error: familiesError } = await supabase
          .from('families')
          .select('id')
          .eq('created_by', userId)
          .eq('name', 'Personal Stories')
          .maybeSingle();

        if (familiesError) throw familiesError;

        let familyId;

        if (!families) {
          // Create a new personal family if none exists
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

          // Add user as family member and owner
          const { error: memberError } = await supabase
            .from('family_members')
            .insert({
              family_id: familyId,
              profile_id: userId,
              is_admin: true,
              role: 'owner'
            });

          if (memberError) throw memberError;
        } else {
          familyId = families.id;
        }

        // Create initial draft
        const { data: draft, error: draftError } = await supabase
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
        .eq('author_id', userId); // Add author check for RLS

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
