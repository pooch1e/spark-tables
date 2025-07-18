import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });
import { eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

import { closeConnection, db } from '@/db/connections.ts';
import { seed } from '@/db/seeds/seed.ts';
import { topics, themes, subthemes } from '@/db/schema.ts';
import {
  topics as topicsTestData,
  themes as themeTestData,
  subthemes as subthemeData,
  descriptors as descriptorsData,
} from '../data/test-data/index.ts';

console.log('Connected to DB:', process.env.TEST_DATABASE_URL);
beforeAll(async () => {
  await db.delete(subthemes);
  await db.delete(themes);
  await db.delete(topics);
  await db.execute(sql`TRUNCATE TABLE topics RESTART IDENTITY CASCADE`);
  await seed({ topicsTestData, themeTestData, subthemeData });
});
afterAll(async () => {
  await db.delete(subthemes);
  await db.delete(themes);
  await db.delete(topics);
  await closeConnection();
});

describe('testing database', () => {
  describe('topics table', () => {
    test('table of topics exists', async () => {
      const allTopics = await db.select().from(topics);
      expect(allTopics.length).toBeGreaterThan(0);
    });
    test('topics has an id column as primary key', async () => {
      const result = await db.execute(sql`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_name = 'topics';
  `);
      const [idCol] = result;
      expect(idCol.column_name).toBe('id');
      expect(idCol.data_type).toBe('integer');
    });
    test('topics has column of name of text', async () => {
      const result = await db.execute(sql`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_name = 'topics';
  `);
      const [idCol, nameCol, descCol] = result;
      expect(nameCol.column_name).toBe('name');
      expect(nameCol.data_type).toBe('text');
    });
    test('topics has a description of type string', async () => {
      const result = await db.execute(sql`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_name = 'topics';
  `);
      const [idCol, nameCol, descCol] = result;
      expect(descCol.column_name).toBe('description');
      expect(descCol.data_type).toBe('text');
    });
  });
  describe('topics data seeded', () => {
    test('topics data has been inserted correctly', async () => {
      const topic = await db.select().from(topics);
      expect(topic).toHaveLength(2);
      topic.forEach((data) => {
        expect(data).toHaveProperty('id');
        expect(data).toHaveProperty('name');
        expect(data).toHaveProperty('description');
      });
    });
  });
  describe('theme table', () => {
    test('table of themes exists', async () => {
      const theme = await db.select().from(themes);
      expect(theme.length).toBeGreaterThan(0);
    });
    test('theme table has a primary key of id integer', async () => {
      const result = await db.execute(sql`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_name = 'themes';
  `);
      const [idCol] = result;
      expect(idCol.column_name).toBe('id');
      expect(idCol.data_type).toBe('integer');
    });
    test('theme table has an order column of int', async () => {
      const result = await db.execute(sql`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_name = 'themes';
  `);

      const [idCol, orderCol] = result;
      expect(orderCol.column_name).toBe('order');
      expect(orderCol.data_type).toBe('integer');
    });
    test('theme table has an name column of text', async () => {
      const result = await db.execute(sql`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_name = 'themes';
  `);
      const [idCol, orderCol, table_id, nameCol] = result;
      expect(table_id.column_name).toBe('table_id');
      expect(table_id.data_type).toBe('integer');
    });
    test('theme table has an name column of text', async () => {
      const result = await db.execute(sql`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_name = 'themes';
  `);
      const [idCol, orderCol, table_id, nameCol] = result;
      expect(nameCol.column_name).toBe('name');
      expect(nameCol.data_type).toBe('text');
    });
  });
  describe('themes table seeded', () => {
    test('themes table has been seeded succesfully', async () => {
      const themesTable = await db.select().from(themes);
      expect(themesTable).toHaveLength(4);
      themesTable.forEach((theme) => {
        expect(theme).toHaveProperty('id');
        expect(theme).toHaveProperty('name');
        expect(theme).toHaveProperty('order');
        expect(theme).toHaveProperty('topic_id');
      });
    });
  });
  describe('subtheme table', () => {
    test('table of subtheme exists', async () => {
      const allSubthemes = await db.select().from(subthemes);
      expect(allSubthemes.length).toBeGreaterThan(0);
    });
    test('subtheme table has column of id as primary key', async () => {
      const result = await db.execute(sql`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_name = 'subthemes';
  `);
      const [idCol] = result;
      expect(idCol.column_name).toBe('id');
      expect(idCol.data_type).toBe('integer');
    });
    test('subtheme table has column of order as Int', async () => {
      const result = await db.execute(sql`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_name = 'subthemes';
  `);
      const [idCol, orderCol] = result;
      expect(orderCol.column_name).toBe('order');
      expect(orderCol.data_type).toBe('integer');
    });
    test('subtheme table has column of theme_id as int', async () => {
      const result = await db.execute(sql`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_name = 'subthemes';
  `);
      const [idCol, orderCol, theme_id] = result;
      expect(theme_id.column_name).toBe('theme_id');
      expect(theme_id.data_type).toBe('integer');
    });
    test('subtheme table has column of name as text', async () => {
      const result = await db.execute(sql`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_name = 'subthemes';
  `);
      const [idCol, orderCol, theme, nameCol] = result;
      expect(nameCol.column_name).toBe('name');
      expect(nameCol.data_type).toBe('text');
    });
  });
  describe('subtheme table seeded', () => {
    test('subtheme table has been seeded succesfully', async () => {
      const subtheme = await db.select().from(subthemes);
      expect(subtheme).toHaveLength(6);
      subtheme.map((theme) => {
        expect(theme).toHaveProperty('id');
        expect(theme).toHaveProperty('name');
        expect(theme).toHaveProperty('order');
        expect(theme).toHaveProperty('theme_id');
      });
    });
  });
});
