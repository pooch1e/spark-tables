import { testApiHandler } from 'next-test-api-route-handler';
// Import the handler under test from the app directory
import * as appHandler from '@/app/api/topics/route';
import { TopicService } from '../app/lib/services/topicService.ts';
import { closeConnection } from '@/db/connections.ts';

describe('testing endpoints', () => {
  describe('GET: api/topics', () => {
    test('200: returns empty array when no topics exist', async () => {
      await testApiHandler({
        appHandler,
        test: async ({ fetch }) => {
          const response = await fetch({ method: 'GET' });
          const json = await response.json();

          expect(json.status).toBe(200);
          expect(TopicService).toHaveBeenCalledTimes(1);
        },
      });
    });
    test.todo('200: returns array of all topics');
    test.todo('200: topics are returned with correct properties');
    test.todo('500: handles database connection errors');
  });
});

afterAll(async () => {
  await closeConnection(); // <-- Close DB connection after all tests
});
