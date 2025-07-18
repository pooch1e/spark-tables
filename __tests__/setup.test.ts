import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

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
  await seed(topicsTestData);
});
afterAll(async () => {
  await db.delete(topics);
  await closeConnection();
});

describe('testing database', () => {
  test('table of topics exists', async () => {
    const allTopics = await db.select().from(topics);
    expect(allTopics.length).toBeGreaterThan(0);
  });
});
