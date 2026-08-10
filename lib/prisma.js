import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';

const globalForPrisma = globalThis;

let prisma;

if (!globalForPrisma.prisma) {
  let dbUrl = process.env.DATABASE_URL;
  if (!dbUrl || typeof dbUrl !== 'string' || !dbUrl.startsWith('file:')) {
    dbUrl = `file:${path.join(process.cwd(), 'dev.db')}`;
  }

  try {
    const adapter = new PrismaBetterSqlite3({ url: dbUrl });
    globalForPrisma.prisma = new PrismaClient({ adapter });
  } catch (err) {
    console.error("Failed to initialize Prisma client with url:", dbUrl, err);
    const fallbackUrl = `file:${path.join(process.cwd(), 'dev.db')}`;
    const adapter = new PrismaBetterSqlite3({ url: fallbackUrl });
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }
}

prisma = globalForPrisma.prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export { prisma };
