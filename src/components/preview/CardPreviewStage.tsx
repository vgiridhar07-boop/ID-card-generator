import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { CardDesignConfig, CardOrientation, CardSide, InstitutionBranding, StudentDetails } from '@/types/id-card';
import { CardRenderer } from '../card/CardRenderer';
import { RefreshCw, ZoomIn, ZoomOut, Maximize2, ShieldCheck, Eye } from 'lucide-react';

interface CardPreviewStageProps {
  institution: InstitutionBranding;
  student: StudentDetails;
  design: CardDesignConfig;
}

export interface CardPreviewStageRef {
  getFrontExportNode: () => HTMLDivElement | null;
  getBackExportNode: () => HTMLDivElement | null;
}

export const CardPreviewStage = forwardRef<CardPreviewStageRef, CardPreviewStageProps>(
  function CardPreviewStage({ institution, student, design }, ref) {
    const [currentSide, setCurrentSide] = useState<CardSide>('front');
    const [zoomLevel, setZoomLevel] = useState<number>(1.0);

    const frontExportRef = useRef<HTMLDivElement>(null);
    const backExportRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      getFrontExportNode: () => frontExportRef.current,
      getBackExportNode: () => backExportRef.current,
    }));

    const toggleSide = () => {
      setCurrentSide((prev) => (prev === 'front' ? 'back' : 'front'));
    };

    const isPortrait = design.orientation === 'portrait';

    return (
      <div className="flex flex-col h-full w-full max-w-full select-none overflow-hidden">
        {/* Top Stage Control Strip */}
        <div className="bg-studio-panel border-b border-studio-border px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2 z-20 shrink-0 w-full max-w-full">
          {/* Side Toggle Tabs & Quick Flip */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <div className="flex items-center gap-1 p-0.5 sm:p-1 bg-studio-subtle border border-studio-border rounded-md">
              <button
                type="button"
                onClick={() => setCurrentSide('front')}
                className={`px-2.5 sm:px-3 py-1.5 sm:py-1 rounded text-[11px] sm:text-[11.5px] font-medium min-h-[38px] sm:min-h-0 transition-all ${
                  currentSide === 'front'
                    ? 'bg-studio-panel text-studio-ink-primary shadow-xs font-semibold'
                    : 'text-studio-ink-secondary hover:text-studio-ink-primary'
                }`}
              >
                Obverse (Front)
              </button>
              <button
                type="button"
                onClick={() => setCurrentSide('back')}
                className={`px-2.5 sm:px-3 py-1.5 sm:py-1 rounded text-[11px] sm:text-[11.5px] font-medium min-h-[38px] sm:min-h-0 transition-all ${
                  currentSide === 'back'
                    ? 'bg-studio-panel text-studio-ink-primary shadow-xs font-semibold'
                    : 'text-studio-ink-secondary hover:text-studio-ink-primary'
                }`}
              >
                Reverse (Back)
              </button>
            </div>

            {/* Quick Flip Button */}
            <button
              type="button"
              onClick={toggleSide}
              className="px-2.5 sm:px-3 py-1.5 sm:py-1 text-[11px] font-mono text-studio-action hover:bg-studio-subtle border border-studio-border rounded-md min-h-[38px] sm:min-h-0 flex items-center gap-1.5 transition-colors shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Flip Card</span>
            </button>
          </div>

          {/* Zoom Controls & Dimension Specs */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-studio-subtle border border-studio-border rounded px-1.5 py-0.5">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(0.6, Math.round((z - 0.1) * 10) / 10))}
                className="p-1 hover:bg-studio-panel rounded text-studio-ink-secondary transition-colors min-h-[36px] sm:min-h-0 min-w-[36px] sm:min-w-0 flex items-center justify-center"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[10px] text-studio-ink-primary px-1 font-semibold min-w-[34px] text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(1.4, Math.round((z + 0.1) * 10) / 10))}
                className="p-1 hover:bg-studio-panel rounded text-studio-ink-secondary transition-colors min-h-[36px] sm:min-h-0 min-w-[36px] sm:min-w-0 flex items-center justify-center"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(1.0)}
                className="p-1 hover:bg-studio-panel rounded text-studio-ink-secondary transition-colors ml-0.5 min-h-[36px] sm:min-h-0 min-w-[36px] sm:min-w-0 flex items-center justify-center"
                title="Actual Size (100%)"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="hidden sm:block font-mono text-[10px] text-studio-ink-muted bg-studio-panel border border-studio-border px-2 py-1 rounded">
              {isPortrait ? '53.98 × 85.60 mm' : '85.60 × 53.98 mm'} (CR80)
            </div>
          </div>
        </div>

        {/* Drafting Mat Viewport */}
        <div className="flex-1 bg-drafting-grid flex items-center justify-center p-3 sm:p-6 relative overflow-x-hidden overflow-y-auto min-h-[340px] sm:min-h-[520px] w-full max-w-full">
          {/* Card Presentation Container with responsive mobile scaling */}
          <div
            className="transition-transform duration-150 ease-out origin-center flex items-center justify-center max-w-full"
            style={{
              transform: `scale(${zoomLevel})`,
              maxWidth: '100%',
            }}
          >
            <div className="scale-[0.80] xs:scale-[0.88] sm:scale-100 origin-center transition-transform max-w-full">
              <CardRenderer
                institution={institution}
                student={student}
                design={design}
                side={currentSide}
                isExportNode={false}
              />
            </div>
          </div>

          {/* Bottom Floating Card Spec Pill */}
          <div className="absolute bottom-2.5 sm:bottom-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm border border-studio-border px-2.5 sm:px-3 py-1 rounded-full shadow-xs flex items-center gap-1.5 sm:gap-2 pointer-events-none max-w-[92vw] truncate">
            <span className="w-2 h-2 rounded-full bg-studio-success shrink-0" />
            <span className="text-[9.5px] sm:text-[10px] font-mono uppercase tracking-wider text-studio-ink-secondary truncate">
              {currentSide.toUpperCase()} • CR80 ISO/IEC 7810 ID-1
            </span>
          </div>
        </div>

        {/* Offscreen Hidden Export Capture Nodes (Scale 3x High-Res Ready) */}
        <div
          style={{
            position: 'absolute',
            left: -9999,
            top: 0,
            opacity: 1,
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        >
          {/* Front Node */}
          <CardRenderer
            ref={frontExportRef}
            institution={institution}
            student={student}
            design={design}
            side="front"
            isExportNode={true}
          />
          {/* Back Node */}
          <CardRenderer
            ref={backExportRef}
            institution={institution}
            student={student}
            design={design}
            side="back"
            isExportNode={true}
          />
        </div>
      </div>
    );
  }
);
