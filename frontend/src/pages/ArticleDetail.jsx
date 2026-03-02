import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  Eye,
  Share2,
  Bookmark,
  ExternalLink,
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  Mail,
  Newspaper,
} from "lucide-react";
import { toast } from "sonner";
import { Layout } from "@/components/layout/Layout";
import { useArticle, useRelatedArticles } from "@/hooks/useArticles";
import { CategoryBadge } from "@/components/news/CategoryBadge";
import { NewsCard } from "@/components/news/NewsCard";
import { NewsCardSkeleton } from "@/components/news/NewsCardSkeleton";
import { TrendingSidebar } from "@/components/news/TrendingSidebar";
import { formatDate } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { DummyAd } from "@/components/ads/DummyAd";
import { getFullImageUrl } from "@/lib/utils";

export default function ArticleDetail() {
  const { category, subcategory, slugId } = useParams();

  // Safety: Encode parameters to ensure the API call handles non-ASCII characters correctly
  const seoPath = `${encodeURIComponent(category || "")}/${encodeURIComponent(subcategory || "")}/${encodeURIComponent(slugId || "")}`;
  const { data: article, isLoading, error } = useArticle(seoPath);
  const { data: relatedArticles, isLoading: relatedLoading } =
    useRelatedArticles(article);
  console.log("Article Detail - SEO Path:", article);
  if (error) {
    console.error("Article Fetch Error:", error);
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <div className="h-8 w-48 skeleton-shimmer rounded mb-6" />
              <div className="h-12 w-full skeleton-shimmer rounded mb-4" />
              <div className="h-6 w-2/3 skeleton-shimmer rounded mb-8" />
              <div className="aspect-video skeleton-shimmer rounded-xl mb-8" />
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-4 w-full skeleton-shimmer rounded"
                  />
                ))}
              </div>
            </div>
            <div className="lg:col-span-4 hidden lg:block">
              <div className="h-96 w-full skeleton-shimmer rounded-xl" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout>
        <Helmet>
          <title>Article Not Found | Daily News Views</title>
          <meta
            name="description"
            content="The news story you are looking for could not be found."
          />
        </Helmet>
        <div className="container mx-auto px-4 py-32 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Newspaper className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-black mb-4 uppercase tracking-tighter">
              Story Not Found
            </h1>
            <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
              The article you're looking for doesn't exist or may have been
              moved. Explore our latest headlines or try searching.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button className="w-full sm:w-auto px-8 py-6 rounded-xl font-bold uppercase tracking-widest text-xs">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Link to="/search">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto px-8 py-6 rounded-xl font-bold uppercase tracking-widest text-xs"
                >
                  Browse News
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const author = typeof article.author === "object" ? article.author : null;

  const handleShare = async (platform) => {
    if (!article) {
      toast.error("Nothing to share at the moment.");
      return;
    }

    const title = article.title || "Check out this news article";
    const url = window.location.href;

    // Decode the URL so that Hindi characters appear as text instead of % symbols
    const readableUrl = decodeURIComponent(url);

    // Construct the shared text for messaging platforms
    const shareText = `${title}\n\nRead more at: ${readableUrl}`;

    const platforms = {
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareText)}`,
    };

    if (platform === "copy") {
      try {
        await navigator.clipboard.writeText(readableUrl);
        toast.success("Link copied to clipboard!");
      } catch (err) {
        toast.error("Failed to copy link");
      }
      return;
    }

    if (platforms[platform]) {
      window.open(platforms[platform], "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>{article.title}</title>
        <meta
          name="description"
          content={article.summary || article.description}
        />
        <meta property="og:title" content={article.title} />
        <meta
          property="og:description"
          content={article.summary || article.description}
        />
        <meta
          property="og:image"
          content={getFullImageUrl(article.featuredImage || article.imageUrl)}
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={`https://korsimnaturals.com/${article.category?.slug}/${article.subcategories?.[0]?.slug || "general"}/${article.slug}-${article.publicId}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta
          name="twitter:description"
          content={article.summary || article.description}
        />
        <meta
          name="twitter:image"
          content={getFullImageUrl(article.featuredImage || article.imageUrl)}
        />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <main className="lg:col-span-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>

            <article>
              <div className="flex items-center gap-4 mb-4">
                {article?.category && (
                  <CategoryBadge category={article.category} size="md" />
                )}
                <div className="flex flex-wrap gap-2">
                  {article.subcategories?.map(sub => (
                    <span
                      key={sub._id}
                      className="px-3 py-1 bg-zinc-100 text-zinc-600 rounded-full text-[10px] uppercase font-black tracking-widest border border-zinc-200"
                    >
                      {sub.name}
                    </span>
                  ))}
                </div>
                <span className="flex items-center gap-1 text-muted-foreground text-sm">
                  <Clock className="w-4 h-4" />
                  {formatDate(article?.publishedAt || article?.createdAt)}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground text-sm">
                  <Eye className="w-4 h-4" />
                  {article?.viewCount?.toLocaleString() || 0} views
                </span>
              </div>

              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 cursor-pointer">
                {article?.title || "Loading..."}
              </h1>

              <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                {article.summary || article.description}
              </p>

              <div className="relative aspect-video rounded-xl overflow-hidden mb-8 shadow-2xl shadow-primary/5 bg-white">
                <img
                  src={getFullImageUrl(article?.featuredImage || article?.imageUrl)}
                  alt={article?.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mb-10 ">
                {article?.imageCaption && (
                  <p className="text-sm text-zinc-500 italic mb-4">
                    {article.imageCaption}
                  </p>
                )}

                {article && (article.publishedAt || article.createdAt) && (
                  <p className="text-zinc-500 text-sm mb-6 font-medium">
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
                )}

                <div className="flex flex-row items-center justify-between py-4 border-y border-zinc-100">
                  {/* Share buttons */}
                  <div className="flex items-center gap-1 md:gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full w-8 h-8 md:w-10 md:h-10 border-zinc-200 text-zinc-600 cursor-pointer hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all"
                      onClick={() => handleShare("facebook")}
                      title="Share on Facebook"
                    >
                      <img
                        src="/facebook.webp"
                        className="w-7 h-7 md:w-9 md:h-9"
                        alt="Facebook"
                      />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full w-8 h-8 md:w-10 md:h-10 border-zinc-200 text-zinc-600 cursor-pointer hover:text-white hover:border-gray-200 transition-all hover:bg-gray-300"
                      onClick={() => handleShare("twitter")}
                      title="Share on X (Twitter)"
                    >
                      <img
                        src="/twitter-x.webp"
                        className="w-5 h-5 md:w-6 md:h-6"
                        alt="Twitter"
                      />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full w-8 h-8 md:w-10 md:h-10 cursor-pointer border-zinc-200 text-zinc-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all"
                      onClick={() => handleShare("linkedin")}
                      title="Share on LinkedIn"
                    >
                      <img
                        src="/linkedin.webp"
                        className="w-8 h-8 md:w-10 md:h-10"
                        alt="LinkedIn"
                      />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full w-8 h-8 md:w-10 md:h-10 border-zinc-200 cursor-pointer text-zinc-600 hover:bg-zinc-100 hover:text-foreground hover:border-zinc-300 transition-all"
                      onClick={() => handleShare("email")}
                      title="Share via Email"
                    >
                      <Mail className="w-4 h-4 md:w-5 md:h-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full w-8 h-8 md:w-10 md:h-10 border-zinc-200 cursor-pointer text-zinc-600 hover:bg-zinc-100 hover:text-foreground hover:border-zinc-300 transition-all"
                      onClick={() => handleShare("copy")}
                      title="Copy link"
                    >
                      <img
                        src="/download.webp"
                        className="w-7 h-7 md:w-9 md:h-9"
                      />
                    </Button>
                  </div>

                  {/* Join community */}
                  <div className="flex items-center gap-1.5 md:gap-3 flex-shrink-0">
                    <span className="font-bold text-zinc-900 text-xs md:text-sm whitespace-nowrap">
                      Join our community
                    </span>
                    <a
                      href="https://whatsapp.com/channel/your-channel-id"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 md:w-13 md:h-13 flex items-center justify-center bg-green-600 text-white cursor-pointer rounded-full transition-colors shadow-sm hover:shadow-md flex-shrink-0"
                      title="Join our WhatsApp Channel"
                    >
                      <img
                        src="/whatsapp1.png"
                        alt="WhatsApp"
                        className="w-8 h-8 md:w-15 md:h-15"
                      />
                    </a>
                  </div>
                </div>
              </div>

              <div
                className="prose prose-lg max-w-none mb-12 text-xl"
                dangerouslySetInnerHTML={{ __html: article?.content || "" }}
              />

              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-8 mb-12">
                  {article.tags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/tags/${tag}`}
                      className="px-3 py-1 bg-muted hover:bg-primary hover:text-white rounded-full text-sm transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}

              {article.sourceUrl && (
                <div className="mt-12 p-6 bg-muted/30 rounded-2xl border border-border/50">
                  <p className="text-sm text-muted-foreground mb-3 font-semibold uppercase tracking-wider">
                    Originally published on:
                  </p>
                  <a
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-bold text-lg transition-colors group"
                  >
                    {article.sourceName}
                    <ExternalLink className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>
              )}

              {author && (
                <div className="mt-12 p-6 bg-zinc-50 rounded-2xl border border-zinc-100 flex items-center gap-4">
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Published by:
                  </span>
                  <Link
                    to={`/author/${author._id}`}
                    className="flex items-center gap-3 group"
                  >
                    <span className="font-bold text-lg text-zinc-900 group-hover:text-primary transition-colors">
                      {author.name}
                    </span>
                  </Link>
                </div>
              )}
            </article>
          </main>

          <aside className="lg:col-span-4">
            <div className="sticky top-34 space-y-8">
              <TrendingSidebar />
              <DummyAd
                variant="rectangle"
                label="Sponsored Content"
                sublabel="Ad space available"
              />
            </div>
          </aside>
        </div>

        {relatedArticles && relatedArticles.length > 0 && (
          <section className="mt-16 pt-16 border-t border-zinc-200">
            <div className="flex items-end justify-between mb-10 pb-4 border-b-4 border-zinc-900 relative">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl md:text-2xl font-black uppercase tracking-tighter text-zinc-900 leading-none">
                  Releated Article
                </h2>
              </div>

              <div className="absolute bottom-[-4px] left-0 w-48 h-1 bg-red-600" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                  <NewsCardSkeleton key={i} />
                ))
                : relatedArticles.map((related) => (
                  <NewsCard key={related._id} article={related} />
                ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
