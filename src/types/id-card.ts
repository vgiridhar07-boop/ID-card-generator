import type { AiDesignSpec } from './ai-design';

export type TemplateId =
  | 'classic-academic'
  | 'modern-minimal'
  | 'heritage-crest'
  | 'campus-tech'
  | 'executive-metro'
  | 'nordic-clean'
  | 'ai-dynamic';

export type CardOrientation = 'portrait' | 'landscape';
export type CardSide = 'front' | 'back';

export type BloodGroup =
  | ''
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-';

export interface PhotoCropConfig {
  zoom: number;       // 1.0 to 2.5 (default: 1.0)
  offsetX: number;    // -50 to 50 percentage shift (default: 0)
  offsetY: number;    // -50 to 50 percentage shift (default: 0)
}

export interface InstitutionBranding {
  name: string;             // Required
  subtitle: string;         // Optional (e.g., "Autonomous • NAAC A+")
  logoDataUrl: string | null;
  phone: string;
  emailOrWebsite: string;
  address: string;
  accentColor: string;      // Backwards compatible hex string
  primaryColor?: string;    // Primary brand color
  secondaryColor?: string;  // Secondary accent color
  cardStockTint?: string;   // Card background tint
  issuingAuthority: string; // Default: "Registrar / Principal"
}

export interface StudentDetails {
  fullName: string;         // Required
  studentId: string;        // Required
  department: string;       // Required
  course: string;           // Required
  academicYear: string;     // Required (e.g., "2026–2030" or "Year 2")
  validThru: string;        // Optional (e.g., "May 2030")
  bloodGroup: BloodGroup;   // Optional (shown on back)
  emergencyContactName: string;
  emergencyContactPhone: string;
  photoDataUrl: string | null; // Compressed base64 Data URL
  photoCrop: PhotoCropConfig;
}

export interface CardDesignConfig {
  templateId: TemplateId;
  orientation: CardOrientation;
  showLanyardSlotPreview: boolean; // Preview visual only, excluded from export
  primaryColor?: string;
  secondaryColor?: string;
  cardStockTint?: string;
  aiBackground?: {
    imageUrl: string;
    theme?: string;
    opacity?: number;
    scrimOpacity?: number;
    isDemo?: boolean;
  } | null;
  aiDynamicSpec?: AiDesignSpec | null;
}

export interface StudentIdDraft {
  id: string;               // crypto.randomUUID()
  updatedAt: string;        // ISO timestamp
  createdAt: string;        // ISO timestamp
  institution: InstitutionBranding;
  student: StudentDetails;
  design: CardDesignConfig;
}

export interface CollegeRecord {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  logoDataUrl: string | null;
  phone: string;
  emailOrWebsite: string;
  address: string;
  primaryColor: string;
  secondaryColor: string;
  cardStockTint: string;
  issuingAuthority: string;
  dbPath: string;
  createdAt: string;
  updatedAt: string;
  studentCount?: number;
}

export interface StoredStudentCard {
  id: string;
  fullName: string;
  studentId: string;
  department: string;
  course: string;
  academicYear: string;
  validThru: string;
  bloodGroup: BloodGroup;
  emergencyContactName: string;
  emergencyContactPhone: string;
  photoDataUrl: string | null;
  photoCropZoom: number;
  photoCropOffsetX: number;
  photoCropOffsetY: number;
  templateId: TemplateId;
  orientation: CardOrientation;
  primaryColor: string;
  secondaryColor: string;
  cardStockTint: string;
  showLanyardSlotPreview: number;
  createdAt: string;
  updatedAt: string;
}

export type ExportFormat = 'png-front' | 'png-back' | 'pdf-cr80' | 'pdf-a4-sheet';

export interface ExportProgress {
  isExporting: boolean;
  statusText: string;
  format?: ExportFormat;
}
