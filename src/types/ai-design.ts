import { CardOrientation } from './id-card';

export type HeaderStyle = 'solid-banner' | 'minimal-rail' | 'split-accent' | 'tech-hud' | 'crest-centered';
export type PhotoPosition = 'top-center' | 'top-left' | 'center-left' | 'badge-inset';
export type PhotoShape = 'circle' | 'squircle' | 'rounded-rect' | 'sharp-rect';
export type PhotoBorder = 'metallic-gold' | 'accent' | 'double-hairline' | 'none';
export type InfoLayout = 'two-column-grid' | 'stacked-cards' | 'tabular-rows' | 'compact-modern';
export type QrPlacement = 'front-corner' | 'back-centered' | 'front-inline';
export type PatternType = 'guilloche-waves' | 'geometric-grid' | 'circuit-traces' | 'diagonal-stripes' | 'subtle-mesh' | 'archival-crest' | 'clean-minimal';
export type BorderTreatment = 'precision-hairline' | 'double-frame' | 'corner-brackets' | 'accent-edge-stripe' | 'none';
export type TypographyStyle = 'modern-sans' | 'archival-serif' | 'tech-mono';

export interface AiDesignSpec {
  theme: string;
  styleCategory: string;
  orientation: CardOrientation;
  layout: {
    headerStyle: HeaderStyle;
    photoPosition: PhotoPosition;
    photoShape: PhotoShape;
    photoBorder: PhotoBorder;
    infoLayout: InfoLayout;
    qrPlacement: QrPlacement;
  };
  palette: {
    primaryColor: string;     // Primary brand shade (e.g. #1B365D)
    secondaryColor: string;   // Secondary accent shade (e.g. #D4AF37)
    accentColor: string;      // Supporting visual accent (e.g. #06B6D4)
    cardStockTint: string;    // Substrate base tone (e.g. #FFFFFF or #F8FAFC)
    textColor: string;        // High-contrast text color (e.g. #0F172A)
    mutedTextColor: string;   // Secondary label color (e.g. #64748B)
  };
  typography: {
    headingFont: TypographyStyle;
    labelFont: TypographyStyle;
    nameTransform: 'uppercase' | 'capitalize';
  };
  decorations: {
    patternType: PatternType;
    borderTreatment: BorderTreatment;
    securityBadge: 'holographic-strip' | 'guilloche-rosette' | 'microprint-line' | 'watermark-seal' | 'none';
    elements: string[];
  };
  readabilityGuidance: string;
}

export interface AiApiStatusResponse {
  geminiConfigured: boolean;
  geminiModel: string;
  engine: string;
}
