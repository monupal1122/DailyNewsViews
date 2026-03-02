import { Link } from "react-router-dom";
import { Clock, Eye, User, ArrowRight, Calendar } from "lucide-react";
import { formatDate } from "@/lib/types";
import { CategoryBadge } from "./CategoryBadge";
import { getFullImageUrl } from "@/lib/utils";

export function calculateReadingTime(content) {
  const wordsPerMinute = 200;

  if (!content) return 0;

  const text = content.replace(/<[^>]*>/g, "");
  const wordCount = text.trim().split(/\s+/).length;

  return Math.ceil(wordCount / wordsPerMinute);
}

export function NewsCard({ article, variant = "default" }) {
  const readingTime = calculateReadingTime(article.content);
  const categorySlug =
    typeof article.category === "object"
      ? article.category.slug
      : "uncategorized";
  const subcategorySlug =
    article.subcategories &&
      article.subcategories.length > 0 &&
      typeof article.subcategories[0] === "object"
      ? article.subcategories[0].slug
      : "general";

  const authorName =
    typeof article.author === "object"
      ? article.author.name
      : article.author || "Editorial Team";

  const imageSrc =
    getFullImageUrl(article.featuredImage) ||
    getFullImageUrl(article.imageUrl) ||
    "https://images.unsplash.com/photo-1504711432869-efd597cdd04b?q=80&w=1000&auto=format&fit=crop";
  const excerpt = article.summary || article.description;
  let totalview = article.viewCount;
  const articleLink =
    article.slug && article.publicId
      ? `/${categorySlug}/${subcategorySlug}/${article.slug}-${article.publicId}`
      : `/articles/${article._id}`;
  function TruncatedSummary({ text, articleLink }) {
    if (!text) return null;

    const words = text.trim().split(/\s+/);
    const isLong = words.length > 12;
    const displayText = isLong ? words.slice(0, 18).join(' ') : text;

    return (
      <p className="text-zinc-600 text-[15px] leading-relaxed font-sans">
        {displayText}
        {isLong && (
          <>
            {'... '}
            <Link to={articleLink} className="inline text-red-600 font-semibold hover:underline whitespace-nowrap">
              read more
            </Link>
          </>
        )}
      </p>
    );
  }

  if (variant === "featured") {
    return (
      <Link
        to={articleLink}
        className="group block h-full bg-white hover:bg-zinc-100 hover:shadow-lg transition-all cursor-pointer duration-300 border border-zinc-100 rounded-xl overflow-hidden"
      >
        <div className="flex flex-col lg:flex-row h-full">
          {/* Image Side */}
          <div className="lg:w-7/12 lg:h-auto relative aspect-[16/9] lg:aspect-auto overflow-hidden rounded-xl m-2 lg:m-3">
            <img
              src={imageSrc}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          {/* Content Side */}
          <div className="lg:w-5/12 p-6 sm:p-2 lg:p-5 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2 md:mb-4">
              <CategoryBadge category={article.category} />
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                {formatDate(article.publishedAt || article.createdAt)}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-4xl font-serif font-bold text-zinc-900 leading-[1.2] mb-3 md:mb-6 group-hover:text-primary transition-colors line-clamp-3">
              {article.title}
            </h2>

            <p className="text-zinc-600 text-sm sm:text-base lg:text-lg leading-relaxed line-clamp-2 lg:line-clamp-5 font-sans mb-3 md:mb-6">
              {excerpt}
            </p>
            <p className="hidden lg:block text-zinc-500 text-md mb-6 font-medium">
              Published on:{" "}
              {new Date(
                article.publishedAt || article.createdAt,
              ).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </p>
            <div className="mt-auto flex items-center gap-3 text-sm font-bold text-zinc-900 uppercase tracking-widest group-hover:gap-4 transition-all">
              Read Full Story <ArrowRight className="w-4 h-4 text-red-600" />
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "horizontal") {
    return (
      <Link
        to={articleLink}
        className="group flex gap-4 p-3 hover:bg-zinc-50 hover:shadow-sm transition-all duration-300 last:border-0 relative bg-white rounded-2xl"
      >
        <div className="flex-shrink-0 w-33 h-24 md:w-44 md:h-28 overflow-hidden relative bg-zinc-100 rounded-xl shadow-sm font-2xl">
          <img
            src={imageSrc}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 rounded-xl"
          />
        </div>
        <div className="flex flex-col justify-center min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-1 h-3 bg-red-600 rounded-full" />
            <span className="text-[13px] font-black uppercase text-zinc-400 tracking-[0.15em]">
              {typeof article.category === "object"
                ? article.category.name
                : categorySlug}
            </span>
          </div>
          <h4 className="font-black text-lg md:text-lg text-zinc-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors tracking-tight">
            {article.title}
          </h4>
          <div className="flex items-center gap-4 mt-2 text-[12px] font-black text-zinc-400 uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-5 h-5 text-red-600" />
              {formatDate(article.publishedAt || article.createdAt)}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // Default variant
  return (
    <div className="group relative bg-white overflow-hidden flex flex-col h-full hover:bg-zinc-50 hover:shadow-lg transition-all duration-300 border border-zinc-100 rounded-3xl">
      <Link
        to={articleLink}
        className="relative aspect-[16/9] overflow-hidden block rounded-2xl m-2 mb-0"
      >
        <img
          src={imageSrc}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 rounded-xl"
        />
      </Link>
      <div className="flex flex-col flex-1 p-3 gap-3 ">
        <Link to={articleLink} className="block">
          <h3 className="font-Geneva font-bold text-xl md:text-xl leading-tight text-zinc-800 group-hover:text-red-700 transition-colors mb-3 ">
            {article.title}
          </h3>
        </Link>
        <TruncatedSummary text={excerpt} articleLink={articleLink} />
        <div className="mt-auto flex items-center flex-wrap text-zinc-500 font-medium gap-4">
          <span className="flex items-center gap-1.5 text-sm">
            <Calendar className="w-4 h-4 text-red-600 flex-shrink-0" />
            {formatDate(article.publishedAt || article.createdAt)}
          </span>

          <span className="flex items-center gap-1.5 text-sm">
            <Eye className="w-4 h-4 flex-shrink-0" />
            {totalview} views
          </span>

          <span className="flex items-center gap-1.5 text-sm">
            <Clock className="w-4 h-4 flex-shrink-0" />
            {readingTime} min read
          </span>
        </div>
      </div>
    </div>
  );
}
