import { BloodGroup, CardDesignConfig, InstitutionBranding, StudentDetails, StudentIdDraft, TemplateId } from '@/types/id-card';

export interface AccentColorPreset {
  name: string;
  hex: string;
  description: string;
}

export const ACCENT_COLOR_PRESETS: AccentColorPreset[] = [
  { name: 'Oxford Navy', hex: '#1B365D', description: 'Classic Ivy & Collegiate Authority' },
  { name: 'Heritage Crimson', hex: '#7A1F2B', description: 'Traditional University Maroon' },
  { name: 'Forest Pine', hex: '#1E4D3B', description: 'Archival Scholastic Green' },
  { name: 'Matte Slate', hex: '#2C353F', description: 'Architectural Charcoal & Neutral' },
  { name: 'Burnished Ochre', hex: '#8C5A1E', description: 'Honors Guild Warm Bronze' },
  { name: 'Deep Indigo', hex: '#2E2A5E', description: 'Modern Research Institute' },
];

export interface TemplateDefinition {
  id: TemplateId;
  title: string;
  description: string;
  badge: string;
  styleCategory: 'Archival Serif' | 'Swiss Modern' | 'Collegiate Crest' | 'Technical Grid' | 'Corporate Executive' | 'Bauhaus Studio';
}

export const TEMPLATE_DEFINITIONS: TemplateDefinition[] = [
  {
    id: 'classic-academic',
    title: 'Classic Academic',
    description: 'Archival serif headers with formal collegiate horizontal framing and balanced proportions.',
    badge: 'Collegiate Standard',
    styleCategory: 'Archival Serif',
  },
  {
    id: 'modern-minimal',
    title: 'Modern Minimal',
    description: 'Swiss-inspired grid, asymmetric accent rule, and high-contrast typographic hierarchy.',
    badge: 'Contemporary',
    styleCategory: 'Swiss Modern',
  },
  {
    id: 'heritage-crest',
    title: 'Heritage Crest',
    description: 'Traditional institutional layout with tinted headers, crest emblem, and ornate framing.',
    badge: 'Archival Prestige',
    styleCategory: 'Collegiate Crest',
  },
  {
    id: 'campus-tech',
    title: 'Campus Tech',
    description: 'STEM institute layout with monospace metadata, modular data chips, and barcode line.',
    badge: 'Polytechnic / STEM',
    styleCategory: 'Technical Grid',
  },
  {
    id: 'executive-metro',
    title: 'Executive Metro',
    description: 'Postgraduate & corporate institute layout with deep executive band, metallic rules, and sleek data columns.',
    badge: 'Executive / Grad',
    styleCategory: 'Corporate Executive',
  },
  {
    id: 'nordic-clean',
    title: 'Nordic Clean',
    description: 'Bauhaus & Scandinavian design academy aesthetic with prominent photo display and bold typographic scale.',
    badge: 'Design & Arts',
    styleCategory: 'Bauhaus Studio',
  },
];

export const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Physical Print Constants (ISO/IEC 7810 ID-1 / CR80)
export const PRINT_GEOMETRY = {
  mm: {
    portrait: { width: 53.98, height: 85.60 },
    landscape: { width: 85.60, height: 53.98 },
    cornerRadius: 3.18,
  },
  capturePx: {
    portrait: { width: 324, height: 514, radius: 19 },
    landscape: { width: 514, height: 324, radius: 19 },
    scale: 3, // ~300 DPI rasterization (972x1542 or 1542x972)
  },
  a4SheetMm: {
    pageWidth: 210,
    pageHeight: 297,
    marginTop: 20,
    marginSide: 20,
    cardGapMm: 12,
  },
} as const;

export const DEFAULT_PHOTO_CROP = {
  zoom: 1.0,
  offsetX: 0,
  offsetY: 0,
};

export const DEFAULT_INSTITUTION: InstitutionBranding = {
  name: '',
  subtitle: '',
  logoDataUrl: null,
  phone: '',
  emailOrWebsite: '',
  address: '',
  accentColor: '#1B365D',
  primaryColor: '#1B365D',
  secondaryColor: '#8C5A1E',
  cardStockTint: '#FFFFFF',
  issuingAuthority: 'Registrar / Principal',
};

export const DEFAULT_STUDENT: StudentDetails = {
  fullName: '',
  studentId: '',
  department: '',
  course: '',
  academicYear: '',
  validThru: '',
  bloodGroup: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  photoDataUrl: null,
  photoCrop: { ...DEFAULT_PHOTO_CROP },
};

export const DEFAULT_DESIGN: CardDesignConfig = {
  templateId: 'classic-academic',
  orientation: 'portrait',
  showLanyardSlotPreview: true,
  primaryColor: '#1B365D',
  secondaryColor: '#8C5A1E',
  cardStockTint: '#FFFFFF',
};

export function createBlankDraft(): StudentIdDraft {
  const now = new Date().toISOString();
  return {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `draft-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
    institution: { ...DEFAULT_INSTITUTION },
    student: { ...DEFAULT_STUDENT },
    design: { ...DEFAULT_DESIGN },
  };
}

// Built-in Sample University Seal (SVG Data URL)
export const SAMPLE_UNIVERSITY_SEAL = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <circle cx="60" cy="60" r="56" fill="none" stroke="#1B365D" stroke-width="4"/>
  <circle cx="60" cy="60" r="50" fill="none" stroke="#1B365D" stroke-width="1.5" stroke-dasharray="3,3"/>
  <polygon points="60,18 72,42 98,46 80,64 84,90 60,78 36,90 40,64 22,46 48,42" fill="#1B365D" opacity="0.12"/>
  <path d="M40 70 L60 45 L80 70 Z" fill="#1B365D"/>
  <rect x="52" y="65" width="16" height="22" rx="2" fill="#1B365D"/>
  <circle cx="60" cy="38" r="6" fill="#1B365D"/>
  <text x="60" y="104" font-family="serif" font-size="8" font-weight="700" text-anchor="middle" fill="#1B365D" letter-spacing="1.5">VERITAS • 1892</text>
</svg>
`)}`;

// Built-in Sample Student Photo (High-quality SVG Portrait Data URL)
export const SAMPLE_STUDENT_PHOTO = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="400" height="500">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E2E8F0"/>
      <stop offset="100%" stop-color="#CBD5E1"/>
    </linearGradient>
  </defs>
  <rect width="400" height="500" fill="url(#bg)"/>
  <circle cx="200" cy="180" r="85" fill="#475569"/>
  <path d="M70 470 C90 320, 310 320, 330 470 Z" fill="#1E293B"/>
  <path d="M140 330 L200 400 L260 330 Z" fill="#FFFFFF"/>
  <path d="M185 350 L200 450 L215 350 Z" fill="#1B365D"/>
  <ellipse cx="200" cy="190" rx="60" ry="70" fill="#E2E8F0"/>
  <path d="M140 180 C140 100, 260 100, 260 180 C240 120, 160 120, 140 180 Z" fill="#1E293B"/>
</svg>
`)}`;

export const SAMPLE_DRAFT: StudentIdDraft = {
  id: 'sample-draft-preview-001',
  createdAt: '2026-09-01T08:00:00.000Z',
  updatedAt: new Date().toISOString(),
  institution: {
    name: 'St. Jude Institute of Technology',
    subtitle: 'Autonomous Institution • NAAC A++ Grade',
    logoDataUrl: SAMPLE_UNIVERSITY_SEAL,
    phone: '+1 (555) 342-8900',
    emailOrWebsite: 'www.stjude-tech.edu',
    address: '400 University Crest Blvd, Cambridge, MA 02138',
    accentColor: '#1B365D',
    primaryColor: '#1B365D',
    secondaryColor: '#8C5A1E',
    cardStockTint: '#FFFFFF',
    issuingAuthority: 'Dr. Eleanor Vance, Registrar',
  },
  student: {
    fullName: 'Julian Vance Sterling',
    studentId: 'STU-2026-8942',
    department: 'School of Computing & Data Sciences',
    course: 'B.Tech Artificial Intelligence',
    academicYear: '2026–2030 (Year 1)',
    validThru: 'May 2030',
    bloodGroup: 'O+',
    emergencyContactName: 'Sarah Sterling (Guardian)',
    emergencyContactPhone: '+1 (555) 892-4110',
    photoDataUrl: SAMPLE_STUDENT_PHOTO,
    photoCrop: {
      zoom: 1.0,
      offsetX: 0,
      offsetY: 0,
    },
  },
  design: {
    templateId: 'classic-academic',
    orientation: 'portrait',
    showLanyardSlotPreview: true,
    primaryColor: '#1B365D',
    secondaryColor: '#8C5A1E',
    cardStockTint: '#FFFFFF',
  },
};
