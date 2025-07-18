import { db, closeConnection } from '../connections.ts';
import {
  topics as topicsTestData,
  themes as themeData,
  subthemes,
  descriptors,
} from '../../data/test-data/index.ts';
import { topics, themes } from '../schema.ts';

export const seed = async ({ topicsTestData }) => {
  try {
    // topics
    const insertedTopics = await db
      .insert(topics)
      .values(topicsTestData)
      .returning();
    // console.log('seeded topics table', insertedTopics);

    const insertedThemes = await db
      .insert(themes)
      .values(themeData)
      .returning();

    console.log(insertedThemes);
  } catch (err) {
    console.log(err);
  }
};
