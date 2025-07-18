import { db, closeConnection } from '../connections.ts';
import {
  topics as topicsTestData,
  themes as themeTestData,
  subthemes,
  descriptors,
} from '../../data/test-data/index.ts';
import { topics, themes } from '../schema.ts';

export const seed = async ({ topicsTestData, themeTestData }) => {
  try {
    //delete data before seeding

    await db.insert(themes);
    await db.delete(topics);

    // topics
    const insertedTopics = await db
      .insert(topics)
      .values(topicsTestData)
      .returning();
    console.log('seeded topics table', insertedTopics);

    const insertedThemes = await db
      .insert(themes)
      .values(themeTestData)
      .returning();

    console.log('seeded themes table', insertedThemes);
  } catch (err) {
    console.log(err);
  }
};
