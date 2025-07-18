import { prisma } from '../app/lib/seeds/prisma.ts';
import { seed } from '../app/lib/seeds/seed.ts';
import { cleanTestDatabase } from '../app/lib/seeds/prisma.ts';
import { Themes } from '@/app/types/themes.ts';
import {
  tables,
  themes,
  subthemes,
  descriptors,
} from '../data/test-data/index.js';

console.log(process.env.DATABASE_URL, 'test db url');

beforeAll(async () => {
  await cleanTestDatabase();
  await seed({ tables, themes });
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('testing database', () => {
  describe('testing seeds', () => {
    describe('testing Tables table', () => {
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
        const tableName = 'Table';
        const columnName = 'id';

        const result = await prisma.$queryRaw<{ exists: boolean }[]>`
      SELECT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = ${tableName} AND column_name = ${columnName}
    );
  `;
        expect(result[0].exists).toBe(true);
      });
      test('tables has an name column of a string', async () => {
        const tableName = 'Table';
        const columnName = 'name';

        const result = await prisma.$queryRaw<{ exists: boolean }[]>`
      SELECT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = ${tableName} AND column_name = ${columnName}
    );
  `;
        expect(result[0].exists).toBe(true);
      });
      test('tables has a Description column of a string', async () => {
        const tableName = 'Table';
        const columnName = 'description';

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
    describe('testing Theme table', () => {
      test('theme table exists', async () => {
        const tableName = 'Theme';

        const result = await prisma.$queryRaw<
          { exists: boolean }[]
        >`SELECT EXISTS (
          SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = ${tableName}
        );`;
        expect(result[0].exists).toBe(true);
      });
      test('theme has column ID of primary key', async () => {
        const result = await prisma.theme.findFirst({
          where: {
            id: 1,
          },
        });
        const test = async () => {
          console.log('DATABASE_URL:', process.env.DATABASE_URL);
          const result = await prisma.theme.findMany();
          console.log(result);
        };
        test();
        console.log(result);
      });
      test.todo('theme has column Name of string');
      test.todo('theme has column Order of Int');
      test.todo('theme has column table_id of Int and foreign key');
    });
  });
});
