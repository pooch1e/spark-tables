import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });
import { eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

import { closeConnection, db } from '@/db/connections.ts';
import { seed } from '@/db/seeds/seed.ts';
import { topics, themes } from '@/db/schema.ts';
import {
  topics as topicsTestData,
  themes as themeTestData,
  subthemes as subthemeData,
  descriptors as descriptorsData,
} from '../data/test-data/index.ts';

console.log('Connected to DB:', process.env.TEST_DATABASE_URL);
beforeAll(async () => {
  await db.delete(topics);
  await db.delete(themes);
  await db.execute(sql`TRUNCATE TABLE topics RESTART IDENTITY CASCADE`);
  await seed({ topicsTestData, themeTestData });
});
afterAll(async () => {
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
  describe('theme table tests', () => {
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
      console.log(result);
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
});
