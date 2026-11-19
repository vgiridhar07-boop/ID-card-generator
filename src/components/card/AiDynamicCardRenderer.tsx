import React from 'react';
import { CardOrientation, CardSide, InstitutionBranding, StudentDetails } from '@/types/id-card';
import { AiDesignSpec } from '@/types/ai-design';
import { CardQrCode } from './CardQrCode';
import { generateDynamicSvgBackground } from '@/lib/ai/svg-patterns';
import { ShieldCheck, Phone, Mail, MapPin, AlertCircle, Droplet } from 'lucide-react';

export interface AiDynamicCardRendererProps {
  spec: AiDesignSpec;
  student: StudentDetails;
  institution: InstitutionBranding;
  side: CardSide;
  orientation?: CardOrientation;
  isExportNode?: boolean;
}

export function AiDynamicCardRenderer({
  spec,
  student,
  institution,
  side,
  orientation: propOrientation,
  isExportNode = false,
}: AiDynamicCardRendererProps) {
  const orientation = propOrientation || spec.orientation || 'portrait';
  const isPortrait = orientation === 'portrait';
  const width = isPortrait ? 324 : 514;
  const height = isPortrait ? 514 : 324;

  const { layout, palette, typography, decorations } = spec;
  const p = palette.primaryColor;
  const s = palette.secondaryColor;
  const a = palette.accentColor || '#06B6D4';
  const stock = palette.cardStockTint || '#FFFFFF';
  const textCol = palette.textColor || '#0F172A';
  const mutedCol = palette.mutedTextColor || '#64748B';

  // Typography font class selection
  const headingFontClass =
    typography.headingFont === 'archival-serif'
      ? 'font-serif'
      : typography.headingFont === 'tech-mono'
      ? 'font-mono'
      : 'font-sans';

  const labelFontClass = typography.labelFont === 'tech-mono' ? 'font-mono' : 'font-sans';

  // Photo shape class
  const photoShapeClass =
    layout.photoShape === 'circle'
      ? 'rounded-full'
      : layout.photoShape === 'squircle'
      ? 'rounded-2xl'
      : layout.photoShape === 'sharp-rect'
      ? 'rounded-none'
      : 'rounded-lg';

  // Photo border styling
  const photoBorderClass =
    layout.photoBorder === 'metallic-gold'
      ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-white shadow-md'
      : layout.photoBorder === 'accent'
      ? 'ring-2 ring-offset-2 ring-offset-white shadow-sm'
      : layout.photoBorder === 'double-hairline'
      ? 'border-2 border-dashed shadow-xs'
      : 'ring-1 ring-black/10 shadow-xs';

  const photoBorderInlineStyle =
    layout.photoBorder === 'accent'
      ? { borderColor: p, boxShadow: `0 0 0 2px ${p}25` }
      : layout.photoBorder === 'double-hairline'
      ? { borderColor: s }
      : {};

  // Photo zoom/offset transform
  const photoZoom = student.photoCrop?.zoom ?? 1;
  const photoOffsetX = student.photoCrop?.offsetX ?? 0;
  const photoOffsetY = student.photoCrop?.offsetY ?? 0;
  const photoTransform = `scale(${photoZoom}) translate(${photoOffsetX}%, ${photoOffsetY}%)`;

  // Student name transform
  const formattedName =
    typography.nameTransform === 'uppercase'
      ? student.fullName.toUpperCase()
      : student.fullName;

  // Background SVG data URL generated mathematically
  const bgSvgDataUrl = generateDynamicSvgBackground(spec, width, height);

  // QR Code payload
  const qrPayload = JSON.stringify({
    institution: institution.name,
    studentId: student.studentId || 'N/A',
    name: student.fullName || 'Student',
    department: student.department || 'N/A',
    validThru: student.validThru || 'N/A',
    theme: spec.theme,
  });

  /* ========================================================================= */
  /* FRONT SIDE RENDERER                                                       */
  /* ========================================================================= */
  if (side === 'front') {
    return (
      <div
        className="relative w-full h-full overflow-hidden select-none flex flex-col justify-between"
        style={{ backgroundColor: stock }}
      >
        {/* Layer 0: Dynamic Mathematical SVG Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={bgSvgDataUrl}
            alt="AI Background Layer"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Layer 10: Card Content Elements */}
        <div className="relative z-10 flex flex-col h-full justify-between">
          {/* Header Variant Section */}
          {layout.headerStyle === 'solid-banner' && (
            <div
              className="p-3 text-white flex items-center justify-between shadow-xs"
              style={{ backgroundColor: p }}
            >
              <div className="flex items-center gap-2 max-w-[80%]">
                {institution.logoDataUrl ? (
                  <img
                    src={institution.logoDataUrl}
                    alt="Logo"
                    className="w-8 h-8 rounded object-contain bg-white/10 p-0.5 shrink-0"
                  />
                ) : (
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center font-bold text-sm shrink-0 border border-white/20"
                    style={{ backgroundColor: s }}
                  >
                    {institution.name.slice(0, 2).toUpperCase() || 'ID'}
                  </div>
                )}
                <div className="truncate">
                  <h3 className="font-bold text-[12px] truncate leading-tight tracking-wide">
                    {institution.name || 'INSTITUTION NAME'}
                  </h3>
                  {institution.subtitle && (
                    <p className="text-[9px] opacity-80 truncate leading-none mt-0.5 font-mono">
                      {institution.subtitle}
                    </p>
                  )}
                </div>
              </div>
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: s }}
                title="Verified Credential"
              />
            </div>
          )}

          {layout.headerStyle === 'minimal-rail' && (
            <div className="p-3 border-b flex items-center justify-between" style={{ borderColor: `${p}30` }}>
              <div className="flex items-center gap-2 max-w-[85%]">
                {institution.logoDataUrl ? (
                  <img
                    src={institution.logoDataUrl}
                    alt="Logo"
                    className="w-7 h-7 rounded object-contain shrink-0"
                  />
                ) : (
                  <div
                    className="w-7 h-7 rounded flex items-center justify-center font-bold text-xs text-white shrink-0"
                    style={{ backgroundColor: p }}
                  >
                    {institution.name.slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3
                    className="font-bold text-[11.5px] tracking-wider uppercase truncate"
                    style={{ color: p }}
                  >
                    {institution.name || 'INSTITUTION NAME'}
                  </h3>
                  <span className="text-[9px] font-mono uppercase block" style={{ color: mutedCol }}>
                    {institution.subtitle || 'STUDENT IDENTITY CARD'}
                  </span>
                </div>
              </div>
              <div
                className="px-1.5 py-0.5 rounded text-[8.5px] font-mono font-semibold text-white uppercase"
                style={{ backgroundColor: p }}
              >
                PASS
              </div>
            </div>
          )}

          {layout.headerStyle === 'split-accent' && (
            <div className="relative">
              <div className="h-2 w-full" style={{ backgroundColor: s }} />
              <div
                className="p-3 text-white flex items-center justify-between shadow-xs"
                style={{ backgroundColor: p }}
              >
                <div className="truncate">
                  <h3 className="font-bold text-[12px] truncate uppercase tracking-wider">
                    {institution.name || 'INSTITUTION NAME'}
                  </h3>
                  <span className="text-[9px] opacity-85 font-mono block">
                    {institution.subtitle || 'OFFICIAL CREDENTIAL'}
                  </span>
                </div>
                {institution.logoDataUrl && (
                  <img
                    src={institution.logoDataUrl}
                    alt="Logo"
                    className="w-7 h-7 object-contain bg-white/10 rounded p-0.5 shrink-0"
                  />
                )}
              </div>
            </div>
          )}

          {layout.headerStyle === 'tech-hud' && (
            <div
              className="p-2.5 border-b font-mono text-[9px] flex items-center justify-between bg-black/5"
              style={{ borderColor: `${a}40` }}
            >
              <div className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: a }} />
                <span className="font-bold truncate text-[10px]" style={{ color: p }}>
                  {institution.name.toUpperCase() || 'TECH INSTITUTION'}
                </span>
              </div>
              <span
                className="px-1.5 py-0.5 rounded text-[8px] font-semibold text-white"
                style={{ backgroundColor: p }}
              >
                HUD // ID
              </span>
            </div>
          )}

          {layout.headerStyle === 'crest-centered' && (
            <div className="pt-3 pb-2 text-center border-b" style={{ borderColor: `${s}30` }}>
              {institution.logoDataUrl ? (
                <img
                  src={institution.logoDataUrl}
                  alt="Logo"
                  className="w-8 h-8 mx-auto object-contain mb-1"
                />
              ) : (
                <div
                  className="w-7 h-7 mx-auto rounded-full flex items-center justify-center font-bold text-xs text-white mb-1"
                  style={{ backgroundColor: p }}
                >
                  {institution.name.slice(0, 1).toUpperCase()}
                </div>
              )}
              <h3 className="font-serif font-bold text-[12px] leading-tight" style={{ color: p }}>
                {institution.name || 'UNIVERSITY NAME'}
              </h3>
              <p className="text-[8.5px] font-mono tracking-widest uppercase opacity-70 mt-0.5" style={{ color: mutedCol }}>
                {institution.subtitle || 'FOUNDED 1885'}
              </p>
            </div>
          )}

          {/* Central Body: Photo + Identity Stack */}
          <div className="p-3.5 flex-1 flex flex-col justify-center">
            {/* Top-Center Photo Arrangement */}
            {layout.photoPosition === 'top-center' && (
              <div className="flex flex-col items-center text-center space-y-2.5">
                <div
                  className={`w-28 h-32 overflow-hidden bg-slate-100 flex items-center justify-center relative ${photoShapeClass} ${photoBorderClass}`}
                  style={photoBorderInlineStyle}
                >
                  {student.photoDataUrl ? (
                    <img
                      src={student.photoDataUrl}
                      alt={student.fullName}
                      className="w-full h-full object-cover"
                      style={{ transform: photoTransform }}
                    />
                  ) : (
                    <div className="text-slate-400 font-mono text-[10px] text-center p-2">
                      PORTRAIT PHOTO
                    </div>
                  )}
                </div>

                <div>
                  <h2
                    className={`font-bold text-[15px] leading-snug tracking-tight ${headingFontClass}`}
                    style={{ color: textCol }}
                  >
                    {formattedName || 'STUDENT FULL NAME'}
                  </h2>
                  <div
                    className="inline-block mt-1 px-2 py-0.5 rounded font-mono text-[10px] font-semibold"
                    style={{ backgroundColor: `${p}15`, color: p }}
                  >
                    ID: {student.studentId || 'STU-2026-0000'}
                  </div>
                </div>
              </div>
            )}

            {/* Top-Left Photo Arrangement */}
            {(layout.photoPosition === 'top-left' || layout.photoPosition === 'center-left' || layout.photoPosition === 'badge-inset') && (
              <div className="flex items-center gap-3">
                <div
                  className={`w-24 h-28 shrink-0 overflow-hidden bg-slate-100 flex items-center justify-center relative ${photoShapeClass} ${photoBorderClass}`}
                  style={photoBorderInlineStyle}
                >
                  {student.photoDataUrl ? (
                    <img
                      src={student.photoDataUrl}
                      alt={student.fullName}
                      className="w-full h-full object-cover"
                      style={{ transform: photoTransform }}
                    />
                  ) : (
                    <div className="text-slate-400 font-mono text-[9px] text-center p-1">
                      PHOTO
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-mono uppercase tracking-wider block" style={{ color: mutedCol }}>
                    STUDENT IDENTITY
                  </span>
                  <h2
                    className={`font-bold text-[14px] leading-snug truncate ${headingFontClass}`}
                    style={{ color: textCol }}
                  >
                    {formattedName || 'STUDENT NAME'}
                  </h2>
                  <div
                    className="inline-block mt-1 px-2 py-0.5 rounded font-mono text-[9.5px] font-semibold"
                    style={{ backgroundColor: `${p}15`, color: p }}
                  >
                    {student.studentId || 'STU-00000'}
                  </div>
                </div>
              </div>
            )}

            {/* Information Grid Section */}
            <div className="mt-3">
              {layout.infoLayout === 'two-column-grid' && (
                <div className="grid grid-cols-2 gap-2 text-[10px] p-2 rounded bg-white/70 backdrop-blur-[1px] border border-black/5 shadow-2xs">
                  <div>
                    <span className="text-[8.5px] uppercase font-mono block opacity-70" style={{ color: mutedCol }}>
                      Department
                    </span>
                    <span className="font-semibold truncate block" style={{ color: textCol }}>
                      {student.department || 'Computer Science'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[8.5px] uppercase font-mono block opacity-70" style={{ color: mutedCol }}>
                      Course / Program
                    </span>
                    <span className="font-semibold truncate block" style={{ color: textCol }}>
                      {student.course || 'B.Tech / B.Sc'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[8.5px] uppercase font-mono block opacity-70" style={{ color: mutedCol }}>
                      Academic Year
                    </span>
                    <span className="font-semibold block" style={{ color: textCol }}>
                      {student.academicYear || '2026–2030'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[8.5px] uppercase font-mono block opacity-70" style={{ color: mutedCol }}>
                      Valid Thru
                    </span>
                    <span className="font-semibold block" style={{ color: textCol }}>
                      {student.validThru || 'May 2030'}
                    </span>
                  </div>
                </div>
              )}

              {layout.infoLayout === 'stacked-cards' && (
                <div className="space-y-1.5 text-[10px]">
                  <div className="flex justify-between items-center p-1.5 rounded bg-white/80 border border-black/5 shadow-2xs">
                    <span className="font-mono text-[8.5px] uppercase opacity-75" style={{ color: mutedCol }}>
                      Dept:
                    </span>
                    <span className="font-semibold truncate max-w-[65%]" style={{ color: textCol }}>
                      {student.department || 'Engineering'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-1.5 rounded bg-white/80 border border-black/5 shadow-2xs">
                    <span className="font-mono text-[8.5px] uppercase opacity-75" style={{ color: mutedCol }}>
                      Course:
                    </span>
                    <span className="font-semibold truncate max-w-[65%]" style={{ color: textCol }}>
                      {student.course || 'Undergraduate'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-1.5 rounded bg-white/80 border border-black/5 shadow-2xs">
                    <span className="font-mono text-[8.5px] uppercase opacity-75" style={{ color: mutedCol }}>
                      Tenure:
                    </span>
                    <span className="font-semibold" style={{ color: textCol }}>
                      {student.academicYear || '2026–2030'}
                    </span>
                  </div>
                </div>
              )}

              {layout.infoLayout === 'tabular-rows' && (
                <div className="border rounded divide-y text-[10px] bg-white/80" style={{ borderColor: `${p}25` }}>
                  <div className="flex justify-between p-1.5">
                    <span className="font-mono text-[8.5px] uppercase" style={{ color: mutedCol }}>
                      Department
                    </span>
                    <span className="font-semibold" style={{ color: textCol }}>
                      {student.department || 'Not Assigned'}
                    </span>
                  </div>
                  <div className="flex justify-between p-1.5">
                    <span className="font-mono text-[8.5px] uppercase" style={{ color: mutedCol }}>
                      Course
                    </span>
                    <span className="font-semibold" style={{ color: textCol }}>
                      {student.course || 'Degree Program'}
                    </span>
                  </div>
                  <div className="flex justify-between p-1.5">
                    <span className="font-mono text-[8.5px] uppercase" style={{ color: mutedCol }}>
                      Valid Until
                    </span>
                    <span className="font-semibold font-mono" style={{ color: p }}>
                      {student.validThru || '2030'}
                    </span>
                  </div>
                </div>
              )}

              {layout.infoLayout === 'compact-modern' && (
                <div className="p-2 rounded bg-black/5 border border-black/5 text-[9.5px] font-mono space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="opacity-60">DEPT //</span>
                    <span className="font-bold truncate" style={{ color: p }}>
                      {student.department || 'SCIENCE'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="opacity-60">CRS //</span>
                    <span className="font-semibold truncate">{student.course || 'MAJOR'}</span>
                  </div>
                  <div className="flex items-center justify-between pt-0.5 border-t border-black/5">
                    <span>{student.academicYear || '2026-30'}</span>
                    <span className="font-bold" style={{ color: s }}>
                      EXP: {student.validThru || '2030'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Bar & Front QR Code (if configured) */}
          <div
            className="p-2.5 border-t flex items-center justify-between text-[8.5px] bg-white/60 backdrop-blur-xs"
            style={{ borderColor: `${p}20` }}
          >
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" style={{ color: p }} />
              <span className="font-mono uppercase opacity-75 truncate max-w-[170px]" style={{ color: textCol }}>
                {institution.issuingAuthority || 'OFFICIAL ID'}
              </span>
            </div>

            {layout.qrPlacement === 'front-corner' && (
              <div className="bg-white p-0.5 rounded shadow-2xs border border-black/10 shrink-0">
                <CardQrCode value={qrPayload} size={36} darkColor={p} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ========================================================================= */
  /* BACK SIDE RENDERER                                                        */
  /* ========================================================================= */
  return (
    <div
      className="relative w-full h-full overflow-hidden select-none flex flex-col justify-between"
      style={{ backgroundColor: stock }}
    >
      {/* Layer 0: Background SVG Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <img
          src={bgSvgDataUrl}
          alt="AI Background Layer"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Layer 10: Content */}
      <div className="relative z-10 flex flex-col h-full justify-between p-3.5 space-y-2">
        {/* Top Header */}
        <div className="border-b pb-2 flex items-center justify-between" style={{ borderColor: `${p}25` }}>
          <div>
            <h4 className="font-bold text-[11px] uppercase tracking-wider" style={{ color: p }}>
              Terms of Identification
            </h4>
            <span className="text-[8px] font-mono opacity-70" style={{ color: mutedCol }}>
              Property of {institution.name || 'Institution'}
            </span>
          </div>

          {student.bloodGroup && (
            <div
              className="px-2 py-0.5 rounded font-mono text-[9px] font-bold flex items-center gap-1 border shadow-2xs"
              style={{ backgroundColor: '#FEE2E2', color: '#991B1B', borderColor: '#FCA5A5' }}
            >
              <Droplet className="w-2.5 h-2.5 fill-current" />
              <span>{student.bloodGroup}</span>
            </div>
          )}
        </div>

        {/* Central Information: QR Code + Barcode + Emergency Contact */}
        <div className="space-y-2.5 my-auto">
          {/* Centered QR Verification */}
          <div className="flex flex-col items-center justify-center p-2 rounded bg-white/80 border border-black/5 shadow-2xs text-center">
            <CardQrCode value={qrPayload} size={64} darkColor={p} />
            <span className="font-mono text-[7.5px] uppercase mt-1 opacity-70" style={{ color: textCol }}>
              SCAN TO AUTHENTICATE STUDENT RECORD
            </span>
          </div>

          {/* Emergency Contact */}
          {(student.emergencyContactName || student.emergencyContactPhone) && (
            <div className="p-2 rounded bg-white/70 border border-black/5 text-[9px] space-y-0.5">
              <span className="font-mono text-[8px] uppercase font-semibold flex items-center gap-1" style={{ color: p }}>
                <AlertCircle className="w-3 h-3 text-amber-600" />
                Emergency Contact
              </span>
              <div className="font-medium truncate" style={{ color: textCol }}>
                {student.emergencyContactName || 'Guardian / Family'}
              </div>
              {student.emergencyContactPhone && (
                <div className="font-mono text-[8.5px] flex items-center gap-1" style={{ color: mutedCol }}>
                  <Phone className="w-2.5 h-2.5" />
                  <span>{student.emergencyContactPhone}</span>
                </div>
              )}
            </div>
          )}

          {/* Disclaimer text */}
          <p className="text-[8px] leading-tight text-justify opacity-75 font-sans" style={{ color: mutedCol }}>
            This identity credential is nontransferable and must be surrendered upon graduation, dismissal, or withdrawal. Found cards should be returned to the Office of the Registrar.
          </p>
        </div>

        {/* Bottom Contact & Signature */}
        <div className="pt-2 border-t text-[8px] space-y-1.5" style={{ borderColor: `${p}20` }}>
          <div className="flex justify-between items-end">
            <div className="space-y-0.5 max-w-[65%] font-mono text-[7.5px]" style={{ color: mutedCol }}>
              {institution.address && (
                <div className="flex items-center gap-1 truncate">
                  <MapPin className="w-2.5 h-2.5 shrink-0" />
                  <span className="truncate">{institution.address}</span>
                </div>
              )}
              {institution.emailOrWebsite && (
                <div className="flex items-center gap-1 truncate">
                  <Mail className="w-2.5 h-2.5 shrink-0" />
                  <span className="truncate">{institution.emailOrWebsite}</span>
                </div>
              )}
            </div>

            <div className="text-right">
              <div className="w-20 border-b border-black/30 mb-0.5" />
              <span className="font-mono text-[7px] uppercase font-semibold block" style={{ color: textCol }}>
                {institution.issuingAuthority || 'REGISTRAR'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
