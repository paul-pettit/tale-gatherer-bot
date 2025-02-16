
import { useAuth } from "@/hooks/useAuth";
import { AvatarUpload } from "./AvatarUpload";
import { Badge } from "@/components/ui/badge";

interface ProfileHeaderProps {
  avatarUrl?: string;
  firstName: string;
  email?: string;
  onAvatarChange: (url: string | null) => void;
  remainingStories: number;
  subscriptionPlan?: string;
}

export function ProfileHeader({ 
  avatarUrl, 
  firstName, 
  email, 
  onAvatarChange,
  remainingStories,
  subscriptionPlan = 'free'
}: ProfileHeaderProps) {
  const { user } = useAuth();

  return (
    <div className="flex items-center space-x-4">
      {user && (
        <AvatarUpload
          userId={user.id}
          avatarUrl={avatarUrl}
          onAvatarChange={onAvatarChange}
          size="lg"
          fallback={firstName?.[0] || email?.[0] || '?'}
        />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-2xl font-semibold truncate">{firstName || "Not set"}</h3>
          <Badge variant={subscriptionPlan === 'premium' ? 'default' : 'secondary'}>
            {subscriptionPlan.charAt(0).toUpperCase() + subscriptionPlan.slice(1)} Tier
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground truncate" title={email}>
          {email}
        </p>
        <p className="text-sm mt-1">
          <span className="font-medium">{remainingStories}</span> {remainingStories === 1 ? 'credit' : 'credits'} remaining
        </p>
      </div>
    </div>
  );
}
