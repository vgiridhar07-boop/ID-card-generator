/**
 * Color mathematics & WCAG 2.1 luminance calculation
 * Enforces automatic, accessible typographic contrast across custom card stock tints and brand headers.
 */

export interface ColorPalettePreset {
  id: string;
  name: string;
  description: string;
  primary: string;
  secondary: string;
  cardStock: string;
}

export const INSTITUTIONAL_PALETTE_PRESETS: ColorPalettePreset[] = [
  {
    id: 'oxford-classic',
    name: 'Oxford Academic',
    description: 'Oxford Navy & Burnished Ochre on Crisp White',
    primary: '#1B365D',
    secondary: '#8C5A1E',
    cardStock: '#FFFFFF',
  },
  {
    id: 'heritage-crimson',
    name: 'Heritage Crimson',
    description: 'Traditional Cardinal Maroon & Antique Gold on Archival Ivory',
    primary: '#7A1F2B',
    secondary: '#C27D00',
    cardStock: '#FDFBF7',
  },
  {
    id: 'cambridge-pine',
    name: 'Cambridge Pine',
    description: 'Archival Scholastic Forest & Copper on Alabaster',
    primary: '#1E4D3B',
    secondary: '#B87333',
    cardStock: '#F6F5F1',
  },
  {
    id: 'imperial-slate',
    name: 'Imperial Charcoal',
    description: 'Precision Slate & Electric Cobalt on Crisp White',
    primary: '#2C353F',
    secondary: '#2563EB',
    cardStock: '#FFFFFF',
  },
  {
    id: 'gothic-academia',
    name: 'Gothic Academia',
    description: 'Deep Royal Indigo & Burnished Bronze on Parchment Tint',
    primary: '#2E2A5E',
    secondary: '#A67C52',
    cardStock: '#FAF7EE',
  },
  {
    id: 'metro-tech',
    name: 'Metro Polytechnic',
    description: 'Pure Obsidian & Signal Emerald on Soft Gray PVC',
    primary: '#181A1F',
    secondary: '#10B981',
    cardStock: '#F8FAFC',
  },
];

export const CARD_STOCK_SWATCHES = [
  { name: 'Crisp White', hex: '#FFFFFF', desc: 'Standard Bright Gloss PVC' },
  { name: 'Warm Alabaster', hex: '#F6F5F1', desc: 'Natural Uncoated Fine Stock' },
  { name: 'Archival Ivory', hex: '#FDFBF7', desc: 'Antique Parchment Tint' },
  { name: 'Parchment Cream', hex: '#FAF7EE', desc: 'Traditional Heavy Laid Paper' },
  { name: 'Muted Celadon', hex: '#F2F7F4', desc: 'Soft Organic Botanical Tint' },
  { name: 'Cool Slate', hex: '#F1F3F5', desc: 'Industrial Technical Stock' },
];

/**
 * Parses 3 or 6 digit hex to RGB integers
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) {
    return { r: 27, g: 54, b: 93 }; // fallback navy
  }
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Calculates WCAG 2.1 relative luminance
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
export function getRelativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const transform = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const R = transform(r);
  const G = transform(g);
  const B = transform(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * Automatically calculates optimal high-contrast text color (Dark Ink vs Crisp White)
 */
export function getContrastTextColor(backgroundColorHex: string): '#111216' | '#FFFFFF' {
  const luminance = getRelativeLuminance(backgroundColorHex);
  // If background is light (luminance > 0.42), use dark ink; otherwise white
  return luminance > 0.42 ? '#111216' : '#FFFFFF';
}

/**
 * Returns true if the background requires light text
 */
export function isDarkSurface(backgroundColorHex: string): boolean {
  return getRelativeLuminance(backgroundColorHex) <= 0.42;
}
