import React from 'react';
import { CardOrientation, CardSide, InstitutionBranding, StudentDetails } from '@/types/id-card';
import { CardPhotoFrame } from '../CardPhotoFrame';
import { BarcodeRenderer } from '../BarcodeRenderer';
import { getContrastTextColor, isDarkSurface } from '@/lib/color-utils';

interface ExecutiveMetroCardProps {
  institution: InstitutionBranding;
  student: StudentDetails;
  orientation: CardOrientation;
  side: CardSide;
  isExportNode?: boolean;
}

export function ExecutiveMetroCard({
  institution,
  student,
  orientation,
  side,
}: ExecutiveMetroCardProps) {
  const isPortrait = orientation === 'portrait';
  const primary = institution.primaryColor || institution.accentColor || '#1E293B';
  const secondary = institution.secondaryColor || '#C27D00';
  const cardStock = institution.cardStockTint || '#FFFFFF';

  const stockTextColor = getContrastTextColor(cardStock);
  const headerTextColor = getContrastTextColor(primary);

  const instName = institution.name || 'METROPOLITAN UNIVERSITY';
  const instSubtitle = institution.subtitle || 'Graduate School & Professional Studies';
  const studentName = student.fullName || 'Student Full Name';
  const studentId = student.studentId || 'STU-2026-0000';
  const department = student.department || 'Faculty of Executive Studies';
  const course = student.course || 'Master of Management & Analytics';
  const academicYear = student.academicYear || '2026–2028';
  const validThru = student.validThru || 'June 2028';

  if (side === 'back') {
    return (
      <div
        className="w-full h-full flex flex-col justify-between p-4 relative select-none font-sans overflow-hidden"
        style={{ backgroundColor: cardStock, color: stockTextColor }}
      >
        {/* Top Metallic Pinstripe Header */}
        <div className="w-full py-1.5 px-3 rounded-sm flex items-center justify-between text-[8px] font-mono tracking-wider uppercase"
          style={{ backgroundColor: primary, color: headerTextColor }}
        >
          <span>EXECUTIVE CREDENTIAL SECURITY</span>
          <span style={{ color: secondary }}>ENCRYPTED</span>
        </div>

        {/* Regulatory Copy */}
        <div className="space-y-1.5 text-[8.5px] leading-relaxed opacity-85 my-2">
          <p>
            1. This card certifies authorized admission to institutional centers, conference facilities, and digital knowledge repositories of {instName}.
          </p>
          <p>
            2. Property of the University Board. Must be presented to proctors or facility administrators upon request.
          </p>
          <div className="pt-1 border-t border-black/10 text-[7.5px] font-mono">
            HEADQUARTERS REGISTRY: {institution.phone || '+1 (555) 800-EXEC'} • {institution.emailOrWebsite || 'executive@institution.edu'}
          </div>
        </div>

        {/* Medical & Emergency Inscription */}
        <div className="p-2 rounded border border-black/10 bg-black/5 flex items-center justify-between text-[8px] font-mono">
          <div>
            <span className="text-[7px] uppercase opacity-70 block">EMERGENCY ASSISTANCE:</span>
            <span className="font-semibold block truncate">{student.emergencyContactName || 'N/A'}</span>
            <span className="opacity-80 text-[7.5px]">{student.emergencyContactPhone || 'N/A'}</span>
          </div>
          <div className="text-right pl-2 border-l border-black/10">
            <span className="text-[7px] uppercase opacity-70 block">BLOOD TYPE:</span>
            <span className="font-bold text-[10px]" style={{ color: secondary }}>
              {student.bloodGroup || 'N/A'}
            </span>
          </div>
        </div>

        {/* Barcode & Registry Stamp */}
        <div className="pt-2 border-t border-black/10 flex items-end justify-between">
          <div className="flex-1 pr-3">
            <BarcodeRenderer value={studentId} height={28} showText={true} />
          </div>
          <div className="text-right">
            <div className="h-5 font-serif italic text-[9px] opacity-80 border-b border-black/30 px-2">
              Dean / Registrar
            </div>
            <span className="text-[7px] font-mono opacity-60 uppercase block mt-0.5">
              {institution.issuingAuthority || 'OFFICE OF REGISTRAR'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // FRONT - PORTRAIT
  if (isPortrait) {
    return (
      <div
        className="w-full h-full flex flex-col justify-between relative select-none font-sans overflow-hidden"
        style={{ backgroundColor: cardStock, color: stockTextColor }}
      >
        {/* Executive Top Banner with Metallic Rule */}
        <div
          className="w-full pt-4 pb-3 px-4 relative shadow-sm"
          style={{ backgroundColor: primary, color: headerTextColor }}
        >
          <div className="flex items-center gap-3">
            {institution.logoDataUrl ? (
              <img
                src={institution.logoDataUrl}
                alt="Logo"
                className="w-10 h-10 object-contain rounded bg-white/10 p-0.5 border border-white/20 shrink-0"
              />
            ) : (
              <div
                className="w-10 h-10 rounded border flex items-center justify-center font-bold text-xs shrink-0"
                style={{ borderColor: secondary, color: secondary, backgroundColor: 'rgba(255,255,255,0.08)' }}
              >
                METRO
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="font-sans font-bold text-[12px] leading-tight tracking-tight uppercase line-clamp-2">
                {instName}
              </h1>
              <p className="text-[7.5px] font-mono opacity-80 uppercase tracking-wider mt-0.5 truncate">
                {instSubtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Secondary Metallic Accent Line */}
        <div className="w-full h-1" style={{ backgroundColor: secondary }} />

        {/* Center: Photo & Executive Identification */}
        <div className="flex-1 flex flex-col items-center justify-between px-4 py-3">
          <div className="relative">
            <CardPhotoFrame
              photoDataUrl={student.photoDataUrl}
              crop={student.photoCrop}
              shape="rounded"
              accentColor={secondary}
              className="w-28 h-36 shadow-sm border-2"
            />
            <div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded text-[8px] font-mono font-bold tracking-wider uppercase shadow-xs whitespace-nowrap"
              style={{ backgroundColor: primary, color: headerTextColor, border: `1px solid ${secondary}` }}
            >
              FELLOW // STUDENT
            </div>
          </div>

          <div className="w-full text-center mt-3">
            <h2 className="font-sans font-bold text-[15.5px] leading-tight tracking-tight">
              {studentName}
            </h2>
            <div className="mt-1 font-mono text-[9.5px] font-semibold tracking-wider opacity-85">
              ID NO: <span style={{ color: primary }}>{studentId}</span>
            </div>
          </div>

          {/* Clean Data Matrix */}
          <div className="w-full border-t border-b border-black/10 py-2 mt-2 bg-black/[0.03] px-3 rounded space-y-1 text-[8.5px]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[7px] uppercase opacity-70">Program:</span>
              <span className="font-bold truncate max-w-[180px]">{course}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[7px] uppercase opacity-70">Division:</span>
              <span className="truncate max-w-[180px] opacity-90">{department}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[7px] uppercase opacity-70">Academic Term:</span>
              <span className="font-mono">{academicYear}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[7px] uppercase opacity-70">Valid Until:</span>
              <span className="font-mono font-medium">{validThru}</span>
            </div>
          </div>

          {/* Footer Callout */}
          <div className="w-full flex items-center justify-between text-[7px] font-mono uppercase tracking-widest opacity-60 pt-1">
            <span>OFFICIAL EXECUTIVE CREDENTIAL</span>
            <span className="font-bold" style={{ color: secondary }}>CR80 ID-1</span>
          </div>
        </div>

        {/* Bottom Accent */}
        <div className="w-full h-1.5" style={{ backgroundColor: primary }} />
      </div>
    );
  }

  // FRONT - LANDSCAPE
  return (
    <div
      className="w-full h-full flex flex-col justify-between relative select-none font-sans overflow-hidden"
      style={{ backgroundColor: cardStock, color: stockTextColor }}
    >
      {/* Top Banner */}
      <div
        className="w-full py-2 px-4 flex items-center justify-between shadow-sm"
        style={{ backgroundColor: primary, color: headerTextColor }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {institution.logoDataUrl ? (
            <img
              src={institution.logoDataUrl}
              alt="Logo"
              className="w-7 h-7 object-contain rounded bg-white/10 p-0.5 border border-white/20 shrink-0"
            />
          ) : (
            <div
              className="w-7 h-7 rounded border flex items-center justify-center font-bold text-[9px] shrink-0"
              style={{ borderColor: secondary, color: secondary }}
            >
              METRO
            </div>
          )}
          <div className="min-w-0">
            <h1 className="font-sans font-bold text-[11px] leading-tight uppercase truncate">
              {instName}
            </h1>
            <p className="font-mono text-[7px] opacity-80 uppercase truncate">
              {instSubtitle}
            </p>
          </div>
        </div>
        <div
          className="px-2 py-0.5 rounded text-[7.5px] font-mono uppercase font-bold tracking-wider shrink-0"
          style={{ backgroundColor: secondary, color: getContrastTextColor(secondary) }}
        >
          EXECUTIVE
        </div>
      </div>

      <div className="w-full h-0.5" style={{ backgroundColor: secondary }} />

      {/* Main Body: Photo Left, Info Right */}
      <div className="flex-1 flex items-center px-4 py-2.5 gap-4">
        <div className="shrink-0">
          <CardPhotoFrame
            photoDataUrl={student.photoDataUrl}
            crop={student.photoCrop}
            shape="rounded"
            accentColor={secondary}
            className="w-28 h-36 shadow-sm border-2"
          />
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
          <div>
            <span className="font-mono text-[7.5px] uppercase tracking-widest opacity-60">IDENTIFICATION CARD</span>
            <h2 className="font-sans font-bold text-[15px] leading-tight truncate">
              {studentName}
            </h2>
            <div className="mt-0.5 font-mono text-[9.5px] font-bold" style={{ color: primary }}>
              ID: {studentId}
            </div>
          </div>

          <div className="space-y-1 text-[8.5px] border-t border-black/10 pt-1.5 bg-black/[0.02] p-1.5 rounded">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[7px] uppercase opacity-70">Program:</span>
              <span className="font-bold truncate max-w-[200px]">{course}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[7px] uppercase opacity-70">Faculty:</span>
              <span className="truncate max-w-[200px] opacity-90">{department}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[7px] uppercase opacity-70">Tenure:</span>
              <span className="font-mono">{academicYear}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[7px] uppercase opacity-70">Expires:</span>
              <span className="font-mono">{validThru}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[7px] font-mono opacity-60 uppercase pt-1 border-t border-black/10">
            <span>ISSUED BY: {institution.issuingAuthority || 'REGISTRAR'}</span>
            <span className="font-bold" style={{ color: secondary }}>CR80</span>
          </div>
        </div>
      </div>

      <div className="w-full h-1" style={{ backgroundColor: primary }} />
    </div>
  );
}
