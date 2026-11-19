import { NextRequest, NextResponse } from 'next/server';
import { getCollegeDb } from '@/lib/db';

interface Params {
  params: {
    slug: string;
    id: string;
  };
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { slug, id } = params;
    const db = getCollegeDb(slug);
    const student = db.prepare('SELECT * FROM students WHERE id = ?').get(id) as any;

    if (!student) {
      return NextResponse.json({ error: 'Student record not found' }, { status: 404 });
    }

    return NextResponse.json({ student });
  } catch (err) {
    console.error('Failed to get student:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { slug, id } = params;
    const db = getCollegeDb(slug);
    const student = db.prepare('SELECT * FROM students WHERE id = ?').get(id) as any;

    if (!student) {
      return NextResponse.json({ error: 'Student record not found' }, { status: 404 });
    }

    db.prepare('DELETE FROM students WHERE id = ?').run(id);
    return NextResponse.json({ success: true, message: 'Student ID card deleted' });
  } catch (err) {
    console.error('Failed to delete student:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
