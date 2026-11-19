import React from 'react';
import { StudentIdDraft } from '@/types/id-card';
import { TEMPLATE_DEFINITIONS } from '@/lib/constants';
import { X, FolderOpen, Trash2, Copy, Plus, Clock, FileCheck } from 'lucide-react';

interface DraftsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedDrafts: StudentIdDraft[];
  onLoadDraft: (draft: StudentIdDraft) => void;
  onSaveCurrentAsNew: () => void;
  onDeleteDraft: (id: string) => void;
  onDuplicateDraft: (draft: StudentIdDraft) => void;
  activeDraftId: string;
}

export function DraftsDrawer({
  isOpen,
  onClose,
  savedDrafts,
  onLoadDraft,
  onSaveCurrentAsNew,
  onDeleteDraft,
  onDuplicateDraft,
  activeDraftId,
}: DraftsDrawerProps) {
  if (!isOpen) return null;

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/35 backdrop-blur-xs select-none">
      <div className="w-full max-w-md bg-studio-panel h-full border-l border-studio-border shadow-float flex flex-col justify-between">
        {/* Drawer Header */}
        <div className="p-4 border-b border-studio-border bg-studio-canvas flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-studio-action" />
            <h2 className="font-sans font-bold text-[14.5px] text-studio-ink-primary">
              Saved Card Archives
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-studio-ink-muted hover:text-studio-ink-primary hover:bg-studio-subtle"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Subheader / Action */}
        <div className="p-3 border-b border-studio-border bg-studio-subtle/50 flex items-center justify-between">
          <span className="text-[11px] font-mono text-studio-ink-secondary">
            {savedDrafts.length} {savedDrafts.length === 1 ? 'Archive Stored' : 'Archives Stored'}
          </span>
          <button
            type="button"
            onClick={onSaveCurrentAsNew}
            className="px-2.5 py-1 bg-studio-action hover:bg-studio-action-hover text-white rounded text-[11px] font-medium flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3 h-3" />
            Save Current as New
          </button>
        </div>

        {/* Drafts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedDrafts.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-studio-border rounded-lg">
              <FolderOpen className="w-8 h-8 text-studio-ink-muted mb-2 stroke-[1.5]" />
              <span className="font-semibold text-[13px] text-studio-ink-primary">
                No Saved Archives Yet
              </span>
              <p className="text-[11px] text-studio-ink-secondary mt-1 max-w-xs">
                Save your completed student card designs to local archives for instant retrieval and re-printing.
              </p>
            </div>
          ) : (
            savedDrafts.map((draft) => {
              const isActive = draft.id === activeDraftId;
              const tmpl = TEMPLATE_DEFINITIONS.find((t) => t.id === draft.design.templateId);

              return (
                <div
                  key={draft.id}
                  className={`p-3.5 rounded-lg border transition-all ${
                    isActive
                      ? 'bg-studio-subtle/70 border-studio-action ring-1 ring-studio-action/20'
                      : 'bg-white border-studio-border hover:border-studio-ink-muted'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-sans font-bold text-[13px] text-studio-ink-primary">
                          {draft.student.fullName || 'Untitled Student'}
                        </span>
                        {isActive && (
                          <span className="px-1.5 py-0.5 bg-studio-action text-white rounded text-[11px] font-mono leading-none">
                            Active
                          </span>
                        )}
                      </div>
                      <span className="text-[12px] font-mono text-studio-ink-secondary block mt-0.5">
                        {draft.student.studentId || 'ID Pending'} • {draft.institution.name || 'General'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-studio-border/50 text-[11px] font-mono text-studio-ink-secondary leading-normal">
                    <span className="capitalize">{tmpl?.title || draft.design.templateId}</span>
                    <span>•</span>
                    <span className="capitalize">{draft.design.orientation}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-3 h-3" />
                      {formatDate(draft.updatedAt)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-studio-border/40">
                    <button
                      type="button"
                      onClick={() => {
                        onLoadDraft(draft);
                        onClose();
                      }}
                      className="px-2.5 py-1 bg-studio-canvas hover:bg-studio-subtle border border-studio-border rounded text-[11px] font-medium text-studio-ink-primary flex items-center gap-1 transition-colors"
                    >
                      <FileCheck className="w-3 h-3 text-studio-action" />
                      Load Card
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onDuplicateDraft(draft)}
                        className="p-1 text-studio-ink-secondary hover:text-studio-ink-primary hover:bg-studio-subtle rounded transition-colors"
                        title="Duplicate draft"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm('Permanently delete this saved archive?')) {
                            onDeleteDraft(draft.id);
                          }
                        }}
                        className="p-1 text-studio-destructive hover:bg-studio-destructive-tint rounded transition-colors"
                        title="Delete draft"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-studio-border bg-studio-canvas text-center">
          <span className="text-[10.5px] font-mono text-studio-ink-muted">
            Stored securely in browser offline localStorage
          </span>
        </div>
      </div>
    </div>
  );
}
