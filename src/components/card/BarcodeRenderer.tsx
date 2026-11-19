import React from 'react';

interface BarcodeRendererProps {
  value: string;
  width?: number | string;
  height?: number;
  className?: string;
  showText?: boolean;
}

/**
 * High-precision vector barcode simulation (Code 128 style)
 * Generates deterministic mathematical bar widths based on input string hash
 */
export function BarcodeRenderer({
  value,
  width = '100%',
  height = 36,
  className = '',
  showText = true,
}: BarcodeRendererProps) {
  const cleanVal = (value || 'STU-0000-0000').toUpperCase();

  // Generate deterministic pseudo-bar widths from string characters
  const bars: { width: number; isSpace: boolean }[] = [];
  
  // Start pattern
  bars.push({ width: 2, isSpace: false });
  bars.push({ width: 1, isSpace: true });
  bars.push({ width: 2, isSpace: false });
  bars.push({ width: 2, isSpace: true });

  for (let i = 0; i < cleanVal.length; i++) {
    const charCode = cleanVal.charCodeAt(i);
    const pattern = (charCode * 31 + i * 17) % 64;
    
    // 4 elements per character (bar, space, bar, space)
    bars.push({ width: 1 + (pattern & 1), isSpace: false });
    bars.push({ width: 1 + ((pattern >> 1) & 1), isSpace: true });
    bars.push({ width: 1 + ((pattern >> 2) & 2), isSpace: false });
    bars.push({ width: 1 + ((pattern >> 4) & 1), isSpace: true });
  }

  // Stop pattern
  bars.push({ width: 2, isSpace: false });
  bars.push({ width: 1, isSpace: true });
  bars.push({ width: 3, isSpace: false });
  bars.push({ width: 1, isSpace: true });
  bars.push({ width: 2, isSpace: false });

  const totalWidth = bars.reduce((sum, b) => sum + b.width, 0);

  let currentX = 0;

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <svg
        viewBox={`0 0 ${totalWidth} ${height}`}
        style={{ width, height }}
        className="shape-rendering-crispEdges block"
      >
        {bars.map((bar, idx) => {
          const x = currentX;
          currentX += bar.width;
          if (bar.isSpace) return null;
          return (
            <rect
              key={idx}
              x={x}
              y={0}
              width={bar.width}
              height={height}
              fill="currentColor"
            />
          );
        })}
      </svg>
      {showText && (
        <span className="mt-1 font-mono text-[9px] tracking-[0.2em] uppercase text-studio-ink-secondary">
          *{cleanVal}*
        </span>
      )}
    </div>
  );
}
