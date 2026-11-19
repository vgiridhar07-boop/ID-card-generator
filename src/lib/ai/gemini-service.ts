import { AiDesignSpec } from '@/types/ai-design';
import { AiDesignSpecSchema } from './validation';

interface GenerateSpecParams {
  description: string;
  style?: string;
  orientation?: 'portrait' | 'landscape';
}

/**
 * Deterministic offline preset generator exclusively for the explicit Offline Sample Mode.
 * This is never silently returned to mask failed API calls.
 */
export function generateOfflinePresetSpec(
  description: string,
  orientation: 'portrait' | 'landscape' = 'portrait',
  styleCategory?: string
): AiDesignSpec {
  const lower = description.toLowerCase();

  let theme = 'Imperial Collegiate Institute';
  let style = styleCategory || 'Modern Minimalist';
  let primaryColor = '#1B365D'; // Oxford Navy
  let secondaryColor = '#D4AF37'; // Gold
  let accentColor = '#06B6D4'; // Cyan
  let cardStockTint = '#FFFFFF';
  let textColor = '#0F172A';
  let mutedTextColor = '#64748B';
  let headerStyle: any = 'solid-banner';
  let photoPosition: any = 'top-center';
  let photoShape: any = 'squircle';
  let photoBorder: any = 'metallic-gold';
  let infoLayout: any = 'two-column-grid';
  let qrPlacement: any = 'front-corner';
  let patternType: any = 'guilloche-waves';
  let borderTreatment: any = 'precision-hairline';
  let headingFont: any = 'modern-sans';

  if (lower.includes('crimson') || lower.includes('red') || lower.includes('heritage') || styleCategory?.includes('Heritage')) {
    theme = 'Archival Heritage & Crest Academy';
    style = 'Archival Heritage';
    primaryColor = '#7A1F2B';
    secondaryColor = '#C27D00';
    accentColor = '#B87333';
    cardStockTint = '#FDFBF7';
    textColor = '#1C1917';
    mutedTextColor = '#78716C';
    headerStyle = 'crest-centered';
    photoPosition = 'top-center';
    photoShape = 'rounded-rect';
    photoBorder = 'double-hairline';
    infoLayout = 'tabular-rows';
    patternType = 'archival-crest';
    borderTreatment = 'double-frame';
    headingFont = 'archival-serif';
  } else if (lower.includes('tech') || lower.includes('cyber') || lower.includes('quantum') || styleCategory?.includes('Tech')) {
    theme = 'Quantum Technology Institute';
    style = 'Cybersecurity & High-Tech';
    primaryColor = '#0F172A';
    secondaryColor = '#06B6D4';
    accentColor = '#3B82F6';
    cardStockTint = '#F8FAFC';
    textColor = '#0F172A';
    mutedTextColor = '#475569';
    headerStyle = 'tech-hud';
    photoPosition = 'top-left';
    photoShape = 'squircle';
    photoBorder = 'accent';
    infoLayout = 'compact-modern';
    patternType = 'circuit-traces';
    borderTreatment = 'corner-brackets';
    headingFont = 'tech-mono';
  } else if (lower.includes('emerald') || lower.includes('green') || lower.includes('bio') || styleCategory?.includes('Bio')) {
    theme = 'Bio-Sciences & Agricultural College';
    style = 'Botanical & Applied Sciences';
    primaryColor = '#1E4D3B';
    secondaryColor = '#B87333';
    accentColor = '#10B981';
    cardStockTint = '#F6F5F1';
    textColor = '#143327';
    mutedTextColor = '#576F64';
    headerStyle = 'split-accent';
    photoPosition = 'center-left';
    photoShape = 'circle';
    photoBorder = 'accent';
    infoLayout = 'two-column-grid';
    patternType = 'geometric-grid';
    borderTreatment = 'accent-edge-stripe';
    headingFont = 'modern-sans';
  } else if (lower.includes('metro') || lower.includes('gold') || lower.includes('black') || styleCategory?.includes('Executive')) {
    theme = 'Executive Metro Graduate School';
    style = 'Executive Metro';
    primaryColor = '#181A1F';
    secondaryColor = '#D4AF37';
    accentColor = '#94A3B8';
    cardStockTint = '#F8FAFC';
    textColor = '#090A0C';
    mutedTextColor = '#64748B';
    headerStyle = 'minimal-rail';
    photoPosition = 'top-center';
    photoShape = 'sharp-rect';
    photoBorder = 'metallic-gold';
    infoLayout = 'stacked-cards';
    patternType = 'diagonal-stripes';
    borderTreatment = 'precision-hairline';
    headingFont = 'modern-sans';
  }

  return {
    theme,
    styleCategory: style,
    orientation,
    layout: {
      headerStyle,
      photoPosition,
      photoShape,
      photoBorder,
      infoLayout,
      qrPlacement,
    },
    palette: {
      primaryColor,
      secondaryColor,
      accentColor,
      cardStockTint,
      textColor,
      mutedTextColor,
    },
    typography: {
      headingFont,
      labelFont: headingFont === 'tech-mono' ? 'tech-mono' : 'modern-sans',
      nameTransform: 'uppercase',
    },
    decorations: {
      patternType,
      borderTreatment,
      securityBadge: 'guilloche-rosette',
      elements: ['Guilloche security band', 'Precision hairline frame', 'Micro-dot coordinate grid'],
    },
    readabilityGuidance: 'High-contrast central zone with structured key-value alignment for student credentials.',
  };
}

/**
 * Normalizes raw LLM output into a compliant AiDesignSpec structure.
 */
function normalizeSpecJson(raw: any, orientation: 'portrait' | 'landscape', styleCategory: string): any {
  // Ensure layout object
  let layout = raw.layout;
  if (!layout || typeof layout !== 'object') {
    layout = {
      headerStyle: 'solid-banner',
      photoPosition: 'top-center',
      photoShape: 'squircle',
      photoBorder: 'accent',
      infoLayout: 'two-column-grid',
      qrPlacement: 'front-corner',
    };
  } else {
    layout = {
      headerStyle: layout.headerStyle || 'solid-banner',
      photoPosition: layout.photoPosition || 'top-center',
      photoShape: layout.photoShape || 'squircle',
      photoBorder: layout.photoBorder || 'accent',
      infoLayout: layout.infoLayout || 'two-column-grid',
      qrPlacement: layout.qrPlacement || 'front-corner',
    };
  }

  // Format hex color
  const toHex = (val: any, fallback: string): string => {
    if (!val || typeof val !== 'string') return fallback;
    let s = val.trim();
    if (!s.startsWith('#')) s = '#' + s;
    if (/^#[0-9A-Fa-f]{6}$/.test(s)) return s.toUpperCase();
    return fallback;
  };

  const rawPalette = raw.palette || {};
  const palette = {
    primaryColor: toHex(rawPalette.primaryColor || rawPalette.primary || rawPalette.background, '#1B365D'),
    secondaryColor: toHex(rawPalette.secondaryColor || rawPalette.secondary || rawPalette.accent, '#D4AF37'),
    accentColor: toHex(rawPalette.accentColor || rawPalette.accent, '#06B6D4'),
    cardStockTint: toHex(rawPalette.cardStockTint || rawPalette.cardStock || rawPalette.background, '#FFFFFF'),
    textColor: toHex(rawPalette.textColor || rawPalette.text, '#0F172A'),
    mutedTextColor: toHex(rawPalette.mutedTextColor || rawPalette.muted, '#64748B'),
  };

  const rawTypo = raw.typography || {};
  let headingFont: 'modern-sans' | 'archival-serif' | 'tech-mono' = 'modern-sans';
  if (typeof rawTypo.headingFont === 'string') {
    if (rawTypo.headingFont.includes('serif')) headingFont = 'archival-serif';
    else if (rawTypo.headingFont.includes('mono')) headingFont = 'tech-mono';
  } else if (typeof rawTypo.header === 'string') {
    if (rawTypo.header.toLowerCase().includes('serif')) headingFont = 'archival-serif';
    else if (rawTypo.header.toLowerCase().includes('mono')) headingFont = 'tech-mono';
  }

  const typography = {
    headingFont,
    labelFont: headingFont === 'tech-mono' ? ('tech-mono' as const) : ('modern-sans' as const),
    nameTransform: (rawTypo.nameTransform === 'capitalize' ? 'capitalize' : 'uppercase') as 'uppercase' | 'capitalize',
  };

  const rawDeco = raw.decorations;
  let decorations: any = {
    patternType: 'guilloche-waves',
    borderTreatment: 'precision-hairline',
    securityBadge: 'guilloche-rosette',
    elements: ['Guilloche security band', 'Precision hairline frame', 'Micro-dot coordinate grid'],
  };

  if (Array.isArray(rawDeco)) {
    decorations.elements = rawDeco.slice(0, 4);
  } else if (rawDeco && typeof rawDeco === 'object') {
    decorations = {
      patternType: rawDeco.patternType || 'guilloche-waves',
      borderTreatment: rawDeco.borderTreatment || 'precision-hairline',
      securityBadge: rawDeco.securityBadge || 'guilloche-rosette',
      elements: Array.isArray(rawDeco.elements) ? rawDeco.elements.slice(0, 4) : ['Guilloche security band'],
    };
  }

  return {
    theme: String(raw.theme || 'Institutional Credential').slice(0, 100),
    styleCategory: String(raw.styleCategory || styleCategory).slice(0, 80),
    orientation,
    layout,
    palette,
    typography,
    decorations,
    readabilityGuidance: String(
      raw.readabilityGuidance || 'High contrast central zone with structured key-value alignment.'
    ).slice(0, 250),
  };
}

/**
 * Helper to pause execution for exponential backoff.
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Checks whether an HTTP status or error message is transient and eligible for retry.
 */
function isRetryableError(status: number, message: string): boolean {
  if (status === 429 || status === 500 || status === 503 || status === 504) return true;
  const lower = (message || '').toLowerCase();
  return (
    lower.includes('high demand') ||
    lower.includes('overloaded') ||
    lower.includes('resource exhausted') ||
    lower.includes('temporarily unavailable') ||
    lower.includes('timeout') ||
    lower.includes('service unavailable')
  );
}

/**
 * Calls the official Google Gemini API to generate structured design specifications.
 * Primary target model: gemini-3.1-flash-lite (fastest, high availability on free tier).
 * Secondary fallback target: gemini-3.8-flash.
 * Includes exponential backoff retries for 429, 500, 503, and transient demand surges.
 */
export async function generateDesignSpecWithGemini(params: GenerateSpecParams): Promise<AiDesignSpec> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    throw new Error(
      'Google Gemini API key (GEMINI_API_KEY) is not configured in .env.local. Please configure your API key to generate real AI design specifications.'
    );
  }

  // Model selection: gemini-3.1-flash-lite is the proven stable model for free tier keys,
  // avoiding unstable aliases like 'gemini-flash-latest' which suffer from high-demand peaks.
  const configuredModel = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';
  const candidateModels = Array.from(
    new Set(
      [
        configuredModel,
        'gemini-3.1-flash-lite',
        'gemini-3.8-flash',
      ].filter(Boolean)
    )
  ) as string[];

  const orientation = params.orientation || 'portrait';
  const selectedStyle = params.style || 'Modern Minimalist';

  const systemInstruction = `
You are a Principal Institutional Identity & Security Credential Designer.
Your task is to analyze the user's natural language ID card prompt and return a complete, highly structured JSON design specification.

CRITICAL DIRECTIVES:
- You dictate layout configuration, color palette, typography styling, geometric patterns, and decorative elements.
- Never invent or alter student personal details (names, student IDs, photos, blood groups, dates, or QR code data).
- Output valid, clean JSON only matching the schema.

Required JSON Structure:
{
  "theme": "short evocative theme title (e.g. 'Imperial Polytechnic Honors')",
  "styleCategory": "${selectedStyle}",
  "orientation": "${orientation}",
  "layout": {
    "headerStyle": "solid-banner | minimal-rail | split-accent | tech-hud | crest-centered",
    "photoPosition": "top-center | top-left | center-left | badge-inset",
    "photoShape": "circle | squircle | rounded-rect | sharp-rect",
    "photoBorder": "metallic-gold | accent | double-hairline | none",
    "infoLayout": "two-column-grid | stacked-cards | tabular-rows | compact-modern",
    "qrPlacement": "front-corner | back-centered | front-inline"
  },
  "palette": {
    "primaryColor": "#RRGGBB (dominant institutional color, high contrast)",
    "secondaryColor": "#RRGGBB (secondary metallic or accent color)",
    "accentColor": "#RRGGBB (vibrant third accent)",
    "cardStockTint": "#RRGGBB (substrate background tone, e.g. #FFFFFF, #F8FAFC, #FDFBF7)",
    "textColor": "#RRGGBB (dark legible text color, e.g. #0F172A)",
    "mutedTextColor": "#RRGGBB (subtle label color, e.g. #64748B)"
  },
  "typography": {
    "headingFont": "modern-sans | archival-serif | tech-mono",
    "labelFont": "modern-sans | tech-mono",
    "nameTransform": "uppercase | capitalize"
  },
  "decorations": {
    "patternType": "guilloche-waves | geometric-grid | circuit-traces | diagonal-stripes | subtle-mesh | archival-crest | clean-minimal",
    "borderTreatment": "precision-hairline | double-frame | corner-brackets | accent-edge-stripe | none",
    "securityBadge": "holographic-strip | guilloche-rosette | microprint-line | watermark-seal | none",
    "elements": ["2 to 4 concise decorative features"]
  },
  "readabilityGuidance": "directive specifying how text contrast and scannability are maintained"
}
`;

  let lastError: Error | null = null;
  const MAX_RETRIES = 2; // Up to 3 total attempts per model

  for (const model of candidateModels) {
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      if (attempt > 0) {
        // Exponential backoff: 1500ms on first retry, 3000ms on second retry + small jitter
        const backoffMs = 1500 * attempt + Math.floor(Math.random() * 400);
        console.info(`[Gemini Service] Retrying ${model} (attempt ${attempt + 1}/${MAX_RETRIES + 1}) after ${backoffMs}ms backoff...`);
        await sleep(backoffMs);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      try {
        // Official Google Gemini Interactions API (POST /v1beta/interactions with Api-Revision: 2026-05-20)
        const interactionsEndpoint = `https://generativelanguage.googleapis.com/v1beta/interactions?key=${apiKey}`;

        const response = await fetch(interactionsEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Api-Revision': '2026-05-20',
          },
          signal: controller.signal,
          body: JSON.stringify({
            model,
            system_instruction: systemInstruction,
            input: `Design Request: "${params.description}"\nSelected Style: ${selectedStyle}\nOrientation: ${orientation}`,
          }),
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          let parsedError: any = null;
          try {
            parsedError = JSON.parse(errorText);
          } catch {
            // raw error text
          }

          const msg = parsedError?.error?.message || errorText;
          const retryable = isRetryableError(response.status, msg);
          console.warn(`[Gemini Service] Model ${model} returned HTTP ${response.status}: ${msg}`);

          // If retryable (429, 500, 503, high demand), retry this model if attempts remain
          if (retryable && attempt < MAX_RETRIES) {
            continue;
          }

          // If model is permanently unavailable, deprecated, or not found (404), advance to next candidate model
          if (
            response.status === 404 ||
            msg.includes('not found') ||
            msg.includes('no longer available') ||
            msg.includes('deprecated')
          ) {
            lastError = new Error(`Gemini model ${model}: ${msg}`);
            break; // Exit retry loop to try next model in candidateModels
          }

          lastError = new Error(`Gemini model ${model} (${response.status}): ${msg}`);
          break; // Exit retry loop to try next candidate model
        }

        const data = await response.json();

        // Extract generated text from model_output step
        let candidateText =
          data.steps?.find((s: any) => s.type === 'model_output')?.content?.[0]?.text ||
          data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!candidateText) {
          throw new Error('Google Gemini API returned an empty output step. Please try rephrasing your prompt.');
        }

        // Strip markdown codeblock markers if present (e.g. ```json ... ```)
        candidateText = candidateText.trim();
        if (candidateText.startsWith('```')) {
          candidateText = candidateText.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
        }

        const parsedJson = JSON.parse(candidateText);
        const normalizedJson = normalizeSpecJson(parsedJson, orientation, selectedStyle);
        const validatedSpec = AiDesignSpecSchema.parse(normalizedJson);

        return validatedSpec;
      } catch (err: any) {
        clearTimeout(timeoutId);
        const isTimeout = err.name === 'AbortError';
        const errMsg = isTimeout ? `Request timed out for model ${model}` : (err.message || String(err));
        console.warn(`[Gemini Service] Error for ${model} (attempt ${attempt + 1}): ${errMsg}`);

        if (attempt < MAX_RETRIES && (isTimeout || isRetryableError(500, errMsg))) {
          continue;
        }

        lastError = isTimeout ? new Error(errMsg) : err;
        break; // Advance to next candidate model
      }
    }
  }

  // Clear, readable error message when all candidate models and retries are exhausted
  const failureReason = lastError?.message || 'High network demand across all Gemini models.';
  throw new Error(
    `Gemini AI design service is temporarily unavailable: ${failureReason}. Please wait a moment and try again, or use the Offline Sample Mode.`
  );
}
