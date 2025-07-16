import { prisma } from '../app/lib/seeds/prisma.ts';
import { seed } from '../app/lib/seeds/seed.ts';
import { cleanTestDatabase } from '../app/lib/seeds/prisma.ts';
import {
  tables,
  themes,
  subthemes,
  descriptors,
} from '../data/test-data/index.js';

beforeAll(async () => {
  await cleanTestDatabase();
  await seed({ tables });
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('testing database', () => {
  describe('testing seeds', () => {
    describe('tables table', () => {
      test.todo('tables table exists');
      test.todo('tables has x as pk');
      test.todo('tables has y as col etc..');
    });
  });
  test('testing here', () => {
    console.log('im a test');
    console.log(process.env.NODE_ENV);
  });
});
