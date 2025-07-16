import { prisma } from './prisma.ts';
import dotenv from 'dotenv';

// Load environment variables from .env.test explicitly
dotenv.config({ path: '.env.test' });

import {
  tables,
  themes,
  subthemes,
  descriptors,
} from '../../data/test-data/index.js';

export const seedTestDatabase = async () => {
  //table, theme, subtheme, descriptor
  //deletion - descriptor, subtheme, theme, table

  try {
    //clear db
    await prisma.Descriptor.deleteMany({});
    await prisma.Subtheme.deleteMany({});
    await prisma.Theme.deleteMany({});
    await prisma.Table.deleteMany({});

    //seed db with test data
    await prisma.Table.createMany({
      data: tables,
      skipDuplicates: true,
    });
    await prisma.Theme.createMany({
      data: themes,
      skipDuplicates: true,
    });
    await prisma.Subtheme.createMany({
      data: subthemes,
      skipDuplicates: true,
    });
    await prisma.Descriptor.createMany({
      data: descriptors,
      skipDuplicates: true,
    });
    console.log('seeded test db succesfully');
  } catch (err) {
    console.log(err, 'err in seeding test db');
  } finally {
    await prisma.$disconnect();
  }
};

seedTestDatabase()
  .catch((error) => {
    console.error('Seeding error:', error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
