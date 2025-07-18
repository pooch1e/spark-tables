import { db, closeConnection } from '../connections.js';
import {
  tablesTestData,
  themes,
  subthemes,
  descriptors,
} from '../../data/test-data/index.js';
import { tables } from '../schema.ts';

export const seed = async () => {
  const insertTables = await db.insert(tables).values(tablesTestData);
  console.log('table created');
};

export const seed = async () => {
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

seed()
  .catch((error) => {
    console.error('Seeding error:', error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
