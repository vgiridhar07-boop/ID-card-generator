import React from 'react';
import { BloodGroup, StudentDetails } from '@/types/id-card';
import { BLOOD_GROUPS } from '@/lib/constants';
import { User, Hash, BookOpen, GraduationCap, Calendar, Clock, HeartPulse, UserCheck, PhoneCall } from 'lucide-react';

interface StudentDetailsFormProps {
  student: StudentDetails;
  onChange: (updated: Partial<StudentDetails>) => void;
}

export function StudentDetailsForm({ student, onChange }: StudentDetailsFormProps) {
  return (
    <div className="space-y-4">
      {/* Student Full Name & ID Number */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-[11.5px] font-mono uppercase tracking-wider text-studio-ink-secondary mb-1">
            Student Full Name <span className="text-studio-destructive">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={student.fullName}
              onChange={(e) => onChange({ fullName: e.target.value })}
              placeholder="e.g. Julian Vance Sterling"
              className="w-full px-3 py-2 pl-9 bg-studio-panel border border-studio-border rounded-md text-[13px] text-studio-ink-primary placeholder:text-studio-ink-muted focus-ring"
            />
            <User className="w-4 h-4 text-studio-ink-muted absolute left-3 top-2.5 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-[11.5px] font-mono uppercase tracking-wider text-studio-ink-secondary mb-1">
            Student Matriculation ID <span className="text-studio-destructive">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={student.studentId}
              onChange={(e) => onChange({ studentId: e.target.value })}
              placeholder="e.g. STU-2026-8942"
              className="w-full px-3 py-2 pl-9 bg-studio-panel border border-studio-border rounded-md text-[13px] font-mono text-studio-ink-primary placeholder:text-studio-ink-muted focus-ring tabular-nums"
            />
            <Hash className="w-4 h-4 text-studio-ink-muted absolute left-3 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Department & Course Program */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-[11.5px] font-mono uppercase tracking-wider text-studio-ink-secondary mb-1">
            Department / Faculty <span className="text-studio-destructive">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={student.department}
              onChange={(e) => onChange({ department: e.target.value })}
              placeholder="e.g. School of Computing & AI"
              className="w-full px-3 py-2 pl-9 bg-studio-panel border border-studio-border rounded-md text-[13px] text-studio-ink-primary placeholder:text-studio-ink-muted focus-ring"
            />
            <BookOpen className="w-4 h-4 text-studio-ink-muted absolute left-3 top-2.5 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-[11.5px] font-mono uppercase tracking-wider text-studio-ink-secondary mb-1">
            Degree / Course Program <span className="text-studio-destructive">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={student.course}
              onChange={(e) => onChange({ course: e.target.value })}
              placeholder="e.g. B.Tech Artificial Intelligence"
              className="w-full px-3 py-2 pl-9 bg-studio-panel border border-studio-border rounded-md text-[13px] text-studio-ink-primary placeholder:text-studio-ink-muted focus-ring"
            />
            <GraduationCap className="w-4 h-4 text-studio-ink-muted absolute left-3 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Academic Year, Valid Thru, and Blood Group */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div>
          <label className="block text-[11.5px] font-mono uppercase tracking-wider text-studio-ink-secondary mb-1">
            Academic Cohort / Year <span className="text-studio-destructive">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={student.academicYear}
              onChange={(e) => onChange({ academicYear: e.target.value })}
              placeholder="e.g. 2026–2030"
              className="w-full px-3 py-2 pl-8 bg-studio-panel border border-studio-border rounded-md text-[13px] text-studio-ink-primary placeholder:text-studio-ink-muted focus-ring tabular-nums"
            />
            <Calendar className="w-3.5 h-3.5 text-studio-ink-muted absolute left-2.5 top-3 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-[11.5px] font-mono uppercase tracking-wider text-studio-ink-secondary mb-1">
            Card Expiry (Valid Thru)
          </label>
          <div className="relative">
            <input
              type="text"
              value={student.validThru}
              onChange={(e) => onChange({ validThru: e.target.value })}
              placeholder="e.g. May 2030"
              className="w-full px-3 py-2 pl-8 bg-studio-panel border border-studio-border rounded-md text-[13px] text-studio-ink-primary placeholder:text-studio-ink-muted focus-ring"
            />
            <Clock className="w-3.5 h-3.5 text-studio-ink-muted absolute left-2.5 top-3 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-[11.5px] font-mono uppercase tracking-wider text-studio-ink-secondary mb-1">
            Blood Group
          </label>
          <div className="relative">
            <select
              value={student.bloodGroup}
              onChange={(e) => onChange({ bloodGroup: e.target.value as BloodGroup })}
              className="w-full px-3 py-2 pl-8 bg-studio-panel border border-studio-border rounded-md text-[13px] text-studio-ink-primary focus-ring"
            >
              <option value="">Select (Optional)</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
            <HeartPulse className="w-3.5 h-3.5 text-studio-ink-muted absolute left-2.5 top-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Emergency Contact Block */}
      <div className="pt-3 border-t border-studio-border">
        <span className="block text-[11.5px] font-mono uppercase tracking-wider text-studio-ink-secondary mb-2.5">
          Emergency Contact Information (Printed on Reverse)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-[11px] text-studio-ink-secondary mb-1">
              Emergency Contact Name / Relationship
            </label>
            <div className="relative">
              <input
                type="text"
                value={student.emergencyContactName}
                onChange={(e) => onChange({ emergencyContactName: e.target.value })}
                placeholder="e.g. Sarah Sterling (Guardian)"
                className="w-full px-3 py-2 pl-8 bg-studio-panel border border-studio-border rounded-md text-[13px] text-studio-ink-primary placeholder:text-studio-ink-muted focus-ring"
              />
              <UserCheck className="w-3.5 h-3.5 text-studio-ink-muted absolute left-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-studio-ink-secondary mb-1">
              Emergency Contact Telephone
            </label>
            <div className="relative">
              <input
                type="text"
                value={student.emergencyContactPhone}
                onChange={(e) => onChange({ emergencyContactPhone: e.target.value })}
                placeholder="e.g. +1 (555) 892-4110"
                className="w-full px-3 py-2 pl-8 bg-studio-panel border border-studio-border rounded-md text-[13px] text-studio-ink-primary placeholder:text-studio-ink-muted focus-ring tabular-nums"
              />
              <PhoneCall className="w-3.5 h-3.5 text-studio-ink-muted absolute left-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
