
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useFreeTier } from '@/hooks/useFreeTier';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function NewStoryPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { remainingStories, incrementStoryCount } = useFreeTier();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to create a story');
      return;
    }

    try {
      setIsSubmitting(true);

      // First, try to get the user's personal family
      let { data: families } = await supabase
        .from('families')
        .select('id')
        .eq('created_by', user.id)
        .limit(1);

      let familyId;

      // If user doesn't have a family, create one
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
        
        // Add user as a member of their new family
        const { error: memberError } = await supabase
          .from('family_members')
          .insert({
            family_id: familyId,
            profile_id: user.id,
            is_admin: true,
            role: 'owner'
          });

        if (memberError) throw memberError;
      } else {
        familyId = families[0].id;
        
        // Check if user is already a member of the family
        const { data: existingMember } = await supabase
          .from('family_members')
          .select('id')
          .eq('family_id', familyId)
          .eq('profile_id', user.id)
          .single();

        // If not a member yet, add them
        if (!existingMember) {
          const { error: memberError } = await supabase
            .from('family_members')
            .insert({
              family_id: familyId,
              profile_id: user.id,
              is_admin: true,
              role: 'owner'
            });

          if (memberError) throw memberError;
        }
      }
      
      const { error } = await supabase
        .from('stories')
        .insert({
          title,
          content,
          author_id: user.id,
          family_id: familyId,
          status: 'draft',
        });

      if (error) throw error;

      await incrementStoryCount();
      toast.success('Story created successfully!');
      navigate('/');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An error occurred while creating the story');
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
          {remainingStories > 0 && (
            <p className="text-sm text-muted-foreground">
              You have {remainingStories} stories remaining in your free tier
            </p>
          )}
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
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Story'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
