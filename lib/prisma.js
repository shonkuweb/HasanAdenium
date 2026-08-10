import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const globalForPrisma = globalThis;

let prisma;

if (!globalForPrisma.prisma) {
  let dbUrl = process.env.DATABASE_URL || `file:${path.join(process.cwd(), 'dev.db')}`;
  let dbFilePath = dbUrl.replace(/^file:/, '');

  const dir = path.dirname(dbFilePath);
  if (dir && !fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (e) {
      console.error("Could not create db directory:", dir, e);
    }
  }

  let adapter;
  try {
    const db = new Database(dbFilePath);
    adapter = new PrismaBetterSqlite3(db);
  } catch (err) {
    console.error("Failed to open database at", dbFilePath, err);
    const fallbackPath = path.join(process.cwd(), 'dev.db');
    const fallbackDb = new Database(fallbackPath);
    adapter = new PrismaBetterSqlite3(fallbackDb);
  }

  globalForPrisma.prisma = new PrismaClient({ adapter });
}

prisma = globalForPrisma.prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export { prisma };
