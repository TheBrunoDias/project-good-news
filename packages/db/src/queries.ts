import { desc } from "drizzle-orm";
import { db } from "./client.js";
import { news } from "./schema.js";
import type { NewsSelect } from "./schema.js";

export async function getLatestNews(limit = 50): Promise<NewsSelect[]> {
  return db.select().from(news).orderBy(desc(news.publishedAt)).limit(limit);
}
