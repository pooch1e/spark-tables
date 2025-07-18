import { db, closeConnection } from '../connections.ts';
import {
  topics as topicsTestData,
  themes,
  subthemes,
  descriptors,
} from '../../data/test-data/index.ts';
import { topics } from '../schema.ts';

export const seed = async () => {
  try {
    const insertedTopics = await db
      .insert(topics)
      .values(topicsTestData)
      .returning();
    console.log('table created', insertedTopics);
    return insertedTopics;
  } catch (err) {
    console.log(err);
  }
};
