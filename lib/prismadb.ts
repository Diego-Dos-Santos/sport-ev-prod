import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL } },
    log: ['error'],
  });

// cache só fora de production local
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;