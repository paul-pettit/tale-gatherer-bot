
import { type Crop } from 'react-image-crop';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AvatarCropDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imgSrc: string;
  crop: Crop;
  onCropChange: (crop: Crop) => void;
  onSave: () => void;
  onCancel: () => void;
  isLoading: boolean;
  imageRef: (node: HTMLImageElement | null) => void;
}

export function AvatarCropDialog({
  open,
  onOpenChange,
  imgSrc,
  crop,
  onCropChange,
  onSave,
  onCancel,
  isLoading,
  imageRef,
}: AvatarCropDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Crop Profile Picture</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {imgSrc && (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => onCropChange(percentCrop)}
              aspect={1}
              circularCrop
              className="max-w-full mx-auto"
            >
              <img
                ref={imageRef}
                src={imgSrc}
                alt="Crop me"
                className="max-w-full h-auto mx-auto"
              />
            </ReactCrop>
          )}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              onClick={onSave}
              disabled={isLoading}
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
