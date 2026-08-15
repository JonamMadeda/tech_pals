import { NextResponse } from "next/server";
import RssParser from "rss-parser";

const parser = new RssParser({ timeout: 10000 });

type Article = { title: string; link: string; snippet: string; pubDate: string; source: string };

const FEEDS: { url: string; source: string }[] = [
  { url: "https://techcrunch.com/category/artificial-intelligence/feed/", source: "TechCrunch" },
  { url: "https://www.technologyreview.com/feed/", source: "MIT Tech Review" },
  { url: "https://blog.google/technology/ai/rss/", source: "Google AI Blog" },
  { url: "https://openai.com/blog/rss.xml", source: "OpenAI" },
];

export const dynamic = "force-dynamic";

async function fetchFeed(feed: { url: string; source: string }): Promise<Article[]> {
  const data = await parser.parseURL(feed.url);
  return (data.items ?? []).map((item) => ({
    title: item.title ?? "Untitled",
    link: item.link ?? "#",
    snippet: item.contentSnippet ?? item.content ?? "",
    pubDate: item.pubDate ?? item.isoDate ?? "",
    source: feed.source,
  }));
}

export async function GET() {
  const results = await Promise.allSettled(FEEDS.map((feed) => fetchFeed(feed)));

  const articles = results
    .filter((r): r is PromiseFulfilledResult<Article[]> => r.status === "fulfilled")
    .flatMap((r) => r.value)
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .slice(0, 30);

  return NextResponse.json({ articles });
}
