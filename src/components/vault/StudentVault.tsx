import React, { useState, useEffect } from 'react';
import { CollegeRecord, StoredStudentCard, StudentIdDraft } from '@/types/id-card';
import { fetchStudents, deleteStudentFromCollege } from '@/lib/api';
import { TEMPLATE_DEFINITIONS } from '@/lib/constants';
import {
  Search,
  Filter,
  RotateCcw,
  Eye,
  Edit3,
  Download,
  Trash2,
  GraduationCap,
  Calendar,
  Layers,
  Database,
  UserPlus,
  Loader2,
  FolderOpen,
} from 'lucide-react';

interface StudentVaultProps {
  activeCollege: CollegeRecord | null;
  onEditStudent: (student: StoredStudentCard) => void;
  onPreviewStudent: (student: StoredStudentCard) => void;
  onQuickExport: (student: StoredStudentCard) => void;
  onCreateNew: () => void;
  refreshTrigger: number;
}

export function StudentVault({
  activeCollege,
  onEditStudent,
  onPreviewStudent,
  onQuickExport,
  onCreateNew,
  refreshTrigger,
}: StudentVaultProps) {
  const [students, setStudents] = useState<StoredStudentCard[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');

  // Filter options returned from college database
  const [availableDepts, setAvailableDepts] = useState<string[]>([]);
  const [availableCourses, setAvailableCourses] = useState<string[]>([]);
  const [availableYears, setAvailableYears] = useState<string[]>([]);

  const loadCollegeStudents = async (query = searchQuery) => {
    if (!activeCollege) return;
    try {
      setIsLoading(true);
      const res = await fetchStudents(activeCollege.slug, {
        q: query,
        department: selectedDept,
        course: selectedCourse,
        academicYear: selectedYear,
      });
      setStudents(res.students);
      setTotalCount(res.total);
      setAvailableDepts(res.filters.departments || []);
      setAvailableCourses(res.filters.courses || []);
      setAvailableYears(res.filters.academicYears || []);
    } catch (err) {
      console.error('Failed to load students from college db:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeCollege) {
      loadCollegeStudents();
    } else {
      setStudents([]);
      setTotalCount(0);
    }
  }, [activeCollege?.slug, selectedDept, selectedCourse, selectedYear, refreshTrigger]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadCollegeStudents(searchQuery);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDept('all');
    setSelectedCourse('all');
    setSelectedYear('all');
    if (activeCollege) {
      setIsLoading(true);
      fetchStudents(activeCollege.slug, { q: '', department: 'all', course: 'all', academicYear: 'all' })
        .then((res) => {
          setStudents(res.students);
          setTotalCount(res.total);
        })
        .finally(() => setIsLoading(false));
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!activeCollege) return;
    if (confirm(`Permanently delete ID card for "${name}" from ${activeCollege.name}'s database?`)) {
      try {
        await deleteStudentFromCollege(activeCollege.slug, id);
        loadCollegeStudents();
      } catch (err) {
        console.error('Failed to delete student:', err);
        alert('Could not delete student record.');
      }
    }
  };

  if (!activeCollege) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-studio-border rounded-lg bg-studio-panel">
        <Database className="w-10 h-10 text-studio-ink-muted mb-3" />
        <h3 className="font-serif font-bold text-[16px] text-studio-ink-primary">
          No College Selected
        </h3>
        <p className="text-[12px] text-studio-ink-secondary mt-1 max-w-sm">
          Select or add an institution from the college menu in the top bar to inspect its isolated student card database.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* College Database Status Header */}
      <div className="p-4 bg-studio-panel border border-studio-border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-studio-success" />
            <h2 className="font-serif font-bold text-[16px] text-studio-ink-primary">
              {activeCollege.name} — Student ID Vault
            </h2>
          </div>
          <p className="text-[11px] font-mono text-studio-ink-secondary mt-0.5">
            Database file: <span className="text-studio-action font-semibold">data/colleges/{activeCollege.slug}.db</span> • {totalCount} Records Indexed
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateNew}
          className="px-3.5 py-1.5 bg-studio-action hover:bg-studio-action-hover text-white rounded-md text-[12px] font-medium flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
        >
          <UserPlus className="w-3.5 h-3.5" />
          Create New ID Card
        </button>
      </div>

      {/* Dedicated Search & Explicit Filter Bar */}
      <div className="p-4 bg-studio-panel border border-studio-border rounded-lg space-y-3 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student full name or matriculation ID number..."
              className="w-full px-3 py-2 pl-9 bg-studio-canvas border border-studio-border rounded-md text-[13px] text-studio-ink-primary placeholder:text-studio-ink-muted focus:outline-none focus:border-studio-action"
            />
            <Search className="w-4 h-4 text-studio-ink-muted absolute left-3 top-2.5 pointer-events-none" />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-studio-action hover:bg-studio-action-hover text-white rounded-md text-[12.5px] font-medium flex items-center justify-center gap-1.5 transition-colors shadow-xs shrink-0"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>

          {(searchQuery || selectedDept !== 'all' || selectedCourse !== 'all' || selectedYear !== 'all') && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-3 py-2 bg-studio-canvas hover:bg-studio-subtle border border-studio-border text-studio-ink-secondary hover:text-studio-ink-primary rounded-md text-[12px] flex items-center justify-center gap-1 transition-colors shrink-0"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </form>

        {/* Department, Course, Year Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-studio-border/60">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-studio-ink-muted mb-1">
              Filter Department
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-studio-canvas border border-studio-border rounded text-[12px] text-studio-ink-primary focus:outline-none focus:border-studio-action"
            >
              <option value="all">All Departments ({availableDepts.length})</option>
              {availableDepts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-studio-ink-muted mb-1">
              Filter Degree / Course
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-studio-canvas border border-studio-border rounded text-[12px] text-studio-ink-primary focus:outline-none focus:border-studio-action"
            >
              <option value="all">All Courses ({availableCourses.length})</option>
              {availableCourses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-studio-ink-muted mb-1">
              Filter Academic Cohort
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-studio-canvas border border-studio-border rounded text-[12px] text-studio-ink-primary focus:outline-none focus:border-studio-action"
            >
              <option value="all">All Academic Years ({availableYears.length})</option>
              {availableYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results List / Grid */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="p-12 text-center bg-studio-panel border border-studio-border rounded-lg flex items-center justify-center gap-2 text-studio-action">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="font-mono text-[12px]">Querying {activeCollege.slug}.db...</span>
          </div>
        ) : students.length === 0 ? (
          <div className="p-12 text-center bg-studio-panel border border-studio-border rounded-lg">
            <FolderOpen className="w-10 h-10 text-studio-ink-muted mx-auto mb-2" />
            <h3 className="font-sans font-bold text-[14px] text-studio-ink-primary">
              No Student ID Records Found
            </h3>
            <p className="text-[12px] text-studio-ink-secondary mt-1 max-w-sm mx-auto">
              {searchQuery || selectedDept !== 'all' || selectedCourse !== 'all' || selectedYear !== 'all'
                ? 'No student records match the active search criteria or filters.'
                : `This college database (data/colleges/${activeCollege.slug}.db) does not contain any student ID records yet.`}
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={onCreateNew}
                className="px-3.5 py-1.5 bg-studio-action hover:bg-studio-action-hover text-white rounded text-[12px] font-medium transition-colors"
              >
                Create First Student Card
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {students.map((student) => {
              const tmpl = TEMPLATE_DEFINITIONS.find((t) => t.id === student.templateId);
              return (
                <div
                  key={student.id}
                  className="p-3.5 bg-studio-panel border border-studio-border hover:border-studio-action/50 rounded-lg shadow-xs transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3">
                    {/* Student Photo Thumbnail */}
                    <div className="w-14 h-18 rounded border border-studio-border bg-studio-canvas overflow-hidden shrink-0 flex items-center justify-center">
                      {student.photoDataUrl ? (
                        <img
                          src={student.photoDataUrl}
                          alt={student.fullName}
                          className="w-full h-full object-cover"
                          style={{
                            transform: `scale(${student.photoCropZoom}) translate(${student.photoCropOffsetX}%, ${student.photoCropOffsetY}%)`,
                          }}
                        />
                      ) : (
                        <span className="text-[8px] font-mono text-studio-ink-muted uppercase">No Photo</span>
                      )}
                    </div>

                    {/* Student Metadata Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-sans font-bold text-[13.5px] text-studio-ink-primary truncate">
                          {student.fullName}
                        </h4>
                        <span className="text-[9.5px] font-mono px-1.5 py-0.2 rounded border bg-studio-canvas uppercase text-studio-ink-secondary shrink-0 ml-1">
                          {tmpl?.badge || student.templateId}
                        </span>
                      </div>

                      <div className="font-mono text-[11px] font-semibold text-studio-action mt-0.5">
                        {student.studentId}
                      </div>

                      <div className="text-[11px] text-studio-ink-secondary mt-1 space-y-0.5">
                        <div className="truncate flex items-center gap-1">
                          <GraduationCap className="w-3 h-3 text-studio-ink-muted shrink-0" />
                          <span className="truncate">{student.course || 'Unspecified Course'}</span>
                        </div>
                        <div className="truncate text-studio-ink-muted text-[10.5px]">
                          {student.department}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-2 pt-1.5 border-t border-studio-border/60 text-[10px] font-mono text-studio-ink-muted">
                        <span className="flex items-center gap-0.5">
                          <Calendar className="w-2.5 h-2.5" /> {student.academicYear}
                        </span>
                        <span>•</span>
                        <span className="capitalize">{student.orientation}</span>
                        {student.bloodGroup && (
                          <>
                            <span>•</span>
                            <span>Blood: {student.bloodGroup}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Vault Actions: Preview, Edit, Re-Download, Delete */}
                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-studio-border/60">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onPreviewStudent(student)}
                        className="px-2 py-1 bg-studio-canvas hover:bg-studio-subtle border border-studio-border rounded text-[11px] font-medium text-studio-ink-primary flex items-center gap-1 transition-colors"
                        title="View Live Card Preview"
                      >
                        <Eye className="w-3 h-3 text-studio-action" />
                        <span>Preview</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onEditStudent(student)}
                        className="px-2 py-1 bg-studio-canvas hover:bg-studio-subtle border border-studio-border rounded text-[11px] font-medium text-studio-ink-primary flex items-center gap-1 transition-colors"
                        title="Load into Editor"
                      >
                        <Edit3 className="w-3 h-3 text-studio-ink-secondary" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onQuickExport(student)}
                        className="px-2 py-1 bg-studio-action hover:bg-studio-action-hover text-white rounded text-[11px] font-medium flex items-center gap-1 transition-colors shadow-xs"
                        title="Export Card to PDF/PNG"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(student.id, student.fullName)}
                      className="p-1 text-studio-destructive hover:bg-studio-destructive-tint rounded transition-colors"
                      title="Delete card from college database"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
