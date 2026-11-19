import { AiDesignSpec } from '@/types/ai-design';

/**
 * Generates dynamic SVG pattern definitions and layers based on the Gemini design specification.
 * Zero external image dependencies — renders 100% locally via pure SVG code.
 */
export function generateDynamicSvgBackground(
  spec: AiDesignSpec,
  width: number,
  height: number
): string {
  const { palette, decorations } = spec;
  const p = palette.primaryColor;
  const s = palette.secondaryColor;
  const a = palette.accentColor;
  const stock = palette.cardStockTint || '#FFFFFF';

  let patternDef = '';
  let patternUsage = '';

  switch (decorations.patternType) {
    case 'guilloche-waves': {
      patternDef = `
        <pattern id="guilloche" width="120" height="60" patternUnits="userSpaceOnUse">
          <path d="M 0 30 Q 30 5, 60 30 T 120 30" fill="none" stroke="${s}" stroke-width="0.75" stroke-opacity="0.22"/>
          <path d="M 0 30 Q 30 55, 60 30 T 120 30" fill="none" stroke="${p}" stroke-width="0.5" stroke-opacity="0.16"/>
          <path d="M 0 15 Q 30 40, 60 15 T 120 15" fill="none" stroke="${s}" stroke-width="0.4" stroke-opacity="0.14"/>
          <path d="M 0 45 Q 30 20, 60 45 T 120 45" fill="none" stroke="${p}" stroke-width="0.4" stroke-opacity="0.14"/>
        </pattern>
      `;
      patternUsage = `
        <rect width="${width}" height="${height}" fill="url(#guilloche)"/>
      `;
      break;
    }
    case 'circuit-traces': {
      patternDef = `
        <pattern id="circuit" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M 10 10 H 50 L 70 30 V 70" fill="none" stroke="${a}" stroke-width="0.8" stroke-opacity="0.2"/>
          <circle cx="10" cy="10" r="2" fill="${a}" fill-opacity="0.25"/>
          <circle cx="70" cy="70" r="2" fill="${a}" fill-opacity="0.25"/>
          <path d="M 80 50 H 40 L 20 70" fill="none" stroke="${p}" stroke-width="0.6" stroke-opacity="0.15"/>
          <circle cx="20" cy="70" r="1.5" fill="${p}" fill-opacity="0.2"/>
          <path d="M 30 0 V 25 L 45 40" fill="none" stroke="${s}" stroke-width="0.6" stroke-opacity="0.15"/>
        </pattern>
      `;
      patternUsage = `
        <rect width="${width}" height="${height}" fill="url(#circuit)"/>
      `;
      break;
    }
    case 'geometric-grid': {
      patternDef = `
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="none" stroke="${p}" stroke-width="0.3" stroke-opacity="0.08"/>
          <circle cx="10" cy="10" r="0.75" fill="${s}" fill-opacity="0.25"/>
        </pattern>
      `;
      patternUsage = `
        <rect width="${width}" height="${height}" fill="url(#grid)"/>
      `;
      break;
    }
    case 'diagonal-stripes': {
      patternDef = `
        <pattern id="diag" width="40" height="40" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="40" stroke="${p}" stroke-width="3" stroke-opacity="0.06"/>
          <line x1="20" y1="0" x2="20" y2="40" stroke="${s}" stroke-width="1.5" stroke-opacity="0.08"/>
        </pattern>
      `;
      patternUsage = `
        <rect width="${width}" height="${height}" fill="url(#diag)"/>
      `;
      break;
    }
    case 'subtle-mesh': {
      patternDef = `
        <linearGradient id="meshGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${p}" stop-opacity="0.14"/>
          <stop offset="50%" stop-color="${stock}" stop-opacity="0.0"/>
          <stop offset="100%" stop-color="${a}" stop-opacity="0.12"/>
        </linearGradient>
        <radialGradient id="meshGrad2" cx="100%" cy="0%" r="80%">
          <stop offset="0%" stop-color="${s}" stop-opacity="0.18"/>
          <stop offset="100%" stop-color="${stock}" stop-opacity="0.0"/>
        </radialGradient>
      `;
      patternUsage = `
        <rect width="${width}" height="${height}" fill="url(#meshGrad1)"/>
        <rect width="${width}" height="${height}" fill="url(#meshGrad2)"/>
      `;
      break;
    }
    case 'archival-crest': {
      patternDef = `
        <pattern id="crestMicro" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 30 10 L 45 25 L 30 50 L 15 25 Z" fill="none" stroke="${s}" stroke-width="0.5" stroke-opacity="0.12"/>
          <circle cx="30" cy="30" r="12" fill="none" stroke="${p}" stroke-width="0.4" stroke-opacity="0.1"/>
        </pattern>
      `;
      patternUsage = `
        <rect width="${width}" height="${height}" fill="url(#crestMicro)"/>
      `;
      break;
    }
    case 'clean-minimal':
    default: {
      patternDef = `
        <pattern id="dots" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="8" cy="8" r="0.6" fill="${p}" fill-opacity="0.08"/>
        </pattern>
      `;
      patternUsage = `
        <rect width="${width}" height="${height}" fill="url(#dots)"/>
      `;
      break;
    }
  }

  // Border treatment graphics
  let borderGraphics = '';
  switch (decorations.borderTreatment) {
    case 'precision-hairline':
      borderGraphics = `
        <rect x="10" y="10" width="${width - 20}" height="${height - 20}" rx="14" fill="none" stroke="${p}" stroke-width="0.75" stroke-opacity="0.25"/>
        <rect x="13" y="13" width="${width - 26}" height="${height - 26}" rx="12" fill="none" stroke="${s}" stroke-width="0.4" stroke-opacity="0.2"/>
      `;
      break;
    case 'double-frame':
      borderGraphics = `
        <rect x="8" y="8" width="${width - 16}" height="${height - 16}" rx="15" fill="none" stroke="${p}" stroke-width="1.5" stroke-opacity="0.4"/>
        <rect x="13" y="13" width="${width - 26}" height="${height - 26}" rx="12" fill="none" stroke="${s}" stroke-width="0.75" stroke-dasharray="3 3" stroke-opacity="0.35"/>
      `;
      break;
    case 'corner-brackets':
      borderGraphics = `
        <path d="M 8 28 V 8 H 28" fill="none" stroke="${p}" stroke-width="1.5" stroke-opacity="0.6"/>
        <path d="M ${width - 28} 8 H ${width - 8} V 28" fill="none" stroke="${p}" stroke-width="1.5" stroke-opacity="0.6"/>
        <path d="M 8 ${height - 28} V ${height - 8} H 28" fill="none" stroke="${p}" stroke-width="1.5" stroke-opacity="0.6"/>
        <path d="M ${width - 28} ${height - 8} H ${width - 8} V ${height - 28}" fill="none" stroke="${p}" stroke-width="1.5" stroke-opacity="0.6"/>
      `;
      break;
    case 'accent-edge-stripe':
      borderGraphics = `
        <rect x="0" y="0" width="6" height="${height}" fill="${p}"/>
        <rect x="6" y="0" width="2" height="${height}" fill="${s}"/>
      `;
      break;
    case 'none':
    default:
      borderGraphics = '';
      break;
  }

  // Security badge
  let securityGraphics = '';
  if (decorations.securityBadge === 'guilloche-rosette') {
    securityGraphics = `
      <g transform="translate(${width - 46}, ${height - 46}) scale(0.6)" opacity="0.35">
        <circle cx="30" cy="30" r="28" fill="none" stroke="${s}" stroke-width="0.8"/>
        <circle cx="30" cy="30" r="22" fill="none" stroke="${p}" stroke-width="0.6" stroke-dasharray="2 2"/>
        <path d="M 30 2 Q 40 20 58 30 Q 40 40 30 58 Q 20 40 2 30 Q 20 20 30 2 Z" fill="none" stroke="${s}" stroke-width="0.7"/>
        <circle cx="30" cy="30" r="8" fill="${p}" fill-opacity="0.1"/>
      </g>
    `;
  } else if (decorations.securityBadge === 'holographic-strip') {
    securityGraphics = `
      <g transform="translate(${width - 24}, 80)">
        <rect width="14" height="${height - 160}" rx="3" fill="url(#holoGrad)" opacity="0.4"/>
      </g>
    `;
    patternDef += `
      <linearGradient id="holoGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#FF007F" stop-opacity="0.4"/>
        <stop offset="25%" stop-color="#00F0FF" stop-opacity="0.5"/>
        <stop offset="50%" stop-color="#FFE600" stop-opacity="0.4"/>
        <stop offset="75%" stop-color="#00FF66" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="#9D00FF" stop-opacity="0.4"/>
      </linearGradient>
    `;
  } else if (decorations.securityBadge === 'microprint-line') {
    securityGraphics = `
      <g transform="translate(16, ${height - 14})" opacity="0.25">
        <text font-size="3.5" font-family="monospace" letter-spacing="1" fill="${p}">
          AUTHENTIC SECURE CREDENTIAL • VERIFIED ENROLLMENT • VALID STUDENT IDENTIFICATION
        </text>
      </g>
    `;
  }

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="baseStockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${stock}"/>
      <stop offset="100%" stop-color="${stock}"/>
    </linearGradient>
    ${patternDef}
  </defs>

  <!-- Substrate -->
  <rect width="${width}" height="${height}" fill="url(#baseStockGrad)"/>

  <!-- Dynamic SVG Pattern Layer -->
  ${patternUsage}

  <!-- Structural Borders -->
  ${borderGraphics}

  <!-- Security Feature Overlay -->
  ${securityGraphics}
</svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
