import { testApiHandler } from 'next-test-api-route-handler';
import { sql } from 'drizzle-orm';
// Import the handler under test from the app directory
import * as topicHandler from '@/app/api/topics/route.ts';
import * as topicIdHandler from '../app/api/topics/[id]/route.ts';
import * as topicIdHandlerThemesId from '../app/api/topics/[id]/themes/route.ts';
import * as topicHandlerIdAllData from '../app/api/topics/[id]/all/route.ts';
import * as themeHandler from '../app/api/themes/route.ts';
import * as themeIdHandler from '../app/api/themes/[id]/route.ts';
import * as allDataHandler from '../app/api/full/route.ts';

import { Topics, Themes, FullTree } from '@/app/types/index.ts';

import { closeConnection, db } from '@/db/connections.ts';
import { seed } from '@/db/seeds/seed.ts';
import { topics, themes, subthemes, descriptors } from '@/db/schema.ts';
import {
  topics as topicsTestData,
  themes as themeTestData,
  subthemes as subthemeData,
  descriptors as descriptorData,
} from '../data/test-data/index.ts';

// console.log('Connected to DB:', process.env.TEST_DATABASE_URL);
beforeEach(async () => {
  await db.delete(descriptors);
  await db.delete(subthemes);
  await db.delete(themes);
  await db.delete(topics);
  await db.execute(sql`
    TRUNCATE TABLE descriptors, subthemes, themes, topics 
    RESTART IDENTITY CASCADE
  `);
  await seed({ topicsTestData, themeTestData, subthemeData, descriptorData });
});

describe('testing endpoints', () => {
  describe('GET: api/topics', () => {
    test('200: returns array of objects with all topics data', async () => {
      await testApiHandler({
        appHandler: topicHandler,
        test: async ({ fetch }) => {
          const response = await fetch({ method: 'GET' });
          const { data } = await response.json();
          expect(response.status).toBe(200);
          expect(data.length).not.toBe(0);
        },
      });
    });
    test('200: returns empty array when no topics exist', async () => {
      const expected: Array<number>[] = [];

      // Save existing data
      const existingDescriptors = await db.select().from(descriptors);
      const existingSubthemes = await db.select().from(subthemes);
      const existingThemes = await db.select().from(themes);
      const existingTopics = await db.select().from(topics);

      // Delete in correct order (children first)
      await db.delete(descriptors);
      await db.delete(subthemes);
      await db.delete(themes);
      await db.delete(topics);
      try {
        await testApiHandler({
          appHandler: topicHandler,
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
        if (existingThemes.length > 0) {
          await db.insert(themes).values(existingThemes);
        }
        if (existingSubthemes.length > 0) {
          await db.insert(subthemes).values(existingSubthemes);
        }
        if (existingDescriptors.length > 0) {
          await db.insert(descriptors).values(existingDescriptors);
        }
      }
    });
    test('200: topics are returned with correct properties', async () => {
      await testApiHandler({
        appHandler: topicHandler,
        test: async ({ fetch }) => {
          const response = await fetch({ method: 'GET' });
          const { data } = await response.json();

          expect(response.status).toBe(200);
          expect(data.length).not.toBe(0);
          data.forEach((topic: Topics) => {
            expect(typeof topic.id).toBe('number');
            expect(typeof topic.name).toBe('string');
            expect(typeof topic.description).toBe('string');
          });
        },
      });
    });
  });
  describe('GET: api/topics/[id]', () => {
    test('200: returns topic with correct id', async () => {
      const expected = {
        id: 1,
        name: 'Wilderness',
        description:
          'The majority of any realm, where even rough trails are a rare sight',
      };
      await testApiHandler({
        params: { id: '1' },
        appHandler: topicIdHandler,
        test: async ({ fetch }) => {
          const response = await fetch({ method: 'GET' });
          const { data } = await response.json();

          expect(data.id).toBe(1);
          expect(data).toEqual(expected);
        },
      });
    });
    describe('GET api/topics/[id]/themes', () => {
      test('200: returns array of theme objects where themes match topic id', async () => {
        await testApiHandler({
          params: { id: '1' },
          appHandler: topicIdHandlerThemesId,
          test: async ({ fetch }) => {
            const response = await fetch({ method: 'GET' });
            const { data } = await response.json();

            expect(data).not.toHaveLength(0);
            expect(data).toHaveLength(2);
            data.forEach((theme: Themes) => {
              expect(theme.topic_id).toBe(1);
            });
          },
        });
      });
    });
    describe('GET: api/topics/[id]/all', () => {
      test('returns array of topics with all nested data', async () => {
        await testApiHandler({
          params: { id: '1' },
          appHandler: topicHandlerIdAllData,
          test: async ({ fetch }) => {
            const response = await fetch({ method: 'GET' });
            const result = await response.json();

            const { data } = result;
            expect(data).not.toHaveLength(0);
            data.forEach((topic: FullTree) => {
              expect(topic).toHaveProperty('id');
              expect(topic).toHaveProperty('name');
              expect(topic).toHaveProperty('description');
              expect(topic).toHaveProperty('themes');
              //check themes nested array of objects exists
              expect(topic.themes).not.toHaveLength(0);
            });
          },
        });
      });
    });
    test.todo('handles topic with no themes');
    test.todo('handles non-existent topic ID');
    test.todo('handles invalid topic ID');
  });
  describe('POST: api/topics', () => {
    test('201: returns a newly created topic object with correct properties', async () => {
      const expected = {
        name: 'Test Topic Name',
        description: 'Test Topic Description',
      };
      await testApiHandler({
        appHandler: topicHandler,
        test: async ({ fetch }) => {
          const response = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(expected),
          });
          expect(response.status).toBe(201);

          const result = await response.json();
          const { data } = result;
          expect(data.id).toBe(3);
          expect(data.description).toBe('Test Topic Description');
        },
      });
    });
  });
  describe('DELETE /api/topics/[id]', () => {
    test('200: topic deleted succesfully', async () => {
      await testApiHandler({
        params: { id: '1' },
        appHandler: topicIdHandler,
        test: async ({ fetch }) => {
          const response = await fetch({ method: 'DELETE' });
          expect(response.status).toBe(204);
        },
      });
    });
  });
  describe('GET: api/themes', () => {
    test('200: returns array of objects with all themes', async () => {
      await testApiHandler({
        appHandler: themeHandler,
        test: async ({ fetch }) => {
          const response = await fetch({ method: 'GET' });
          const { data } = await response.json();
          expect(response.status).toBe(200);
          expect(data.length).not.toBe(0);
        },
      });
    });
    test('200: returns empty array when no themes exist', async () => {
      const expected: Array<number>[] = [];
      // Save existing data
      const existingDescriptors = await db.select().from(descriptors);
      const existingSubthemes = await db.select().from(subthemes);
      const existingThemes = await db.select().from(themes);
      const existingTopics = await db.select().from(topics);

      // Delete in correct order (children first)
      await db.delete(descriptors);
      await db.delete(subthemes);
      await db.delete(themes);
      await db.delete(topics);

      await db.delete(topics);
      try {
        await testApiHandler({
          appHandler: themeHandler,
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
        if (existingThemes.length > 0) {
          await db.insert(themes).values(existingThemes);
        }
        if (existingSubthemes.length > 0) {
          await db.insert(subthemes).values(existingSubthemes);
        }
        if (existingDescriptors.length > 0) {
          await db.insert(descriptors).values(existingDescriptors);
        }
      }
    });
    test('themes are returned with correct properties', async () => {
      await testApiHandler({
        appHandler: themeHandler,
        test: async ({ fetch }) => {
          const response = await fetch({ method: 'GET' });
          const { data } = await response.json();
          expect(response.status).toBe(200);
          expect(data.length).not.toBe(0);
          data.forEach((theme) => {
            expect(typeof theme.id).toBe('number');
            expect(typeof theme.name).toBe('string');
            expect(typeof theme.order).toBe('number');
            expect(typeof theme.topic_id).toBe('number');
          });
        },
      });
    });
  });
  describe('POST /api/themes', () => {
    test('201: returns a newly created theme object with correct properties', async () => {
      const expected = { name: 'Test Name', order: 1, topic_id: 2 };
      await testApiHandler({
        appHandler: themeHandler,
        test: async ({ fetch }) => {
          const response = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(expected),
          });
          expect(response.status).toBe(201);
          const result = await response.json();
          const { data } = result;
          expect(data.id).toBe(5);
          expect(data.name).toBe('Test Name');
          expect(data.order).toBe(1);
          expect(data.topic_id).toBe(2);
        },
      });
    });
  });
  describe('GET api/themes/[id]', () => {
    test('200: returns single theme object with correct id', async () => {
      await testApiHandler({
        params: { id: '1' },
        appHandler: themeIdHandler,
        test: async ({ fetch }) => {
          const response = await fetch({ method: 'GET' });
          const { data } = await response.json();
          expect(data.id).toBe(1);
          expect(data.name).toBe('Land');
          expect(data.order).toBe(1);
          expect(data.topic_id).toBe(1);
        },
      });
    });
  });
  describe('DELETE /api/themes/[id]', () => {
    test('200: Theme deleted succesfully', async () => {
      await testApiHandler({
        params: { id: '1' },
        appHandler: themeIdHandler,
        test: async ({ fetch }) => {
          const response = await fetch({ method: 'DELETE' });
          expect(response.status).toBe(204);
        },
      });
    });
  });
  describe('GET /api/full', () => {
    test('200: Returns array of nested objects representing whole data tree', async () => {
      await testApiHandler({
        appHandler: allDataHandler,
        test: async ({ fetch }) => {
          const response = await fetch({ method: 'GET' });
          const result = response.json();
          const { data } = await result;
          expect(data).not.toHaveLength(0);
          data.forEach((topic) => {
            expect(topic).toHaveProperty('id');
            expect(topic).toHaveProperty('name');
            expect(topic).toHaveProperty('description');
            expect(topic).toHaveProperty('themes');
            //check themes nested array of objects exists
            expect(topic.themes).not.toHaveLength(0);
          });
        },
      });
    });
    test.todo('handles topic with no themes');
    test.todo('handles non-existent topic ID');
    test.todo('handles invalid topic ID');
  });
});

describe('Error handling for endpoints', () => {
  describe('GET: api/topics/[id]', () => {
    test('400: returns error for non-valid ID', async () => {
      await testApiHandler({
        params: { id: 'test' },
        appHandler: topicIdHandler,
        test: async ({ fetch }) => {
          const response = await fetch({ method: 'GET' });
          const { error } = await response.json();
          expect(response.status).toBe(400);
          expect(error).toContain('Invalid ID');
        },
      });
    });
    test('404: returns error for non existent topic-id', async () => {
      await testApiHandler({
        params: { id: '99999' },
        appHandler: topicIdHandler,
        test: async ({ fetch }) => {
          const response = await fetch({ method: 'GET' });
          const result = await response.json();
          expect(response.status).toBe(404);
          expect(result.error).toBe('Topic was not found');
        },
      });
    });
  });
  describe('POST: api/topics', () => {
    test('400: returns error when required fields are missing', async () => {
      await testApiHandler({
        appHandler: topicHandler,
        test: async ({ fetch }) => {
          const response = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}),
          });
          expect(response.status).toBe(400);
          const { error } = await response.json();
          expect(error).toContain('Name is required');
        },
      });
    });
    test('409: returns error when name of topic already exists', async () => {
      await testApiHandler({
        appHandler: topicHandler,
        test: async ({ fetch }) => {
          const response = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: 'Wilderness',
              description: 'I exist already',
            }),
          });
          expect(response.status).toBe(409);
          const { error } = await response.json();
          expect(error).toContain('Topic name already exists');
        },
      });
    });
  });
  describe('GET: api/themes/[id]', () => {
    test('400: returns error for non-valid ID', async () => {
      await testApiHandler({
        params: { id: 'test' },
        appHandler: themeIdHandler,
        test: async ({ fetch }) => {
          const response = await fetch({ method: 'GET' });
          const result = await response.json();
          expect(response.status).toBe(400);
          expect(result.error).toBe('Invalid ID');
        },
      });
    });
    test('404: returns error for non existent theme-id', async () => {
      await testApiHandler({
        params: { id: '99999' },
        appHandler: themeIdHandler,
        test: async ({ fetch }) => {
          const response = await fetch({ method: 'GET' });
          const result = await response.json();
          expect(response.status).toBe(404);
          expect(result.error).toBe('Theme was not found');
        },
      });
    });
  });
  describe('POST: api/themes', () => {
    test('400: returns error when required fields are missing', async () => {
      await testApiHandler({
        appHandler: themeHandler,
        test: async ({ fetch }) => {
          const response = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}),
          });
          expect(response.status).toBe(400);
          const { error } = await response.json();
          expect(error).toContain('Name is required');
        },
      });
    });
    test('400: returns error when name is missing', async () => {
      await testApiHandler({
        appHandler: themeHandler,
        test: async ({ fetch }) => {
          const response = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              order: 1,
              topic_id: 1,
              // name missing
            }),
          });
          expect(response.status).toBe(400);
          const { error } = await response.json();
          expect(error).toContain('Name is required');
        },
      });
    });

    test('400: returns error when order is not a number', async () => {
      await testApiHandler({
        appHandler: themeHandler,
        test: async ({ fetch }) => {
          const response = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: 'Test Theme',
              order: 'invalid',
              topic_id: 1,
            }),
          });
          expect(response.status).toBe(400);
          const { error } = await response.json();
          expect(error).toContain('Order must be a number');
        },
      });
    });

    test('400: returns error when topic_id is negative', async () => {
      await testApiHandler({
        appHandler: themeHandler,
        test: async ({ fetch }) => {
          const response = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: 'Test Theme',
              order: 1,
              topic_id: -1,
            }),
          });
          expect(response.status).toBe(400);
          const { error } = await response.json();
          expect(error).toContain('Topic ID must be a positive integer');
        },
      });
    });
    test('409: returns error when name of theme already exists', async () => {
      const expected = { name: 'Land', order: 1, topic_id: 2 };
      await testApiHandler({
        appHandler: themeHandler,
        test: async ({ fetch }) => {
          const response = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(expected),
          });
          expect(response.status).toBe(409);
          const { error } = await response.json();
          expect(error).toContain('Theme name already exists');
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
