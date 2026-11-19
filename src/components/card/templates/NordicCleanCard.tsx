import React from 'react';
import { CardOrientation, CardSide, InstitutionBranding, StudentDetails } from '@/types/id-card';
import { CardPhotoFrame } from '../CardPhotoFrame';
import { BarcodeRenderer } from '../BarcodeRenderer';
import { getContrastTextColor } from '@/lib/color-utils';

interface NordicCleanCardProps {
  institution: InstitutionBranding;
  student: StudentDetails;
  orientation: CardOrientation;
  side: CardSide;
  isExportNode?: boolean;
}

export function NordicCleanCard({
  institution,
  student,
  orientation,
  side,
}: NordicCleanCardProps) {
  const isPortrait = orientation === 'portrait';
  const primary = institution.primaryColor || institution.accentColor || '#181A1F';
  const secondary = institution.secondaryColor || '#E11D48';
  const cardStock = institution.cardStockTint || '#FFFFFF';

  const stockTextColor = getContrastTextColor(cardStock);

  const instName = institution.name || 'ACADEMY OF DESIGN & ARCHITECTURE';
  const instSubtitle = institution.subtitle || 'Institute of Spatial Arts & Craft';
  const studentName = student.fullName || 'Student Full Name';
  const studentId = student.studentId || 'STU-2026-0000';
  const department = student.department || 'Visual Communication & Media';
  const course = student.course || 'Bachelor of Fine Arts & Design';
  const academicYear = student.academicYear || '2026–2030';
  const validThru = student.validThru || 'May 2030';

  if (side === 'back') {
    return (
      <div
        className="w-full h-full flex flex-col justify-between p-4 relative select-none font-sans overflow-hidden"
        style={{ backgroundColor: cardStock, color: stockTextColor }}
      >
        {/* Top Minimal Strip */}
        <div className="flex items-center justify-between border-b-2 border-black/80 pb-2">
          <span className="font-mono text-[9px] font-bold tracking-widest uppercase">
            STUDENT IDENTIFIER // ARCHIVE
          </span>
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: secondary }} />
        </div>

        {/* Minimal Academic Policy */}
        <div className="space-y-2 text-[8px] leading-relaxed opacity-85 font-mono">
          <p>
            Credential issued to enrolled candidates of {instName}. Authorized for design studios, fabrication workshops, and resource archives.
          </p>
          <p>
            Surrender immediately upon withdrawal or graduation. Found cards must be deposited at campus dispatch.
          </p>
          <div className="pt-1 border-t border-black/10 text-[7.5px]">
            DISPATCH: {institution.phone || '+1 (555) 789-0000'} • {institution.emailOrWebsite || 'design@academy.edu'}
          </div>
        </div>

        {/* Compact Medical / ICE HUD */}
        <div className="border border-black/15 p-2 rounded-sm text-[8px] font-mono grid grid-cols-2 gap-2 bg-black/[0.03]">
          <div>
            <span className="text-[6.5px] uppercase opacity-60 block">EMERGENCY:</span>
            <div className="font-bold truncate">{student.emergencyContactName || 'N/A'}</div>
            <div className="opacity-80 text-[7px]">{student.emergencyContactPhone || 'N/A'}</div>
          </div>
          <div className="border-l border-black/15 pl-2">
            <span className="text-[6.5px] uppercase opacity-60 block">BLOOD GRP:</span>
            <span className="font-bold text-[10px]" style={{ color: secondary }}>
              {student.bloodGroup || 'N/A'}
            </span>
          </div>
        </div>

        {/* High Contrast Barcode */}
        <div className="pt-2 border-t-2 border-black/80">
          <BarcodeRenderer value={studentId} height={30} showText={true} />
        </div>
      </div>
    );
  }

  // FRONT - PORTRAIT
  if (isPortrait) {
    return (
      <div
        className="w-full h-full flex flex-col justify-between p-4 relative select-none font-sans overflow-hidden"
        style={{ backgroundColor: cardStock, color: stockTextColor }}
      >
        {/* Top Minimalist Header */}
        <div className="flex items-start justify-between border-b-2 border-black/90 pb-2.5">
          <div className="min-w-0 flex-1 pr-2">
            <h1 className="font-sans font-black text-[12px] leading-tight tracking-tight uppercase line-clamp-2">
              {instName}
            </h1>
            <p className="font-mono text-[7px] opacity-75 uppercase tracking-wider mt-0.5 truncate">
              {instSubtitle}
            </p>
          </div>
          {institution.logoDataUrl ? (
            <img
              src={institution.logoDataUrl}
              alt="Logo"
              className="w-8 h-8 object-contain rounded p-0.5 border border-black/20 shrink-0"
            />
          ) : (
            <div
              className="w-8 h-8 rounded-none border-2 flex items-center justify-center font-black text-[9px] shrink-0"
              style={{ borderColor: primary, color: primary }}
            >
              NORD
            </div>
          )}
        </div>

        {/* Center: Large Photo Frame & Asymmetric Typographic Spine */}
        <div className="flex-1 flex flex-col items-center justify-center py-2">
          <div className="relative">
            <CardPhotoFrame
              photoDataUrl={student.photoDataUrl}
              crop={student.photoCrop}
              shape="square"
              accentColor={primary}
              className="w-32 h-40 shadow-xs border-2 border-black/90"
            />
            {/* Color accent chip */}
            <div
              className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 shadow-xs"
              style={{ backgroundColor: secondary }}
            />
          </div>

          <div className="w-full text-center mt-3">
            <h2 className="font-sans font-black text-[16px] leading-none tracking-tight uppercase">
              {studentName}
            </h2>
            <div
              className="mt-1 font-mono text-[10px] font-bold tracking-widest inline-block px-2 py-0.5 border"
              style={{ borderColor: primary, color: primary }}
            >
              NO // {studentId}
            </div>
          </div>

          {/* Minimalist Key Values */}
          <div className="w-full mt-3 pt-2 border-t border-black/20 space-y-1 text-[8.5px] font-mono">
            <div className="flex items-center justify-between">
              <span className="opacity-60 uppercase text-[7px]">DISCIPLINE:</span>
              <span className="font-bold truncate max-w-[180px] font-sans text-[9px]">{course}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60 uppercase text-[7px]">STUDIO:</span>
              <span className="truncate max-w-[180px] opacity-90">{department}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60 uppercase text-[7px]">SESSION:</span>
              <span>{academicYear}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="opacity-60 uppercase text-[7px]">VALIDITY:</span>
              <span>{validThru}</span>
            </div>
          </div>
        </div>

        {/* Footer Minimal Line */}
        <div className="pt-2 border-t-2 border-black/90 flex items-center justify-between text-[7px] font-mono uppercase tracking-widest opacity-80">
          <span>{institution.issuingAuthority || 'REGISTRAR'}</span>
          <span className="font-bold">CR80</span>
        </div>
      </div>
    );
  }

  // FRONT - LANDSCAPE
  return (
    <div
      className="w-full h-full flex flex-col justify-between p-4 relative select-none font-sans overflow-hidden"
      style={{ backgroundColor: cardStock, color: stockTextColor }}
    >
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b-2 border-black/90 pb-2">
        <div className="flex items-center gap-2.5 min-w-0">
          {institution.logoDataUrl ? (
            <img
              src={institution.logoDataUrl}
              alt="Logo"
              className="w-7 h-7 object-contain rounded p-0.5 border border-black/20 shrink-0"
            />
          ) : (
            <div
              className="w-7 h-7 border-2 flex items-center justify-center font-black text-[8px] shrink-0"
              style={{ borderColor: primary, color: primary }}
            >
              NORD
            </div>
          )}
          <div className="min-w-0">
            <h1 className="font-sans font-black text-[11px] leading-tight uppercase truncate">
              {instName}
            </h1>
            <p className="font-mono text-[7px] opacity-75 uppercase truncate">
              {instSubtitle}
            </p>
          </div>
        </div>
        <div
          className="w-3 h-3 shrink-0"
          style={{ backgroundColor: secondary }}
        />
      </div>

      {/* Main Body: Photo Left, Content Right */}
      <div className="flex-1 flex items-center py-2 gap-4">
        <div className="shrink-0 relative">
          <CardPhotoFrame
            photoDataUrl={student.photoDataUrl}
            crop={student.photoCrop}
            shape="square"
            accentColor={primary}
            className="w-28 h-36 shadow-xs border-2 border-black/90"
          />
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5 font-mono">
          <div>
            <span className="text-[7.5px] uppercase tracking-widest opacity-60 block">ACADEMY SCHOLAR</span>
            <h2 className="font-sans font-black text-[16px] leading-tight uppercase truncate">
              {studentName}
            </h2>
            <div className="text-[9.5px] font-bold mt-0.5" style={{ color: primary }}>
              ID // {studentId}
            </div>
          </div>

          <div className="space-y-1 text-[8.5px] border-t border-black/20 pt-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[7px] uppercase opacity-60">PROGRAM:</span>
              <span className="font-bold truncate max-w-[200px] font-sans text-[9px]">{course}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[7px] uppercase opacity-60">STUDIO:</span>
              <span className="truncate max-w-[200px] opacity-90">{department}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[7px] uppercase opacity-60">TERM:</span>
              <span>{academicYear}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[7px] uppercase opacity-60">VALID:</span>
              <span>{validThru}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[7px] uppercase pt-1 border-t-2 border-black/90">
            <span>ISSUED // {institution.issuingAuthority || 'REGISTRAR'}</span>
            <span className="font-bold">CR80</span>
          </div>
        </div>
      </div>
    </div>
  );
}
