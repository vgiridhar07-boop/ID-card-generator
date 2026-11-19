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
      <div className="flex flex-col h-full w-full select-none">
        {/* Top Stage Control Strip */}
        <div className="bg-studio-panel border-b border-studio-border px-4 py-2.5 flex items-center justify-between z-20 shrink-0">
          {/* Side Toggle Tabs */}
          <div className="flex items-center gap-1 p-1 bg-studio-subtle border border-studio-border rounded-lg">
            <button
              type="button"
              onClick={() => setCurrentSide('front')}
              className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all focus-ring ${
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
              className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all focus-ring ${
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
            className="px-3 py-1.5 text-[12px] font-mono text-studio-action hover:bg-studio-subtle border border-studio-border rounded-md flex items-center gap-1.5 transition-colors focus-ring"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Flip Card</span>
          </button>

          {/* Zoom Controls & Dimension Specs */}
          <div className="hidden sm:flex items-center gap-2.5">
            <div className="flex items-center gap-1 bg-studio-subtle border border-studio-border rounded-md px-1.5 py-0.5">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
                className="p-1 hover:bg-studio-panel rounded text-studio-ink-secondary transition-colors focus-ring"
                title="Zoom Out"
                aria-label="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[12px] text-studio-ink-primary px-1 font-semibold min-w-[42px] text-center tabular-nums">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
                className="p-1 hover:bg-studio-panel rounded text-studio-ink-secondary transition-colors focus-ring"
                title="Zoom In"
                aria-label="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(1.0)}
                className="p-1 hover:bg-studio-panel rounded text-studio-ink-secondary transition-colors ml-0.5 focus-ring"
                title="Actual Size (100%)"
                aria-label="Actual Size"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="font-mono text-[12px] leading-normal text-studio-ink-secondary bg-studio-panel border border-studio-border px-2.5 py-1 rounded-md tabular-nums">
              {isPortrait ? '53.98 × 85.60 mm' : '85.60 × 53.98 mm'} (CR80)
            </div>
          </div>
        </div>

        {/* Drafting Mat Viewport */}
        <div className="flex-1 bg-drafting-grid flex items-center justify-center p-6 sm:p-8 relative overflow-auto min-h-[580px]">
          {/* Card Presentation Container with scale transform */}
          <div
            className="transition-transform duration-200 ease-out origin-center flex items-center justify-center"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <CardRenderer
              institution={institution}
              student={student}
              design={design}
              side={currentSide}
              isExportNode={false}
            />
          </div>

          {/* Bottom Floating Card Spec Pill */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border border-studio-border px-4 py-1.5 rounded-full shadow-sm flex items-center gap-2 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-studio-success" />
            <span className="text-[12px] font-mono tracking-wider text-studio-ink-secondary tabular-nums leading-normal">
              Viewing {currentSide.toUpperCase()} • ISO/IEC 7810 ID-1 Standard
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
