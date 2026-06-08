import { GoogleGenAI, type GenerateContentResponse } from "@google/genai";
import { db, news } from "@daily-good-news/db";
import type { NewsInsert } from "@daily-good-news/db";

// ── NewsAPI types ─────────────────────────────────────────────────────────────

interface NewsApiSource {
  id: string | null;
  name: string;
}

interface NewsApiArticle {
  source: NewsApiSource;
  title: string | null;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
}

interface NewsApiResponse {
  status: string;
  message?: string;
  articles: NewsApiArticle[];
}

// ── Google GenAI types ────────────────────────────────────────────────────────

interface ArticleScore {
  id: number;
  score: number;
}

interface BatchEvaluationResponse {
  noticias: ArticleScore[];
}

// ── Domain ────────────────────────────────────────────────────────────────────

export interface NormalizedArticle {
  title: string;
  description: string;
  url: string;
  imageUrl: string | null;
  publishedAt: Date;
}

const GEMINI_MODEL = "gemini-3.5-flash";

export class NewsService {
  private readonly genAi: GoogleGenAI;

  constructor(
    private readonly newsApiKey: string,
    genAiApiKey: string,
  ) {
    this.genAi = new GoogleGenAI({ apiKey: genAiApiKey });
  }

  async fetchArticles(): Promise<NormalizedArticle[]> {
    const url = `https://newsapi.org/v2/top-headlines?pageSize=100&apiKey=${this.newsApiKey}&language=en`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`NewsAPI error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as NewsApiResponse;
    if (data.status !== "ok") {
      throw new Error(`NewsAPI returned error status: ${data.message ?? "unknown"}`);
    }

    return data.articles.flatMap((article): NormalizedArticle[] => {
      if (!article.title || !article.description) return [];
      return [
        {
          title: article.title,
          description: article.description,
          url: article.url,
          imageUrl: article.urlToImage,
          publishedAt: new Date(article.publishedAt),
        },
      ];
    });
  }

  private async generateWithRetry(prompt: string, retries = 3, delay = 2000): Promise<GenerateContentResponse> {
    try {
      return await this.genAi.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: { temperature: 0 },
      });
    } catch (error) {
      const status = (error as { status?: number }).status;
      if ((status === 503 || status === 429) && retries > 0) {
        console.warn(`GenAI unavailable (${status}). Retrying in ${delay / 1000}s... (${retries} left)`);
        await new Promise<void>((resolve) => setTimeout(resolve, delay));
        return this.generateWithRetry(prompt, retries - 1, delay * 2);
      }
      throw error;
    }
  }

  async evaluateBatch(articles: NormalizedArticle[]): Promise<Map<number, number>> {
    if (articles.length === 0) return new Map();

    const articlesList = articles
      .map((a, i) => `[ID: ${i + 1}] Title: ${a.title}\nDescription: ${a.description}`)
      .join("\n\n");

    const prompt =
      `ROLE: You are an expert psychological sentiment analyzer curating content for a "Good News" aggregator.\n\n` +
      `OBJECTIVE: Evaluate the positivity of EACH news article below on a scale from 0 to 10.\n\n` +
      `DEFINITION OF POSITIVITY:\n` +
      `"Positivity" strictly measures how much this news will make a human reader feel genuinely happy, excited, hopeful, or glad.\n\n` +
      `SCORING RUBRIC:\n` +
      `0-3: Negative (tragic, anxiety-inducing, political drama, or depressing).\n` +
      `4-6: Neutral (purely informational, mundane, or "not bad" but not actively making someone happy).\n` +
      `7-8: Positive (heartwarming, inspiring, exciting local/personal news, or acts of kindness).\n` +
      `9-10: Extremely Positive (extraordinary scientific breakthroughs, massive positive global impact, or incredibly uplifting stories).\n\n` +
      `STRICT OUTPUT RULE:\n` +
      `Return a JSON in the format: { "noticias": [{ "id": 1, "score": 8 }, { "id": 2, "score": 4 }] }\n` +
      `Do not include any explanation, markdown formatting, or code fences. Only raw JSON.\n\n` +
      `ARTICLES:\n${articlesList}`;

    try {
      const response = await this.generateWithRetry(prompt);

      const rawText = (response.text ?? "").trim();
      // Strip markdown code fences if the model wraps the JSON
      const jsonText = rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");

      const parsed = JSON.parse(jsonText) as BatchEvaluationResponse;

      const scores = new Map<number, number>();
      for (const entry of parsed.noticias) {
        if (
          typeof entry.id === "number" &&
          typeof entry.score === "number" &&
          entry.score >= 0 &&
          entry.score <= 10
        ) {
          scores.set(entry.id, entry.score);
        }
      }
      return scores;
    } catch (error) {
      console.error("GenAI batch evaluation failed:", error);
      return new Map();
    }
  }

  async ingestNews(): Promise<void> {
    const articles = await this.fetchArticles();
    console.log(`Fetched ${articles.length} articles from NewsAPI.`);

    if (articles.length === 0) return;

    const scores = await this.evaluateBatch(articles);

    const approved: NewsInsert[] = articles.flatMap((article, i) => {
      const score = scores.get(i + 1) ?? 0;
      if (score < 7) return [];
      return [{ ...article, score }];
    });

    console.log(`${approved.length} articles approved (score >= 7).`);

    if (approved.length === 0) return;

    await db.insert(news).values(approved).onConflictDoNothing();
    console.log(`Inserted ${approved.length} articles into the database.`);
  }
}
