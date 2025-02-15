
import { CardHeader, CardTitle } from '@/components/ui/card';

interface StoryHeaderProps {
  remainingStories: number;
  lastSaved: Date | null;
}

export function StoryHeader({ remainingStories, lastSaved }: StoryHeaderProps) {
  return (
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
  );
}
