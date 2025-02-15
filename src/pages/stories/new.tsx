
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { useFreeTier } from '@/hooks/useFreeTier';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { StoryForm } from '@/components/stories/StoryForm';
import { StoryHeader } from '@/components/stories/StoryHeader';
import { useStoryDraft } from '@/hooks/useStoryDraft';

export default function NewStoryPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { remainingStories, decrementStoryToken } = useFreeTier();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { draftId, lastSaved, debouncedSave } = useStoryDraft(user?.id);

  // Trigger auto-save when content changes
  useEffect(() => {
    if (draftId) {
      debouncedSave(draftId, title, content);
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
        <StoryHeader 
          remainingStories={remainingStories}
          lastSaved={lastSaved}
        />
        <CardContent>
          <StoryForm
            title={title}
            content={content}
            isSubmitting={isSubmitting}
            draftId={draftId}
            remainingStories={remainingStories}
            onTitleChange={setTitle}
            onContentChange={setContent}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/')}
          />
        </CardContent>
      </Card>
    </div>
  );
}
