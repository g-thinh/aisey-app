import { sql } from "drizzle-orm";
import { int, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  age: int().notNull(),
  email: text().notNull().unique(),
});

export const categoriesTable = sqliteTable("categories", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  created_at: integer({ mode: "timestamp" }).default(sql`(current_timestamp)`),
});

export const entriesTable = sqliteTable("entries", {
  id: int().primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categoriesTable.id),
  type: text({ enum: ["expense", "income"] }).notNull(), // e.g., "expense" or "income"
  amount: int().notNull(),
  posted_at: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export type User = typeof usersTable.$inferSelect;
export type Category = typeof categoriesTable.$inferSelect;
export type Entry = typeof entriesTable.$inferSelect;
