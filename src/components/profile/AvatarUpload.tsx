
import { useCallback, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { type Crop } from 'react-image-crop';
import { AvatarCropDialog } from "./avatar/AvatarCropDialog";
import { AvatarOptionsMenu } from "./avatar/AvatarOptionsMenu";
import { getCroppedImg } from "./avatar/image-cropper";

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
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5
  });
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);

  const sizeClasses = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-32 w-32"
  };

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setImgSrc(reader.result?.toString() || '');
      setShowCropDialog(true);
      setShowOptions(false);
    });
    reader.readAsDataURL(file);
  };

  const handleCropComplete = useCallback(async () => {
    try {
      if (!imageRef || !selectedFile) return;

      setIsUploading(true);
      const croppedBlob = await getCroppedImg(imageRef, crop);
      const croppedFile = new File([croppedBlob], selectedFile.name, {
        type: 'image/jpeg',
      });

      if (avatarUrl) {
        const oldAvatarPath = avatarUrl.split('/').pop();
        if (oldAvatarPath) {
          await supabase.storage
            .from('avatars')
            .remove([`${userId}/${oldAvatarPath}`]);
        }
      }

      const fileExt = 'jpg';
      const filePath = `${userId}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, croppedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      onAvatarChange(publicUrl);
      toast.success('Profile picture updated successfully');
      setShowCropDialog(false);
      setImgSrc('');
      setSelectedFile(null);
    } catch (error: any) {
      toast.error('Error uploading image: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  }, [imageRef, crop, selectedFile, userId, avatarUrl, onAvatarChange]);

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
        <Avatar className={`${sizeClasses[size]} overflow-hidden`}>
          <AvatarImage 
            src={avatarUrl} 
            className="h-full w-full"
          />
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

        <AvatarOptionsMenu
          show={showOptions}
          onClose={() => setShowOptions(false)}
          onFileChange={onSelectFile}
          onDelete={handleDelete}
          isUploading={isUploading}
          hasAvatar={!!avatarUrl}
        />

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

      <AvatarCropDialog
        open={showCropDialog}
        onOpenChange={setShowCropDialog}
        imgSrc={imgSrc}
        crop={crop}
        onCropChange={setCrop}
        onSave={handleCropComplete}
        onCancel={() => {
          setShowCropDialog(false);
          setImgSrc('');
          setSelectedFile(null);
        }}
        isLoading={isUploading}
        imageRef={setImageRef}
      />
    </div>
  );
}
