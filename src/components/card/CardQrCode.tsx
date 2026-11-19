import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface CardQrCodeProps {
  value: string;
  size?: number;
  className?: string;
  darkColor?: string;
  lightColor?: string;
}

/**
 * Pure Vector SVG QR Code Renderer
 * Generates self-contained, scannable SVG QR codes without external image requests or canvas taint.
 */
export function CardQrCode({
  value,
  size = 54,
  className = '',
  darkColor = '#181A1F',
  lightColor = '#FFFFFF',
}: CardQrCodeProps) {
  const [svgString, setSvgString] = useState<string>('');

  useEffect(() => {
    const rawVal = value || 'https://verify.student-id.studio';
    QRCode.toString(rawVal, {
      type: 'svg',
      margin: 1,
      width: size,
      color: {
        dark: darkColor,
        light: lightColor,
      },
      errorCorrectionLevel: 'M',
    })
      .then((svg) => {
        setSvgString(svg);
      })
      .catch((err) => {
        console.error('QR code generation error:', err);
      });
  }, [value, size, darkColor, lightColor]);

  if (!svgString) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`bg-studio-subtle border border-studio-border/60 rounded flex items-center justify-center text-[7px] font-mono text-studio-ink-muted ${className}`}
      >
        QR
      </div>
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={`shrink-0 overflow-hidden select-none ${className}`}
      dangerouslySetInnerHTML={{ __html: svgString }}
    />
  );
}
