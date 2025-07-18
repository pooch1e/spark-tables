import { db } from '@/db/connections.ts';
import { seed } from '@/db/seeds/seed.ts';
import {tables as tableData, themes as themeData, subthemes as subthemeData, descriptors as descriptorsData}

beforeAll(() => {
  seed({tableData})
})
afterAll(() => {
  
})

describe('testing database', () => {
  test('testing here', () => {
    console.log('im a test');
    console.log(process.env.NODE_ENV);
  });
});
