import { describe, it, expect } from "vitest";
import { getTableColumns } from "drizzle-orm";
import { news } from "./schema.js";

describe("news schema", () => {
  const columns = getTableColumns(news);

  it("define todas as colunas obrigatórias", () => {
    expect(columns).toHaveProperty("id");
    expect(columns).toHaveProperty("title");
    expect(columns).toHaveProperty("description");
    expect(columns).toHaveProperty("url");
    expect(columns).toHaveProperty("imageUrl");
    expect(columns).toHaveProperty("score");
    expect(columns).toHaveProperty("publishedAt");
    expect(columns).toHaveProperty("createdAt");
  });

  it("url possui constraint UNIQUE", () => {
    expect(columns.url.isUnique).toBe(true);
  });

  it("imageUrl é nullable (sem notNull)", () => {
    expect(columns.imageUrl.notNull).toBe(false);
  });

  it("campos obrigatórios possuem notNull", () => {
    expect(columns.title.notNull).toBe(true);
    expect(columns.description.notNull).toBe(true);
    expect(columns.url.notNull).toBe(true);
    expect(columns.score.notNull).toBe(true);
    expect(columns.publishedAt.notNull).toBe(true);
    expect(columns.createdAt.notNull).toBe(true);
  });

  it("id utiliza o tipo uuid", () => {
    expect(columns.id.columnType).toBe("PgUUID");
  });

  it("score utiliza o tipo integer", () => {
    expect(columns.score.columnType).toBe("PgInteger");
  });

  it("publishedAt e createdAt utilizam timestamp (modo Date JS)", () => {
    expect(columns.publishedAt.columnType).toBe("PgTimestamp");
    expect(columns.createdAt.columnType).toBe("PgTimestamp");
  });
});
