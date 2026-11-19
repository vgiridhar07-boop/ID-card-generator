import React from 'react';
import { PhotoCropConfig } from '@/types/id-card';

interface CardPhotoFrameProps {
  photoDataUrl: string | null;
  crop?: PhotoCropConfig;
  className?: string;
  shape?: 'rounded' | 'circle' | 'square';
  alt?: string;
  accentColor?: string;
}

export function CardPhotoFrame({
  photoDataUrl,
  crop = { zoom: 1.0, offsetX: 0, offsetY: 0 },
  className = '',
  shape = 'rounded',
  alt = 'Student Photo',
  accentColor = '#1B365D',
}: CardPhotoFrameProps) {
  const shapeClass =
    shape === 'circle'
      ? 'rounded-full'
      : shape === 'square'
      ? 'rounded-none'
      : 'rounded-md';

  return (
    <div
      className={`relative overflow-hidden bg-[#E2E8F0] border border-studio-border/80 shadow-inner flex items-center justify-center select-none ${shapeClass} ${className}`}
      style={{
        borderColor: accentColor ? `${accentColor}33` : undefined,
      }}
    >
      {photoDataUrl ? (
        <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
          <img
            src={photoDataUrl}
            alt={alt}
            className="w-full h-full object-cover transition-transform duration-75 pointer-events-none"
            style={{
              transform: `scale(${crop.zoom || 1.0}) translate(${crop.offsetX || 0}%, ${crop.offsetY || 0}%)`,
              transformOrigin: 'center center',
            }}
          />
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100 p-2">
          <svg
            className="w-3/5 h-3/5 text-slate-300"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
          <span className="text-[7.5px] font-mono tracking-wider uppercase text-slate-400 mt-1">
            Photo
          </span>
        </div>
      )}
    </div>
  );
}
