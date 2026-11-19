import React from 'react';
import { CardOrientation, CardSide, InstitutionBranding, StudentDetails } from '@/types/id-card';
import { CardPhotoFrame } from '../CardPhotoFrame';
import { BarcodeRenderer } from '../BarcodeRenderer';

interface CampusTechCardProps {
  institution: InstitutionBranding;
  student: StudentDetails;
  orientation: CardOrientation;
  side: CardSide;
  isExportNode?: boolean;
}

export function CampusTechCard({
  institution,
  student,
  orientation,
  side,
}: CampusTechCardProps) {
  const isPortrait = orientation === 'portrait';
  const accent = institution.accentColor || '#1E4D3B'; // Default Forest Pine / Deep Tech

  const instName = institution.name || 'INSTITUTE OF ADVANCED TECHNOLOGY';
  const instSubtitle = institution.subtitle || 'Polytechnic & Applied Research Labs';
  const studentName = student.fullName || 'Student Full Name';
  const studentId = student.studentId || 'STU-2026-0000';
  const department = student.department || 'Computing & Systems Architecture';
  const course = student.course || 'B.Tech Robotics & Machine Learning';
  const academicYear = student.academicYear || '2026–2030';
  const validThru = student.validThru || 'May 2030';

  if (side === 'back') {
    return (
      <div className="w-full h-full bg-[#181A1F] text-white flex flex-col justify-between p-3.5 relative select-none font-sans overflow-hidden">
        {/* Top Tech Header Bar */}
        <div className="flex items-center justify-between border-b border-white/20 pb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[7.5px] tracking-widest text-emerald-400 uppercase">
              RFID // SMART CAMPUS NODE
            </span>
          </div>
          <span className="font-mono text-[7.5px] text-white/50">ISO 14443-A</span>
        </div>

        {/* Security & Access Policies */}
        <div className="space-y-1.5 text-[8px] leading-relaxed text-white/70 font-sans my-1">
          <p>
            1. Authorized for laboratory physical access, compute clusters, and distributed campus facility networks.
          </p>
          <p>
            2. Property of {instName}. Transfer or unauthorized duplication revokes network and physical security credentials.
          </p>
          <div className="text-[7.5px] font-mono text-white/50 pt-1 border-t border-white/10">
            EMERGENCY LAB DISPATCH: {institution.phone || '+1 (555) 911-TECH'}
          </div>
        </div>

        {/* Medical & Emergency HUD */}
        <div className="bg-white/5 border border-white/10 p-2 rounded text-[8px] font-mono grid grid-cols-2 gap-2">
          <div>
            <span className="text-[6.5px] text-white/50 uppercase block">ICE Contact:</span>
            <div className="font-bold text-white truncate">{student.emergencyContactName || 'N/A'}</div>
            <div className="text-white/70 text-[7.5px]">{student.emergencyContactPhone || 'N/A'}</div>
          </div>
          <div className="border-l border-white/10 pl-2">
            <span className="text-[6.5px] text-white/50 uppercase block">Blood Type:</span>
            <span className="font-bold text-emerald-400 text-[10px]">{student.bloodGroup || 'N/A'}</span>
            <div className="text-[6.5px] text-white/40 truncate">SECURITY TIER 1</div>
          </div>
        </div>

        {/* Inverted Barcode & Footer */}
        <div className="pt-2 border-t border-white/20 bg-white p-2 rounded-sm text-studio-ink-primary">
          <BarcodeRenderer value={studentId} height={26} showText={true} />
        </div>
      </div>
    );
  }

  // FRONT - PORTRAIT
  if (isPortrait) {
    return (
      <div className="w-full h-full bg-[#FAFAFA] flex flex-col justify-between relative select-none font-sans overflow-hidden text-studio-ink-primary border border-studio-border">
        {/* Top Tech Header Band */}
        <div
          className="w-full pt-4 pb-3 px-4 text-white relative shadow-sm"
          style={{ backgroundColor: accent }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              {institution.logoDataUrl ? (
                <img
                  src={institution.logoDataUrl}
                  alt="Logo"
                  className="w-9 h-9 object-contain rounded bg-white/10 p-0.5 border border-white/20 shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded bg-white/20 border border-white/30 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                  SYS
                </div>
              )}
              <div className="min-w-0">
                <h1 className="font-sans font-bold text-[11.5px] leading-tight tracking-tight uppercase line-clamp-2">
                  {instName}
                </h1>
                <p className="font-mono text-[7px] text-white/80 uppercase tracking-widest mt-0.5 truncate">
                  {instSubtitle}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/15 text-[7px] font-mono tracking-widest">
            <span className="text-white/80">PASS TYPE: STUDENT</span>
            <span className="bg-white/20 px-1.5 py-0.2 rounded text-white font-bold">ACTIVE</span>
          </div>
        </div>

        {/* Tech Accent Micro-stripe */}
        <div className="w-full h-0.5 bg-emerald-400" />

        {/* Center Section: Photo & Metadata HUD */}
        <div className="flex-1 flex flex-col items-center justify-between px-4 py-2.5">
          {/* Photo Frame with Tech Brackets */}
          <div className="relative mt-1">
            {/* Corner Bracket Accents */}
            <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-emerald-500 z-10" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-emerald-500 z-10" />
            <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-emerald-500 z-10" />
            <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-emerald-500 z-10" />

            <CardPhotoFrame
              photoDataUrl={student.photoDataUrl}
              crop={student.photoCrop}
              shape="square"
              accentColor={accent}
              className="w-28 h-36 shadow-sm border border-slate-300"
            />
          </div>

          {/* Student Name & ID Block */}
          <div className="w-full text-center mt-2">
            <h2 className="font-sans font-extrabold text-[15px] leading-tight text-studio-ink-primary tracking-tight">
              {studentName}
            </h2>
            <div className="inline-block mt-0.5 px-2 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono text-[9px] font-bold text-slate-800">
              ID // {studentId}
            </div>
          </div>

          {/* Tech Data Grid */}
          <div className="w-full grid grid-cols-2 gap-1.5 text-left text-[8px] font-mono border-t border-b border-slate-200 py-1.5 mt-2 bg-slate-50/80 px-2 rounded">
            <div>
              <span className="text-[6.5px] text-slate-400 uppercase block">SPEC / COURSE:</span>
              <span className="font-bold text-slate-800 truncate block font-sans text-[8.5px]">{course}</span>
            </div>
            <div>
              <span className="text-[6.5px] text-slate-400 uppercase block">LAB / DEPT:</span>
              <span className="font-semibold text-slate-700 truncate block font-sans text-[8.5px]">{department}</span>
            </div>
            <div>
              <span className="text-[6.5px] text-slate-400 uppercase block">COHORT:</span>
              <span className="font-medium text-slate-600 block">{academicYear}</span>
            </div>
            <div>
              <span className="text-[6.5px] text-slate-400 uppercase block">VALID:</span>
              <span className="font-medium text-slate-600 block">{validThru}</span>
            </div>
          </div>

          {/* Micro Barcode on Front */}
          <div className="w-full pt-1 flex items-center justify-between text-[7px] font-mono text-slate-400 uppercase">
            <span>REGISTRY VERIFIED</span>
            <span className="font-bold text-slate-700">CR80 // STEM</span>
          </div>
        </div>

        {/* Bottom Accent */}
        <div className="w-full h-1.5" style={{ backgroundColor: accent }} />
      </div>
    );
  }

  // FRONT - LANDSCAPE
  return (
    <div className="w-full h-full bg-[#FAFAFA] flex flex-col justify-between relative select-none font-sans overflow-hidden text-studio-ink-primary border border-studio-border">
      {/* Top Banner */}
      <div
        className="w-full py-2.5 px-4 text-white flex items-center justify-between shadow-sm"
        style={{ backgroundColor: accent }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {institution.logoDataUrl ? (
            <img
              src={institution.logoDataUrl}
              alt="Logo"
              className="w-8 h-8 object-contain rounded bg-white/10 p-0.5 border border-white/20 shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded bg-white/20 border border-white/30 flex items-center justify-center font-mono font-bold text-[10px] shrink-0">
              SYS
            </div>
          )}
          <div className="min-w-0">
            <h1 className="font-sans font-bold text-[11px] leading-tight uppercase truncate">
              {instName}
            </h1>
            <p className="font-mono text-[7px] text-white/80 uppercase truncate">
              {instSubtitle}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 bg-white/10 border border-white/20 px-2 py-0.5 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="font-mono text-[7px] text-white font-bold uppercase tracking-wider">
            STUDENT PASS
          </span>
        </div>
      </div>

      <div className="w-full h-0.5 bg-emerald-400" />

      {/* Main Body: Photo Left, Tech Grid Right */}
      <div className="flex-1 flex items-center px-4 py-2.5 gap-4">
        <div className="relative shrink-0">
          <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-emerald-500 z-10" />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-emerald-500 z-10" />
          <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-emerald-500 z-10" />
          <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-emerald-500 z-10" />

          <CardPhotoFrame
            photoDataUrl={student.photoDataUrl}
            crop={student.photoCrop}
            shape="square"
            accentColor={accent}
            className="w-28 h-36 shadow-sm border border-slate-300"
          />
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
          <div>
            <span className="font-mono text-[7.5px] uppercase tracking-widest text-slate-400">CREDENTIAL HOLDER</span>
            <h2 className="font-sans font-extrabold text-[15px] leading-tight text-studio-ink-primary truncate">
              {studentName}
            </h2>
            <div className="inline-block mt-0.5 font-mono text-[9.5px] font-bold text-slate-700 bg-slate-100 border border-slate-300 px-1.5 py-0.2 rounded">
              ID // {studentId}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[8px] font-mono border-t border-slate-200 pt-1.5 mt-1 bg-slate-50 p-1.5 rounded">
            <div>
              <span className="text-[6.5px] text-slate-400 uppercase block">COURSE:</span>
              <span className="font-bold text-slate-800 truncate block font-sans text-[8.5px]">{course}</span>
            </div>
            <div>
              <span className="text-[6.5px] text-slate-400 uppercase block">DEPARTMENT:</span>
              <span className="font-semibold text-slate-700 truncate block font-sans text-[8.5px]">{department}</span>
            </div>
            <div>
              <span className="text-[6.5px] text-slate-400 uppercase block">COHORT:</span>
              <span className="font-medium text-slate-600 block">{academicYear}</span>
            </div>
            <div>
              <span className="text-[6.5px] text-slate-400 uppercase block">VALID:</span>
              <span className="font-medium text-slate-600 block">{validThru}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[7px] font-mono text-slate-400 uppercase pt-1 border-t border-slate-200">
            <span>ISSUING AUTHORITY: {institution.issuingAuthority || 'REGISTRAR'}</span>
            <span className="font-bold text-slate-700">CR80</span>
          </div>
        </div>
      </div>

      {/* Bottom Accent */}
      <div className="w-full h-1.5" style={{ backgroundColor: accent }} />
    </div>
  );
}
