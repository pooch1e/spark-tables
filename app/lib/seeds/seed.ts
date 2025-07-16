import { prisma } from './prisma.ts';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });



export const seed = async ({tables}) => {
  try {
    // FK-safe deletion
    await prisma.$transaction([
      prisma.descriptor.deleteMany({}),
      prisma.subtheme.deleteMany({}),
      prisma.theme.deleteMany({}),
      prisma.table.deleteMany({}),
    ]);

    // seed tables
    await prisma.table.createMany({ data: tables });

    console.log('Seeded Success');
  } catch (err) {
    console.error('Error seeding test DB:', err);
  } finally {
    await prisma.$disconnect();
  }
};


