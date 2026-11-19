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
    <div className="min-h-screen flex flex-col bg-studio-canvas text-studio-ink-primary font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Application Header */}
      <header className="bg-studio-panel/95 backdrop-blur-md border-b border-studio-border sticky top-0 z-30 shadow-xs">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & College Selector */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-studio-action text-white flex items-center justify-center shadow-xs shrink-0">
              <CreditCard className="w-5 h-5 text-white" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-[18px] tracking-tight text-studio-ink-primary truncate">
                  Student ID Studio
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 bg-studio-subtle border border-studio-border text-[12px] font-mono font-medium rounded text-studio-ink-secondary shrink-0 leading-normal">
                  Credential Lab
                </span>
              </div>

              {/* Active College Database Selector Pill */}
              <div className="flex items-center gap-1.5 mt-0.5">
                <button
                  type="button"
                  onClick={() => setIsCollegeModalOpen(true)}
                  className="px-2.5 py-0.5 bg-studio-panel hover:bg-studio-subtle border border-studio-border rounded-md text-[12px] font-medium text-studio-ink-primary flex items-center gap-1.5 transition-colors truncate max-w-[280px] sm:max-w-xs focus-ring"
                  title="Switch or manage college database"
                >
                  <Landmark className="w-3.5 h-3.5 text-studio-action shrink-0" />
                  <span className="truncate">
                    {activeCollege ? activeCollege.name : 'Select Institution Database'}
                  </span>
                  {activeCollege && (
                    <span className="text-[12px] font-mono text-studio-ink-secondary tabular-nums leading-normal">
                      ({activeCollege.studentCount ?? 0})
                    </span>
                  )}
                  <ChevronDown className="w-3.5 h-3.5 text-studio-ink-muted shrink-0" />
                </button>
              </div>
            </div>
          </div>

          {/* Center Navigation Mode Switcher: Studio vs Vault */}
          <div className="hidden lg:flex items-center p-1 bg-studio-subtle border border-studio-border rounded-lg">
            <button
              type="button"
              onClick={() => setCurrentView('studio')}
              className={`px-3.5 py-1.5 rounded-md text-[13px] font-medium flex items-center gap-2 transition-all ${
                currentView === 'studio'
                  ? 'bg-studio-panel text-studio-ink-primary shadow-xs font-semibold'
                  : 'text-studio-ink-secondary hover:text-studio-ink-primary'
              }`}
            >
              <LayoutGrid className="w-4 h-4 text-studio-action" />
              <span>Card Studio</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('vault')}
              className={`px-3.5 py-1.5 rounded-md text-[13px] font-medium flex items-center gap-2 transition-all ${
                currentView === 'vault'
                  ? 'bg-studio-panel text-studio-ink-primary shadow-xs font-semibold'
                  : 'text-studio-ink-secondary hover:text-studio-ink-primary'
              }`}
            >
              <Search className="w-4 h-4 text-studio-action" />
              <span>Student ID Vault</span>
              {activeCollege && (
                <span className="px-2 py-0.5 bg-studio-panel border border-studio-border rounded text-[12px] font-mono font-medium text-studio-ink-secondary tabular-nums leading-normal">
                  {activeCollege.studentCount ?? 0}
                </span>
              )}
            </button>
          </div>

          {/* Header Action Toolbar */}
          <div className="flex items-center gap-2">
            {/* Auto-save status indicator */}
            {saveStatusText && (
              <span className="hidden md:flex items-center gap-1.5 font-mono text-[12px] text-studio-success bg-studio-success-tint px-2.5 py-1 rounded-md border border-studio-success/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {saveStatusText}
              </span>
            )}

            {/* Mobile View Switcher */}
            <div className="flex lg:hidden items-center border border-studio-border rounded-md overflow-hidden p-0.5 bg-studio-subtle">
              <button
                type="button"
                onClick={() => setCurrentView('studio')}
                className={`px-2.5 py-1 text-[12px] font-medium rounded ${
                  currentView === 'studio'
                    ? 'bg-studio-action text-white font-semibold'
                    : 'text-studio-ink-secondary'
                }`}
              >
                Studio
              </button>
              <button
                type="button"
                onClick={() => setCurrentView('vault')}
                className={`px-2.5 py-1 text-[12px] font-medium rounded ${
                  currentView === 'vault'
                    ? 'bg-studio-action text-white font-semibold'
                    : 'text-studio-ink-secondary'
                }`}
              >
                Vault
              </button>
            </div>

            {/* Load Sample Student Preview Button */}
            <button
              type="button"
              onClick={handleLoadSamplePreview}
              className="px-3 py-1.5 bg-studio-panel hover:bg-studio-subtle border border-studio-border text-studio-ink-primary rounded-md text-[12.5px] font-medium flex items-center gap-1.5 transition-colors shadow-xs focus-ring"
              title="Preload sample credentials to test all templates immediately"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">Sample Preview</span>
            </button>

            {/* Reset to Blank */}
            <button
              type="button"
              onClick={handleResetToBlank}
              className="p-1.5 sm:px-3 sm:py-1.5 text-studio-ink-secondary hover:text-studio-ink-primary hover:bg-studio-subtle border border-studio-border rounded-md text-[12.5px] font-medium flex items-center gap-1.5 transition-colors focus-ring"
              title="Clear all fields and reset to blank"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            {/* Save to College Database Button */}
            <button
              type="button"
              onClick={handleSaveToCollegeDb}
              disabled={isSavingToDb}
              className="px-3 py-1.5 bg-studio-panel hover:bg-studio-subtle border border-studio-border text-studio-action rounded-md text-[12.5px] font-medium flex items-center gap-1.5 transition-colors shadow-xs disabled:opacity-50 focus-ring"
              title={activeCollege ? `Save permanently to ${activeCollege.slug}.db` : 'Select college to save'}
            >
              <Database className="w-4 h-4 text-studio-action" />
              <span className="hidden sm:inline">
                {isSavingToDb ? 'Saving...' : 'Save to College DB'}
              </span>
              <span className="sm:hidden">Save</span>
            </button>

            {/* Primary Export Button */}
            <button
              type="button"
              onClick={() => setIsExportModalOpen(true)}
              className="px-4 py-1.5 bg-studio-action hover:bg-studio-action-hover text-white rounded-md text-[13px] font-semibold flex items-center gap-2 shadow-sm transition-all focus-ring active:scale-[0.98] ml-1"
            >
              <Download className="w-4 h-4" />
              <span>Export Card</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Surface */}
      {currentView === 'vault' ? (
        /* Vault View */
        <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6">
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
        <main className="flex-1 max-w-[1600px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-4rem)]">
          {/* Left Side: Configuration & Form Controls (Cols 5) */}
          <section className="lg:col-span-5 border-r border-studio-border bg-studio-panel flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Editor Tab Navigation Bar */}
              <div className="bg-studio-panel border-b border-studio-border px-3 pt-2 grid grid-cols-6 gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('template')}
                  className={`py-2.5 px-1 text-center border-b-2 font-medium text-[12px] flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === 'template'
                      ? 'border-studio-action text-studio-action font-semibold'
                      : 'border-transparent text-studio-ink-secondary hover:text-studio-ink-primary'
                  }`}
                  title="Card Templates"
                >
                  <Layers className="w-4 h-4 shrink-0" />
                  <span className="truncate">Templates</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('ai-studio')}
                  className={`py-2.5 px-1 text-center border-b-2 font-medium text-[12px] flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === 'ai-studio'
                      ? 'border-studio-action text-studio-action font-semibold'
                      : 'border-transparent text-studio-ink-secondary hover:text-studio-ink-primary'
                  }`}
                  title="AI Design Studio"
                >
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="truncate font-semibold">AI Studio</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('colors')}
                  className={`py-2.5 px-1 text-center border-b-2 font-medium text-[12px] flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === 'colors'
                      ? 'border-studio-action text-studio-action font-semibold'
                      : 'border-transparent text-studio-ink-secondary hover:text-studio-ink-primary'
                  }`}
                  title="Color Customizer"
                >
                  <Palette className="w-4 h-4 shrink-0" />
                  <span className="truncate">Colors</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('student')}
                  className={`py-2.5 px-1 text-center border-b-2 font-medium text-[12px] flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === 'student'
                      ? 'border-studio-action text-studio-action font-semibold'
                      : 'border-transparent text-studio-ink-secondary hover:text-studio-ink-primary'
                  }`}
                  title="Student Details"
                >
                  <User className="w-4 h-4 shrink-0" />
                  <span className="truncate">Student</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('photo')}
                  className={`py-2.5 px-1 text-center border-b-2 font-medium text-[12px] flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === 'photo'
                      ? 'border-studio-action text-studio-action font-semibold'
                      : 'border-transparent text-studio-ink-secondary hover:text-studio-ink-primary'
                  }`}
                  title="Portrait Photo"
                >
                  <Camera className="w-4 h-4 shrink-0" />
                  <span className="truncate">Photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('institution')}
                  className={`py-2.5 px-1 text-center border-b-2 font-medium text-[12px] flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === 'institution'
                      ? 'border-studio-action text-studio-action font-semibold'
                      : 'border-transparent text-studio-ink-secondary hover:text-studio-ink-primary'
                  }`}
                  title="College Details"
                >
                  <Landmark className="w-4 h-4 shrink-0" />
                  <span className="truncate">College</span>
                </button>
              </div>

              {/* Active Tab Panel Body */}
              <div className="p-5 sm:p-6">
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
            <div className="p-4 border-t border-studio-border bg-studio-canvas text-[12px] font-mono text-studio-ink-secondary flex items-center justify-between">
              <span className="truncate">
                Style: <strong className="text-studio-ink-primary font-semibold">{draft.design.aiBackground?.theme || selectedTemplate?.title}</strong>
              </span>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                {draft.design.aiBackground && (
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-300 rounded text-[12px] font-semibold leading-normal">
                    AI Artwork
                  </span>
                )}
                <span className="capitalize font-semibold text-studio-action text-[12px] tabular-nums leading-normal">
                  {draft.design.orientation} CR80
                </span>
              </div>
            </div>
          </section>

          {/* Right Side: Interactive Drafting Mat Stage (Cols 7) */}
          <section className="lg:col-span-7 bg-studio-canvas flex flex-col justify-between overflow-hidden">
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
