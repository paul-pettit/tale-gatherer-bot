
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface StoryFormProps {
  title: string;
  content: string;
  isSubmitting: boolean;
  draftId: string | null;
  remainingStories: number;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function StoryForm({
  title,
  content,
  isSubmitting,
  draftId,
  remainingStories,
  onTitleChange,
  onContentChange,
  onSubmit,
  onCancel,
}: StoryFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Input
          placeholder="Enter story title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          required
          className="w-full"
        />
      </div>
      <div>
        <Textarea
          placeholder="Write your story here..."
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          required
          className="min-h-[200px] w-full"
        />
      </div>
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
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
  );
}
