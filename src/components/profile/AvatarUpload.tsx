
import { useCallback, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AvatarUploadProps {
  userId: string;
  avatarUrl?: string;
  onAvatarChange: (url: string | null) => void;
  size?: "sm" | "md" | "lg";
  showSkip?: boolean;
  onSkip?: () => void;
  fallback: string;
}

export function AvatarUpload({ 
  userId, 
  avatarUrl, 
  onAvatarChange, 
  size = "md", 
  showSkip = false,
  onSkip,
  fallback 
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const sizeClasses = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-32 w-32"
  };

  const handleUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      // Delete existing avatar if there is one
      if (avatarUrl) {
        const oldAvatarPath = avatarUrl.split('/').pop();
        if (oldAvatarPath) {
          await supabase.storage
            .from('avatars')
            .remove([`${userId}/${oldAvatarPath}`]);
        }
      }

      // Upload new avatar
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      onAvatarChange(publicUrl);
      toast.success('Profile picture updated successfully');
    } catch (error: any) {
      toast.error('Error uploading image: ' + error.message);
    } finally {
      setIsUploading(false);
      setShowOptions(false);
    }
  }, [userId, avatarUrl, onAvatarChange]);

  const handleDelete = useCallback(async () => {
    try {
      if (!avatarUrl) return;

      const avatarPath = avatarUrl.split('/').pop();
      if (!avatarPath) return;

      setIsUploading(true);
      const { error } = await supabase.storage
        .from('avatars')
        .remove([`${userId}/${avatarPath}`]);

      if (error) throw error;

      onAvatarChange(null);
      toast.success('Profile picture removed successfully');
    } catch (error: any) {
      toast.error('Error removing image: ' + error.message);
    } finally {
      setIsUploading(false);
      setShowOptions(false);
    }
  }, [userId, avatarUrl, onAvatarChange]);

  return (
    <div className="space-y-4">
      <div className="relative group">
        <Avatar className={sizeClasses[size]}>
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          <Button
            variant="secondary"
            size="sm"
            className="relative z-10 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setShowOptions(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>

        {showOptions && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-card p-2 rounded-lg shadow-lg border flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="relative"
              disabled={isUploading}
            >
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleUpload}
                accept="image/*"
                disabled={isUploading}
              />
              {avatarUrl ? <Pencil className="h-4 w-4 mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
              {avatarUrl ? 'Change' : 'Upload'}
            </Button>
            
            {avatarUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={isUploading}
              >
                <Trash className="h-4 w-4 mr-2" />
                Remove
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowOptions(false)}
              className="ml-1"
            >
              Cancel
            </Button>
          </div>
        )}

        {showSkip && onSkip && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onSkip}
            disabled={isUploading}
            className="mt-4"
          >
            Skip for now
          </Button>
        )}
      </div>
    </div>
  );
}
