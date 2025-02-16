
import { Button } from "@/components/ui/button";
import { Pencil, Trash, Upload } from "lucide-react";

interface AvatarOptionsMenuProps {
  show: boolean;
  onClose: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete?: () => void;
  isUploading: boolean;
  hasAvatar: boolean;
}

export function AvatarOptionsMenu({
  show,
  onClose,
  onFileChange,
  onDelete,
  isUploading,
  hasAvatar
}: AvatarOptionsMenuProps) {
  if (!show) return null;

  return (
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
          onChange={onFileChange}
          accept="image/*"
          disabled={isUploading}
        />
        {hasAvatar ? <Pencil className="h-4 w-4 mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
        {hasAvatar ? 'Change' : 'Upload'}
      </Button>
      
      {hasAvatar && onDelete && (
        <Button
          variant="outline"
          size="sm"
          onClick={onDelete}
          disabled={isUploading}
        >
          <Trash className="h-4 w-4 mr-2" />
          Remove
        </Button>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="ml-1"
      >
        Cancel
      </Button>
    </div>
  );
}
