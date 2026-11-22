import React, { useRef } from 'react';
import { InstitutionBranding } from '@/types/id-card';
import { ACCENT_COLOR_PRESETS } from '@/lib/constants';
import { processAndCompressImage } from '@/lib/image-utils';
import { Upload, X, Landmark, Phone, Globe, MapPin, Award } from 'lucide-react';

interface InstitutionFormProps {
  institution: InstitutionBranding;
  onChange: (updated: Partial<InstitutionBranding>) => void;
}

export function InstitutionForm({ institution, onChange }: InstitutionFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressedDataUrl = await processAndCompressImage(file, 400, 0.9);
      onChange({ logoDataUrl: compressedDataUrl });
    } catch (err) {
      console.error('Logo upload failed:', err);
      alert('Unable to process logo image. Please ensure it is a valid PNG, JPG, or SVG.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Institution Name & Subtitle */}
      <div>
        <label className="block text-[11px] font-mono uppercase tracking-wider text-studio-ink-secondary mb-1">
          Institution / College Name <span className="text-studio-destructive">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={institution.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="e.g. St. Jude Institute of Technology"
            className="w-full px-3 py-2 pl-9 bg-studio-panel border border-studio-border rounded-md text-[13px] text-studio-ink-primary placeholder:text-studio-ink-muted focus:outline-none focus:border-studio-action focus:ring-1 focus:ring-studio-action"
          />
          <Landmark className="w-4 h-4 text-studio-ink-muted absolute left-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-mono uppercase tracking-wider text-studio-ink-secondary mb-1">
          Subtitle / Accreditation Tag
        </label>
        <div className="relative">
          <input
            type="text"
            value={institution.subtitle}
            onChange={(e) => onChange({ subtitle: e.target.value })}
            placeholder="e.g. Autonomous Institution • NAAC A++ Grade"
            className="w-full px-3 py-2 pl-9 bg-studio-panel border border-studio-border rounded-md text-[13px] text-studio-ink-primary placeholder:text-studio-ink-muted focus:outline-none focus:border-studio-action focus:ring-1 focus:ring-studio-action"
          />
          <Award className="w-4 h-4 text-studio-ink-muted absolute left-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Logo Uploader */}
      <div>
        <label className="block text-[11px] font-mono uppercase tracking-wider text-studio-ink-secondary mb-1">
          Institutional Seal or Crest Logo
        </label>
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-md border border-studio-border bg-studio-panel flex items-center justify-center p-1 relative shrink-0">
            {institution.logoDataUrl ? (
              <>
                <img
                  src={institution.logoDataUrl}
                  alt="Seal Preview"
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={() => onChange({ logoDataUrl: null })}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-studio-destructive text-white rounded-full flex items-center justify-center shadow-xs"
                  title="Remove logo"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </>
            ) : (
              <span className="text-[9px] font-mono uppercase text-studio-ink-muted text-center leading-none">
                No Seal
              </span>
            )}
          </div>

          <div className="flex-1">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={handleLogoUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="min-h-[44px] sm:min-h-0 px-3.5 py-2 sm:py-1.5 bg-studio-panel hover:bg-studio-subtle border border-studio-border rounded text-[12px] font-medium text-studio-ink-primary flex items-center justify-center gap-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-studio-ink-secondary" />
              <span>Upload Crest / Seal</span>
            </button>
            <p className="text-[10px] text-studio-ink-muted mt-1">
              Supports PNG, JPG, or vector SVG. Resized automatically for high-res print.
            </p>
          </div>
        </div>
      </div>

      {/* Issuing Authority & Contact Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-studio-border">
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-studio-ink-secondary mb-1">
            Issuing Authority
          </label>
          <input
            type="text"
            value={institution.issuingAuthority}
            onChange={(e) => onChange({ issuingAuthority: e.target.value })}
            placeholder="Registrar / Principal"
            className="w-full px-3 py-2 bg-studio-panel border border-studio-border rounded-md text-[13px] text-studio-ink-primary placeholder:text-studio-ink-muted focus:outline-none focus:border-studio-action"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-studio-ink-secondary mb-1">
            Campus Helpline Phone
          </label>
          <div className="relative">
            <input
              type="text"
              value={institution.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
              className="w-full px-3 py-2 pl-8 bg-studio-panel border border-studio-border rounded-md text-[13px] text-studio-ink-primary placeholder:text-studio-ink-muted focus:outline-none focus:border-studio-action"
            />
            <Phone className="w-3.5 h-3.5 text-studio-ink-muted absolute left-2.5 top-3 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-studio-ink-secondary mb-1">
            Website or Registry Email
          </label>
          <div className="relative">
            <input
              type="text"
              value={institution.emailOrWebsite}
              onChange={(e) => onChange({ emailOrWebsite: e.target.value })}
              placeholder="www.institution.edu"
              className="w-full px-3 py-2 pl-8 bg-studio-panel border border-studio-border rounded-md text-[13px] text-studio-ink-primary placeholder:text-studio-ink-muted focus:outline-none focus:border-studio-action"
            />
            <Globe className="w-3.5 h-3.5 text-studio-ink-muted absolute left-2.5 top-3 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-studio-ink-secondary mb-1">
            Campus Address / City
          </label>
          <div className="relative">
            <input
              type="text"
              value={institution.address}
              onChange={(e) => onChange({ address: e.target.value })}
              placeholder="University Blvd, Cambridge, MA"
              className="w-full px-3 py-2 pl-8 bg-studio-panel border border-studio-border rounded-md text-[13px] text-studio-ink-primary placeholder:text-studio-ink-muted focus:outline-none focus:border-studio-action"
            />
            <MapPin className="w-3.5 h-3.5 text-studio-ink-muted absolute left-2.5 top-3 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
