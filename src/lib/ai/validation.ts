import { z } from 'zod';

const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

export const HexColorSchema = z
  .string()
  .trim()
  .regex(hexColorRegex, 'Must be a valid 6-digit hex color (e.g. #1B365D)');

export const HeaderStyleSchema = z.enum([
  'solid-banner',
  'minimal-rail',
  'split-accent',
  'tech-hud',
  'crest-centered',
]);

export const PhotoPositionSchema = z.enum([
  'top-center',
  'top-left',
  'center-left',
  'badge-inset',
]);

export const PhotoShapeSchema = z.enum([
  'circle',
  'squircle',
  'rounded-rect',
  'sharp-rect',
]);

export const PhotoBorderSchema = z.enum([
  'metallic-gold',
  'accent',
  'double-hairline',
  'none',
]);

export const InfoLayoutSchema = z.enum([
  'two-column-grid',
  'stacked-cards',
  'tabular-rows',
  'compact-modern',
]);

export const QrPlacementSchema = z.enum([
  'front-corner',
  'back-centered',
  'front-inline',
]);

export const PatternTypeSchema = z.enum([
  'guilloche-waves',
  'geometric-grid',
  'circuit-traces',
  'diagonal-stripes',
  'subtle-mesh',
  'archival-crest',
  'clean-minimal',
]);

export const BorderTreatmentSchema = z.enum([
  'precision-hairline',
  'double-frame',
  'corner-brackets',
  'accent-edge-stripe',
  'none',
]);

export const TypographyStyleSchema = z.enum([
  'modern-sans',
  'archival-serif',
  'tech-mono',
]);

export const AiDesignSpecSchema = z
  .object({
    theme: z.string().trim().min(2).max(120),
    styleCategory: z.string().trim().min(2).max(100),
    orientation: z.enum(['portrait', 'landscape']).default('portrait'),
    layout: z.object({
      headerStyle: HeaderStyleSchema.default('solid-banner'),
      photoPosition: PhotoPositionSchema.default('top-center'),
      photoShape: PhotoShapeSchema.default('squircle'),
      photoBorder: PhotoBorderSchema.default('accent'),
      infoLayout: InfoLayoutSchema.default('two-column-grid'),
      qrPlacement: QrPlacementSchema.default('front-corner'),
    }),
    palette: z.object({
      primaryColor: HexColorSchema,
      secondaryColor: HexColorSchema,
      accentColor: HexColorSchema.default('#06B6D4'),
      cardStockTint: HexColorSchema.default('#FFFFFF'),
      textColor: HexColorSchema.default('#0F172A'),
      mutedTextColor: HexColorSchema.default('#64748B'),
    }),
    typography: z.object({
      headingFont: TypographyStyleSchema.default('modern-sans'),
      labelFont: TypographyStyleSchema.default('modern-sans'),
      nameTransform: z.enum(['uppercase', 'capitalize']).default('uppercase'),
    }),
    decorations: z.object({
      patternType: PatternTypeSchema.default('guilloche-waves'),
      borderTreatment: BorderTreatmentSchema.default('precision-hairline'),
      securityBadge: z.enum(['holographic-strip', 'guilloche-rosette', 'microprint-line', 'watermark-seal', 'none']).default('guilloche-rosette'),
      elements: z.array(z.string().trim().max(100)).max(6).default([]),
    }),
    readabilityGuidance: z.string().trim().min(5).max(300).default('Preserve high contrast for student text, photo, and scannable QR verification.'),
  })
  .strict();

export const DesignPromptInputSchema = z.object({
  description: z.string().trim().min(3, 'Description must be at least 3 characters').max(500, 'Description must be 500 characters or less'),
  style: z.string().trim().optional(),
  orientation: z.enum(['portrait', 'landscape']).optional().default('portrait'),
});
