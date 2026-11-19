import { NextRequest, NextResponse } from 'next/server';
import { getCollegeDb } from '@/lib/db';
import crypto from 'crypto';

interface Params {
  params: {
    slug: string;
  };
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { slug } = params;
    const db = getCollegeDb(slug);

    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') || '').trim();
    const department = (searchParams.get('department') || '').trim();
    const course = (searchParams.get('course') || '').trim();
    const academicYear = (searchParams.get('academicYear') || '').trim();

    const conditions: string[] = [];
    const sqlParams: any[] = [];

    if (q) {
      conditions.push('(fullName LIKE ? OR studentId LIKE ?)');
      sqlParams.push(`%${q}%`, `%${q}%`);
    }

    if (department && department !== 'all') {
      conditions.push('department = ?');
      sqlParams.push(department);
    }

    if (course && course !== 'all') {
      conditions.push('course = ?');
      sqlParams.push(course);
    }

    if (academicYear && academicYear !== 'all') {
      conditions.push('academicYear = ?');
      sqlParams.push(academicYear);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const querySql = `SELECT * FROM students ${whereClause} ORDER BY updatedAt DESC`;

    const students = db.prepare(querySql).all(...sqlParams) as any[];

    // Extract dynamic filter lists for the search UI (using single quotes for SQLite string literals)
    const distinctDepts = (
      db.prepare("SELECT DISTINCT department FROM students WHERE department IS NOT NULL AND department != '' ORDER BY department ASC").all() as any[]
    ).map((r) => r.department);

    const distinctCourses = (
      db.prepare("SELECT DISTINCT course FROM students WHERE course IS NOT NULL AND course != '' ORDER BY course ASC").all() as any[]
    ).map((r) => r.course);

    const distinctYears = (
      db.prepare("SELECT DISTINCT academicYear FROM students WHERE academicYear IS NOT NULL AND academicYear != '' ORDER BY academicYear ASC").all() as any[]
    ).map((r) => r.academicYear);

    return NextResponse.json({
      students,
      total: students.length,
      filters: {
        departments: distinctDepts,
        courses: distinctCourses,
        academicYears: distinctYears,
      },
    });
  } catch (err) {
    console.error('Failed to query students:', err);
    return NextResponse.json({ error: 'Failed to query student database' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { slug } = params;
    const db = getCollegeDb(slug);
    const body = await req.json();

    const {
      fullName,
      studentId,
      department = '',
      course = '',
      academicYear = '',
      validThru = '',
      bloodGroup = '',
      emergencyContactName = '',
      emergencyContactPhone = '',
      photoDataUrl = null,
      photoCrop = { zoom: 1.0, offsetX: 0, offsetY: 0 },
      design = {},
    } = body;

    if (!fullName || !fullName.trim()) {
      return NextResponse.json({ error: 'Student full name is required' }, { status: 400 });
    }
    if (!studentId || !studentId.trim()) {
      return NextResponse.json({ error: 'Student ID number is required' }, { status: 400 });
    }

    const id = body.id || crypto.randomUUID();
    const now = new Date().toISOString();

    const templateId = design.templateId || 'classic-academic';
    const orientation = design.orientation || 'portrait';
    const primaryColor = design.primaryColor || '#1B365D';
    const secondaryColor = design.secondaryColor || '#8C5A1E';
    const cardStockTint = design.cardStockTint || '#FFFFFF';
    const showLanyardSlotPreview = design.showLanyardSlotPreview !== false ? 1 : 0;

    const zoom = photoCrop.zoom || 1.0;
    const offsetX = photoCrop.offsetX || 0;
    const offsetY = photoCrop.offsetY || 0;

    // Insert or replace student in college database
    db.prepare(`
      INSERT OR REPLACE INTO students (
        id, fullName, studentId, department, course, academicYear, validThru,
        bloodGroup, emergencyContactName, emergencyContactPhone, photoDataUrl,
        photoCropZoom, photoCropOffsetX, photoCropOffsetY,
        templateId, orientation, primaryColor, secondaryColor, cardStockTint,
        showLanyardSlotPreview, createdAt, updatedAt
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?
      )
    `).run(
      id,
      fullName.trim(),
      studentId.trim(),
      department.trim(),
      course.trim(),
      academicYear.trim(),
      validThru.trim(),
      bloodGroup.trim(),
      emergencyContactName.trim(),
      emergencyContactPhone.trim(),
      photoDataUrl,
      zoom,
      offsetX,
      offsetY,
      templateId,
      orientation,
      primaryColor,
      secondaryColor,
      cardStockTint,
      showLanyardSlotPreview,
      body.createdAt || now,
      now
    );

    const saved = db.prepare('SELECT * FROM students WHERE id = ?').get(id) as any;
    return NextResponse.json({ student: saved }, { status: 201 });
  } catch (err) {
    console.error('Failed to create student card in college db:', err);
    return NextResponse.json({ error: 'Failed to persist student record' }, { status: 500 });
  }
}
