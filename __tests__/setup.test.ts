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
      test('check if Tables, table exists', async () => {
        const tableName = 'Table';

        const result = await prisma.$queryRaw<
          { exists: boolean }[]
        >`SELECT EXISTS (
          SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = ${tableName}
        );`;
        expect(result[0].exists).toBe(true);
      });
      test('tables has an ID column of a number', async () => {
        const tableName = 'Table'; // Adjust to your exact table name
        const columnName = 'id';

        const result = await prisma.$queryRaw<{ exists: boolean }[]>`
      SELECT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = ${tableName} AND column_name = ${columnName}
    );
  `;

        expect(result[0].exists).toBe(true);
      });
      test.todo('tables has y as col etc..');
    });
  });
  test('testing here', () => {
    console.log('im a test');
    console.log(process.env.NODE_ENV);
  });
});
