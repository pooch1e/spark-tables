import { db } from '@/db/connections';
import { topics } from '@/db/schema';
import { eq } from 'drizzle-orm';

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
}
