import Fastify from "fastify";
import { Resource } from "sst";
import { NewsService } from "./services/news-service.js";

const service = new NewsService(Resource.NewsApiKey.value, Resource.GeminiApiKey.value);

const app = Fastify({ logger: true });

app.get("/health", async () => {
  return { status: "ok" };
});

app.post("/ingest", async (_request, reply) => {
  try {
    await service.ingestNews();
    return reply.send({ success: true, message: "Ingestion completed" });
  } catch (error) {
    app.log.error(error);
    return reply.code(500).send({ success: false, message: "Ingestion failed" });
  }
});

await app.listen({ port: 3333, host: "0.0.0.0" });
