import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { desc, count } from "drizzle-orm";
import { news } from "@daily-good-news/db/schema";
import type { NewsSelect } from "@daily-good-news/db";

if (!process.env.DATABASE_URL) {
  throw new Error("Missing required env var: DATABASE_URL");
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

export async function getLatestNews(limit = 50, offset = 0): Promise<NewsSelect[]> {
  return db.select().from(news).orderBy(desc(news.publishedAt)).limit(limit).offset(offset);
}

export async function getNewsCount(): Promise<number> {
  const [row] = await db.select({ value: count() }).from(news);
  return row?.value ?? 0;
}
