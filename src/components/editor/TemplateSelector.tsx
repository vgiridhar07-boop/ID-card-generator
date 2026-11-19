import React from 'react';
import { CardDesignConfig } from '@/types/id-card';
import { TEMPLATE_DEFINITIONS } from '@/lib/constants';
import { CreditCard, Check } from 'lucide-react';

interface TemplateSelectorProps {
  design: CardDesignConfig;
  onChange: (updated: Partial<CardDesignConfig>) => void;
}

export function TemplateSelector({ design, onChange }: TemplateSelectorProps) {
  return (
    <div className="space-y-6">
      {/* 6 Template Card Grid */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="block text-[12px] font-mono uppercase tracking-wider text-studio-ink-secondary">
            Select Card Template Style
          </label>
          <span className="text-[12px] font-mono text-studio-action font-semibold tabular-nums leading-normal">
            6 Authentic Standards
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TEMPLATE_DEFINITIONS.map((tmpl) => {
            const isSelected = design.templateId === tmpl.id;
            return (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => onChange({ templateId: tmpl.id })}
                className={`text-left p-3.5 rounded-lg border transition-all relative flex flex-col justify-between focus-ring ${
                  isSelected
                    ? 'bg-studio-panel border-studio-action shadow-sm ring-1 ring-studio-action'
                    : 'bg-studio-panel hover:bg-studio-subtle/50 border-studio-border text-studio-ink-primary'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-sans font-semibold text-[13.5px] text-studio-ink-primary">
                      {tmpl.title}
                    </span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-studio-action text-white flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-studio-ink-secondary leading-relaxed line-clamp-2">
                    {tmpl.description}
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-studio-border/60 flex items-center justify-between text-[12px] font-mono text-studio-ink-secondary leading-normal">
                  <span className="truncate">{tmpl.styleCategory}</span>
                  <span className="text-studio-action font-semibold shrink-0 ml-1.5">{tmpl.badge}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Card Orientation & Lanyard Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 border-t border-studio-border">
        {/* Orientation Toggle */}
        <div>
          <label className="block text-[11.5px] font-mono uppercase tracking-wider text-studio-ink-secondary mb-1.5">
            Card Orientation
          </label>
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-studio-subtle border border-studio-border rounded-lg">
            <button
              type="button"
              onClick={() => onChange({ orientation: 'portrait' })}
              className={`py-2 px-2.5 text-center rounded-md text-[12px] font-medium transition-all flex items-center justify-center gap-1.5 focus-ring ${
                design.orientation === 'portrait'
                  ? 'bg-studio-panel text-studio-ink-primary shadow-xs font-semibold'
                  : 'text-studio-ink-secondary hover:text-studio-ink-primary'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 rotate-90" />
              <span>Portrait</span>
            </button>
            <button
              type="button"
              onClick={() => onChange({ orientation: 'landscape' })}
              className={`py-2 px-2.5 text-center rounded-md text-[12px] font-medium transition-all flex items-center justify-center gap-1.5 focus-ring ${
                design.orientation === 'landscape'
                  ? 'bg-studio-panel text-studio-ink-primary shadow-xs font-semibold'
                  : 'text-studio-ink-secondary hover:text-studio-ink-primary'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Landscape</span>
            </button>
          </div>
        </div>

        {/* Lanyard Slot Preview Toggle */}
        <div>
          <label className="block text-[11.5px] font-mono uppercase tracking-wider text-studio-ink-secondary mb-1.5">
            Lanyard Punch Preview
          </label>
          <button
            type="button"
            onClick={() => onChange({ showLanyardSlotPreview: !design.showLanyardSlotPreview })}
            className={`w-full py-2 px-3 rounded-lg border text-[12px] font-medium flex items-center justify-between transition-colors focus-ring ${
              design.showLanyardSlotPreview
                ? 'bg-studio-panel border-studio-action/50 text-studio-ink-primary shadow-xs'
                : 'bg-studio-subtle border-studio-border text-studio-ink-secondary hover:text-studio-ink-primary'
            }`}
          >
            <span className="truncate">Show Punch Hole Guide</span>
            <span
              className={`w-8 h-4 rounded-full transition-colors relative flex items-center p-0.5 ${
                design.showLanyardSlotPreview ? 'bg-studio-action' : 'bg-studio-border'
              }`}
            >
              <span
                className={`w-3 h-3 rounded-full bg-white transition-transform ${
                  design.showLanyardSlotPreview ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </span>
          </button>
          <span className="text-[12px] text-studio-ink-secondary block mt-1.5 leading-normal">
            Visual drafting preview only; excluded from print exports.
          </span>
        </div>
      </div>
    </div>
  );
}
