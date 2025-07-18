import { db, closeConnection } from '../connections.ts';
import {
  topics as topicsTestData,
  themes,
  subthemes,
  descriptors,
} from '../../data/test-data/index.ts';
import { tables } from '../schema.ts';

export const seed = async (tableTestData) => {
  try {
    const insertTables = await Promise.all(
      tableTestData.map((table) => {
        return db.insert(tables).values(table).returning();
      })
    );
    console.log('table created', insertTables);
  } catch (err) {
    console.log(err);
  }
};
