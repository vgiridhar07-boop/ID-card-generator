import React from 'react';
import { CardOrientation, CardSide, InstitutionBranding, StudentDetails } from '@/types/id-card';
import { CardPhotoFrame } from '../CardPhotoFrame';
import { BarcodeRenderer } from '../BarcodeRenderer';

interface HeritageCrestCardProps {
  institution: InstitutionBranding;
  student: StudentDetails;
  orientation: CardOrientation;
  side: CardSide;
  isExportNode?: boolean;
}

export function HeritageCrestCard({
  institution,
  student,
  orientation,
  side,
}: HeritageCrestCardProps) {
  const isPortrait = orientation === 'portrait';
  const accent = institution.accentColor || '#7A1F2B'; // Default Heritage Crimson

  const instName = institution.name || 'ACADEMIA UNIVERSITATIS';
  const instSubtitle = institution.subtitle || 'Chartered & Endowed • Founded MDCCCXCII';
  const studentName = student.fullName || 'Student Full Name';
  const studentId = student.studentId || 'STU-2026-0000';
  const department = student.department || 'Faculty of Liberal Arts & Sciences';
  const course = student.course || 'Bachelor of Arts & Humanities';
  const academicYear = student.academicYear || '2026–2030';
  const validThru = student.validThru || 'May 2030';

  if (side === 'back') {
    return (
      <div className="w-full h-full bg-[#FDFBF7] flex flex-col justify-between p-3.5 relative select-none font-serif overflow-hidden text-studio-ink-primary border-[3px] border-[#D8D2C2]">
        {/* Archival Inner Hairline Border */}
        <div className="absolute inset-1 border border-[#D8D2C2] pointer-events-none" />

        {/* Back Header Banner */}
        <div className="text-center pt-1 pb-1.5 border-b border-[#D8D2C2]">
          <h3 className="font-serif font-bold text-[10px] tracking-widest uppercase text-studio-ink-primary">
            Academic Regulations & Registry
          </h3>
          <span className="text-[7.5px] italic text-studio-ink-secondary block font-sans">
            Under Charter of the Academic Senate
          </span>
        </div>

        {/* Body Text & Directives */}
        <div className="space-y-1.5 text-[8px] leading-relaxed text-studio-ink-secondary font-sans px-1">
          <p>
            This credential testifies that the bearer is a duly matriculated scholar in good standing of{' '}
            <strong className="text-studio-ink-primary font-serif">{instName}</strong>.
          </p>
          <p>
            It is subject to immediate surrender upon revocation of privileges or withdrawal from the university rolls.
          </p>
          <div className="border-t border-[#E5DFCF] pt-1 text-[7.5px]">
            <span className="font-semibold text-studio-ink-primary">Bursar & Registry: </span>
            {institution.address || 'Collegiate Quadrangle, University Campus'} • {institution.phone || '+1 (555) 432-1000'}
          </div>
        </div>

        {/* Medical & Emergency Inscription */}
        <div className="bg-[#F4EFE6] border border-[#DDD5C5] p-2 rounded-sm text-[8px] font-sans flex items-center justify-between">
          <div>
            <span className="text-[7px] font-mono uppercase text-studio-ink-muted block">Emergency Guardian:</span>
            <div className="font-semibold text-studio-ink-primary truncate">{student.emergencyContactName || 'Designated Contact'}</div>
            <div className="font-mono text-studio-ink-secondary text-[7.5px]">{student.emergencyContactPhone || '+1 (555) 000-0000'}</div>
          </div>
          <div className="text-right pl-2 border-l border-[#DDD5C5]">
            <span className="text-[7px] font-mono uppercase text-studio-ink-muted block">Blood Profile:</span>
            <span className="font-bold text-[10px] font-mono" style={{ color: accent }}>
              {student.bloodGroup || 'N/A'}
            </span>
          </div>
        </div>

        {/* Bottom Barcode & Seal Block */}
        <div className="pt-2 border-t border-[#D8D2C2] flex items-end justify-between font-sans">
          <div className="flex-1 pr-3">
            <BarcodeRenderer value={studentId} height={26} showText={true} />
          </div>
          <div className="text-right">
            <div className="h-5 font-serif italic text-[9px] text-studio-ink-secondary border-b border-studio-ink-primary/30 px-2">
              Registrar Signature
            </div>
            <span className="text-[7px] font-mono text-studio-ink-muted uppercase block mt-0.5">
              {institution.issuingAuthority || 'Office of the Registrar'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // FRONT - PORTRAIT
  if (isPortrait) {
    return (
      <div className="w-full h-full bg-[#FDFBF7] flex flex-col justify-between p-3.5 relative select-none font-serif overflow-hidden text-studio-ink-primary border-[3px] border-[#D8D2C2]">
        {/* Archival Inner Hairline Border */}
        <div className="absolute inset-1 border border-[#D8D2C2] pointer-events-none" />

        {/* Top Ornate Institutional Seal & Title */}
        <div className="w-full text-center pt-2 pb-2 border-b border-[#D8D2C2] flex flex-col items-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            {institution.logoDataUrl ? (
              <img
                src={institution.logoDataUrl}
                alt="Seal"
                className="w-10 h-10 object-contain rounded-full border border-[#D8D2C2] p-0.5 bg-white shrink-0"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-full border border-amber-800/40 flex items-center justify-center font-bold text-xs bg-amber-50 shrink-0"
                style={{ color: accent }}
              >
                UNIV
              </div>
            )}
          </div>
          <h1
            className="font-serif font-bold text-[12px] leading-snug tracking-wider uppercase line-clamp-2 px-2"
            style={{ color: accent }}
          >
            {instName}
          </h1>
          <p className="text-[7.5px] italic font-sans text-studio-ink-secondary tracking-wide uppercase mt-0.5 truncate max-w-[280px]">
            {instSubtitle}
          </p>
        </div>

        {/* Center: Photo & Credential Presentation */}
        <div className="flex-1 flex flex-col items-center justify-between py-2 text-center">
          {/* Framed Archival Photo */}
          <div className="p-1 bg-white border border-[#D8D2C2] shadow-sm">
            <CardPhotoFrame
              photoDataUrl={student.photoDataUrl}
              crop={student.photoCrop}
              shape="rounded"
              accentColor={accent}
              className="w-28 h-36"
            />
          </div>

          {/* Student Name & Matriculation Number */}
          <div className="w-full mt-1.5">
            <span className="text-[7.5px] font-sans uppercase tracking-[0.2em] text-studio-ink-muted block">
              COLLEGIATE SCHOLAR
            </span>
            <h2 className="font-serif font-bold text-[15px] leading-tight text-studio-ink-primary tracking-tight mt-0.5">
              {studentName}
            </h2>
            <div className="inline-block mt-1 font-mono text-[9px] font-semibold tracking-wider text-studio-ink-secondary border-b border-studio-ink-secondary/30 pb-0.5">
              ROLL NO: {studentId}
            </div>
          </div>

          {/* Detailed Faculty Block */}
          <div className="w-full grid grid-cols-2 gap-x-2 gap-y-1 text-left text-[8px] font-sans border-t border-b border-[#E5DFCF] py-1.5 mt-1 bg-[#F7F3EA] px-2 rounded-sm">
            <div>
              <span className="font-mono text-[6.5px] text-studio-ink-muted uppercase block">Curriculum:</span>
              <span className="font-semibold text-studio-ink-primary truncate block">{course}</span>
            </div>
            <div>
              <span className="font-mono text-[6.5px] text-studio-ink-muted uppercase block">Faculty:</span>
              <span className="font-semibold text-studio-ink-primary truncate block">{department}</span>
            </div>
            <div>
              <span className="font-mono text-[6.5px] text-studio-ink-muted uppercase block">Tenure:</span>
              <span className="font-mono text-studio-ink-secondary block">{academicYear}</span>
            </div>
            <div>
              <span className="font-mono text-[6.5px] text-studio-ink-muted uppercase block">Valid Thru:</span>
              <span className="font-mono text-studio-ink-secondary block">{validThru}</span>
            </div>
          </div>

          {/* Archival Motto Footer */}
          <div className="w-full flex items-center justify-between text-[7px] font-mono uppercase tracking-widest text-studio-ink-muted pt-1">
            <span>OFFICIAL REGISTRATION</span>
            <span style={{ color: accent }} className="font-bold">CR80</span>
          </div>
        </div>

        {/* Bottom Accent Band */}
        <div className="w-full h-1" style={{ backgroundColor: accent }} />
      </div>
    );
  }

  // FRONT - LANDSCAPE
  return (
    <div className="w-full h-full bg-[#FDFBF7] flex flex-col justify-between p-3.5 relative select-none font-serif overflow-hidden text-studio-ink-primary border-[3px] border-[#D8D2C2]">
      {/* Archival Inner Hairline Border */}
      <div className="absolute inset-1 border border-[#D8D2C2] pointer-events-none" />

      {/* Top Banner */}
      <div className="w-full pb-2 border-b border-[#D8D2C2] flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          {institution.logoDataUrl ? (
            <img
              src={institution.logoDataUrl}
              alt="Seal"
              className="w-8 h-8 object-contain rounded-full border border-[#D8D2C2] p-0.5 bg-white shrink-0"
            />
          ) : (
            <div
              className="w-8 h-8 rounded-full border border-amber-800/40 flex items-center justify-center font-bold text-[10px] bg-amber-50 shrink-0"
              style={{ color: accent }}
            >
              UNIV
            </div>
          )}
          <div className="min-w-0">
            <h1
              className="font-serif font-bold text-[11px] leading-tight uppercase truncate"
              style={{ color: accent }}
            >
              {instName}
            </h1>
            <p className="text-[7px] italic font-sans text-studio-ink-secondary truncate">
              {instSubtitle}
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="text-[7.5px] font-mono tracking-widest uppercase border border-[#D8D2C2] bg-white px-2 py-0.5 rounded-sm">
            Scholar Credential
          </span>
        </div>
      </div>

      {/* Body: Left Photo, Right Credentials */}
      <div className="flex-1 flex items-center py-2 px-1 gap-4 font-sans">
        <div className="p-1 bg-white border border-[#D8D2C2] shadow-sm shrink-0">
          <CardPhotoFrame
            photoDataUrl={student.photoDataUrl}
            crop={student.photoCrop}
            shape="rounded"
            accentColor={accent}
            className="w-28 h-36"
          />
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
          <div>
            <span className="text-[7.5px] font-mono tracking-widest uppercase text-studio-ink-muted">MATRICULATED SCHOLAR</span>
            <h2 className="font-serif font-bold text-[15px] leading-tight text-studio-ink-primary truncate">
              {studentName}
            </h2>
            <div className="font-mono text-[9.5px] font-semibold text-studio-ink-secondary mt-0.5">
              ROLL NO: {studentId}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[8px] border-t border-[#E5DFCF] pt-1.5 mt-1">
            <div>
              <span className="font-mono text-[6.5px] text-studio-ink-muted uppercase block">Curriculum:</span>
              <span className="font-semibold text-studio-ink-primary truncate block">{course}</span>
            </div>
            <div>
              <span className="font-mono text-[6.5px] text-studio-ink-muted uppercase block">Faculty:</span>
              <span className="font-semibold text-studio-ink-primary truncate block">{department}</span>
            </div>
            <div>
              <span className="font-mono text-[6.5px] text-studio-ink-muted uppercase block">Tenure:</span>
              <span className="font-mono text-studio-ink-secondary block">{academicYear}</span>
            </div>
            <div>
              <span className="font-mono text-[6.5px] text-studio-ink-muted uppercase block">Valid Thru:</span>
              <span className="font-mono text-studio-ink-secondary block">{validThru}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[7px] font-mono text-studio-ink-muted uppercase pt-1 border-t border-[#D8D2C2]/60">
            <span>ATTESTED BY: {institution.issuingAuthority || 'REGISTRAR'}</span>
            <span style={{ color: accent }} className="font-bold">CR80 ID-1</span>
          </div>
        </div>
      </div>

      {/* Bottom Accent */}
      <div className="w-full h-1" style={{ backgroundColor: accent }} />
    </div>
  );
}
