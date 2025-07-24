import { db } from '@/db/connections';
import { themes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { ConflictError, DatabaseError, NotFoundError } from './errorHandling';

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
      const { name } = body;
      const existingTheme = await db
        .select()
        .from(themes)
        .where(eq(themes.name, name));

      if (existingTheme.length > 0) {
        throw new ConflictError('Theme name already exists');
      }

      const newTheme = await db.insert(themes).values(body).returning();
      const theme = newTheme[0];
      return theme;
    } catch (err) {
      if (err instanceof ConflictError) {
        throw err;
      } else {
        console.error('Database error in Posting Theme', err);
        throw new DatabaseError('Failed to create theme');
      }
    }
  }

  static async getThemeById(id: number) {
    try {
      const result = await db.select().from(themes).where(eq(themes.id, id));

      const theme = result[0];
      if (!theme) {
        throw new NotFoundError('Theme was not found');
      }
      return theme;
    } catch (err) {
      throw err;
    }
  }

  static async updateThemeByThemeId(
    id: number,
    body: { name?: string; description?: string }
  ) {
    try {
      const { name, description } = body;

      // Validation
      if (name !== undefined && (!name || name.trim() === '')) {
        throw new Error('Name cannot be empty');
      }

      const existingTheme = await db
        .select()
        .from(themes)
        .where(eq(themes.id, id));
      if (existingTheme.length === 0) {
        return null;
      }

      const updateData: { name?: string; description?: string } = {};
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;

      if (Object.keys(updateData).length === 0) {
        return existingTheme[0];
      }

      if (name !== undefined) {
        const duplicateCheck = await db
          .select()
          .from(themes)
          .where(eq(themes.name, name));

        if (duplicateCheck.length > 0) {
          throw new ConflictError('Theme name already exists');
        }
      }
      //UPDATE THEME
      const updatedTheme = await db
        .update(themes)
        .set(updateData)
        .where(eq(themes.id, id))
        .returning();

      const theme = updatedTheme[0];
      return theme;
    } catch (err) {
      throw err;
    }
  }

  static async deleteThemeById(id: number) {
    try {
      await db.delete(themes).where(eq(themes.id, id));
      return null;
    } catch (err) {
      console.log(err, 'error in deleting theme by theme id');
      throw new Error('Failed to delete theme by theme id');
    }
  }

  static async getThemesByTopicId(topic_id: number) {
    try {
      const themesById = await db
        .select()
        .from(themes)
        .where(eq(themes.topic_id, topic_id));

      if (!themesById) {
        throw new NotFoundError('Topic ID was not found');
      }
      return themesById;
    } catch (err) {
      console.log(err, 'error in fetching themes by topic id');
      throw new Error('Failed to fetch themes by topic id');
    }
  }
}
