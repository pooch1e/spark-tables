import { db } from '@/db/connections';
import { topics, themes, subthemes, descriptors } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { nestTopicData } from '../utils/nestTopicData';

export class TopicService {
  static async getAllTopics() {
    try {
      const allTopics = await db.select().from(topics);
      if (allTopics.length === 0) {
        return [];
      }
      return allTopics;
    } catch (err) {
      console.log(err, 'Database error in getAllTopics');
      throw new Error('Failed to fetch topics from database');
    }
  }

  static async getAllTopicsData(id: number) {
    try {
      const result = await db
        .select()
        .from(topics)
        .where(eq(topics.id, id))
        .leftJoin(themes, eq(themes.topic_id, topics.id))
        .leftJoin(subthemes, eq(subthemes.theme_id, themes.id))
        .leftJoin(descriptors, eq(descriptors.subtheme_id, subthemes.id));

      const nestedData = nestTopicData(result);
      return nestedData;
    } catch (err) {
      console.log(err, 'error fetching all nested topic data');
      throw new Error('Failed to fetch nested data for topics');
    }
  }

  static async getTopicByTopicId(id: number) {
    try {
      const topicById = await db
        .select()
        .from(topics)
        .where(eq(topics.id, id))
        .limit(1);

      const topic = topicById[0];
      return topic;
    } catch (err) {
      console.log(err, 'error fetching topic by id');
      throw new Error('Failed to fetch topic from database');
    }
  }

  static async postTopic({ body }) {
    try {
      const insertedTopic = await db.insert(topics).values(body).returning();
      const topic = insertedTopic[0];
      return topic;
    } catch (err) {
      console.log(err, 'error posting topic');
      throw new Error('Failed to post topic to database');
    }
  }

  static async deleteTopicById(id: number) {
    try {
      await db.delete(topics).where(eq(topics.id, id));
      return null;
    } catch (err) {
      console.log(err, 'error in deleting topic');
      throw new Error('Failed to delete topic');
    }
  }
}
