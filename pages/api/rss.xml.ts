// RSS Feed at /api/rss.xml
import type { NextApiRequest, NextApiResponse } from 'next';

const SITE_URL = 'https://cngeeker.com';
const SITE_NAME = 'CN Geeker';

function esc(s: string): string {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const mod = await import('../../src/data/articles');
    const typeMod = await import('../../src/types/article');
    
    const articles: any[] = mod.articles || [];
    const categories: any[] = typeMod.categories || [];
    
    const sorted = [...articles].sort(
      (a: any, b: any) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    let items = '';
    for (const a of sorted) {
      const cat = categories.find((c: any) => c.key === a.category)?.label || a.category;
      items += `
    <item>
      <title>${esc(a.title)}</title>
      <link>${SITE_URL}/article/${a.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/article/${a.slug}</guid>
      <description>${esc(a.summary)}</description>
      <category>${esc(cat)}</category>
      <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
      <author>${esc(a.author)}</author>
    </item>`;
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>Your geeky guide to the latest Chinese technology news.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/api/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

    res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
    res.status(200).send(xml);
  } catch (err: any) {
    res.status(500).send('Error: ' + (err.message || 'unknown'));
  }
}
