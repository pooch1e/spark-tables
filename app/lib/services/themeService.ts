import { db } from '@/db/connections';
import { themes } from '@/db/schema';
import { eq } from 'drizzle-orm';

export class ThemeService {
  static async getAllThemes() {
    try {
      const allThemes = await db.select().from(themes);
      if (allThemes.length === 0) {
        return [];
      }
      return allThemes;
    } catch (err) {
      console.log(err, 'error in fetching themes from service');
      throw new Error('Failed to fetch themes from database');
    }
  }

  static async postTheme({ body }) {
    try {
      const newTheme = await db.insert(themes).values(body).returning();
      const theme = newTheme[0];
      return theme;
    } catch (err) {
      console.log(err, 'error in posting new theme');
      throw new Error('Failed to post theme to database');
    }
  }

  static async getThemeById(id: number) {
    try {
      const result = await db.select().from(themes).where(eq(themes.id, id));
      const theme = result[0];
      return theme;
    } catch (err) {
      console.log(err, 'error fetching theme by id');
      throw new Error('Failed to fetch theme from database');
    }
  }
}
