import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const tables = pgTable('tables', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
});

export const themes = pgTable('themes', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  order: integer('order').notNull(),
  table_id: integer('table_id').notNull(),
});

export const subthemes = pgTable('subthemes', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  order: integer('order').notNull(),
  theme_id: integer('theme_id').notNull(),
});

export const descriptors = pgTable('descriptors', {
  id: serial('id').primaryKey(),
  text: text('text').notNull(),
  subtheme_id: integer('subtheme_id').notNull(),
});

// Relations (optional but helpful for joins)
export const tablesRelations = relations(tables, ({ many }) => ({
  themes: many(themes),
}));

export const themesRelations = relations(themes, ({ one, many }) => ({
  table: one(tables, { fields: [themes.table_id], references: [tables.id] }),
  subthemes: many(subthemes),
}));

export const subthemesRelations = relations(subthemes, ({ one, many }) => ({
  theme: one(themes, { fields: [subthemes.theme_id], references: [themes.id] }),
  descriptors: many(descriptors),
}));

export const descriptorsRelations = relations(descriptors, ({ one }) => ({
  subtheme: one(subthemes, {
    fields: [descriptors.subtheme_id],
    references: [subthemes.id],
  }),
}));
