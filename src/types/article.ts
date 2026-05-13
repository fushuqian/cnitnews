export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  imageUrl: string;
}

export type Category = 'ai' | 'chip' | 'ev' | 'internet' | 'overseas';

export const categories: { key: Category; label: string }[] = [
  { key: 'ai', label: 'AI' },
  { key: 'chip', label: 'Semiconductor' },
  { key: 'ev', label: 'EV' },
  { key: 'internet', label: 'Internet' },
  { key: 'overseas', label: 'Global Expansion' },
];
