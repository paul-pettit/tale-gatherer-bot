import { useCallback, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

  const getCroppedImg = (image: HTMLImageElement, crop: Crop): Promise<Blob> => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    const cropWidth = (crop.width * image.width * scaleX) / 100;
    const cropHeight = (crop.height * image.height * scaleY) / 100;
    const size = Math.min(cropWidth, cropHeight);

    canvas.width = size;
    canvas.height = size;

    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const cropX = (crop.x * image.width * scaleX) / 100;
    const cropY = (crop.y * image.height * scaleY) / 100;

    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      size,
      size
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) throw new Error('Canvas is empty');
        resolve(blob);
      }, 'image/jpeg', 1);
    });
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
                onChange={onSelectFile}
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

      <Dialog open={showCropDialog} onOpenChange={setShowCropDialog}>
        <DialogContent className="max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Crop Profile Picture</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            {imgSrc && (
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                aspect={1}
                circularCrop
                className="max-w-full mx-auto"
              >
                <img
                  ref={(e) => setImageRef(e)}
                  src={imgSrc}
                  alt="Crop me"
                  className="max-w-full h-auto mx-auto"
                />
              </ReactCrop>
            )}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCropDialog(false);
                  setImgSrc('');
                  setSelectedFile(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCropComplete}
                disabled={isUploading}
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
