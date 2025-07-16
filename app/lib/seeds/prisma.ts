import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

// Load environment-specific .env file
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    // Add logging for debugging in test environment
    log: process.env.NODE_ENV === 'test' ? ['error', 'warn'] : [],
  });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Permission-safe test cleanup using DELETE instead of TRUNCATE
export const cleanTestDatabase = async () => {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('cleanTestDatabase can only be used in test environment');
  }

  try {
    // Use transaction to ensure all operations succeed or fail together
    await prisma.$transaction(async (tx) => {
      // Example order - adjust based on your actual schema:
      await tx.descriptor.deleteMany({});
      await tx.subtheme.deleteMany({});
      await tx.theme.deleteMany({});
      await tx.table.deleteMany({});
    });

    console.log('Test database cleaned successfully');
  } catch (error) {
    console.error('Error cleaning test database:', error);
    throw error;
  }
};

export const resetTestSequences = async () => {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('resetTestSequences can only be used in test environment');
  }

  const sequences = await prisma.$queryRaw<Array<{ sequence_name: string }>>`
    SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema = 'public'
  `;

  for (const { sequence_name } of sequences) {
    await prisma.$executeRawUnsafe(
      `ALTER SEQUENCE "public"."${sequence_name}" RESTART WITH 1;`
    );
  }
};
