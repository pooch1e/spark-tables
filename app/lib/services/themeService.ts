import { db } from '@/db/connections';
import { themes } from '@/db/schema';


export class ThemeService {
  static async getAllThemes() {
    try {
      const allThemes = await db.select().from(themes);
      if (allThemes.length === 0) {
        return []
      }
      return allThemes;
    } catch (err) {
      console.log(err, 'error in fetching themes from service')
      throw new Error('Failed to fetch themes from database');
    }
  }
}