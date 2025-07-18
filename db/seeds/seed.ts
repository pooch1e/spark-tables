import { db, closeConnection } from '../connections.ts';
import { topics, themes, subthemes } from '../schema.ts';

export const seed = async ({ topicsTestData, themeTestData, subthemeData }) => {
  try {
    //delete data before seeding

    await db.delete(subthemes);
    await db.delete(themes);
    await db.delete(topics);

    // topics
    const insertedTopics = await db
      .insert(topics)
      .values(topicsTestData)
      .returning();
    // console.log('seeded topics table', insertedTopics);

    // themes
    const insertedThemes = await db
      .insert(themes)
      .values(themeTestData)
      .returning();
    // console.log('seeded themes table', insertedThemes);

    //subthemes
    const insertedSubThemes = await db
      .insert(subthemes)
      .values(subthemeData)
      .returning();
    console.log('seeded subtheme', insertedSubThemes);
  } catch (err) {
    console.log(err);
  }
};
