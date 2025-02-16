
import { type Crop } from 'react-image-crop';

export const getCroppedImg = (image: HTMLImageElement, crop: Crop): Promise<Blob> => {
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
