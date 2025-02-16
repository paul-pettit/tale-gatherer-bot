
import { useAuth } from "@/hooks/useAuth";
import { AvatarUpload } from "./AvatarUpload";

interface ProfileHeaderProps {
  avatarUrl?: string;
  firstName: string;
  email?: string;
  onAvatarChange: (url: string | null) => void;
}

export function ProfileHeader({ avatarUrl, firstName, email, onAvatarChange }: ProfileHeaderProps) {
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
        <h3 className="text-2xl font-semibold truncate">{firstName || "Not set"}</h3>
        <p className="text-sm text-muted-foreground truncate" title={email}>
          {email}
        </p>
      </div>
    </div>
  );
}
