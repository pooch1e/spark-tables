import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import { closeConnection, db } from '@/db/connections.ts';
import { seed } from '@/db/seeds/seed.ts';
import {
  topics as topicsTestData,
  themes as themeData,
  subthemes as subthemeData,
  descriptors as descriptorsData,
} from '../data/test-data/index.ts';

console.log('Connected to DB:', process.env.TEST_DATABASE_URL);
beforeAll(async () => {
  await seed(tableTestData);
});
afterAll(async () => {
  await closeConnection();
});

describe('testing database', () => {
  test('table of Table exists', async () => {
    const allTables = await db.select().from(tables);
    expect(allTables.length).toBeGreaterThan(0);
  });
});
