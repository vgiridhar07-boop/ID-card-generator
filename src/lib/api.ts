import { CollegeRecord, StoredStudentCard } from '@/types/id-card';

export async function fetchInstitutions(): Promise<CollegeRecord[]> {
  const res = await fetch('/api/institutions', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load colleges');
  const data = await res.json();
  return data.institutions || [];
}

export async function createInstitution(payload: {
  name: string;
  subtitle?: string;
  logoDataUrl?: string | null;
  phone?: string;
  emailOrWebsite?: string;
  address?: string;
  primaryColor?: string;
  secondaryColor?: string;
  cardStockTint?: string;
  issuingAuthority?: string;
}): Promise<CollegeRecord> {
  const res = await fetch('/api/institutions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create college database');
  }
  const data = await res.json();
  return data.institution;
}

export async function updateInstitution(
  slug: string,
  payload: Partial<CollegeRecord>
): Promise<CollegeRecord> {
  const res = await fetch(`/api/institutions/${slug}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update college');
  const data = await res.json();
  return data.institution;
}

export async function deleteInstitution(slug: string): Promise<void> {
  const res = await fetch(`/api/institutions/${slug}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete college');
}

export async function fetchStudents(
  slug: string,
  params: { q?: string; department?: string; course?: string; academicYear?: string } = {}
): Promise<{
  students: StoredStudentCard[];
  total: number;
  filters: { departments: string[]; courses: string[]; academicYears: string[] };
}> {
  const query = new URLSearchParams();
  if (params.q) query.set('q', params.q);
  if (params.department && params.department !== 'all') query.set('department', params.department);
  if (params.course && params.course !== 'all') query.set('course', params.course);
  if (params.academicYear && params.academicYear !== 'all') query.set('academicYear', params.academicYear);

  const res = await fetch(`/api/institutions/${slug}/students?${query.toString()}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to query students');
  return await res.json();
}

export async function saveStudentToCollege(
  slug: string,
  payload: any
): Promise<StoredStudentCard> {
  const res = await fetch(`/api/institutions/${slug}/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to save student card');
  }
  const data = await res.json();
  return data.student;
}

export async function deleteStudentFromCollege(slug: string, id: string): Promise<void> {
  const res = await fetch(`/api/institutions/${slug}/students/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete student card');
}
