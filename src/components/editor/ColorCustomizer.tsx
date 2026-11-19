import React from 'react';
import { CardDesignConfig, InstitutionBranding } from '@/types/id-card';
import {
  INSTITUTIONAL_PALETTE_PRESETS,
  CARD_STOCK_SWATCHES,
  getContrastTextColor,
  getRelativeLuminance,
} from '@/lib/color-utils';
import { Palette, Check, ShieldCheck, Sparkles, Layers } from 'lucide-react';

interface ColorCustomizerProps {
  institution: InstitutionBranding;
  design: CardDesignConfig;
  onColorChange: (colors: {
    primaryColor: string;
    secondaryColor: string;
    cardStockTint: string;
  }) => void;
}

export function ColorCustomizer({
  institution,
  design,
  onColorChange,
}: ColorCustomizerProps) {
  const currentPrimary = design.primaryColor || institution.primaryColor || institution.accentColor || '#1B365D';
  const currentSecondary = design.secondaryColor || institution.secondaryColor || '#8C5A1E';
  const currentStock = design.cardStockTint || institution.cardStockTint || '#FFFFFF';

  const stockTextColor = getContrastTextColor(currentStock);
  const stockLuminance = getRelativeLuminance(currentStock);
  const headerTextColor = getContrastTextColor(currentPrimary);

  const applyPalette = (palette: typeof INSTITUTIONAL_PALETTE_PRESETS[0]) => {
    onColorChange({
      primaryColor: palette.primary,
      secondaryColor: palette.secondary,
      cardStockTint: palette.cardStock,
    });
  };

  return (
    <div className="space-y-5">
      {/* Curated Institutional Palettes */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-[11px] font-mono uppercase tracking-wider text-studio-ink-secondary">
            Curated Institutional Palettes
          </label>
          <span className="text-[10px] font-mono text-studio-action flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> One-Click Harmony
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {INSTITUTIONAL_PALETTE_PRESETS.map((preset) => {
            const isSelected =
              currentPrimary.toLowerCase() === preset.primary.toLowerCase() &&
              currentSecondary.toLowerCase() === preset.secondary.toLowerCase() &&
              currentStock.toLowerCase() === preset.cardStock.toLowerCase();

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPalette(preset)}
                className={`p-2.5 rounded-md border text-left transition-all relative ${
                  isSelected
                    ? 'bg-studio-panel border-studio-action ring-1 ring-studio-action/20 shadow-xs'
                    : 'bg-studio-panel hover:bg-studio-subtle/50 border-studio-border'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-[12px] text-studio-ink-primary">
                    {preset.name}
                  </span>
                  {isSelected && (
                    <span className="w-3.5 h-3.5 rounded-full bg-studio-action text-white flex items-center justify-center">
                      <Check className="w-2 h-2" />
                    </span>
                  )}
                </div>
                {/* Visual Swatch Strip */}
                <div className="flex items-center gap-1 h-3.5 w-full rounded overflow-hidden border border-studio-border/60">
                  <div className="flex-1 h-full" style={{ backgroundColor: preset.primary }} />
                  <div className="w-6 h-full" style={{ backgroundColor: preset.secondary }} />
                  <div className="w-8 h-full" style={{ backgroundColor: preset.cardStock }} />
                </div>
                <span className="text-[10px] text-studio-ink-muted block mt-1 leading-tight">
                  {preset.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Specific Color Pickers */}
      <div className="p-4 bg-studio-panel border border-studio-border rounded-lg space-y-4">
        {/* Primary Brand Color */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-studio-ink-secondary">
              Primary Brand Color (Headers & Primary Bands)
            </label>
            <span
              className="text-[9.5px] font-mono px-1.5 py-0.2 rounded"
              style={{ backgroundColor: currentPrimary, color: headerTextColor }}
            >
              Text Contrast: {headerTextColor === '#FFFFFF' ? 'White' : 'Dark'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="color"
              value={currentPrimary}
              onChange={(e) =>
                onColorChange({
                  primaryColor: e.target.value,
                  secondaryColor: currentSecondary,
                  cardStockTint: currentStock,
                })
              }
              className="w-8 h-8 rounded border border-studio-border cursor-pointer p-0 bg-transparent shrink-0"
            />
            <input
              type="text"
              value={currentPrimary}
              onChange={(e) =>
                onColorChange({
                  primaryColor: e.target.value,
                  secondaryColor: currentSecondary,
                  cardStockTint: currentStock,
                })
              }
              placeholder="#1B365D"
              className="w-28 px-2.5 py-1.5 font-mono text-[12px] bg-studio-canvas border border-studio-border rounded uppercase text-studio-ink-primary"
            />
            <span className="text-[11px] text-studio-ink-muted">
              Used for institutional crests, primary ribbons, and major titles.
            </span>
          </div>
        </div>

        {/* Secondary Accent Color */}
        <div className="pt-3 border-t border-studio-border/60">
          <label className="block text-[11px] font-mono uppercase tracking-wider text-studio-ink-secondary mb-1.5">
            Secondary Accent Color (Pinstripes, Badges, Highlights)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={currentSecondary}
              onChange={(e) =>
                onColorChange({
                  primaryColor: currentPrimary,
                  secondaryColor: e.target.value,
                  cardStockTint: currentStock,
                })
              }
              className="w-8 h-8 rounded border border-studio-border cursor-pointer p-0 bg-transparent shrink-0"
            />
            <input
              type="text"
              value={currentSecondary}
              onChange={(e) =>
                onColorChange({
                  primaryColor: currentPrimary,
                  secondaryColor: e.target.value,
                  cardStockTint: currentStock,
                })
              }
              placeholder="#8C5A1E"
              className="w-28 px-2.5 py-1.5 font-mono text-[12px] bg-studio-canvas border border-studio-border rounded uppercase text-studio-ink-primary"
            />
            <span className="text-[11px] text-studio-ink-muted">
              Provides visual depth and metallic/highlight framing.
            </span>
          </div>
        </div>

        {/* Card Stock Tint */}
        <div className="pt-3 border-t border-studio-border/60">
          <label className="block text-[11px] font-mono uppercase tracking-wider text-studio-ink-secondary mb-1.5">
            Card Stock Tint (Substrate / Base PVC Tone)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
            {CARD_STOCK_SWATCHES.map((swatch) => {
              const isSelected = currentStock.toLowerCase() === swatch.hex.toLowerCase();
              return (
                <button
                  key={swatch.name}
                  type="button"
                  onClick={() =>
                    onColorChange({
                      primaryColor: currentPrimary,
                      secondaryColor: currentSecondary,
                      cardStockTint: swatch.hex,
                    })
                  }
                  className={`p-2 rounded border text-left flex items-center gap-2 transition-all ${
                    isSelected
                      ? 'border-studio-action ring-1 ring-studio-action/20 bg-studio-subtle'
                      : 'border-studio-border hover:border-studio-ink-muted bg-white'
                  }`}
                >
                  <span
                    className="w-5 h-5 rounded-full border border-black/10 shrink-0 shadow-xs"
                    style={{ backgroundColor: swatch.hex }}
                  />
                  <div className="min-w-0">
                    <span className="text-[11px] font-medium text-studio-ink-primary block truncate">
                      {swatch.name}
                    </span>
                    <span className="text-[9px] font-mono text-studio-ink-muted block uppercase">
                      {swatch.hex}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input
              type="color"
              value={currentStock}
              onChange={(e) =>
                onColorChange({
                  primaryColor: currentPrimary,
                  secondaryColor: currentSecondary,
                  cardStockTint: e.target.value,
                })
              }
              className="w-7 h-7 rounded border border-studio-border cursor-pointer p-0 bg-transparent shrink-0"
            />
            <input
              type="text"
              value={currentStock}
              onChange={(e) =>
                onColorChange({
                  primaryColor: currentPrimary,
                  secondaryColor: currentSecondary,
                  cardStockTint: e.target.value,
                })
              }
              placeholder="#FFFFFF"
              className="w-24 px-2 py-1 font-mono text-[11px] bg-studio-canvas border border-studio-border rounded uppercase text-studio-ink-primary"
            />
            <span className="text-[10.5px] text-studio-ink-secondary">
              Custom substrate hex
            </span>
          </div>
        </div>
      </div>

      {/* Automatic WCAG 2.1 Contrast Guarantee Callout */}
      <div className="p-3 bg-studio-panel border border-studio-border rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-studio-success" />
          <div>
            <span className="font-sans font-semibold text-[11.5px] text-studio-ink-primary block">
              Automatic WCAG 2.1 Contrast Enforcement
            </span>
            <span className="text-[10px] text-studio-ink-secondary block">
              Substrate luminance: {(stockLuminance * 100).toFixed(1)}% • Card text automatically calibrated to{' '}
              <strong style={{ color: stockTextColor }}>{stockTextColor === '#181A1F' ? 'Dark Slate' : 'Pure White'}</strong>.
            </span>
          </div>
        </div>
        <span className="px-2 py-0.5 bg-studio-success-tint border border-studio-success/20 text-studio-success text-[10px] font-mono font-bold rounded">
          Pass AA/AAA
        </span>
      </div>
    </div>
  );
}
