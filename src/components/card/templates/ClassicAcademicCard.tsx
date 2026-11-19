import React from 'react';
import { CardOrientation, CardSide, InstitutionBranding, StudentDetails } from '@/types/id-card';
import { CardPhotoFrame } from '../CardPhotoFrame';
import { BarcodeRenderer } from '../BarcodeRenderer';
import { CardQrCode } from '../CardQrCode';

interface ClassicAcademicCardProps {
  institution: InstitutionBranding;
  student: StudentDetails;
  orientation: CardOrientation;
  side: CardSide;
  isExportNode?: boolean;
}

export function ClassicAcademicCard({
  institution,
  student,
  orientation,
  side,
}: ClassicAcademicCardProps) {
  const isPortrait = orientation === 'portrait';
  const accent = institution.primaryColor || institution.accentColor || '#1B365D';

  const instName = institution.name || 'INSTITUTION OF HIGHER EDUCATION';
  const instSubtitle = institution.subtitle || 'Autonomous Collegiate Institution';
  const studentName = student.fullName || 'Student Full Name';
  const studentId = student.studentId || 'STU-2026-0000';
  const department = student.department || 'Academic Department';
  const course = student.course || 'Degree Program';
  const academicYear = student.academicYear || '2026–2030';
  const validThru = student.validThru || 'May 2030';

  if (side === 'back') {
    return (
      <div className="w-full h-full bg-white/95 flex flex-col justify-between p-4 relative select-none font-sans overflow-hidden text-studio-ink-primary">
        {/* Top Accent Strip */}
        <div
          className="w-full py-1.5 px-3 text-center text-white text-[9px] font-serif font-bold tracking-wider uppercase rounded-sm"
          style={{ backgroundColor: accent }}
        >
          Institutional Credential Policy
        </div>

        {/* Middle Content */}
        <div className={`flex-1 flex ${isPortrait ? 'flex-col gap-2 pt-1.5' : 'flex-row gap-3 pt-1.5'}`}>
          {/* Rules & Return Address */}
          <div className="flex-1 text-[8px] leading-relaxed text-studio-ink-secondary space-y-1">
            <p>
              1. This credential remains the property of{' '}
              <strong className="text-studio-ink-primary">{instName}</strong> and must be produced upon demand.
            </p>
            <p>
              2. Authorized for official campus facility access, examinations, and library circulation services.
            </p>
            <p>
              3. Found cards must be deposited in any official campus mailbox or returned to the Office of the Registrar.
            </p>

            <div className="pt-1 border-t border-studio-border/60 text-[7.5px]">
              <span className="font-semibold text-studio-ink-primary">Office of Student Affairs: </span>
              {institution.phone || '+1 (555) 000-0000'} • {institution.emailOrWebsite || 'registrar@institution.edu'}
              <div className="truncate">{institution.address || 'Campus Quadrangle, Main Campus'}</div>
            </div>
          </div>

          {/* Medical & Emergency Block */}
          <div className={`${isPortrait ? 'w-full' : 'w-44'} bg-studio-canvas/70 border border-studio-border/80 p-2 rounded-sm text-[8px] flex flex-col justify-between`}>
            <div className="flex items-center justify-between pb-1 border-b border-studio-border/60">
              <span className="font-mono font-semibold uppercase text-studio-ink-secondary">Medical / Blood:</span>
              <span className="font-bold text-studio-ink-primary px-1.5 py-0.5 bg-white border border-studio-border rounded text-[9px]">
                {student.bloodGroup || 'N/A'}
              </span>
            </div>
            <div className="pt-1">
              <span className="font-mono text-[7.5px] text-studio-ink-muted uppercase block">Emergency Contact:</span>
              <div className="font-semibold text-studio-ink-primary truncate">
                {student.emergencyContactName || 'Designated Contact Person'}
              </div>
              <div className="font-mono text-studio-ink-secondary text-[7.5px]">
                {student.emergencyContactPhone || '+1 (555) 000-0000'}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Barcode, QR Code & Authority */}
        <div className="pt-2 border-t border-studio-border/80 flex items-end justify-between gap-2">
          <div className="flex-1 pr-1">
            <BarcodeRenderer value={studentId} height={26} showText={true} />
          </div>
          <div className="shrink-0 pb-0.5">
            <CardQrCode value={`https://verify.edu/id/${studentId}?s=${encodeURIComponent(studentName)}`} size={36} darkColor={accent} />
          </div>
          <div className="text-right flex flex-col items-end shrink-0">
            <div className="h-5 flex items-end font-serif italic text-[9px] text-studio-ink-secondary border-b border-studio-ink-primary/40 px-2 pb-0.5">
              Registrar Signature
            </div>
            <span className="text-[7px] font-sans text-studio-ink-muted uppercase tracking-wider mt-0.5">
              {institution.issuingAuthority || 'Office of the Registrar'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // FRONT SIDE - PORTRAIT
  if (isPortrait) {
    return (
      <div className="w-full h-full bg-white/95 flex flex-col justify-between relative select-none font-sans overflow-hidden text-studio-ink-primary">
        {/* Top Institutional Header Band */}
        <div
          className="w-full pt-4 pb-3 px-4 text-white flex items-center gap-3 relative shadow-sm"
          style={{ backgroundColor: accent }}
        >
          {institution.logoDataUrl ? (
            <img
              src={institution.logoDataUrl}
              alt="Logo"
              className="w-11 h-11 object-contain rounded-full bg-white/10 p-0.5 border border-white/20 shrink-0"
            />
          ) : (
            <div className="w-11 h-11 rounded-full border border-white/30 flex items-center justify-center font-serif font-bold text-xs shrink-0 bg-white/10">
              COL
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="font-serif font-bold text-[12px] leading-tight tracking-wide uppercase line-clamp-2">
              {instName}
            </h1>
            <p className="text-[8px] font-sans opacity-85 tracking-wider uppercase mt-0.5 truncate">
              {instSubtitle}
            </p>
          </div>
        </div>

        {/* Subtle decorative gold/hairline rule */}
        <div className="w-full h-0.5 bg-gradient-to-r from-amber-600/40 via-amber-400 to-amber-600/40" />

        {/* Student Credential Center Body */}
        <div className="flex-1 flex flex-col items-center justify-between px-4 py-3 text-center">
          <div className="mt-1">
            <CardPhotoFrame
              photoDataUrl={student.photoDataUrl}
              crop={student.photoCrop}
              shape="rounded"
              accentColor={accent}
              className="w-28 h-36 shadow-sm border-2"
            />
          </div>

          <div className="w-full mt-2">
            <h2 className="font-serif font-bold text-[15px] leading-tight text-studio-ink-primary tracking-tight">
              {studentName}
            </h2>
            <div className="inline-block mt-1 px-2.5 py-0.5 bg-studio-canvas border border-studio-border rounded text-[9.5px] font-mono font-semibold tracking-wider text-studio-ink-primary">
              ID: {studentId}
            </div>
          </div>

          <div className="w-full grid grid-cols-2 gap-x-2 gap-y-1.5 text-left text-[8.5px] border-t border-b border-studio-border/60 py-2 mt-2 bg-studio-canvas/30 px-2 rounded">
            <div>
              <span className="font-mono text-[7px] text-studio-ink-muted uppercase block">Course</span>
              <span className="font-semibold text-studio-ink-primary truncate block">{course}</span>
            </div>
            <div>
              <span className="font-mono text-[7px] text-studio-ink-muted uppercase block">Department</span>
              <span className="font-semibold text-studio-ink-primary truncate block">{department}</span>
            </div>
            <div>
              <span className="font-mono text-[7px] text-studio-ink-muted uppercase block">Academic Year</span>
              <span className="font-medium text-studio-ink-secondary block">{academicYear}</span>
            </div>
            <div>
              <span className="font-mono text-[7px] text-studio-ink-muted uppercase block">Valid Thru</span>
              <span className="font-medium text-studio-ink-secondary block">{validThru}</span>
            </div>
          </div>

          <div className="w-full flex items-center justify-between text-[7.5px] font-mono uppercase tracking-widest text-studio-ink-muted pt-1">
            <span>OFFICIAL STUDENT IDENTIFICATION</span>
            <span style={{ color: accent }} className="font-bold">CR80</span>
          </div>
        </div>

        <div className="w-full h-1.5" style={{ backgroundColor: accent }} />
      </div>
    );
  }

  // FRONT SIDE - LANDSCAPE
  return (
    <div className="w-full h-full bg-white/95 flex flex-col justify-between relative select-none font-sans overflow-hidden text-studio-ink-primary">
      <div
        className="w-full py-2.5 px-4 text-white flex items-center justify-between shadow-sm"
        style={{ backgroundColor: accent }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {institution.logoDataUrl ? (
            <img
              src={institution.logoDataUrl}
              alt="Logo"
              className="w-8 h-8 object-contain rounded-full bg-white/10 p-0.5 border border-white/20 shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center font-serif font-bold text-[10px] shrink-0 bg-white/10">
              COL
            </div>
          )}
          <div className="min-w-0">
            <h1 className="font-serif font-bold text-[11px] leading-tight uppercase truncate">
              {instName}
            </h1>
            <p className="text-[7.5px] font-sans opacity-85 uppercase truncate">
              {instSubtitle}
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="text-[7.5px] font-mono tracking-widest uppercase bg-white/15 px-2 py-0.5 rounded border border-white/20">
            Student Card
          </span>
        </div>
      </div>

      <div className="w-full h-0.5 bg-gradient-to-r from-amber-600/40 via-amber-400 to-amber-600/40" />

      <div className="flex-1 flex items-center px-4 py-3 gap-4">
        <div className="shrink-0 flex flex-col items-center">
          <CardPhotoFrame
            photoDataUrl={student.photoDataUrl}
            crop={student.photoCrop}
            shape="rounded"
            accentColor={accent}
            className="w-28 h-36 shadow-sm border-2"
          />
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
          <div>
            <span className="text-[8px] font-mono tracking-widest text-studio-ink-muted uppercase">Student Name</span>
            <h2 className="font-serif font-bold text-[15px] leading-tight text-studio-ink-primary truncate">
              {studentName}
            </h2>
            <div className="inline-block mt-1 px-2 py-0.5 bg-studio-canvas border border-studio-border rounded text-[9px] font-mono font-semibold text-studio-ink-primary">
              ID: {studentId}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[8.5px] border-t border-studio-border/60 pt-1.5 mt-2">
            <div>
              <span className="font-mono text-[7px] text-studio-ink-muted uppercase block">Course</span>
              <span className="font-semibold text-studio-ink-primary truncate block">{course}</span>
            </div>
            <div>
              <span className="font-mono text-[7px] text-studio-ink-muted uppercase block">Department</span>
              <span className="font-semibold text-studio-ink-primary truncate block">{department}</span>
            </div>
            <div>
              <span className="font-mono text-[7px] text-studio-ink-muted uppercase block">Tenure</span>
              <span className="font-medium text-studio-ink-secondary block">{academicYear}</span>
            </div>
            <div>
              <span className="font-mono text-[7px] text-studio-ink-muted uppercase block">Valid Thru</span>
              <span className="font-medium text-studio-ink-secondary block">{validThru}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[7px] font-mono text-studio-ink-muted pt-1 border-t border-studio-border/40">
            <span>ISSUED BY: {institution.issuingAuthority || 'REGISTRAR'}</span>
            <span className="font-bold" style={{ color: accent }}>CR80 ID-1</span>
          </div>
        </div>
      </div>

      <div className="w-full h-1.5" style={{ backgroundColor: accent }} />
    </div>
  );
}
