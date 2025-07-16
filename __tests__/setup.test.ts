import { prisma } from '../app/lib/prisma.ts';
import { seed } from '../app/lib/seed.ts';
import { cleanTestDatabase, resetTestSequences } from '../app/lib/prisma.ts';


describe('testing database', () => {
  test('testing here', () => {
    console.log('im a test');
    console.log(process.env.NODE_ENV);
  });
});
