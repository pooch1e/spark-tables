import { testApiHandler } from 'next-test-api-route-handler';
// Import the handler under test from the app directory
import * as appHandler from '../app/your-endpoint/route';


describe('testing endpoints', () => {
  describe('GET: api/topics', () => {
    test('200: returns empty array when no topics exist', async () => {
      await testApiHandler({
    appHandler,
    test: async ({ fetch }) => {
      const response = await fetch({ method: "GET" });
      const json = await response.json();
      expect(response.status).toBe(200);
      await expect(json).toStrictEqual({
        hello: true,
      });
    },
  });
});
    });
    test.todo('200: returns array of all topics');
    test.todo('200: topics are returned with correct properties');
    test.todo('500: handles database connection errors');
  });
});
