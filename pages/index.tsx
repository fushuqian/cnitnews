import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import ArticleCard from '@/components/ArticleCard';
import Footer from '@/components/Footer';
import { articles } from '@/data/articles';
import { Article, categories } from '@/types/article';

interface Props {
  allArticles: Article[];
}

export default function Home({ allArticles }: Props) {
  const router = useRouter();
  const category = (router.query.category as string) || 'all';

  const filtered = category === 'all' 
    ? allArticles 
    : allArticles.filter(a => a.category === category);

  const currentCategoryLabel = category === 'all' 
    ? 'All News' 
    : categories.find(c => c.key === category)?.label || 'All News';

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>CN Geeker - Latest Chinese Technology News in English</title>
        <meta name="description" content="Your geeky guide to the latest Chinese technology news: AI, chips, EVs, apps, and gadgets." />
      </Head>
      <Navbar currentCategory={category} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            {currentCategoryLabel}
          </h1>
          <p className="text-gray-500">
            Latest technology news from China
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No articles found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export async function getStaticProps() {
  const sorted = [...articles].sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return {
    props: {
      allArticles: sorted,
    },
  };
}
