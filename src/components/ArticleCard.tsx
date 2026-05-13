import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types/article';
import { categories } from '@/types/article';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const categoryLabel = categories.find(c => c.key === article.category)?.label || article.category;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48 md:h-56">
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-primary-500 text-white px-3 py-1 text-xs font-medium rounded-full">
            {categoryLabel}
          </span>
        </div>
      </div>
      <div className="p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
          <Link href={`/article/${article.slug}`} className="hover:text-primary-500 transition-colors">
            {article.title}
          </Link>
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {article.summary}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-sm">{article.publishedAt}</span>
          <span className="text-gray-400 text-sm">By {article.author}</span>
        </div>
      </div>
    </div>
  );
}
