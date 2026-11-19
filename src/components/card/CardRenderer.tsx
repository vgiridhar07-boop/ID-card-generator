import React from 'react';
import { CardDesignConfig, CardOrientation, CardSide, InstitutionBranding, StudentDetails } from '@/types/id-card';
import { ClassicAcademicCard } from './templates/ClassicAcademicCard';
import { ModernMinimalCard } from './templates/ModernMinimalCard';
import { HeritageCrestCard } from './templates/HeritageCrestCard';
import { CampusTechCard } from './templates/CampusTechCard';
import { ExecutiveMetroCard } from './templates/ExecutiveMetroCard';
import { NordicCleanCard } from './templates/NordicCleanCard';
import { AiDynamicCardRenderer } from './AiDynamicCardRenderer';

export interface CardRendererProps {
  institution: InstitutionBranding;
  student: StudentDetails;
  design: CardDesignConfig;
  side: CardSide;
  isExportNode?: boolean;
  className?: string;
  id?: string;
}

export const CardRenderer = React.forwardRef<HTMLDivElement, CardRendererProps>(
  function CardRenderer(
    {
      institution,
      student,
      design,
      side,
      isExportNode = false,
      className = '',
      id,
    },
    ref
  ) {
    const isPortrait = design.orientation === 'portrait';
    const showLanyard = !isExportNode && design.showLanyardSlotPreview;
    const aiBackground = design.aiBackground;

    // Dimensions: exactly 324px x 514px (portrait) or 514px x 324px (landscape)
    // Corner radius: 19px (~3.18mm on CR80)
    const cardDimensionsStyle: React.CSSProperties = isPortrait
      ? { width: 324, height: 514, minWidth: 324, minHeight: 514, borderRadius: 19 }
      : { width: 514, height: 324, minWidth: 514, minHeight: 324, borderRadius: 19 };

    const renderTemplateContent = () => {
      if (design.templateId === 'ai-dynamic' && design.aiDynamicSpec) {
        return (
          <AiDynamicCardRenderer
            spec={design.aiDynamicSpec}
            student={student}
            institution={institution}
            side={side}
            orientation={design.orientation}
            isExportNode={isExportNode}
          />
        );
      }

      switch (design.templateId) {
        case 'modern-minimal':
          return (
            <ModernMinimalCard
              institution={institution}
              student={student}
              orientation={design.orientation}
              side={side}
              isExportNode={isExportNode}
            />
          );
        case 'heritage-crest':
          return (
            <HeritageCrestCard
              institution={institution}
              student={student}
              orientation={design.orientation}
              side={side}
              isExportNode={isExportNode}
            />
          );
        case 'campus-tech':
          return (
            <CampusTechCard
              institution={institution}
              student={student}
              orientation={design.orientation}
              side={side}
              isExportNode={isExportNode}
            />
          );
        case 'executive-metro':
          return (
            <ExecutiveMetroCard
              institution={institution}
              student={student}
              orientation={design.orientation}
              side={side}
              isExportNode={isExportNode}
            />
          );
        case 'nordic-clean':
          return (
            <NordicCleanCard
              institution={institution}
              student={student}
              orientation={design.orientation}
              side={side}
              isExportNode={isExportNode}
            />
          );
        case 'classic-academic':
        default:
          return (
            <ClassicAcademicCard
              institution={institution}
              student={student}
              orientation={design.orientation}
              side={side}
              isExportNode={isExportNode}
            />
          );
      }
    };

    return (
      <div
        ref={ref}
        id={id}
        data-card-side={side}
        data-card-orientation={design.orientation}
        style={cardDimensionsStyle}
        className={`relative overflow-hidden select-none box-border ${
          isExportNode ? 'border border-black/10' : 'shadow-card-elevated ring-1 ring-black/5'
        } ${className}`}
      >
        {/* Layer 0: AI-Generated Decorative Background (if active on standard templates) */}
        {design.templateId !== 'ai-dynamic' && aiBackground?.imageUrl && (
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <img
              src={aiBackground.imageUrl}
              alt="AI Background Artwork"
              className="w-full h-full object-cover"
              style={{ opacity: aiBackground.opacity ?? 0.92 }}
            />
            {/* Readability Contrast Scrim: Guarantees text & photo legibility */}
            <div
              className="absolute inset-0 bg-white backdrop-blur-[0.5px] pointer-events-none"
              style={{ opacity: aiBackground.scrimOpacity ?? 0.35 }}
            />
          </div>
        )}

        {/* Lanyard Slot Punch Hole Preview (Excluded from Print Export) */}
        {showLanyard && (
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center"
            title="Lanyard punch slot (preview only, excluded from print)"
          >
            <div className="w-10 h-2 rounded-full bg-[#1e293b]/70 border border-white/40 shadow-inner" />
          </div>
        )}

        {/* Layer 2: Deterministic Card Template & Student Credential Body */}
        <div className={`w-full h-full relative z-10 overflow-hidden ${aiBackground?.imageUrl ? 'bg-transparent' : ''}`}>
          {renderTemplateContent()}
        </div>
      </div>
    );
  }
);
