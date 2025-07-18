import { db, closeConnection } from '../connections.ts';
import {
  tables as tableTestData,
  themes,
  subthemes,
  descriptors,
} from '../../data/test-data/index.js';
import { tables } from '../schema.ts';

export const seed = async ({tablesTestData}) => {
  try {
    const insertTables = await Promise.all(
      tablesTestData.map((table) => {
        return db.insert(tables).values(table).returning();
      })
    );
    console.log('table created', insertTables);
  } catch (err) {
    console.log(err);
  } finally {
    await closeConnection();
  }
};

seed();
