
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileHeaderProps {
  avatarUrl?: string;
  firstName: string;
  email?: string;
}

export function ProfileHeader({ avatarUrl, firstName, email }: ProfileHeaderProps) {
  return (
    <div className="flex items-center space-x-4">
      <Avatar className="h-20 w-20">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>{firstName?.[0] || email?.[0]}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <h3 className="text-2xl font-semibold">{firstName || "Not set"}</h3>
        <p className="text-sm text-muted-foreground">
          {email}
        </p>
      </div>
    </div>
  );
}
