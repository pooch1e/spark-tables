import { db } from '@/db/connections';
import { topics, themes, subthemes, descriptors } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { nestTopicData } from '../utils/nestTopicData';
import {
  NotFoundError,
  ValidationError,
  DatabaseError,
  ConflictError,
} from './errorHandling.ts';

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

  static async getAllTopicsData() {
    try {
      const result = await db
        .select()
        .from(topics)
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

  static async getAllTopicsDataById(id: number) {
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
      if (!topic) {
        throw new NotFoundError('Topic was not found');
      }
      return topic;
    } catch (err) {
      // console.log(err, 'error fetching topic by id');
      throw err;
    }
  }

  static async postTopic({ body }) {
    try {
      const { name, description } = body;
      const existingTopic = await db
        .select()
        .from(topics)
        .where(eq(topics.name, name));

      if (existingTopic.length > 0) {
        throw new ConflictError('Topic name already exists');
      }

      const insertedTopic = await db.insert(topics).values(body).returning();
      const topic = insertedTopic[0];
      return topic;
    } catch (err) {
      if (err instanceof ConflictError) {
        throw err;
      } else {
        console.error('Database error in createTopic:', err);
        throw new DatabaseError('Failed to create topic');
      }
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
