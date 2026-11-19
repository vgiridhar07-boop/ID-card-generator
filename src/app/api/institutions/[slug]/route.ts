import { NextRequest, NextResponse } from 'next/server';
import { getRegistryDb, getCollegeDb } from '@/lib/db';
import fs from 'fs';
import path from 'path';

interface Params {
  params: {
    slug: string;
  };
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { slug } = params;
    const db = getRegistryDb();
    const inst = db.prepare('SELECT * FROM institutions WHERE slug = ?').get(slug) as any;

    if (!inst) {
      return NextResponse.json({ error: 'Institution not found' }, { status: 404 });
    }

    const collegeDb = getCollegeDb(slug);
    const countRow = collegeDb.prepare('SELECT COUNT(*) as count FROM students').get() as { count: number };

    return NextResponse.json({
      institution: {
        ...inst,
        studentCount: countRow?.count || 0,
      },
    });
  } catch (err) {
    console.error('Failed to get institution:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { slug } = params;
    const body = await req.json();
    const registryDb = getRegistryDb();

    const existing = registryDb.prepare('SELECT * FROM institutions WHERE slug = ?').get(slug) as any;
    if (!existing) {
      return NextResponse.json({ error: 'Institution not found' }, { status: 404 });
    }

    const name = body.name ?? existing.name;
    const subtitle = body.subtitle ?? existing.subtitle;
    const logoDataUrl = body.logoDataUrl !== undefined ? body.logoDataUrl : existing.logoDataUrl;
    const phone = body.phone ?? existing.phone;
    const emailOrWebsite = body.emailOrWebsite ?? existing.emailOrWebsite;
    const address = body.address ?? existing.address;
    const primaryColor = body.primaryColor ?? existing.primaryColor;
    const secondaryColor = body.secondaryColor ?? existing.secondaryColor;
    const cardStockTint = body.cardStockTint ?? existing.cardStockTint;
    const issuingAuthority = body.issuingAuthority ?? existing.issuingAuthority;
    const now = new Date().toISOString();

    registryDb
      .prepare(`
        UPDATE institutions
        SET name = ?, subtitle = ?, logoDataUrl = ?, phone = ?, emailOrWebsite = ?,
            address = ?, primaryColor = ?, secondaryColor = ?, cardStockTint = ?,
            issuingAuthority = ?, updatedAt = ?
        WHERE slug = ?
      `)
      .run(
        name,
        subtitle,
        logoDataUrl,
        phone,
        emailOrWebsite,
        address,
        primaryColor,
        secondaryColor,
        cardStockTint,
        issuingAuthority,
        now,
        slug
      );

    const updated = registryDb.prepare('SELECT * FROM institutions WHERE slug = ?').get(slug) as any;
    return NextResponse.json({ institution: updated });
  } catch (err) {
    console.error('Failed to update institution:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { slug } = params;
    const registryDb = getRegistryDb();

    const inst = registryDb.prepare('SELECT * FROM institutions WHERE slug = ?').get(slug) as any;
    if (!inst) {
      return NextResponse.json({ error: 'Institution not found' }, { status: 404 });
    }

    // Delete from registry
    registryDb.prepare('DELETE FROM institutions WHERE slug = ?').run(slug);

    // Remove SQLite database file if it exists
    const dbFilePath = path.join(process.cwd(), 'data', 'colleges', `${slug}.db`);
    if (fs.existsSync(dbFilePath)) {
      try {
        fs.unlinkSync(dbFilePath);
      } catch (e) {
        console.warn(`Could not immediately delete ${dbFilePath}, file might be open:`, e);
      }
    }

    return NextResponse.json({ success: true, message: `College database ${slug} removed` });
  } catch (err) {
    console.error('Failed to delete institution:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
