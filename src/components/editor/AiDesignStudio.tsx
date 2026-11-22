import React, { useState, useEffect } from 'react';
import { CardDesignConfig, CardOrientation, InstitutionBranding, StudentDetails } from '@/types/id-card';
import {
  AiDesignSpec,
  AiApiStatusResponse,
  HeaderStyle,
  PhotoPosition,
  PhotoShape,
  InfoLayout,
  QrPlacement,
} from '@/types/ai-design';
import { AiDynamicCardRenderer } from '../card/AiDynamicCardRenderer';
import {
  Sparkles,
  RotateCcw,
  Check,
  Loader2,
  ShieldCheck,
  Undo2,
  AlertCircle,
  KeyRound,
  Sliders,
  Palette,
  Compass,
  FileCode,
  Download,
  Layout,
  Eye,
} from 'lucide-react';

interface AiDesignStudioProps {
  design: CardDesignConfig;
  student: StudentDetails;
  institution: InstitutionBranding;
  onApplyAiSpec: (spec: AiDesignSpec) => void;
  onClearAiDesign: () => void;
  onUpdateDesign?: (updates: Partial<CardDesignConfig>) => void;
  onTriggerExport?: () => void;
}

const STYLE_ARCHETYPES = [
  {
    id: 'Modern Minimalist',
    label: 'Modern Minimal',
    description: 'Clean whitespace, Swiss typographic discipline, crisp hairlines.',
    accent: '#1B365D',
  },
  {
    id: 'Archival Heritage & Crest',
    label: 'Archival Heritage',
    description: 'Traditional scholastic, deep crimson, guilloche micro-engravings.',
    accent: '#7A1F2B',
  },
  {
    id: 'Cybersecurity & High-Tech',
    label: 'Cyber & Tech',
    description: 'Dark slate substrate, cyan circuit traces, corner HUD brackets.',
    accent: '#06B6D4',
  },
  {
    id: 'Executive Metro Postgraduate',
    label: 'Executive Metro',
    description: 'Matte charcoal substrate, burnished gold metallic rules.',
    accent: '#D4AF37',
  },
  {
    id: 'Botanical & Applied Sciences',
    label: 'Bio & Sciences',
    description: 'Deep forest emerald, warm copper, hexagonal molecular grid.',
    accent: '#1E4D3B',
  },
  {
    id: 'Swiss Geometric Precision',
    label: 'Swiss Precision',
    description: 'Asymmetric color blocks, vibrant vermilion, high-contrast borders.',
    accent: '#E11D48',
  },
];

const SAMPLE_PROMPT_SUGGESTIONS = [
  'Modern navy blue and gold identity card with security guilloche ribbons and clean typography.',
  'Collegiate cardinal red and antique ivory crest design with double-line archival borders.',
  'Quantum computing laboratory ID with dark slate substrate, cyan data circuit traces, and technical corner notches.',
  'Executive postgraduate card with brushed charcoal finish, polished bronze borders, and minimalist typography.',
  'Agricultural and biotechnology institute card with emerald gradients and hexagonal cell patterns.',
];

export function AiDesignStudio({
  design,
  student,
  institution,
  onApplyAiSpec,
  onClearAiDesign,
  onUpdateDesign,
  onTriggerExport,
}: AiDesignStudioProps) {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('Modern Minimalist');
  const [selectedOrientation, setSelectedOrientation] = useState<CardOrientation>(design.orientation || 'portrait');
  const [previewSide, setPreviewSide] = useState<'front' | 'back'>('front');

  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const [apiStatus, setApiStatus] = useState<AiApiStatusResponse | null>(null);
  const [generatedSpec, setGeneratedSpec] = useState<AiDesignSpec | null>(design.aiDynamicSpec || null);

  // Editable local overrides for generated spec
  const [editablePrimary, setEditablePrimary] = useState<string>('');
  const [editableSecondary, setEditableSecondary] = useState<string>('');
  const [editableAccent, setEditableAccent] = useState<string>('');
  const [editableStock, setEditableStock] = useState<string>('');
  const [editableHeaderStyle, setEditableHeaderStyle] = useState<HeaderStyle>('solid-banner');
  const [editablePhotoShape, setEditablePhotoShape] = useState<PhotoShape>('squircle');
  const [editableInfoLayout, setEditableInfoLayout] = useState<InfoLayout>('two-column-grid');

  // Check API configuration status on mount
  useEffect(() => {
    fetch('/api/ai/status')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setApiStatus(data);
      })
      .catch((err) => console.warn('Failed to fetch Gemini API status:', err));
  }, []);

  // Sync state when a spec is loaded or generated
  const syncSpecToEditor = (spec: AiDesignSpec) => {
    setGeneratedSpec(spec);
    setEditablePrimary(spec.palette.primaryColor);
    setEditableSecondary(spec.palette.secondaryColor);
    setEditableAccent(spec.palette.accentColor || '#06B6D4');
    setEditableStock(spec.palette.cardStockTint || '#FFFFFF');
    setEditableHeaderStyle(spec.layout.headerStyle);
    setEditablePhotoShape(spec.layout.photoShape);
    setEditableInfoLayout(spec.layout.infoLayout);
  };

  useEffect(() => {
    if (design.aiDynamicSpec) {
      syncSpecToEditor(design.aiDynamicSpec);
    }
  }, [design.aiDynamicSpec]);

  const handleOrientationChange = (ori: CardOrientation) => {
    setSelectedOrientation(ori);
    if (onUpdateDesign) {
      onUpdateDesign({ orientation: ori });
    }
    if (generatedSpec) {
      const updated: AiDesignSpec = { ...generatedSpec, orientation: ori };
      setGeneratedSpec(updated);
    }
  };

  /**
   * Real AI Generation Workflow:
   * 1. Calls Google Gemini API (POST /api/ai/design-spec)
   * 2. Receives structured JSON design specification
   * 3. Local SVG/CSS engine renders visually distinct card design
   */
  const handleGenerateWithGemini = async (targetPrompt = prompt) => {
    const cleanPrompt = targetPrompt.trim();
    if (cleanPrompt.length < 3) {
      setError('Please describe your desired card design with at least 3 characters.');
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);
      setStatusNotice(null);
      setLoadingStep('Consulting Google Gemini AI design intelligence...');

      const res = await fetch('/api/ai/design-spec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: cleanPrompt,
          style: selectedStyle,
          orientation: selectedOrientation,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Gemini API call failed with HTTP ${res.status}`);
      }

      const data = await res.json();
      const spec: AiDesignSpec = data.spec;

      syncSpecToEditor(spec);
      setStatusNotice(`AI Design generated successfully via Google Gemini (${data.spec.theme}).`);
    } catch (err: any) {
      console.error('Gemini design generation error:', err);
      setError(err.message || 'An unexpected error occurred during AI design generation.');
    } finally {
      setIsGenerating(false);
      setLoadingStep('');
    }
  };

  /**
   * Explicit Offline Sample Preset:
   * Pure local mathematical SVG/CSS rendering requiring zero external API keys.
   */
  const handleLoadOfflineSample = async () => {
    try {
      setIsGenerating(true);
      setError(null);
      setStatusNotice(null);
      setLoadingStep('Loading offline architectural vector sample preset...');

      const res = await fetch('/api/ai/demo-spec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: prompt.trim() || 'Modern collegiate card with security guilloche ribbons',
          style: selectedStyle,
          orientation: selectedOrientation,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to load offline preset');
      }

      const data = await res.json();
      syncSpecToEditor(data.spec);
      setStatusNotice('Loaded offline architectural vector sample preset (Rendered locally via SVG/CSS).');
    } catch (err: any) {
      setError(err.message || 'Failed to load offline sample preset.');
    } finally {
      setIsGenerating(false);
      setLoadingStep('');
    }
  };

  // Compile active effective spec from local editor adjustments
  const getActiveEffectiveSpec = (): AiDesignSpec | null => {
    if (!generatedSpec) return null;
    return {
      ...generatedSpec,
      orientation: selectedOrientation,
      layout: {
        ...generatedSpec.layout,
        headerStyle: editableHeaderStyle,
        photoShape: editablePhotoShape,
        infoLayout: editableInfoLayout,
      },
      palette: {
        ...generatedSpec.palette,
        primaryColor: editablePrimary || generatedSpec.palette.primaryColor,
        secondaryColor: editableSecondary || generatedSpec.palette.secondaryColor,
        accentColor: editableAccent || generatedSpec.palette.accentColor,
        cardStockTint: editableStock || generatedSpec.palette.cardStockTint,
      },
    };
  };

  const effectiveSpec = getActiveEffectiveSpec();

  /**
   * Mounts the dynamic AI-generated design and layout to the active ID card
   */
  const handleApplyToActiveCard = () => {
    if (!effectiveSpec) return;
    onApplyAiSpec(effectiveSpec);
  };

  const isApplied =
    design.templateId === 'ai-dynamic' &&
    design.aiDynamicSpec?.theme === effectiveSpec?.theme &&
    Boolean(effectiveSpec);

  return (
    <div className="space-y-4">
      {/* Studio Header */}
      <div className="p-3.5 bg-studio-panel border border-studio-border rounded-lg shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-studio-action" />
            <h3 className="font-serif font-bold text-[14px] text-studio-ink-primary">
              AI Design Studio
            </h3>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] font-mono">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border ${
                apiStatus?.geminiConfigured
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              Gemini AI: {apiStatus?.geminiConfigured ? 'Ready (Free Tier)' : 'Key Missing'}
            </span>
          </div>
        </div>

        <p className="text-[11.5px] text-studio-ink-secondary mt-1 leading-snug">
          Genuinely AI-powered design generator using Google Gemini design intelligence and a local SVG/CSS vector engine. 100% free with zero image credit costs.
        </p>
      </div>

      {/* API Key Setup Banner if Unset */}
      {!apiStatus?.geminiConfigured && (
        <div className="p-3 bg-amber-50/90 border border-amber-200 rounded-lg text-amber-900 text-[11px] space-y-1.5 shadow-xs">
          <div className="flex items-center gap-1.5 font-semibold text-[11.5px]">
            <KeyRound className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>Google Gemini Free API Key Required for Live AI Generation</span>
          </div>
          <p className="text-amber-800 leading-relaxed">
            Obtain a free API key from{' '}
            <a
              href="https://aistudio.google.com/"
              target="_blank"
              rel="noreferrer"
              className="underline font-semibold text-amber-900"
            >
              Google AI Studio
            </a>{' '}
            and paste it into <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">.env.local</code>:
          </p>
          <pre className="bg-amber-100/80 p-2 rounded text-[10.5px] font-mono text-amber-950 overflow-x-auto">
GEMINI_API_KEY=your_gemini_api_key_here
          </pre>
          <p className="text-amber-700 text-[10.5px]">
            You can test the entire SVG/CSS layout engine immediately using the <strong>Load Offline Sample</strong> button below.
          </p>
        </div>
      )}

      {/* Main Studio Controls */}
      <div className="p-4 bg-studio-panel border border-studio-border rounded-lg space-y-4 shadow-xs">
        {/* Style Archetype Selector */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-studio-ink-secondary mb-2">
            1. Aesthetic Archetype
          </label>
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-1.5">
            {STYLE_ARCHETYPES.map((arch) => {
              const active = selectedStyle === arch.id;
              return (
                <button
                  key={arch.id}
                  type="button"
                  onClick={() => setSelectedStyle(arch.id)}
                  disabled={isGenerating}
                  className={`p-2.5 rounded text-left border min-h-[44px] transition-all ${
                    active
                      ? 'border-studio-action bg-studio-action-tint/30 ring-1 ring-studio-action/40'
                      : 'border-studio-border bg-studio-canvas hover:bg-studio-subtle'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: arch.accent }}
                    />
                    <span className="font-sans font-semibold text-[11.5px] text-studio-ink-primary truncate">
                      {arch.label}
                    </span>
                  </div>
                  <span className="text-[10px] text-studio-ink-muted leading-tight block mt-0.5 line-clamp-1">
                    {arch.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Orientation Switcher */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-studio-ink-secondary mb-1.5">
            2. Card Orientation
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleOrientationChange('portrait')}
              disabled={isGenerating}
              className={`min-h-[44px] py-2 px-3 rounded text-[11.5px] font-medium border flex items-center justify-center gap-1.5 transition-colors ${
                selectedOrientation === 'portrait'
                  ? 'border-studio-action bg-studio-action-tint text-studio-action font-semibold'
                  : 'border-studio-border bg-studio-canvas text-studio-ink-secondary hover:text-studio-ink-primary'
              }`}
            >
              <Compass className="w-3.5 h-3.5 shrink-0" />
              <span>Portrait (Vertical CR80)</span>
            </button>
            <button
              type="button"
              onClick={() => handleOrientationChange('landscape')}
              disabled={isGenerating}
              className={`min-h-[44px] py-2 px-3 rounded text-[11.5px] font-medium border flex items-center justify-center gap-1.5 transition-colors ${
                selectedOrientation === 'landscape'
                  ? 'border-studio-action bg-studio-action-tint text-studio-action font-semibold'
                  : 'border-studio-border bg-studio-canvas text-studio-ink-secondary hover:text-studio-ink-primary'
              }`}
            >
              <Compass className="w-3.5 h-3.5 rotate-90 shrink-0" />
              <span>Landscape (Horizontal CR80)</span>
            </button>
          </div>
        </div>

        {/* Natural Language Prompt Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-studio-ink-secondary">
              3. Natural-Language Design Prompt
            </label>
            <span className="text-[10px] font-mono text-studio-ink-muted">
              {prompt.length}/500 chars
            </span>
          </div>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value.slice(0, 500))}
            placeholder="e.g. Design a prestigious engineering college ID card with a deep navy blue theme, gold guilloche borders, and a modern two-column layout."
            rows={3}
            disabled={isGenerating}
            className="w-full p-3 bg-studio-canvas border border-studio-border rounded-md text-[13px] text-studio-ink-primary placeholder:text-studio-ink-muted focus:outline-none focus:border-studio-action resize-none"
          />
        </div>

        {/* Quick Inspiration Starters */}
        <div>
          <span className="block text-[10px] font-mono uppercase tracking-wider text-studio-ink-muted mb-1.5">
            Inspiration Starters:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_PROMPT_SUGGESTIONS.map((suggestion, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setPrompt(suggestion);
                }}
                disabled={isGenerating}
                className="text-[10.5px] px-2 py-0.5 bg-studio-canvas hover:bg-studio-subtle border border-studio-border rounded text-studio-ink-secondary hover:text-studio-ink-primary text-left transition-colors truncate max-w-full"
              >
                {suggestion.slice(0, 48)}...
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col gap-2 border-t border-studio-border/70 w-full max-w-full">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
            <button
              type="button"
              onClick={() => handleGenerateWithGemini()}
              disabled={isGenerating || prompt.trim().length < 3}
              className="flex-1 min-h-[44px] px-4 py-2.5 bg-studio-action hover:bg-studio-action-hover text-white rounded-md text-[12.5px] font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50 w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  <span className="truncate">Generating with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span className="truncate">Generate Design with AI</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleLoadOfflineSample}
              disabled={isGenerating}
              className="min-h-[44px] px-3.5 py-2.5 bg-studio-canvas hover:bg-studio-subtle border border-studio-border text-studio-ink-secondary hover:text-studio-ink-primary rounded-md text-[12px] font-medium flex items-center justify-center gap-1.5 transition-colors w-full sm:w-auto shrink-0"
              title="Loads an offline sample preset rendered via mathematical SVG and CSS"
            >
              <FileCode className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Load Offline Sample</span>
            </button>
          </div>

          {design.templateId === 'ai-dynamic' && (
            <button
              type="button"
              onClick={onClearAiDesign}
              className="min-h-[40px] text-[11px] font-mono text-studio-ink-secondary hover:text-studio-destructive flex items-center justify-center gap-1 transition-colors py-1 w-full"
            >
              <Undo2 className="w-3.5 h-3.5 shrink-0" />
              <span>Reset to Standard Template</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Feedback */}
      {isGenerating && (
        <div className="p-4 bg-studio-subtle/80 border border-studio-border rounded-lg flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-studio-action animate-spin shrink-0" />
          <div>
            <span className="font-sans font-semibold text-[12px] text-studio-ink-primary block">
              AI Generation in Progress
            </span>
            <span className="font-mono text-[11px] text-studio-ink-secondary">
              {loadingStep}
            </span>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="p-3.5 bg-studio-destructive-tint border border-studio-destructive/30 rounded-lg flex items-start gap-2.5 text-studio-destructive">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="text-[11.5px] leading-snug">
            <strong className="block font-semibold">Gemini API Error:</strong>
            {error}
          </div>
        </div>
      )}

      {/* Status Notice */}
      {statusNotice && (
        <div className="p-3 bg-studio-success-tint/60 border border-studio-success/30 rounded-lg flex items-start gap-2.5 text-studio-success text-[11px] leading-snug">
          <Check className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <strong>Success:</strong> {statusNotice}
          </div>
        </div>
      )}

      {/* Generated Design Inspector, Live Preview & Fine-Tuning */}
      {effectiveSpec && (
        <div className="p-4 bg-studio-panel border border-studio-border rounded-lg space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-studio-border/70 pb-2">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-studio-ink-muted block">
                AI Generated Specification
              </span>
              <h4 className="font-serif font-bold text-[14px] text-studio-ink-primary">
                {effectiveSpec.theme}
              </h4>
            </div>

            <div className="flex items-center gap-1.5">
              <span
                className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                style={{ backgroundColor: editablePrimary || effectiveSpec.palette.primaryColor }}
                title={`Primary: ${editablePrimary || effectiveSpec.palette.primaryColor}`}
              />
              <span
                className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                style={{ backgroundColor: editableSecondary || effectiveSpec.palette.secondaryColor }}
                title={`Secondary: ${editableSecondary || effectiveSpec.palette.secondaryColor}`}
              />
              <span
                className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                style={{ backgroundColor: editableAccent || effectiveSpec.palette.accentColor }}
                title={`Accent: ${editableAccent || effectiveSpec.palette.accentColor}`}
              />
              <span
                className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                style={{ backgroundColor: editableStock || effectiveSpec.palette.cardStockTint }}
                title={`Stock: ${editableStock || effectiveSpec.palette.cardStockTint}`}
              />
            </div>
          </div>

          {/* Interactive Mini Preview with actual Student Data */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-studio-ink-secondary flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-studio-action" />
                <span>Live Studio Preview</span>
              </span>
              <div className="flex border border-studio-border rounded overflow-hidden">
                <button
                  type="button"
                  onClick={() => setPreviewSide('front')}
                  className={`px-2 py-0.5 text-[10px] ${
                    previewSide === 'front'
                      ? 'bg-studio-action text-white font-semibold'
                      : 'bg-studio-canvas text-studio-ink-secondary hover:text-studio-ink-primary'
                  }`}
                >
                  Front
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewSide('back')}
                  className={`px-2 py-0.5 text-[10px] ${
                    previewSide === 'back'
                      ? 'bg-studio-action text-white font-semibold'
                      : 'bg-studio-canvas text-studio-ink-secondary hover:text-studio-ink-primary'
                  }`}
                >
                  Back
                </button>
              </div>
            </div>

            <div className="p-3 bg-studio-canvas rounded-lg border border-studio-border flex items-center justify-center overflow-hidden min-h-[260px]">
              <div className="transform scale-[0.55] sm:scale-[0.62] origin-center shadow-card-elevated rounded-[19px] overflow-hidden">
                <AiDynamicCardRenderer
                  spec={effectiveSpec}
                  student={student}
                  institution={institution}
                  side={previewSide}
                  orientation={selectedOrientation}
                />
              </div>
            </div>
          </div>

          {/* Design Blueprint Matrix */}
          <div className="grid grid-cols-2 gap-2 text-[10.5px] p-2.5 bg-studio-canvas rounded border border-studio-border/60 font-mono">
            <div>
              <span className="text-studio-ink-muted uppercase text-[9px] block">Style Category:</span>
              <span className="text-studio-ink-primary font-semibold">{effectiveSpec.styleCategory}</span>
            </div>
            <div>
              <span className="text-studio-ink-muted uppercase text-[9px] block">SVG Pattern:</span>
              <span className="text-studio-ink-primary font-semibold truncate block">
                {effectiveSpec.decorations.patternType}
              </span>
            </div>
          </div>

          {/* Fine-Tuning Section (Color & Layout Overrides) */}
          <div className="p-3 bg-studio-canvas rounded-lg border border-studio-border/70 space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-studio-ink-secondary flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-studio-action" />
              <span>Customize Colors & Composition</span>
            </span>

            {/* Color Pickers */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-mono text-studio-ink-muted mb-1">
                  Primary Brand Hex
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={editablePrimary}
                    onChange={(e) => setEditablePrimary(e.target.value)}
                    className="w-6 h-6 rounded border border-studio-border cursor-pointer p-0"
                  />
                  <input
                    type="text"
                    value={editablePrimary}
                    onChange={(e) => setEditablePrimary(e.target.value)}
                    className="w-full px-2 py-1 bg-studio-panel border border-studio-border rounded text-[11px] font-mono text-studio-ink-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-studio-ink-muted mb-1">
                  Secondary Accent Hex
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={editableSecondary}
                    onChange={(e) => setEditableSecondary(e.target.value)}
                    className="w-6 h-6 rounded border border-studio-border cursor-pointer p-0"
                  />
                  <input
                    type="text"
                    value={editableSecondary}
                    onChange={(e) => setEditableSecondary(e.target.value)}
                    className="w-full px-2 py-1 bg-studio-panel border border-studio-border rounded text-[11px] font-mono text-studio-ink-primary"
                  />
                </div>
              </div>
            </div>

            {/* Layout Dropdowns */}
            <div className="grid grid-cols-2 gap-2 text-[10.5px]">
              <div>
                <label className="block text-[10px] font-mono text-studio-ink-muted mb-1">
                  Header Style
                </label>
                <select
                  value={editableHeaderStyle}
                  onChange={(e) => setEditableHeaderStyle(e.target.value as HeaderStyle)}
                  className="w-full px-2 py-1 bg-studio-panel border border-studio-border rounded font-mono text-studio-ink-primary"
                >
                  <option value="solid-banner">Solid Banner</option>
                  <option value="minimal-rail">Minimal Rail</option>
                  <option value="split-accent">Split Accent</option>
                  <option value="tech-hud">Tech HUD</option>
                  <option value="crest-centered">Crest Centered</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-studio-ink-muted mb-1">
                  Photo Shape
                </label>
                <select
                  value={editablePhotoShape}
                  onChange={(e) => setEditablePhotoShape(e.target.value as PhotoShape)}
                  className="w-full px-2 py-1 bg-studio-panel border border-studio-border rounded font-mono text-studio-ink-primary"
                >
                  <option value="squircle">Squircle (Rounded-2XL)</option>
                  <option value="circle">Circle (Round)</option>
                  <option value="rounded-rect">Rounded-Rect (Rounded-LG)</option>
                  <option value="sharp-rect">Sharp-Rect (Square)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Student Protection Notice */}
          <div className="p-2.5 bg-studio-success-tint/60 border border-studio-success/20 rounded flex items-center gap-2 text-[10.5px] text-studio-success">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>
              <strong>100% PII Integrity:</strong> Real student details, cropped portrait photograph, and scannable QR code are inserted directly by the local rendering engine.
            </span>
          </div>

          {/* Action Footer: Regenerate, Apply, and Export */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 border-t border-studio-border/70 w-full max-w-full">
            <button
              type="button"
              onClick={() => handleGenerateWithGemini()}
              disabled={isGenerating}
              className="min-h-[44px] px-3.5 py-2 bg-studio-canvas hover:bg-studio-subtle border border-studio-border text-studio-ink-primary rounded text-[12px] font-medium flex items-center justify-center gap-1.5 transition-colors w-full sm:w-auto shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5 text-studio-ink-secondary shrink-0" />
              <span className="truncate">Regenerate Variation</span>
            </button>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              {onTriggerExport && (
                <button
                  type="button"
                  onClick={onTriggerExport}
                  className="min-h-[44px] px-3.5 py-2 bg-studio-canvas hover:bg-studio-subtle border border-studio-border text-studio-ink-primary rounded text-[12px] font-medium flex items-center justify-center gap-1.5 transition-colors w-full sm:w-auto shrink-0"
                >
                  <Download className="w-3.5 h-3.5 text-studio-ink-secondary shrink-0" />
                  <span>Export</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleApplyToActiveCard}
                className={`min-h-[44px] px-4 py-2 rounded text-[12px] font-medium flex items-center justify-center gap-1.5 transition-colors shadow-xs w-full sm:w-auto shrink-0 ${
                  isApplied
                    ? 'bg-studio-success text-white'
                    : 'bg-studio-action hover:bg-studio-action-hover text-white'
                }`}
              >
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{isApplied ? 'Design Applied' : 'Apply Design to Card'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
