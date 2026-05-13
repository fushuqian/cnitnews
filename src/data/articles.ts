import { Article } from '@/types/article';

export const articles: Article[] = [
  {
    id: '1',
    title: 'China AI Companies Lead Global Innovation in Large Language Models',
    slug: 'china-ai-companies-lead-global-llm-innovation',
    summary: 'Chinese artificial intelligence firms are pushing the boundaries of LLM technology, with breakthroughs in efficiency, multilingual support, and deployment speed.',
    content: `## China's AI Revolution

Chinese artificial intelligence companies are making significant strides in the development of large language models (LLMs). Companies like ByteDance, Alibaba, and Baidu have released their own AI models that compete with international counterparts.

### Key Innovations

1. **Efficiency**: Chinese LLMs are optimized for deployment on consumer hardware
2. **Multilingual Support**: Native support for Chinese, English, and other Asian languages
3. **Real-time Learning**: Advanced algorithms for continuous model improvement

### Market Impact

The rapid development of AI technology in China is creating new opportunities across various industries, from finance to healthcare and education.`,
    category: 'ai',
    tags: ['AI', 'LLM', 'Technology'],
    author: 'Tech Reporter',
    publishedAt: '2024-01-15',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-17141602294d?w=800',
  },
  {
    id: '2',
    title: 'SMIC Achieves Breakthrough in 7nm Chip Manufacturing',
    slug: 'smic-achieves-7nm-chip-breakthrough',
    summary: 'Semiconductor Manufacturing International Corporation (SMIC) successfully mass-produces 7nm chips, reducing China\'s reliance on foreign technology.',
    content: `## SMIC's 7nm Milestone

Semiconductor Manufacturing International Corporation (SMIC) has announced successful mass production of 7nm chips, marking a significant step forward in China's semiconductor industry.

### Technical Details

- **Process Node**: 7nm FinFET
- **Production Yield**: Over 95%
- **Applications**: AI accelerators, mobile processors

### Strategic Implications

This achievement reduces China's dependence on international chip manufacturers and strengthens national security in the tech sector.`,
    category: 'chip',
    tags: ['Semiconductor', 'SMIC', '7nm'],
    author: 'Industry Analyst',
    publishedAt: '2024-01-14',
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
  },
  {
    id: '3',
    title: 'BYD Surpasses Tesla as World\'s Largest EV Maker',
    slug: 'byd-surpasses-tesla-ev-market',
    summary: 'Chinese electric vehicle manufacturer BYD becomes the world\'s top EV producer, driven by strong domestic demand and expanding international presence.',
    content: `## BYD Takes the Lead

BYD (Build Your Dreams) has officially overtaken Tesla as the world's largest electric vehicle manufacturer in terms of annual sales.

### Sales Figures

- **2023 Sales**: 3.02 million vehicles
- **Market Share**: 18% global EV market
- **Growth Rate**: 63% year-over-year

### Global Expansion

BYD is rapidly expanding into European and Southeast Asian markets, challenging traditional automakers and Tesla alike.`,
    category: 'ev',
    tags: ['EV', 'BYD', 'Tesla', 'Automotive'],
    author: 'Auto Correspondent',
    publishedAt: '2024-01-13',
    imageUrl: 'https://images.unsplash.com/photo-1502945015378-0e284ca1a5be?w=800',
  },
  {
    id: '4',
    title: 'Douyin (TikTok) Expands E-commerce Features Globally',
    slug: 'douyin-tiktok-expands-ecommerce',
    summary: 'ByteDance enhances its social commerce capabilities on TikTok, integrating live shopping and AI-powered recommendations worldwide.',
    content: `## TikTok's E-commerce Push

ByteDance is expanding TikTok's e-commerce features globally, aiming to capture a larger share of the social commerce market.

### New Features

- **Live Shopping**: Real-time product demonstrations
- **AI Recommendations**: Personalized shopping suggestions
- **Integrated Checkout**: Seamless purchasing experience

### Market Potential

Analysts predict TikTok could generate over $20 billion in e-commerce revenue by 2025.`,
    category: 'internet',
    tags: ['TikTok', 'E-commerce', 'Social Media'],
    author: 'Digital Trends',
    publishedAt: '2024-01-12',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
  },
  {
    id: '5',
    title: 'Chinese Tech Giants Accelerate Global Expansion Strategies',
    slug: 'chinese-tech-giants-global-expansion',
    summary: 'Alibaba, Tencent, and JD.com are aggressively expanding into emerging markets, challenging Western tech dominance in Southeast Asia and beyond.',
    content: `## Going Global

Chinese technology companies are accelerating their international expansion efforts, targeting markets in Southeast Asia, the Middle East, and Latin America.

### Expansion Highlights

- **Alibaba**: Strengthening presence in Southeast Asian e-commerce
- **Tencent**: Gaming and social media expansion in emerging markets
- **JD.com**: Logistics and supply chain services globally

### Competitive Landscape

This expansion is reshaping the global tech industry and creating new opportunities for cross-border collaboration.`,
    category: 'overseas',
    tags: ['Global', 'Expansion', 'Tech Giants'],
    author: 'International Business',
    publishedAt: '2024-01-11',
    imageUrl: 'https://images.unsplash.com/photo-1535224206242-487f7090b5bb?w=800',
  },
  {
    id: '6',
    title: 'AI Chip Startup Cambricon Raises $2B in Latest Funding Round',
    slug: 'cambricon-raises-2b-funding',
    summary: 'Chinese AI chipmaker Cambricon secures significant funding to accelerate development of next-generation neural processing units.',
    content: `## Cambricon's Funding Success

Cambricon Technologies, a leading AI chip startup, has raised $2 billion in its latest Series D funding round.

### Investment Details

- **Valuation**: $10 billion
- **Investors**: Major tech companies and sovereign funds
- **Use of Funds**: R&D and production scaling

### Future Plans

The company plans to release its next-generation AI chip with improved performance and energy efficiency.`,
    category: 'chip',
    tags: ['AI Chip', 'Cambricon', 'Funding'],
    author: 'Venture Capital',
    publishedAt: '2024-01-10',
    imageUrl: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800',
  },
];

export const getArticles = (category?: string): Article[] => {
  if (!category || category === 'all') {
    return articles;
  }
  return articles.filter(article => article.category === category);
};

export const getArticleBySlug = (slug: string): Article | undefined => {
  return articles.find(article => article.slug === slug);
};

export const getRelatedArticles = (category: string, excludeId: string): Article[] => {
  return articles.filter(article => article.category === category && article.id !== excludeId).slice(0, 3);
};
