'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  CardDesignConfig,
  CollegeRecord,
  InstitutionBranding,
  StoredStudentCard,
  StudentDetails,
  StudentIdDraft,
} from '@/types/id-card';
import { AiDesignSpec } from '@/types/ai-design';
import {
  createBlankDraft,
  DEFAULT_DESIGN,
  DEFAULT_INSTITUTION,
  DEFAULT_STUDENT,
  SAMPLE_DRAFT,
  TEMPLATE_DEFINITIONS,
} from '@/lib/constants';
import {
  getActiveDraft,
  persistActiveDraft,
  clearActiveDraft,
} from '@/lib/storage';
import {
  fetchInstitutions,
  saveStudentToCollege,
} from '@/lib/api';
import { CardPreviewStage, CardPreviewStageRef } from '@/components/preview/CardPreviewStage';
import { TemplateSelector } from '@/components/editor/TemplateSelector';
import { ColorCustomizer } from '@/components/editor/ColorCustomizer';
import { AiDesignStudio } from '@/components/editor/AiDesignStudio';
import { StudentDetailsForm } from '@/components/editor/StudentDetailsForm';
import { PhotoUploader } from '@/components/editor/PhotoUploader';
import { InstitutionForm } from '@/components/editor/InstitutionForm';
import { ExportModal } from '@/components/export/ExportModal';
import { CollegeModal } from '@/components/college/CollegeModal';
import { StudentVault } from '@/components/vault/StudentVault';
import {
  CreditCard,
  User,
  Camera,
  Landmark,
  Download,
  RotateCcw,
  Sparkles,
  Save,
  CheckCircle2,
  Layers,
  Palette,
  Database,
  Search,
  Plus,
  ChevronDown,
  LayoutGrid,
} from 'lucide-react';

type StudioView = 'studio' | 'vault';
type EditorTab = 'template' | 'ai-studio' | 'colors' | 'student' | 'photo' | 'institution';

export default function MultiInstitutionStudioPage() {
  const [draft, setDraft] = useState<StudentIdDraft>(createBlankDraft);
  const [isClient, setIsClient] = useState(false);
  const [currentView, setCurrentView] = useState<StudioView>('studio');
  const [activeTab, setActiveTab] = useState<EditorTab>('template');

  // Multi-Institution State
  const [colleges, setColleges] = useState<CollegeRecord[]>([]);
  const [activeCollege, setActiveCollege] = useState<CollegeRecord | null>(null);
  const [isCollegeModalOpen, setIsCollegeModalOpen] = useState(false);
  const [vaultRefreshTrigger, setVaultRefreshTrigger] = useState(0);

  // Modals & Status
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [saveStatusText, setSaveStatusText] = useState<string | null>(null);
  const [isSavingToDb, setIsSavingToDb] = useState(false);

  const previewStageRef = useRef<CardPreviewStageRef>(null);

  // Load Colleges & Draft
  const loadCollegesRegistry = async () => {
    try {
      const list = await fetchInstitutions();
      setColleges(list);
      if (list.length > 0 && !activeCollege) {
        setActiveCollege(list[0]);
        syncCollegeToDraft(list[0]);
      }
    } catch (err) {
      console.error('Failed to load institutions from registry.db:', err);
    }
  };

  const syncCollegeToDraft = (college: CollegeRecord) => {
    setDraft((prev) => ({
      ...prev,
      institution: {
        ...prev.institution,
        name: college.name,
        subtitle: college.subtitle || '',
        logoDataUrl: college.logoDataUrl,
        phone: college.phone || '',
        emailOrWebsite: college.emailOrWebsite || '',
        address: college.address || '',
        primaryColor: college.primaryColor || '#1B365D',
        secondaryColor: college.secondaryColor || '#8C5A1E',
        cardStockTint: college.cardStockTint || '#FFFFFF',
        accentColor: college.primaryColor || '#1B365D',
        issuingAuthority: college.issuingAuthority || 'Registrar / Principal',
      },
      design: {
        ...prev.design,
        primaryColor: college.primaryColor || '#1B365D',
        secondaryColor: college.secondaryColor || '#8C5A1E',
        cardStockTint: college.cardStockTint || '#FFFFFF',
      },
    }));
  };

  useEffect(() => {
    setIsClient(true);
    const active = getActiveDraft();
    setDraft(active);
    loadCollegesRegistry();
  }, []);

  // Debounced auto-save to browser local storage
  useEffect(() => {
    if (!isClient) return;
    const timeout = setTimeout(() => {
      persistActiveDraft(draft);
    }, 400);
    return () => clearTimeout(timeout);
  }, [draft, isClient]);

  // Form update handlers
  const updateInstitution = (partial: Partial<InstitutionBranding>) => {
    setDraft((prev) => ({
      ...prev,
      institution: { ...prev.institution, ...partial },
    }));
  };

  const updateStudent = (partial: Partial<StudentDetails>) => {
    setDraft((prev) => ({
      ...prev,
      student: { ...prev.student, ...partial },
    }));
  };

  const updateDesign = (partial: Partial<CardDesignConfig>) => {
    setDraft((prev) => ({
      ...prev,
      design: { ...prev.design, ...partial },
    }));
  };

  const handleColorChange = (colors: {
    primaryColor: string;
    secondaryColor: string;
    cardStockTint: string;
  }) => {
    setDraft((prev) => ({
      ...prev,
      institution: {
        ...prev.institution,
        primaryColor: colors.primaryColor,
        secondaryColor: colors.secondaryColor,
        cardStockTint: colors.cardStockTint,
        accentColor: colors.primaryColor,
      },
      design: {
        ...prev.design,
        primaryColor: colors.primaryColor,
        secondaryColor: colors.secondaryColor,
        cardStockTint: colors.cardStockTint,
      },
    }));
  };

  // AI Design Studio Handlers
  const handleApplyAiSpec = (spec: AiDesignSpec) => {
    setDraft((prev) => ({
      ...prev,
      institution: {
        ...prev.institution,
        primaryColor: spec.palette.primaryColor,
        secondaryColor: spec.palette.secondaryColor,
        cardStockTint: spec.palette.cardStockTint,
        accentColor: spec.palette.primaryColor,
      },
      design: {
        ...prev.design,
        templateId: 'ai-dynamic',
        orientation: spec.orientation,
        primaryColor: spec.palette.primaryColor,
        secondaryColor: spec.palette.secondaryColor,
        cardStockTint: spec.palette.cardStockTint,
        aiDynamicSpec: spec,
      },
    }));
    setSaveStatusText(`AI Design Applied (${spec.theme})`);
    setTimeout(() => setSaveStatusText(null), 3000);
  };

  const handleClearAiDesign = () => {
    setDraft((prev) => ({
      ...prev,
      design: {
        ...prev.design,
        templateId: 'classic-academic',
        aiDynamicSpec: null,
        aiBackground: null,
      },
    }));
    setSaveStatusText('Reset to Standard Template');
    setTimeout(() => setSaveStatusText(null), 2500);
  };

  // Sample data loader (opt-in; does not write to DB until saved)
  const handleLoadSamplePreview = () => {
    setDraft({
      ...SAMPLE_DRAFT,
      id: draft.id || `draft-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    });
    setSaveStatusText('Sample student preview loaded');
    setTimeout(() => setSaveStatusText(null), 2500);
  };

  // Reset to blank
  const handleResetToBlank = () => {
    if (confirm('Reset card editor to blank template? Any unsaved edits will be cleared.')) {
      const blank = clearActiveDraft();
      if (activeCollege) {
        syncCollegeToDraft(activeCollege);
      } else {
        setDraft(blank);
      }
      setSaveStatusText('Reset to blank');
      setTimeout(() => setSaveStatusText(null), 2000);
    }
  };

  // Save current card to active College's SQLite database
  const handleSaveToCollegeDb = async () => {
    if (!activeCollege) {
      setIsCollegeModalOpen(true);
      return;
    }

    if (!draft.student.fullName.trim()) {
      alert('Please enter a student full name before saving to the database.');
      setActiveTab('student');
      return;
    }
    if (!draft.student.studentId.trim()) {
      alert('Please enter a student matriculation ID number before saving.');
      setActiveTab('student');
      return;
    }

    try {
      setIsSavingToDb(true);
      await saveStudentToCollege(activeCollege.slug, {
        id: draft.id,
        fullName: draft.student.fullName,
        studentId: draft.student.studentId,
        department: draft.student.department,
        course: draft.student.course,
        academicYear: draft.student.academicYear,
        validThru: draft.student.validThru,
        bloodGroup: draft.student.bloodGroup,
        emergencyContactName: draft.student.emergencyContactName,
        emergencyContactPhone: draft.student.emergencyContactPhone,
        photoDataUrl: draft.student.photoDataUrl,
        photoCrop: draft.student.photoCrop,
        design: {
          templateId: draft.design.templateId,
          orientation: draft.design.orientation,
          primaryColor: draft.design.primaryColor || draft.institution.primaryColor,
          secondaryColor: draft.design.secondaryColor || draft.institution.secondaryColor,
          cardStockTint: draft.design.cardStockTint || draft.institution.cardStockTint,
          showLanyardSlotPreview: draft.design.showLanyardSlotPreview,
        },
      });

      setSaveStatusText(`Saved to ${activeCollege.slug}.db`);
      setVaultRefreshTrigger((prev) => prev + 1);
      loadCollegesRegistry();
      setTimeout(() => setSaveStatusText(null), 3000);
    } catch (err: any) {
      console.error('Failed to save student card to college database:', err);
      alert(err.message || 'Failed to save student card to college database');
    } finally {
      setIsSavingToDb(false);
    }
  };

  // Switch to student from vault
  const handleEditFromVault = (stored: StoredStudentCard) => {
    setDraft({
      id: stored.id,
      createdAt: stored.createdAt,
      updatedAt: stored.updatedAt,
      institution: {
        ...draft.institution,
        primaryColor: stored.primaryColor || draft.institution.primaryColor,
        secondaryColor: stored.secondaryColor || draft.institution.secondaryColor,
        cardStockTint: stored.cardStockTint || draft.institution.cardStockTint,
        accentColor: stored.primaryColor || draft.institution.accentColor,
      },
      student: {
        fullName: stored.fullName,
        studentId: stored.studentId,
        department: stored.department,
        course: stored.course,
        academicYear: stored.academicYear,
        validThru: stored.validThru,
        bloodGroup: stored.bloodGroup,
        emergencyContactName: stored.emergencyContactName,
        emergencyContactPhone: stored.emergencyContactPhone,
        photoDataUrl: stored.photoDataUrl,
        photoCrop: {
          zoom: stored.photoCropZoom || 1.0,
          offsetX: stored.photoCropOffsetX || 0,
          offsetY: stored.photoCropOffsetY || 0,
        },
      },
      design: {
        templateId: stored.templateId,
        orientation: stored.orientation,
        primaryColor: stored.primaryColor,
        secondaryColor: stored.secondaryColor,
        cardStockTint: stored.cardStockTint,
        showLanyardSlotPreview: stored.showLanyardSlotPreview === 1,
        aiBackground: null,
      },
    });

    setCurrentView('studio');
    setSaveStatusText('Loaded from college database');
    setTimeout(() => setSaveStatusText(null), 2500);
  };

  const handlePreviewFromVault = (stored: StoredStudentCard) => {
    handleEditFromVault(stored);
  };

  const handleQuickExportFromVault = (stored: StoredStudentCard) => {
    handleEditFromVault(stored);
    setIsExportModalOpen(true);
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-studio-canvas flex items-center justify-center text-studio-ink-secondary font-mono text-sm">
        Initializing Multi-Institution Studio...
      </div>
    );
  }

  const selectedTemplate = TEMPLATE_DEFINITIONS.find((t) => t.id === draft.design.templateId);

  return (
    <div className="min-h-screen min-h-[100dvh] w-full max-w-full overflow-x-hidden flex flex-col bg-studio-canvas text-studio-ink-primary font-sans antialiased">
      {/* Top Application Header */}
      <header className="bg-studio-panel border-b border-studio-border sticky top-0 z-30 shadow-xs w-full max-w-full">
        <div className="max-w-[1600px] mx-auto px-3 sm:px-6 py-2 sm:py-0 sm:h-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          {/* Top Row on Mobile: Logo, Title & Active College Pill + Mobile View Switcher */}
          <div className="flex items-center justify-between gap-2 w-full sm:w-auto min-w-0">
            {/* Logo & College Selector */}
            <div className="flex items-center gap-2.5 min-w-0 flex-1 sm:flex-initial">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-studio-action text-white flex items-center justify-center shadow-xs shrink-0">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-[15px] sm:text-[16px] tracking-tight text-studio-ink-primary truncate">
                    Student ID Studio
                  </span>
                  <span className="hidden md:inline-block px-2 py-0.5 bg-studio-subtle border border-studio-border text-[9.5px] font-mono font-medium rounded uppercase text-studio-ink-secondary shrink-0">
                    AI & SQLite Engine
                  </span>
                </div>

                {/* Active College Database Selector Pill */}
                <div className="flex items-center gap-1.5 mt-0.5">
                  <button
                    type="button"
                    onClick={() => setIsCollegeModalOpen(true)}
                    className="px-2 py-0.5 bg-studio-canvas hover:bg-studio-subtle border border-studio-border rounded text-[10.5px] sm:text-[11px] font-medium text-studio-ink-primary flex items-center gap-1 transition-colors truncate max-w-[160px] xs:max-w-[200px] sm:max-w-xs"
                    title="Switch or manage college database"
                  >
                    <Landmark className="w-3 h-3 text-studio-action shrink-0" />
                    <span className="truncate">
                      {activeCollege ? activeCollege.name : 'Select College'}
                    </span>
                    {activeCollege && (
                      <span className="text-[9px] font-mono text-studio-ink-muted shrink-0">
                        ({activeCollege.studentCount ?? 0})
                      </span>
                    )}
                    <ChevronDown className="w-3 h-3 text-studio-ink-muted shrink-0" />
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile View Switcher (Studio vs Vault) */}
            <div className="flex lg:hidden items-center border border-studio-border rounded-md overflow-hidden shrink-0">
              <button
                type="button"
                onClick={() => setCurrentView('studio')}
                className={`px-2.5 py-1.5 text-[11px] font-medium min-h-[38px] flex items-center justify-center transition-colors ${
                  currentView === 'studio'
                    ? 'bg-studio-action text-white font-semibold'
                    : 'bg-studio-panel text-studio-ink-secondary hover:text-studio-ink-primary'
                }`}
                title="Card Studio"
              >
                Studio
              </button>
              <button
                type="button"
                onClick={() => setCurrentView('vault')}
                className={`px-2.5 py-1.5 text-[11px] font-medium min-h-[38px] flex items-center justify-center transition-colors ${
                  currentView === 'vault'
                    ? 'bg-studio-action text-white font-semibold'
                    : 'bg-studio-panel text-studio-ink-secondary hover:text-studio-ink-primary'
                }`}
                title="Student Vault"
              >
                Vault
              </button>
            </div>
          </div>

          {/* Center Navigation Mode Switcher: Studio vs Vault (Desktop) */}
          <div className="hidden lg:flex items-center p-1 bg-studio-subtle border border-studio-border rounded-lg">
            <button
              type="button"
              onClick={() => setCurrentView('studio')}
              className={`px-3 py-1.5 rounded-md text-[12px] font-medium flex items-center gap-1.5 transition-all ${
                currentView === 'studio'
                  ? 'bg-studio-panel text-studio-ink-primary shadow-xs font-semibold'
                  : 'text-studio-ink-secondary hover:text-studio-ink-primary'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-studio-action" />
              <span>Card Studio</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('vault')}
              className={`px-3 py-1.5 rounded-md text-[12px] font-medium flex items-center gap-1.5 transition-all ${
                currentView === 'vault'
                  ? 'bg-studio-panel text-studio-ink-primary shadow-xs font-semibold'
                  : 'text-studio-ink-secondary hover:text-studio-ink-primary'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-studio-action" />
              <span>Student ID Vault</span>
              {activeCollege && (
                <span className="px-1.5 py-0.2 bg-studio-canvas border rounded text-[9.5px] font-mono text-studio-ink-secondary">
                  {activeCollege.studentCount ?? 0}
                </span>
              )}
            </button>
          </div>

          {/* Header Action Toolbar — Responsive Flex Grid that fits 100% on mobile */}
          <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto overflow-x-auto sm:overflow-visible no-scrollbar pb-0.5 sm:pb-0">
            {/* Auto-save status indicator */}
            {saveStatusText && (
              <span className="hidden md:flex items-center gap-1 font-mono text-[11px] text-studio-success bg-studio-success-tint px-2 py-1 rounded border border-studio-success/20 shrink-0">
                <CheckCircle2 className="w-3 h-3" />
                {saveStatusText}
              </span>
            )}

            {/* Load Sample Student Preview Button */}
            <button
              type="button"
              onClick={handleLoadSamplePreview}
              className="flex-1 sm:flex-initial min-h-[44px] sm:min-h-0 px-2.5 py-1.5 bg-studio-subtle hover:bg-studio-border/70 border border-studio-border text-studio-ink-primary rounded-md text-[11.5px] sm:text-[12px] font-medium flex items-center justify-center gap-1.5 transition-colors shrink-0"
              title="Preload sample credentials to test all 6 templates immediately"
            >
              <Sparkles className="w-3.5 h-3.5 text-studio-action shrink-0" />
              <span className="whitespace-nowrap">Sample</span>
            </button>

            {/* Reset to Blank */}
            <button
              type="button"
              onClick={handleResetToBlank}
              className="min-h-[44px] sm:min-h-0 px-2.5 py-1.5 text-studio-ink-secondary hover:text-studio-ink-primary hover:bg-studio-subtle border border-studio-border rounded-md text-[11.5px] sm:text-[12px] flex items-center justify-center gap-1 transition-colors shrink-0"
              title="Clear all fields and reset to blank"
            >
              <RotateCcw className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            {/* Save to College Database Button */}
            <button
              type="button"
              onClick={handleSaveToCollegeDb}
              disabled={isSavingToDb}
              className="flex-1 sm:flex-initial min-h-[44px] sm:min-h-0 px-2.5 sm:px-3 py-1.5 bg-studio-panel hover:bg-studio-subtle border border-studio-action text-studio-action rounded-md text-[11.5px] sm:text-[12px] font-medium flex items-center justify-center gap-1.5 transition-colors shadow-xs disabled:opacity-50 shrink-0"
              title={activeCollege ? `Save permanently to ${activeCollege.slug}.db` : 'Select college to save'}
            >
              <Database className="w-3.5 h-3.5 text-studio-action shrink-0" />
              <span className="hidden sm:inline">
                {isSavingToDb ? 'Saving...' : 'Save to College DB'}
              </span>
              <span className="sm:hidden whitespace-nowrap">Save DB</span>
            </button>

            {/* Primary Export Button */}
            <button
              type="button"
              onClick={() => setIsExportModalOpen(true)}
              className="flex-1 sm:flex-initial min-h-[44px] sm:min-h-0 px-3 sm:px-4 py-1.5 bg-studio-action hover:bg-studio-action-hover text-white rounded-md text-[12px] sm:text-[12.5px] font-semibold flex items-center justify-center gap-1.5 sm:gap-2 shadow-xs transition-colors shrink-0"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="whitespace-nowrap">Export</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Surface */}
      {currentView === 'vault' ? (
        /* Vault View */
        <main className="flex-1 max-w-[1600px] w-full max-w-full mx-auto p-3 sm:p-6 pb-safe">
          <StudentVault
            activeCollege={activeCollege}
            onEditStudent={handleEditFromVault}
            onPreviewStudent={handlePreviewFromVault}
            onQuickExport={handleQuickExportFromVault}
            onCreateNew={() => {
              handleResetToBlank();
              setCurrentView('studio');
            }}
            refreshTrigger={vaultRefreshTrigger}
          />
        </main>
      ) : (
        /* Card Studio View Split Layout */
        <main className="flex-1 max-w-[1600px] w-full max-w-full mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-4rem)] min-h-[calc(100dvh-4rem)] pb-safe">
          {/* Left Side: Configuration & Form Controls (Cols 5) */}
          <section className="lg:col-span-5 border-r border-studio-border bg-studio-canvas flex flex-col justify-between overflow-y-auto w-full max-w-full">
            <div className="w-full max-w-full">
              {/* Editor Tab Navigation Bar: Horizontally scrollable on mobile, grid on desktop */}
              <div className="bg-studio-panel border-b border-studio-border px-2 pt-1.5 flex sm:grid sm:grid-cols-6 gap-1 overflow-x-auto no-scrollbar scroll-smooth">
                <button
                  type="button"
                  onClick={() => setActiveTab('template')}
                  className={`py-2 px-3 sm:px-1 min-h-[44px] sm:min-h-0 shrink-0 text-center border-b-2 font-medium text-[11.5px] sm:text-[11px] flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === 'template'
                      ? 'border-studio-action text-studio-action font-semibold'
                      : 'border-transparent text-studio-ink-secondary hover:text-studio-ink-primary'
                  }`}
                  title="Card Templates"
                >
                  <Layers className="w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0" />
                  <span className="whitespace-nowrap sm:truncate">Templates</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('ai-studio')}
                  className={`py-2 px-3 sm:px-1 min-h-[44px] sm:min-h-0 shrink-0 text-center border-b-2 font-medium text-[11.5px] sm:text-[11px] flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === 'ai-studio'
                      ? 'border-studio-action text-studio-action font-semibold'
                      : 'border-transparent text-studio-ink-secondary hover:text-studio-ink-primary'
                  }`}
                  title="AI Design Studio"
                >
                  <Sparkles className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-amber-600 shrink-0" />
                  <span className="whitespace-nowrap sm:truncate font-semibold">AI Studio</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('colors')}
                  className={`py-2 px-3 sm:px-1 min-h-[44px] sm:min-h-0 shrink-0 text-center border-b-2 font-medium text-[11.5px] sm:text-[11px] flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === 'colors'
                      ? 'border-studio-action text-studio-action font-semibold'
                      : 'border-transparent text-studio-ink-secondary hover:text-studio-ink-primary'
                  }`}
                  title="Color Customizer"
                >
                  <Palette className="w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0" />
                  <span className="whitespace-nowrap sm:truncate">Colors</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('student')}
                  className={`py-2 px-3 sm:px-1 min-h-[44px] sm:min-h-0 shrink-0 text-center border-b-2 font-medium text-[11.5px] sm:text-[11px] flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === 'student'
                      ? 'border-studio-action text-studio-action font-semibold'
                      : 'border-transparent text-studio-ink-secondary hover:text-studio-ink-primary'
                  }`}
                  title="Student Details"
                >
                  <User className="w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0" />
                  <span className="whitespace-nowrap sm:truncate">Student</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('photo')}
                  className={`py-2 px-3 sm:px-1 min-h-[44px] sm:min-h-0 shrink-0 text-center border-b-2 font-medium text-[11.5px] sm:text-[11px] flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === 'photo'
                      ? 'border-studio-action text-studio-action font-semibold'
                      : 'border-transparent text-studio-ink-secondary hover:text-studio-ink-primary'
                  }`}
                  title="Portrait Photo"
                >
                  <Camera className="w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0" />
                  <span className="whitespace-nowrap sm:truncate">Photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('institution')}
                  className={`py-2 px-3 sm:px-1 min-h-[44px] sm:min-h-0 shrink-0 text-center border-b-2 font-medium text-[11.5px] sm:text-[11px] flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === 'institution'
                      ? 'border-studio-action text-studio-action font-semibold'
                      : 'border-transparent text-studio-ink-secondary hover:text-studio-ink-primary'
                  }`}
                  title="College Details"
                >
                  <Landmark className="w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0" />
                  <span className="whitespace-nowrap sm:truncate">College</span>
                </button>
              </div>

              {/* Active Tab Panel Body */}
              <div className="p-3.5 sm:p-5 w-full max-w-full">
                {activeTab === 'template' && (
                  <TemplateSelector design={draft.design} onChange={updateDesign} />
                )}

                {activeTab === 'ai-studio' && (
                  <AiDesignStudio
                    design={draft.design}
                    student={draft.student}
                    institution={draft.institution}
                    onApplyAiSpec={handleApplyAiSpec}
                    onClearAiDesign={handleClearAiDesign}
                    onUpdateDesign={updateDesign}
                    onTriggerExport={() => setIsExportModalOpen(true)}
                  />
                )}

                {activeTab === 'colors' && (
                  <ColorCustomizer
                    institution={draft.institution}
                    design={draft.design}
                    onColorChange={handleColorChange}
                  />
                )}

                {activeTab === 'student' && (
                  <StudentDetailsForm student={draft.student} onChange={updateStudent} />
                )}

                {activeTab === 'photo' && (
                  <PhotoUploader
                    photoDataUrl={draft.student.photoDataUrl}
                    crop={draft.student.photoCrop}
                    onPhotoChange={(url) => updateStudent({ photoDataUrl: url })}
                    onCropChange={(crop) => updateStudent({ photoCrop: crop })}
                  />
                )}

                {activeTab === 'institution' && (
                  <InstitutionForm institution={draft.institution} onChange={updateInstitution} />
                )}
              </div>
            </div>

            {/* Form Footer Spec Callout */}
            <div className="p-3.5 sm:p-4 border-t border-studio-border bg-studio-panel/60 text-[11px] font-mono text-studio-ink-secondary flex flex-wrap items-center justify-between gap-2">
              <span className="truncate max-w-[200px] xs:max-w-[260px] sm:max-w-none">
                Style: <strong className="text-studio-ink-primary">{draft.design.aiBackground?.theme || selectedTemplate?.title}</strong>
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                {draft.design.aiBackground && (
                  <span className="px-1.5 py-0.2 bg-amber-100 text-amber-900 border border-amber-300 rounded text-[9px] font-semibold">
                    AI Artwork
                  </span>
                )}
                <span className="capitalize font-semibold text-studio-action">
                  {draft.design.orientation} CR80
                </span>
              </div>
            </div>
          </section>

          {/* Right Side: Interactive Drafting Mat Stage (Cols 7) */}
          <section className="lg:col-span-7 bg-studio-canvas flex flex-col justify-between overflow-hidden w-full max-w-full">
            <CardPreviewStage
              ref={previewStageRef}
              institution={draft.institution}
              student={draft.student}
              design={draft.design}
            />
          </section>
        </main>
      )}

      {/* College Registry Modal */}
      <CollegeModal
        isOpen={isCollegeModalOpen}
        onClose={() => setIsCollegeModalOpen(false)}
        colleges={colleges}
        activeCollege={activeCollege}
        onSelectCollege={(college) => {
          setActiveCollege(college);
          syncCollegeToDraft(college);
        }}
        onRefreshColleges={loadCollegesRegistry}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        getFrontNode={() => previewStageRef.current?.getFrontExportNode() || null}
        getBackNode={() => previewStageRef.current?.getBackExportNode() || null}
        orientation={draft.design.orientation}
        studentName={draft.student.fullName}
        studentId={draft.student.studentId}
        institutionName={draft.institution.name}
        course={draft.student.course}
      />
    </div>
  );
}
