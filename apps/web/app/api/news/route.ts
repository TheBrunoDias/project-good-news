import { type NextRequest, NextResponse } from "next/server";
import { getLatestNews, getNewsCount } from "@/lib/db";

const PAGE_SIZE = 15;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));

  if (isNaN(page)) {
    return NextResponse.json({ error: "Invalid page parameter" }, { status: 400 });
  }

  const [articles, total] = await Promise.all([
    getLatestNews(PAGE_SIZE, (page - 1) * PAGE_SIZE),
    getNewsCount(),
  ]);

  return NextResponse.json({
    articles,
    pagination: {
      page,
      pageSize: PAGE_SIZE,
      total,
      totalPages: Math.ceil(total / PAGE_SIZE),
      hasNextPage: page * PAGE_SIZE < total,
      hasPreviousPage: page > 1,
    },
  });
}
