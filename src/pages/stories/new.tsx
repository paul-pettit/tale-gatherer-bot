import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useFreeTier } from '@/hooks/useFreeTier';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import debounce from 'lodash/debounce';

export default function NewStoryPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { remainingStories, decrementStoryToken } = useFreeTier();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Create initial draft when component mounts
  useEffect(() => {
    const createInitialDraft = async () => {
      if (!user) return;

      try {
        // Get or create personal family
        let { data: families } = await supabase
          .from('families')
          .select('id')
          .eq('created_by', user.id)
          .limit(1);

        let familyId;

        if (!families || families.length === 0) {
          const { data: newFamily, error: familyError } = await supabase
            .from('families')
            .insert({
              name: 'Personal Stories',
              created_by: user.id,
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
              profile_id: user.id,
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
            author_id: user.id,
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
  }, [user]);

  // Auto-save functionality
  const saveChanges = useCallback(async (newTitle: string, newContent: string) => {
    if (!draftId || !user) return;

    try {
      const { error } = await supabase
        .from('stories')
        .update({ title: newTitle, content: newContent })
        .eq('id', draftId);

      if (error) throw error;
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save error:', error);
      // Don't show toast for auto-save errors to avoid spamming the user
    }
  }, [draftId, user]);

  const debouncedSave = useCallback(
    debounce((newTitle: string, newContent: string) => {
      saveChanges(newTitle, newContent);
    }, 2000),
    [saveChanges]
  );

  // Trigger auto-save when content changes
  useEffect(() => {
    if (draftId) {
      debouncedSave(title, content);
    }
    return () => {
      debouncedSave.cancel();
    };
  }, [title, content, draftId, debouncedSave]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to create a story');
      return;
    }

    if (!draftId) {
      toast.error('Draft not initialized');
      return;
    }

    try {
      setIsSubmitting(true);

      // Final save and status update
      const { error } = await supabase
        .from('stories')
        .update({
          title,
          content,
          status: 'published'
        })
        .eq('id', draftId);

      if (error) throw error;

      await decrementStoryToken();
      toast.success('Story published successfully!');
      navigate('/');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An error occurred while publishing the story');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Create New Story</CardTitle>
          <div className="space-y-2">
            {remainingStories > 0 ? (
              <p className="text-sm text-muted-foreground">
                You have {remainingStories} {remainingStories === 1 ? 'story' : 'stories'} remaining
              </p>
            ) : (
              <p className="text-sm text-destructive">
                You have no remaining stories. Please upgrade or purchase additional credits.
              </p>
            )}
            {lastSaved && (
              <p className="text-sm text-muted-foreground">
                Last saved: {lastSaved.toLocaleTimeString()}
              </p>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Enter story title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div>
              <Textarea
                placeholder="Write your story here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="min-h-[200px] w-full"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !draftId || remainingStories <= 0}
              >
                {isSubmitting ? 'Publishing...' : 'Publish Story'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
