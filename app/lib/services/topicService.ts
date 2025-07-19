import { db } from '@/db/connections';
import { topics } from '@/db/schema';

export class TopicService {
  static async getAllTopics() {
    try {
      const allTopics = await db.select().from(topics);
      return allTopics;
    } catch (err) {
      console.log(err, 'Database error in getAllTopics');
      throw new Error('Failed to fetch topics from database');
    }
  }
}
