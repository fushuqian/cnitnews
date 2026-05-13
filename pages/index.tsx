import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import ArticleCard from '@/components/ArticleCard';
import Footer from '@/components/Footer';
import { getArticles } from '@/data/articles';
import { categories } from '@/types/article';

export default function Home() {
  const router = useRouter();
  const category = router.query.category as string || 'all';
  const articles = getArticles(category);

  const currentCategoryLabel = category === 'all' 
    ? 'All News' 
    : categories.find(c => c.key === category)?.label || 'All News';

  return (
    <div className="min-h-screen bg-gray-50">
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

        {articles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No articles found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
