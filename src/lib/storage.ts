import { StudentIdDraft } from '@/types/id-card';
import { createBlankDraft } from './constants';

const CURRENT_DRAFT_KEY = 'sc_student_id_active_draft_v1';
const SAVED_DRAFTS_KEY = 'sc_student_id_saved_drafts_v1';

export function getActiveDraft(): StudentIdDraft {
  if (typeof window === 'undefined') {
    return createBlankDraft();
  }
  try {
    const raw = window.localStorage.getItem(CURRENT_DRAFT_KEY);
    if (!raw) return createBlankDraft();
    const parsed = JSON.parse(raw) as StudentIdDraft;
    // ensure required nested objects exist
    if (!parsed || !parsed.student || !parsed.institution || !parsed.design) {
      return createBlankDraft();
    }
    return parsed;
  } catch (err) {
    console.error('Failed to load active draft from localStorage:', err);
    return createBlankDraft();
  }
}

export function persistActiveDraft(draft: StudentIdDraft): void {
  if (typeof window === 'undefined') return;
  try {
    const updated = {
      ...draft,
      updatedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(CURRENT_DRAFT_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to persist active draft to localStorage:', err);
  }
}

export function getSavedDrafts(): StudentIdDraft[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(SAVED_DRAFTS_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (err) {
    console.error('Failed to read saved drafts:', err);
    return [];
  }
}

export function saveDraftToArchive(draft: StudentIdDraft): StudentIdDraft[] {
  if (typeof window === 'undefined') return [];
  try {
    const drafts = getSavedDrafts();
    const existingIndex = drafts.findIndex((d) => d.id === draft.id);
    const updatedDraft = {
      ...draft,
      updatedAt: new Date().toISOString(),
    };

    let nextDrafts: StudentIdDraft[];
    if (existingIndex >= 0) {
      nextDrafts = [...drafts];
      nextDrafts[existingIndex] = updatedDraft;
    } else {
      nextDrafts = [updatedDraft, ...drafts];
    }

    window.localStorage.setItem(SAVED_DRAFTS_KEY, JSON.stringify(nextDrafts));
    return nextDrafts;
  } catch (err) {
    console.error('Failed to save draft to archive:', err);
    return getSavedDrafts();
  }
}

export function deleteDraftFromArchive(id: string): StudentIdDraft[] {
  if (typeof window === 'undefined') return [];
  try {
    const drafts = getSavedDrafts();
    const nextDrafts = drafts.filter((d) => d.id !== id);
    window.localStorage.setItem(SAVED_DRAFTS_KEY, JSON.stringify(nextDrafts));
    return nextDrafts;
  } catch (err) {
    console.error('Failed to delete draft from archive:', err);
    return getSavedDrafts();
  }
}

export function clearActiveDraft(): StudentIdDraft {
  const blank = createBlankDraft();
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(CURRENT_DRAFT_KEY);
  }
  return blank;
}
