import { Resource } from "sst";
import type { Handler } from "aws-lambda";
import { NewsService } from "./services/news-service.js";

const service = new NewsService(
  Resource.NewsApiKey.value,
  Resource.GeminiApiKey.value,
);

export const handler: Handler = async () => {
  await service.ingestNews();
};
