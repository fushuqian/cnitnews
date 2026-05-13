import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { articles, getArticleBySlug, getRelatedArticles } from '@/data/articles';
import { Article, categories } from '@/types/article';

interface Props {
  article: Article | null;
  relatedArticles: Article[];
}

export default function ArticlePage({ article, relatedArticles }: Props) {
  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Article not found</h1>
            <Link href="/" className="text-primary-500 hover:underline">
              Return to homepage
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const categoryLabel = categories.find(c => c.key === article.category)?.label || article.category;

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{article.title} - CN Geeker</title>
        <meta name="description" content={article.summary} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.summary} />
        <meta property="og:image" content={article.imageUrl} />
      </Head>
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article>
          <div className="mb-6">
            <span className="bg-primary-500 text-white px-3 py-1 text-sm font-medium rounded-full">
              {categoryLabel}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mb-8 text-gray-500">
            <span>{article.publishedAt}</span>
            <span>By {article.author}</span>
          </div>

          <div className="relative h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="article-content text-gray-700">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {article.content}
            </ReactMarkdown>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-600 px-3 py-1 text-sm rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </article>

        {relatedArticles.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <div
                  key={relatedArticle.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-32">
                    <Image
                      src={relatedArticle.imageUrl}
                      alt={relatedArticle.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                      <Link
                        href={`/article/${relatedArticle.slug}`}
                        className="hover:text-primary-500 transition-colors"
                      >
                        {relatedArticle.title}
                      </Link>
                    </h3>
                    <p className="text-gray-500 text-sm">{relatedArticle.publishedAt}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

export async function getStaticPaths() {
  const paths = articles.map((article) => ({
    params: { slug: article.slug },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug) || null;
  const relatedArticles = article ? getRelatedArticles(article.category, article.id) : [];

  return {
    props: {
      article,
      relatedArticles,
    },
  };
}
