import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });
import { eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

import { closeConnection, db } from '@/db/connections.ts';
import { seed } from '@/db/seeds/seed.ts';
import { topics } from '@/db/schema.ts';
import {
  topics as topicsTestData,
  themes as themeData,
  subthemes as subthemeData,
  descriptors as descriptorsData,
} from '../data/test-data/index.ts';

console.log('Connected to DB:', process.env.TEST_DATABASE_URL);
beforeAll(async () => {
  await db.delete(topics);
  await db.execute(sql`TRUNCATE TABLE topics RESTART IDENTITY CASCADE`);
  await seed({ topicsTestData });
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
      const theme = await db.select().from(themeData);
      expect(theme.length).toBeGreaterThan(0);
    });
  })
});


