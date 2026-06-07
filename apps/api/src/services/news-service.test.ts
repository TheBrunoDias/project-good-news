import { describe, it, expect, vi, beforeEach } from "vitest";
import { NewsService } from "./news-service.js";
import type { NormalizedArticle } from "./news-service.js";

// ── DB mock ───────────────────────────────────────────────────────────────────

const { mockOnConflictDoNothing, mockValues, mockInsert } = vi.hoisted(() => {
  const mockOnConflictDoNothing = vi.fn().mockResolvedValue([]);
  const mockValues = vi.fn().mockReturnValue({ onConflictDoNothing: mockOnConflictDoNothing });
  const mockInsert = vi.fn().mockReturnValue({ values: mockValues });
  return { mockOnConflictDoNothing, mockValues, mockInsert };
});

vi.mock("@daily-good-news/db", () => ({
  db: { insert: mockInsert },
  news: {},
}));

// ── Google GenAI mock ─────────────────────────────────────────────────────────

const { mockGenerateContent, MockGoogleGenAI } = vi.hoisted(() => {
  const mockGenerateContent = vi.fn();
  const MockGoogleGenAI = vi.fn().mockImplementation(function () {
    return { models: { generateContent: mockGenerateContent } };
  });
  return { mockGenerateContent, MockGoogleGenAI };
});

vi.mock("@google/genai", () => ({
  GoogleGenAI: MockGoogleGenAI,
}));

// ── helpers ───────────────────────────────────────────────────────────────────

function makeNewsApiResponse(articles: object[]) {
  return { status: "ok", totalResults: articles.length, articles };
}

function makeSourcesResponse(sources: Array<{ id: string; name: string }>) {
  return { status: "ok", sources };
}

function makeFetchResponse(response: object, ok = true) {
  return {
    ok,
    status: ok ? 200 : 500,
    statusText: ok ? "OK" : "Internal Server Error",
    json: () => Promise.resolve(response),
  };
}

function mockFetch(response: object, ok = true) {
  return vi.fn().mockResolvedValue(makeFetchResponse(response, ok));
}

function mockFetchSequence(...responses: Array<[object, boolean?]>) {
  const mock = vi.fn();
  for (const [response, ok = true] of responses) {
    mock.mockResolvedValueOnce(makeFetchResponse(response, ok));
  }
  return mock;
}

const validSources = [
  { id: "bbc-news", name: "BBC News" },
  { id: "cnn", name: "CNN" },
];

function makeBatchResponse(scores: Array<{ id: number; score: number }>) {
  return { text: JSON.stringify({ noticias: scores }) };
}

const validArticle = {
  source: { id: null, name: "BBC" },
  title: "Scientists discover cure for common cold",
  description: "A major breakthrough brings hope to millions worldwide.",
  url: "https://bbc.com/article-1",
  urlToImage: "https://bbc.com/image.jpg",
  publishedAt: "2026-06-03T10:00:00Z",
};

const normalizedArticle: NormalizedArticle = {
  title: validArticle.title,
  description: validArticle.description,
  url: validArticle.url,
  imageUrl: validArticle.urlToImage,
  publishedAt: new Date(validArticle.publishedAt),
};

// ── tests ─────────────────────────────────────────────────────────────────────

describe("NewsService", () => {
  let service: NewsService;

  beforeEach(() => {
    vi.resetAllMocks();

    MockGoogleGenAI.mockImplementation(function () {
      return { models: { generateContent: mockGenerateContent } };
    });

    mockValues.mockReturnValue({ onConflictDoNothing: mockOnConflictDoNothing });
    mockInsert.mockReturnValue({ values: mockValues });
    mockOnConflictDoNothing.mockResolvedValue([]);

    service = new NewsService("test-news-key", "test-genai-key");
  });

  // ── fetchArticles ─────────────────────────────────────────────────────────

  describe("fetchArticles", () => {
    it("normaliza artigos da NewsAPI para o formato interno", async () => {
      vi.stubGlobal(
        "fetch",
        mockFetchSequence(
          [makeSourcesResponse(validSources)],
          [makeNewsApiResponse([validArticle])],
        ),
      );

      const articles = await service.fetchArticles();

      expect(articles).toHaveLength(1);
      expect(articles[0]).toMatchObject({
        title: validArticle.title,
        description: validArticle.description,
        url: validArticle.url,
        imageUrl: validArticle.urlToImage,
      });
      expect(articles[0]?.publishedAt).toBeInstanceOf(Date);
    });

    it("envia as fontes como query param sources no endpoint everything", async () => {
      const fetchMock = mockFetchSequence(
        [makeSourcesResponse(validSources)],
        [makeNewsApiResponse([validArticle])],
      );
      vi.stubGlobal("fetch", fetchMock);

      await service.fetchArticles();

      const articlesUrl = fetchMock.mock.calls[1]?.[0] as string;
      expect(articlesUrl).toContain("/v2/everything");
      expect(articlesUrl).toContain("sources=bbc-news,cnn");
    });

    it("filtra artigos sem título ou descrição", async () => {
      const withoutTitle = { ...validArticle, title: null };
      const withoutDescription = { ...validArticle, url: "https://bbc.com/article-2", description: null };

      vi.stubGlobal(
        "fetch",
        mockFetchSequence(
          [makeSourcesResponse(validSources)],
          [makeNewsApiResponse([withoutTitle, withoutDescription, validArticle])],
        ),
      );

      const articles = await service.fetchArticles();

      expect(articles).toHaveLength(1);
      expect(articles[0]?.url).toBe(validArticle.url);
    });

    it("lança erro quando a chamada de sources falha com erro HTTP", async () => {
      vi.stubGlobal("fetch", mockFetch({}, false));

      await expect(service.fetchArticles()).rejects.toThrow("NewsAPI sources error: 500");
    });

    it("lança erro quando a chamada de artigos falha com erro HTTP", async () => {
      vi.stubGlobal(
        "fetch",
        mockFetchSequence(
          [makeSourcesResponse(validSources)],
          [{}, false],
        ),
      );

      await expect(service.fetchArticles()).rejects.toThrow("NewsAPI error: 500");
    });

    it("lança erro quando o payload de artigos retorna status != ok", async () => {
      vi.stubGlobal(
        "fetch",
        mockFetchSequence(
          [makeSourcesResponse(validSources)],
          [{ status: "error", message: "apiKeyInvalid" }],
        ),
      );

      await expect(service.fetchArticles()).rejects.toThrow("apiKeyInvalid");
    });
  });

  // ── evaluateBatch ─────────────────────────────────────────────────────────

  describe("evaluateBatch", () => {
    it("retorna Map com scores corretos a partir de JSON válido", async () => {
      mockGenerateContent.mockResolvedValue(
        makeBatchResponse([{ id: 1, score: 8 }, { id: 2, score: 3 }]),
      );

      const scores = await service.evaluateBatch([normalizedArticle, normalizedArticle]);

      expect(scores.get(1)).toBe(8);
      expect(scores.get(2)).toBe(3);
    });

    it("remove code fences markdown antes de parsear o JSON", async () => {
      const json = JSON.stringify({ noticias: [{ id: 1, score: 9 }] });
      mockGenerateContent.mockResolvedValue({ text: `\`\`\`json\n${json}\n\`\`\`` });

      const scores = await service.evaluateBatch([normalizedArticle]);

      expect(scores.get(1)).toBe(9);
    });

    it("retorna Map vazia quando o SDK lança exceção (graceful degradation)", async () => {
      mockGenerateContent.mockRejectedValue(new Error("API quota exceeded"));

      const scores = await service.evaluateBatch([normalizedArticle]);

      expect(scores.size).toBe(0);
    });

    it("retorna Map vazia quando a resposta não é JSON válido", async () => {
      mockGenerateContent.mockResolvedValue({ text: "desculpe, não consigo avaliar" });

      const scores = await service.evaluateBatch([normalizedArticle]);

      expect(scores.size).toBe(0);
    });

    it("ignora entradas com score fora do intervalo 0-10", async () => {
      mockGenerateContent.mockResolvedValue(
        makeBatchResponse([{ id: 1, score: 42 }, { id: 2, score: 7 }]),
      );

      const scores = await service.evaluateBatch([normalizedArticle, normalizedArticle]);

      expect(scores.has(1)).toBe(false);
      expect(scores.get(2)).toBe(7);
    });

    it("retorna Map vazia quando chamado com array vazio", async () => {
      const scores = await service.evaluateBatch([]);

      expect(scores.size).toBe(0);
      expect(mockGenerateContent).not.toHaveBeenCalled();
    });

    it("envia o prompt com IDs e conteúdo de cada artigo", async () => {
      mockGenerateContent.mockResolvedValue(
        makeBatchResponse([{ id: 1, score: 8 }, { id: 2, score: 5 }]),
      );

      const articles: NormalizedArticle[] = [
        { ...normalizedArticle, title: "First Article", url: "https://a.com/1" },
        { ...normalizedArticle, title: "Second Article", url: "https://a.com/2" },
      ];

      await service.evaluateBatch(articles);

      expect(mockGenerateContent).toHaveBeenCalledWith(
        expect.objectContaining({
          model: "gemini-3.5-flash",
          contents: expect.stringContaining("[ID: 1] Title: First Article"),
        }),
      );
      expect(mockGenerateContent).toHaveBeenCalledWith(
        expect.objectContaining({
          contents: expect.stringContaining("[ID: 2] Title: Second Article"),
        }),
      );
    });
  });

  // ── ingestNews ────────────────────────────────────────────────────────────

  describe("ingestNews", () => {
    it("insere apenas artigos com score >= 7 no banco de dados", async () => {
      vi.spyOn(service, "fetchArticles").mockResolvedValue([
        { ...normalizedArticle, url: "https://bbc.com/a1", title: "Great news" },
        { ...normalizedArticle, url: "https://bbc.com/a2", title: "Terrible news" },
        { ...normalizedArticle, url: "https://bbc.com/a3", title: "Amazing news" },
      ]);
      // IDs 1-based: a1=8 (aprovado), a2=5 (rejeitado), a3=9 (aprovado)
      vi.spyOn(service, "evaluateBatch").mockResolvedValue(
        new Map([[1, 8], [2, 5], [3, 9]]),
      );

      await service.ingestNews();

      expect(mockInsert).toHaveBeenCalledTimes(1);
      const inserted = mockValues.mock.calls[0]?.[0] as Array<{ url: string }>;
      expect(inserted).toHaveLength(2);
      expect(inserted.map((v) => v.url)).toEqual([
        "https://bbc.com/a1",
        "https://bbc.com/a3",
      ]);
    });

    it("chama onConflictDoNothing para garantir idempotência (duplicatas ignoradas)", async () => {
      vi.spyOn(service, "fetchArticles").mockResolvedValue([normalizedArticle]);
      vi.spyOn(service, "evaluateBatch").mockResolvedValue(new Map([[1, 10]]));

      await service.ingestNews();

      expect(mockOnConflictDoNothing).toHaveBeenCalledTimes(1);
    });

    it("não chama o banco quando nenhum artigo atinge score >= 7", async () => {
      vi.spyOn(service, "fetchArticles").mockResolvedValue([normalizedArticle]);
      vi.spyOn(service, "evaluateBatch").mockResolvedValue(new Map([[1, 4]]));

      await service.ingestNews();

      expect(mockInsert).not.toHaveBeenCalled();
    });

    it("trata artigo sem ID na resposta como score 0 (rejeitado)", async () => {
      vi.spyOn(service, "fetchArticles").mockResolvedValue([normalizedArticle]);
      // evaluateBatch retorna Map vazia — artigo perdido na resposta da IA
      vi.spyOn(service, "evaluateBatch").mockResolvedValue(new Map());

      await service.ingestNews();

      expect(mockInsert).not.toHaveBeenCalled();
    });

    it("não chama evaluateBatch quando não há artigos", async () => {
      vi.spyOn(service, "fetchArticles").mockResolvedValue([]);
      const batchSpy = vi.spyOn(service, "evaluateBatch");

      await service.ingestNews();

      expect(batchSpy).not.toHaveBeenCalled();
      expect(mockInsert).not.toHaveBeenCalled();
    });
  });
});
