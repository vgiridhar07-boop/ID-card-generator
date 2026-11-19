import React, { useState, useRef } from 'react';
import { CollegeRecord } from '@/types/id-card';
import { createInstitution, deleteInstitution } from '@/lib/api';
import { processAndCompressImage } from '@/lib/image-utils';
import { X, Landmark, Plus, Trash2, Check, Upload, Database, Globe, Phone, MapPin, Award } from 'lucide-react';

interface CollegeModalProps {
  isOpen: boolean;
  onClose: () => void;
  colleges: CollegeRecord[];
  activeCollege: CollegeRecord | null;
  onSelectCollege: (college: CollegeRecord) => void;
  onRefreshColleges: () => void;
}

export function CollegeModal({
  isOpen,
  onClose,
  colleges,
  activeCollege,
  onSelectCollege,
  onRefreshColleges,
}: CollegeModalProps) {
  const [view, setView] = useState<'list' | 'create'>(colleges.length === 0 ? 'create' : 'list');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New college form state
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [emailOrWebsite, setEmailOrWebsite] = useState('');
  const [address, setAddress] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#1B365D');
  const [secondaryColor, setSecondaryColor] = useState('#8C5A1E');
  const [cardStockTint, setCardStockTint] = useState('#FFFFFF');
  const [issuingAuthority, setIssuingAuthority] = useState('Registrar / Principal');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await processAndCompressImage(file, 400, 0.9);
      setLogoDataUrl(compressed);
    } catch (err) {
      console.error('Logo upload error:', err);
      alert('Unable to process logo file.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter an institution or college name.');
      return;
    }

    try {
      setIsSubmitting(true);
      const newCollege = await createInstitution({
        name: name.trim(),
        subtitle: subtitle.trim(),
        logoDataUrl,
        phone: phone.trim(),
        emailOrWebsite: emailOrWebsite.trim(),
        address: address.trim(),
        primaryColor,
        secondaryColor,
        cardStockTint,
        issuingAuthority: issuingAuthority.trim(),
      });

      onRefreshColleges();
      onSelectCollege(newCollege);
      setView('list');
      // Reset form
      setName('');
      setSubtitle('');
      setLogoDataUrl(null);
      setPhone('');
      setEmailOrWebsite('');
      setAddress('');
      setIsSubmitting(false);
      onClose();
    } catch (err: any) {
      console.error('Failed to create college:', err);
      alert(err.message || 'Failed to create college database');
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (slug: string, collegeName: string) => {
    if (confirm(`Permanently delete "${collegeName}" and remove its database file (data/colleges/${slug}.db)? All stored student records will be destroyed.`)) {
      try {
        await deleteInstitution(slug);
        onRefreshColleges();
      } catch (err) {
        console.error('Failed to delete college:', err);
        alert('Could not delete college.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs select-none">
      <div className="w-full max-w-2xl bg-studio-panel border border-studio-border rounded-lg shadow-float overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-studio-border bg-studio-canvas flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-studio-action text-white flex items-center justify-center">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-[15px] text-studio-ink-primary">
                Multi-Institution Directory & Database Registry
              </h2>
              <p className="text-[11px] text-studio-ink-secondary mt-0.5">
                Every college maintains its own isolated SQLite database file (`data/colleges/[slug].db`).
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-studio-ink-muted hover:text-studio-ink-primary hover:bg-studio-subtle"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* View Switcher Tabs */}
        <div className="px-5 pt-3 border-b border-studio-border bg-white flex items-center gap-3">
          <button
            type="button"
            onClick={() => setView('list')}
            className={`pb-2 text-[12.5px] font-medium border-b-2 transition-all ${
              view === 'list'
                ? 'border-studio-action text-studio-action font-semibold'
                : 'border-transparent text-studio-ink-secondary hover:text-studio-ink-primary'
            }`}
          >
            Registered Colleges ({colleges.length})
          </button>
          <button
            type="button"
            onClick={() => setView('create')}
            className={`pb-2 text-[12.5px] font-medium border-b-2 transition-all flex items-center gap-1 ${
              view === 'create'
                ? 'border-studio-action text-studio-action font-semibold'
                : 'border-transparent text-studio-ink-secondary hover:text-studio-ink-primary'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            Add New College Database
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {view === 'list' ? (
            <div className="space-y-3">
              {colleges.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-studio-border rounded-lg bg-studio-canvas">
                  <Database className="w-8 h-8 text-studio-ink-muted mx-auto mb-2" />
                  <h4 className="font-sans font-bold text-[13.5px] text-studio-ink-primary">
                    No Colleges Registered Yet
                  </h4>
                  <p className="text-[11.5px] text-studio-ink-secondary mt-1 max-w-sm mx-auto">
                    Create your first institution to initialize its dedicated SQLite database and start issuing authentic student IDs.
                  </p>
                  <button
                    type="button"
                    onClick={() => setView('create')}
                    className="mt-3 px-3 py-1.5 bg-studio-action hover:bg-studio-action-hover text-white rounded text-[12px] font-medium transition-colors"
                  >
                    Add First College
                  </button>
                </div>
              ) : (
                colleges.map((col) => {
                  const isActive = activeCollege?.slug === col.slug;
                  return (
                    <div
                      key={col.id}
                      className={`p-3.5 rounded-lg border transition-all flex items-center justify-between gap-3 ${
                        isActive
                          ? 'bg-studio-subtle/60 border-studio-action ring-1 ring-studio-action/20'
                          : 'bg-white border-studio-border hover:border-studio-ink-muted'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded border border-studio-border bg-studio-canvas flex items-center justify-center shrink-0 p-0.5 overflow-hidden">
                          {col.logoDataUrl ? (
                            <img src={col.logoDataUrl} alt={col.name} className="w-full h-full object-contain" />
                          ) : (
                            <span className="font-bold text-xs" style={{ color: col.primaryColor }}>
                              {col.name.slice(0, 2).toUpperCase()}
                            </span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-sans font-bold text-[13.5px] text-studio-ink-primary truncate">
                              {col.name}
                            </h4>
                            {isActive && (
                              <span className="px-1.5 py-0.2 bg-studio-action text-white rounded text-[9px] font-mono">
                                Active Workspace
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-mono text-studio-ink-secondary block truncate">
                            Database: data/colleges/{col.slug}.db • {col.studentCount ?? 0} Student IDs Stored
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {!isActive ? (
                          <button
                            type="button"
                            onClick={() => {
                              onSelectCollege(col);
                              onClose();
                            }}
                            className="px-2.5 py-1 bg-studio-action hover:bg-studio-action-hover text-white rounded text-[11px] font-medium transition-colors"
                          >
                            Switch to College
                          </button>
                        ) : (
                          <span className="text-[11px] font-mono text-studio-success flex items-center gap-1 font-semibold">
                            <Check className="w-3.5 h-3.5" /> Selected
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDelete(col.slug, col.name)}
                          className="p-1 text-studio-destructive hover:bg-studio-destructive-tint rounded transition-colors"
                          title="Delete college and database"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            /* Create College Form */
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-studio-ink-secondary mb-1">
                    College / University Name <span className="text-studio-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Cambridge Institute of Science"
                    className="w-full px-3 py-2 bg-studio-canvas border border-studio-border rounded-md text-[13px] text-studio-ink-primary focus:outline-none focus:border-studio-action"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-studio-ink-secondary mb-1">
                    Accreditation / Subtitle
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="e.g. Autonomous • NAAC A++"
                    className="w-full px-3 py-2 bg-studio-canvas border border-studio-border rounded-md text-[13px] text-studio-ink-primary focus:outline-none focus:border-studio-action"
                  />
                </div>
              </div>

              {/* Logo Upload */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-studio-ink-secondary mb-1">
                  Institutional Seal / Logo
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded border border-studio-border bg-studio-canvas flex items-center justify-center p-1 relative shrink-0">
                    {logoDataUrl ? (
                      <img src={logoDataUrl} alt="Seal Preview" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-[8px] font-mono text-studio-ink-muted uppercase">No Seal</span>
                    )}
                  </div>
                  <div>
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
                      className="px-2.5 py-1 bg-studio-panel hover:bg-studio-subtle border border-studio-border rounded text-[11.5px] font-medium text-studio-ink-primary flex items-center gap-1.5 transition-colors"
                    >
                      <Upload className="w-3 h-3 text-studio-ink-secondary" />
                      Upload Crest Seal
                    </button>
                  </div>
                </div>
              </div>

              {/* Color Customizer Palette for New College */}
              <div className="p-3 bg-studio-canvas border border-studio-border rounded-md space-y-3">
                <span className="block text-[11px] font-mono uppercase tracking-wider text-studio-ink-secondary">
                  Institutional Brand Colors
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] text-studio-ink-muted mb-1">Primary Brand Hue</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-6 h-6 rounded border border-studio-border cursor-pointer p-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-20 px-1.5 py-0.5 font-mono text-[11px] bg-studio-panel border border-studio-border rounded uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-studio-ink-muted mb-1">Secondary Accent Hue</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-6 h-6 rounded border border-studio-border cursor-pointer p-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-20 px-1.5 py-0.5 font-mono text-[11px] bg-studio-panel border border-studio-border rounded uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-studio-ink-muted mb-1">Card Stock Tint</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={cardStockTint}
                        onChange={(e) => setCardStockTint(e.target.value)}
                        className="w-6 h-6 rounded border border-studio-border cursor-pointer p-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={cardStockTint}
                        onChange={(e) => setCardStockTint(e.target.value)}
                        className="w-20 px-1.5 py-0.5 font-mono text-[11px] bg-studio-panel border border-studio-border rounded uppercase"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10.5px] text-studio-ink-muted mb-1">Website or Email</label>
                  <input
                    type="text"
                    value={emailOrWebsite}
                    onChange={(e) => setEmailOrWebsite(e.target.value)}
                    placeholder="www.cambridge-sci.edu"
                    className="w-full px-2.5 py-1.5 bg-studio-canvas border border-studio-border rounded text-[12px] text-studio-ink-primary"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] text-studio-ink-muted mb-1">Campus Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-2.5 py-1.5 bg-studio-canvas border border-studio-border rounded text-[12px] text-studio-ink-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] text-studio-ink-muted mb-1">Campus Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Collegiate Quadrangle, Cambridge, MA"
                  className="w-full px-2.5 py-1.5 bg-studio-canvas border border-studio-border rounded text-[12px] text-studio-ink-primary"
                />
              </div>

              <div className="pt-3 border-t border-studio-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setView('list')}
                  className="px-3 py-1.5 text-[12px] text-studio-ink-secondary hover:text-studio-ink-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 bg-studio-action hover:bg-studio-action-hover text-white rounded text-[12px] font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Creating Database...' : 'Initialize College Database'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-studio-border bg-studio-canvas flex items-center justify-between text-[11px] font-mono text-studio-ink-muted shrink-0">
          <span>Active Registry: data/registry.db</span>
          <button
            type="button"
            onClick={onClose}
            className="text-studio-ink-secondary hover:text-studio-ink-primary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
