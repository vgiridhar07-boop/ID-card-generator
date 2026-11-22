import React, { useRef } from 'react';
import { PhotoCropConfig } from '@/types/id-card';
import { processAndCompressImage } from '@/lib/image-utils';
import { DEFAULT_PHOTO_CROP } from '@/lib/constants';
import { Upload, X, RotateCcw, ZoomIn, MoveHorizontal, MoveVertical, Image as ImageIcon } from 'lucide-react';

interface PhotoUploaderProps {
  photoDataUrl: string | null;
  crop: PhotoCropConfig;
  onPhotoChange: (photoDataUrl: string | null) => void;
  onCropChange: (crop: PhotoCropConfig) => void;
}

export function PhotoUploader({
  photoDataUrl,
  crop,
  onPhotoChange,
  onCropChange,
}: PhotoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressedDataUrl = await processAndCompressImage(file, 800, 0.88);
      onPhotoChange(compressedDataUrl);
      onCropChange({ ...DEFAULT_PHOTO_CROP });
    } catch (err) {
      console.error('Photo upload failed:', err);
      alert('Unable to process student photograph. Please provide a valid JPG, PNG, or WEBP file.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const resetCrop = () => {
    onCropChange({ ...DEFAULT_PHOTO_CROP });
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFileUpload}
        className="hidden"
      />

      {!photoDataUrl ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-studio-border hover:border-studio-action/50 bg-studio-panel hover:bg-studio-subtle/30 rounded-lg p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center group"
        >
          <div className="w-10 h-10 rounded-full bg-studio-subtle flex items-center justify-center text-studio-ink-secondary group-hover:text-studio-action group-hover:bg-studio-panel transition-all mb-2">
            <Upload className="w-5 h-5" />
          </div>
          <span className="font-sans font-semibold text-[13px] text-studio-ink-primary">
            Upload Student Portrait Photograph
          </span>
          <p className="text-[11px] text-studio-ink-muted mt-1 max-w-xs">
            Passport-style front-facing portrait. Automatically scaled and optimized for 300 DPI CR80 print.
          </p>
          <span className="inline-block mt-3 px-3 py-1 bg-studio-subtle border border-studio-border rounded text-[11px] font-mono text-studio-ink-secondary">
            JPG, PNG, or WEBP up to 10MB
          </span>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Active Photo Header with Remove & Change */}
          <div className="flex items-center justify-between p-3 bg-studio-panel border border-studio-border rounded-md">
            <div className="flex items-center gap-3">
              <div className="w-12 h-14 bg-slate-100 rounded border border-studio-border overflow-hidden relative flex items-center justify-center">
                <img
                  src={photoDataUrl}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                  style={{
                    transform: `scale(${crop.zoom}) translate(${crop.offsetX}%, ${crop.offsetY}%)`,
                  }}
                />
              </div>
              <div>
                <span className="font-sans font-semibold text-[12.5px] text-studio-ink-primary block">
                  Portrait Photo Active
                </span>
                <span className="font-mono text-[10px] text-studio-ink-muted">
                  Zoom {crop.zoom.toFixed(2)}x • Offset ({crop.offsetX}%, {crop.offsetY}%)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="min-h-[38px] px-3 py-1.5 text-[11.5px] font-medium bg-studio-subtle hover:bg-studio-border/70 border border-studio-border rounded text-studio-ink-primary transition-colors flex items-center justify-center"
              >
                Change
              </button>
              <button
                type="button"
                onClick={() => onPhotoChange(null)}
                className="min-h-[38px] min-w-[38px] p-2 text-studio-destructive hover:bg-studio-destructive-tint rounded transition-colors flex items-center justify-center"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Precision Crop Sliders */}
          <div className="p-3 bg-studio-panel border border-studio-border rounded-md space-y-3">
            <div className="flex items-center justify-between border-b border-studio-border/60 pb-2">
              <span className="font-mono text-[11px] uppercase tracking-wider text-studio-ink-secondary">
                Precision Framing & Alignment
              </span>
              <button
                type="button"
                onClick={resetCrop}
                className="min-h-[36px] text-[11px] font-mono text-studio-action hover:underline flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Frame
              </button>
            </div>

            {/* Zoom Slider */}
            <div>
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-studio-ink-secondary flex items-center gap-1">
                  <ZoomIn className="w-3.5 h-3.5" /> Optical Zoom
                </span>
                <span className="font-mono text-studio-ink-primary font-semibold">
                  {crop.zoom.toFixed(2)}x
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="2.5"
                step="0.05"
                value={crop.zoom}
                onChange={(e) => onCropChange({ ...crop, zoom: parseFloat(e.target.value) })}
                className="w-full accent-studio-action cursor-pointer"
              />
            </div>

            {/* Horizontal Shift */}
            <div>
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-studio-ink-secondary flex items-center gap-1">
                  <MoveHorizontal className="w-3.5 h-3.5" /> Horizontal Shift (X)
                </span>
                <span className="font-mono text-studio-ink-primary font-semibold">
                  {crop.offsetX}%
                </span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                step="1"
                value={crop.offsetX}
                onChange={(e) => onCropChange({ ...crop, offsetX: parseInt(e.target.value) })}
                className="w-full accent-studio-action cursor-pointer"
              />
            </div>

            {/* Vertical Shift */}
            <div>
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-studio-ink-secondary flex items-center gap-1">
                  <MoveVertical className="w-3.5 h-3.5" /> Vertical Shift (Y)
                </span>
                <span className="font-mono text-studio-ink-primary font-semibold">
                  {crop.offsetY}%
                </span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                step="1"
                value={crop.offsetY}
                onChange={(e) => onCropChange({ ...crop, offsetY: parseInt(e.target.value) })}
                className="w-full accent-studio-action cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
