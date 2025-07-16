import { PrismaClient } from '@prisma/client';
import { table, themes, subthemes, descriptors } from '@/data/test-data/index';

export const seedTestDatabase = async () => {
  //table, theme, subtheme, descriptor
  //deletion - descriptor, subtheme, theme, table
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL_TEST || process.env.DATABASE_URL,
      },
    },
  });

  try {
    //clear db
    await prisma.descriptors.deleteMany({});
    await prisma.subthemes.deleteMany({});
    await prisma.themes.deleteMany({});
    await prisma.table.deleteMany({});

    //seed db with test data
    await prisma.table.createMany({
      data: table,
      skipDuplicates: true,
    });
    await prisma.table.createMany({
      data: themes,
      skipDuplicates: true,
    });
    await prisma.table.createMany({
      data: subthemes,
      skipDuplicates: true,
    });
    await prisma.table.createMany({
      data: descriptors,
      skipDuplicates: true,
    });
  } catch (err) {
    console.log(err, 'err in seeding test db');
  } finally {
    await prisma.$disconnect();
  }
};
