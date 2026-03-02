import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useArticlesByCategory } from '@/hooks/useArticles';
import { NewsCard } from '@/components/news/NewsCard';
import { NewsCardSkeleton } from '@/components/news/NewsCardSkeleton';
import { TrendingSidebar } from '@/components/news/TrendingSidebar';
import { AdSlot } from '@/components/ads/AdSlot';

export default function CategoryPage() {
    const { category } = useParams();
    const { data: articles, isLoading } = useArticlesByCategory(category || '', 20);

    // Capitalize category name for display
    const displayName = category ? category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ') : '';

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                    <h1 className="text-4xl font-extrabold tracking-tight">{displayName}</h1>
                    <p className="text-muted-foreground mt-2">
                        Top stories and latest updates in {displayName}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Articles Grid */}
                    <div className="lg:col-span-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {isLoading
                                ? Array.from({ length: 8 }).map((_, i) => (
                                    <NewsCardSkeleton key={i} />
                                ))
                                : articles?.map((article) => (
                                    <NewsCard key={article._id} article={article} />
                                ))}
                        </div>
                        {!isLoading && articles?.length === 0 && (
                            <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed text-muted-foreground">
                                <p className="font-medium">No articles found in this category.</p>
                                <p className="text-sm opacity-70">We're working on bringing you fresh content soon.</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        <AdSlot slot="sidebar-ad" format="rectangle" />
                        <TrendingSidebar />
                    </div>
                </div>
            </div>
        </Layout>
    );
}
