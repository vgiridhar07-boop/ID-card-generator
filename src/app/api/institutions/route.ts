import { NextRequest, NextResponse } from 'next/server';
import { getRegistryDb, getCollegeDb } from '@/lib/db';
import crypto from 'crypto';

export async function GET() {
  try {
    const db = getRegistryDb();
    const institutions = db.prepare('SELECT * FROM institutions ORDER BY createdAt DESC').all() as any[];

    // Calculate live student count for each college from its own database file
    const institutionsWithCounts = institutions.map((inst) => {
      try {
        const collegeDb = getCollegeDb(inst.slug);
        const countRow = collegeDb.prepare('SELECT COUNT(*) as count FROM students').get() as { count: number };
        return {
          ...inst,
          studentCount: countRow?.count || 0,
        };
      } catch (err) {
        console.error(`Failed to count students for college ${inst.slug}:`, err);
        return {
          ...inst,
          studentCount: 0,
        };
      }
    });

    return NextResponse.json({ institutions: institutionsWithCounts });
  } catch (err) {
    console.error('Failed to list institutions:', err);
    return NextResponse.json({ error: 'Failed to retrieve institutions registry' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      subtitle = '',
      logoDataUrl = null,
      phone = '',
      emailOrWebsite = '',
      address = '',
      primaryColor = '#1B365D',
      secondaryColor = '#8C5A1E',
      cardStockTint = '#FFFFFF',
      issuingAuthority = 'Registrar / Principal',
    } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Institution name is required' }, { status: 400 });
    }

    // Generate clean slug
    let baseSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    if (!baseSlug) {
      baseSlug = `college-${Date.now()}`;
    }

    const registryDb = getRegistryDb();

    // Ensure slug uniqueness
    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const existing = registryDb.prepare('SELECT id FROM institutions WHERE slug = ?').get(slug);
      if (!existing) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const dbPath = `data/colleges/${slug}.db`;

    // 1. Initialize the college's dedicated SQLite database file
    getCollegeDb(slug);

    // 2. Register in central registry.db
    registryDb
      .prepare(`
        INSERT INTO institutions (
          id, slug, name, subtitle, logoDataUrl, phone, emailOrWebsite,
          address, primaryColor, secondaryColor, cardStockTint, issuingAuthority,
          dbPath, createdAt, updatedAt
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?
        )
      `)
      .run(
        id,
        slug,
        name.trim(),
        subtitle.trim(),
        logoDataUrl,
        phone.trim(),
        emailOrWebsite.trim(),
        address.trim(),
        primaryColor,
        secondaryColor,
        cardStockTint,
        issuingAuthority.trim(),
        dbPath,
        now,
        now
      );

    const created = registryDb.prepare('SELECT * FROM institutions WHERE id = ?').get(id) as any;
    return NextResponse.json({ institution: { ...created, studentCount: 0 } }, { status: 201 });
  } catch (err) {
    console.error('Failed to create institution:', err);
    return NextResponse.json({ error: 'Failed to create college database' }, { status: 500 });
  }
}
