import { db } from '../connections.ts';
import { topics, themes, subthemes, descriptors } from '../schema.ts';

export const seed = async ({
  topicsTestData,
  themeTestData,
  subthemeData,
  descriptorData,
}) => {
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
    // console.log('seeded subtheme', insertedSubThemes);

    //descriptors
    const insertedDescriptor = await db
      .insert(descriptors)
      .values(descriptorData)
      .returning();
    console.log('inserted descriptors', insertedDescriptor);
  } catch (err) {
    console.log(err);
  }
};
