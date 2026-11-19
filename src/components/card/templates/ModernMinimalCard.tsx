import React from 'react';
import { CardOrientation, CardSide, InstitutionBranding, StudentDetails } from '@/types/id-card';
import { CardPhotoFrame } from '../CardPhotoFrame';
import { BarcodeRenderer } from '../BarcodeRenderer';

interface ModernMinimalCardProps {
  institution: InstitutionBranding;
  student: StudentDetails;
  orientation: CardOrientation;
  side: CardSide;
  isExportNode?: boolean;
}

export function ModernMinimalCard({
  institution,
  student,
  orientation,
  side,
}: ModernMinimalCardProps) {
  const isPortrait = orientation === 'portrait';
  const accent = institution.accentColor || '#181A1F';

  const instName = institution.name || 'MODERN UNIVERSITY';
  const instSubtitle = institution.subtitle || 'Higher Education & Research';
  const studentName = student.fullName || 'Student Full Name';
  const studentId = student.studentId || 'STU-2026-0000';
  const department = student.department || 'Department Name';
  const course = student.course || 'Degree Program';
  const academicYear = student.academicYear || '2026–2030';
  const validThru = student.validThru || 'May 2030';

  if (side === 'back') {
    return (
      <div className="w-full h-full bg-white flex flex-col justify-between relative select-none font-sans overflow-hidden text-studio-ink-primary">
        {/* Sleek Magnetic Stripe Simulation */}
        <div className="w-full h-10 bg-[#1E232A] flex items-center justify-between px-4">
          <span className="font-mono text-[7px] text-slate-400 tracking-widest uppercase">
            MAGNETIC TRACK 1 & 2 ENCODED
          </span>
          <span className="font-mono text-[7px] text-slate-300">ISO 7811</span>
        </div>

        {/* Back Content */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div className="space-y-2 text-[8px] leading-relaxed text-studio-ink-secondary">
            <div className="flex items-center justify-between border-b border-studio-border pb-1">
              <span className="font-mono uppercase font-bold text-studio-ink-primary">Verification Policy</span>
              <span className="text-[7.5px] font-mono" style={{ color: accent }}>{studentId}</span>
            </div>
            <p>
              This card is non-transferable and remains the property of {instName}. Misuse or possession by unauthorized persons is subject to institutional disciplinary action.
            </p>
            <p>
              Report loss or damage to campus facilities immediately. A replacement surcharge applies.
            </p>
          </div>

          {/* Contact & Medical Specs */}
          <div className="grid grid-cols-2 gap-2 p-2 bg-studio-canvas border border-studio-border rounded-sm text-[8px]">
            <div>
              <span className="font-mono text-[7px] uppercase text-studio-ink-muted block">Emergency ICE</span>
              <div className="font-semibold text-studio-ink-primary truncate">{student.emergencyContactName || 'N/A'}</div>
              <div className="font-mono text-studio-ink-secondary">{student.emergencyContactPhone || 'N/A'}</div>
            </div>
            <div className="border-l border-studio-border pl-2">
              <span className="font-mono text-[7px] uppercase text-studio-ink-muted block">Medical Profile</span>
              <div className="font-bold text-studio-ink-primary">BLOOD: {student.bloodGroup || 'N/A'}</div>
              <div className="text-[7.5px] text-studio-ink-muted truncate">{institution.phone || 'Campus Security'}</div>
            </div>
          </div>

          {/* Barcode & Registry */}
          <div className="pt-2 border-t border-studio-border">
            <BarcodeRenderer value={studentId} height={30} showText={true} />
            <div className="text-center text-[7px] font-mono text-studio-ink-muted uppercase tracking-wider mt-1 truncate">
              {institution.emailOrWebsite || 'www.institution.edu'} • {institution.address || 'University City'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // FRONT - PORTRAIT
  if (isPortrait) {
    return (
      <div className="w-full h-full bg-white flex flex-col justify-between relative select-none font-sans overflow-hidden text-studio-ink-primary">
        {/* Asymmetric Accent Left Stripe */}
        <div
          className="absolute top-0 left-0 w-2 h-full z-10"
          style={{ backgroundColor: accent }}
        />

        {/* Top Header */}
        <div className="pt-5 pb-2 px-5 pl-7 border-b border-studio-border/70 flex items-start justify-between">
          <div className="min-w-0 flex-1 pr-2">
            <h1 className="font-sans font-extrabold text-[12px] leading-tight tracking-tight uppercase line-clamp-2 text-studio-ink-primary">
              {instName}
            </h1>
            <p className="font-mono text-[7.5px] uppercase tracking-wider text-studio-ink-secondary mt-0.5 truncate">
              {instSubtitle}
            </p>
          </div>
          {institution.logoDataUrl ? (
            <img
              src={institution.logoDataUrl}
              alt="Logo"
              className="w-9 h-9 object-contain rounded p-0.5 border border-studio-border shrink-0"
            />
          ) : (
            <div
              className="w-9 h-9 rounded flex items-center justify-center font-bold text-white text-[10px] shrink-0"
              style={{ backgroundColor: accent }}
            >
              ID
            </div>
          )}
        </div>

        {/* Center Section: Photo & Identity */}
        <div className="flex-1 flex flex-col items-center justify-center px-5 pl-7 py-3">
          <div className="relative">
            <CardPhotoFrame
              photoDataUrl={student.photoDataUrl}
              crop={student.photoCrop}
              shape="rounded"
              accentColor={accent}
              className="w-32 h-40 shadow-sm border"
            />
            <div
              className="absolute -bottom-2 right-2 px-2 py-0.5 text-white font-mono text-[7.5px] font-bold uppercase tracking-wider rounded-sm shadow-sm"
              style={{ backgroundColor: accent }}
            >
              STUDENT
            </div>
          </div>

          <div className="w-full text-center mt-4">
            <h2 className="font-sans font-bold text-[16px] tracking-tight leading-tight text-studio-ink-primary">
              {studentName}
            </h2>
            <div className="mt-1 font-mono text-[10px] font-semibold tracking-wider text-studio-ink-secondary">
              ID // {studentId}
            </div>
          </div>

          {/* Clean key-value grid */}
          <div className="w-full mt-3 pt-2 border-t border-studio-border/60 space-y-1.5 text-[8.5px]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[7.5px] uppercase text-studio-ink-muted">Course:</span>
              <span className="font-semibold text-studio-ink-primary truncate max-w-[180px]">{course}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[7.5px] uppercase text-studio-ink-muted">Department:</span>
              <span className="text-studio-ink-secondary truncate max-w-[180px]">{department}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[7.5px] uppercase text-studio-ink-muted">Academic Term:</span>
              <span className="font-mono font-medium text-studio-ink-primary">{academicYear}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[7.5px] uppercase text-studio-ink-muted">Expires:</span>
              <span className="font-mono text-studio-ink-secondary">{validThru}</span>
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="py-2 px-5 pl-7 border-t border-studio-border bg-studio-canvas/50 flex items-center justify-between text-[7px] font-mono text-studio-ink-muted uppercase">
          <span>{institution.issuingAuthority || 'REGISTRAR'}</span>
          <span className="font-bold text-studio-ink-primary">CR80 • ID-1</span>
        </div>
      </div>
    );
  }

  // FRONT - LANDSCAPE
  return (
    <div className="w-full h-full bg-white flex flex-col justify-between relative select-none font-sans overflow-hidden text-studio-ink-primary">
      {/* Top Accent Strip */}
      <div className="w-full h-1.5" style={{ backgroundColor: accent }} />

      {/* Main Header */}
      <div className="py-2 px-5 flex items-center justify-between border-b border-studio-border/70">
        <div className="flex items-center gap-2.5 min-w-0">
          {institution.logoDataUrl ? (
            <img
              src={institution.logoDataUrl}
              alt="Logo"
              className="w-7 h-7 object-contain rounded p-0.5 border border-studio-border shrink-0"
            />
          ) : (
            <div
              className="w-7 h-7 rounded flex items-center justify-center font-bold text-white text-[9px] shrink-0"
              style={{ backgroundColor: accent }}
            >
              ID
            </div>
          )}
          <div className="min-w-0">
            <h1 className="font-sans font-bold text-[11px] leading-tight uppercase truncate text-studio-ink-primary">
              {instName}
            </h1>
            <p className="font-mono text-[7px] uppercase tracking-wider text-studio-ink-secondary truncate">
              {instSubtitle}
            </p>
          </div>
        </div>
        <div
          className="px-2 py-0.5 text-white font-mono text-[7.5px] font-bold uppercase tracking-wider rounded-sm shrink-0"
          style={{ backgroundColor: accent }}
        >
          STUDENT
        </div>
      </div>

      {/* Body: Photo Left, Content Right */}
      <div className="flex-1 flex items-center px-5 py-2.5 gap-4">
        <div className="shrink-0">
          <CardPhotoFrame
            photoDataUrl={student.photoDataUrl}
            crop={student.photoCrop}
            shape="rounded"
            accentColor={accent}
            className="w-28 h-36 shadow-sm border"
          />
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
          <div>
            <span className="font-mono text-[7.5px] uppercase tracking-widest text-studio-ink-muted">STUDENT IDENTITY</span>
            <h2 className="font-sans font-extrabold text-[16px] leading-tight text-studio-ink-primary truncate">
              {studentName}
            </h2>
            <div className="mt-0.5 font-mono text-[10px] font-bold" style={{ color: accent }}>
              {studentId}
            </div>
          </div>

          <div className="space-y-1 text-[8.5px] border-t border-studio-border/60 pt-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[7px] uppercase text-studio-ink-muted">Course:</span>
              <span className="font-semibold text-studio-ink-primary truncate max-w-[200px]">{course}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[7px] uppercase text-studio-ink-muted">Department:</span>
              <span className="text-studio-ink-secondary truncate max-w-[200px]">{department}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[7px] uppercase text-studio-ink-muted">Tenure:</span>
              <span className="font-mono text-studio-ink-primary">{academicYear}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[7px] uppercase text-studio-ink-muted">Expires:</span>
              <span className="font-mono text-studio-ink-secondary">{validThru}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[7px] font-mono text-studio-ink-muted uppercase pt-1 border-t border-studio-border/40">
            <span>ISSUED BY: {institution.issuingAuthority || 'REGISTRAR'}</span>
            <span>CR80</span>
          </div>
        </div>
      </div>

      {/* Bottom Border */}
      <div className="w-full h-1 bg-studio-canvas" />
    </div>
  );
}
