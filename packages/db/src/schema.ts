import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

export const news = pgTable("news", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  url: text("url").notNull().unique(),
  imageUrl: text("image_url"),
  score: integer("score").notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type NewsSelect = InferSelectModel<typeof news>;
export type NewsInsert = InferInsertModel<typeof news>;
