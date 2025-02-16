
import { type Crop } from 'react-image-crop';

export const getCroppedImg = (image: HTMLImageElement, crop: Crop): Promise<Blob> => {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  // Calculate the actual dimensions of the crop area in pixels
  const cropX = (crop.x * image.width * scaleX) / 100;
  const cropY = (crop.y * image.height * scaleY) / 100;
  const cropWidth = (crop.width * image.width * scaleX) / 100;
  const cropHeight = (crop.height * image.height * scaleY) / 100;

  // Use the actual cropped size for the canvas
  const finalSize = Math.min(cropWidth, cropHeight);
  canvas.width = finalSize;
  canvas.height = finalSize;

  // Fill with white background (in case the image has transparency)
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Create circular clipping path
  ctx.beginPath();
  ctx.arc(finalSize / 2, finalSize / 2, finalSize / 2, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();

  // Draw the cropped portion of the image
  ctx.drawImage(
    image,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    finalSize,
    finalSize
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) throw new Error('Canvas is empty');
      resolve(blob);
    }, 'image/jpeg', 1);
  });
};
