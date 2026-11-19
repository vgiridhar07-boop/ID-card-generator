/**
 * Client-side image compression and processing utilities
 * Prevents localStorage QuotaExceededError by resizing high-res camera uploads to 800px max bounds.
 */

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

export function processAndCompressImage(file: File, maxDimension = 800, quality = 0.88): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      if (file.type === 'image/svg+xml') {
        const dataUrl = await readFileAsDataUrl(file);
        return resolve(dataUrl);
      }

      const rawDataUrl = await readFileAsDataUrl(file);
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;
        if (width <= maxDimension && height <= maxDimension && file.size < 300 * 1024) {
          // File is already small enough
          return resolve(rawDataUrl);
        }

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(rawDataUrl);
        }

        // Draw with high quality interpolation
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const compressedDataUrl = canvas.toDataURL(mime, quality);
        resolve(compressedDataUrl);
      };

      img.onerror = (err) => {
        console.error('Failed to load image for compression:', err);
        reject(new Error('Invalid image file or format cannot be parsed.'));
      };

      img.src = rawDataUrl;
    } catch (err) {
      reject(err);
    }
  });
}
