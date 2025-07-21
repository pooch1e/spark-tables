import { testApiHandler } from 'next-test-api-route-handler';
import { sql } from 'drizzle-orm';
// Import the handler under test from the app directory
import * as appHandler from '@/app/api/topics/route';
import * as appHandlerTopicById from '../app/api/topics/[id]/route.ts';
import { closeConnection, db } from '@/db/connections.ts';
import { seed } from '@/db/seeds/seed.ts';
import { topics, themes, subthemes, descriptors } from '@/db/schema.ts';
import {
  topics as topicsTestData,
  themes as themeTestData,
  subthemes as subthemeData,
  descriptors as descriptorData,
} from '../data/test-data/index.ts';

console.log('Connected to DB:', process.env.TEST_DATABASE_URL);
beforeAll(async () => {
  await db.delete(descriptors);
  await db.delete(subthemes);
  await db.delete(themes);
  await db.delete(topics);
  await db.execute(sql`TRUNCATE TABLE topics RESTART IDENTITY CASCADE`);
  await db.execute(sql`TRUNCATE TABLE themes RESTART IDENTITY CASCADE`);
  await db.execute(sql`TRUNCATE TABLE subthemes RESTART IDENTITY CASCADE`);
  await db.execute(sql`TRUNCATE TABLE descriptors RESTART IDENTITY CASCADE`);
  await seed({ topicsTestData, themeTestData, subthemeData, descriptorData });
});

describe('testing endpoints', () => {
  describe('GET: api/topics', () => {
    test('200: returns empty array when no topics exist', async () => {
      const expected: Array<>[] = [];
      const existingTopics = await db.select().from(topics);

      await db.delete(topics);
      try {
        await testApiHandler({
          appHandler,
          test: async ({ fetch }) => {
            const response = await fetch({ method: 'GET' });
            const json = await response.json();
            expect(response.status).toBe(200);
            expect(json.data).toEqual(expected);
          },
        });
      } catch (err) {
        console.log(err, 'err in testing empty topics');
      } finally {
        if (existingTopics.length > 0) {
          await db.insert(topics).values(existingTopics);
        }
      }
    });
    test('200: returns array of all topics', async () => {
      await testApiHandler({
        appHandler,
        test: async ({ fetch }) => {
          const response = await fetch({ method: 'GET' });
          const { data } = await response.json();
          expect(response.status).toBe(200);
          expect(data.length).not.toBe(0);
        },
      });
    });
    test('200: topics are returned with correct properties', async () => {
      await testApiHandler({
        appHandler,
        test: async ({ fetch }) => {
          const response = await fetch({ method: 'GET' });
          const { data } = await response.json();

          expect(response.status).toBe(200);
          expect(data.length).not.toBe(0);
          data.forEach((topic) => {
            expect(typeof topic.id).toBe('number');
            expect(typeof topic.name).toBe('string');
            expect(typeof topic.description).toBe('string');
          });
        },
      });
    });
  });
  describe('GET: api/topics/:topic_id', () => {
    test('200: returns topic with correct id', async () => {
      const expected = {
        id: 1,
        name: 'Wilderness',
        description:
          'The majority of any realm, where even rough trails are a rare sight',
      };
      await testApiHandler({
        params: { id: '1' },
        appHandler: appHandlerTopicById,
        test: async ({ fetch }) => {
          const response = await fetch({ method: 'GET' });
          const { data } = await response.json();

          expect(data.id).toBe(1);
          expect(data).toEqual(expected);
        },
      });
    });
  });
});

afterAll(async () => {
  await db.delete(descriptors);
  await db.delete(subthemes);
  await db.delete(themes);
  await db.delete(topics);
  await closeConnection();
});
