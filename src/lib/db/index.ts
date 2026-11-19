import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DATA_DIR = path.join(process.cwd(), 'data');
const COLLEGES_DIR = path.join(DATA_DIR, 'colleges');
const REGISTRY_DB_PATH = path.join(DATA_DIR, 'registry.db');

// Ensure storage directories exist
function ensureDirectories() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(COLLEGES_DIR)) {
    fs.mkdirSync(COLLEGES_DIR, { recursive: true });
  }
}

// Cached DB instances
let registryDbInstance: Database.Database | null = null;
const collegeDbInstances = new Map<string, Database.Database>();

export function getRegistryDb(): Database.Database {
  ensureDirectories();
  if (!registryDbInstance) {
    registryDbInstance = new Database(REGISTRY_DB_PATH);
    registryDbInstance.pragma('journal_mode = WAL');
    initRegistrySchema(registryDbInstance);
  }
  return registryDbInstance;
}

function initRegistrySchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS institutions (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      subtitle TEXT,
      logoDataUrl TEXT,
      phone TEXT,
      emailOrWebsite TEXT,
      address TEXT,
      primaryColor TEXT NOT NULL DEFAULT '#1B365D',
      secondaryColor TEXT NOT NULL DEFAULT '#8C5A1E',
      cardStockTint TEXT NOT NULL DEFAULT '#FFFFFF',
      issuingAuthority TEXT NOT NULL DEFAULT 'Registrar / Principal',
      dbPath TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_institutions_slug ON institutions(slug);
  `);
}

export function getCollegeDb(slug: string): Database.Database {
  ensureDirectories();
  const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
  
  if (collegeDbInstances.has(cleanSlug)) {
    return collegeDbInstances.get(cleanSlug)!;
  }

  const dbPath = path.join(COLLEGES_DIR, `${cleanSlug}.db`);
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  initCollegeSchema(db);
  collegeDbInstances.set(cleanSlug, db);
  return db;
}

function initCollegeSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      fullName TEXT NOT NULL,
      studentId TEXT NOT NULL,
      department TEXT NOT NULL,
      course TEXT NOT NULL,
      academicYear TEXT NOT NULL,
      validThru TEXT,
      bloodGroup TEXT,
      emergencyContactName TEXT,
      emergencyContactPhone TEXT,
      photoDataUrl TEXT,
      photoCropZoom REAL DEFAULT 1.0,
      photoCropOffsetX REAL DEFAULT 0,
      photoCropOffsetY REAL DEFAULT 0,
      templateId TEXT NOT NULL,
      orientation TEXT NOT NULL,
      primaryColor TEXT,
      secondaryColor TEXT,
      cardStockTint TEXT,
      showLanyardSlotPreview INTEGER DEFAULT 1,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_students_search ON students(studentId, fullName);
    CREATE INDEX IF NOT EXISTS idx_students_dept ON students(department);
    CREATE INDEX IF NOT EXISTS idx_students_course ON students(course);
    CREATE INDEX IF NOT EXISTS idx_students_year ON students(academicYear);
  `);
}
