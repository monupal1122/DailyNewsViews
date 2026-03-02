import { useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useArticlesByTag } from '@/hooks/useArticles';
import { NewsCard } from '@/components/news/NewsCard';
import { NewsCardSkeleton } from '@/components/news/NewsCardSkeleton';
import { Helmet } from 'react-helmet-async';

export default function TagPage() {
    const { tag } = useParams();
    const { data: articles, isLoading } = useArticlesByTag(tag || '');

    return (
        <Layout>
            <Helmet>
                <title>#{tag} | Daily Chronicle</title>
                <meta name="description" content={`Explore all articles tagged with #${tag} on Daily Chronicle.`} />
            </Helmet>

            <div className="container mx-auto px-4 py-16">
                <div className="max-w-6xl mx-auto">
                    <header className="mb-12 text-center animate-fade-in">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
                            Topic Exploration
                        </div>
                        <h1 className="text-5xl font-black mb-4 flex items-center justify-center gap-3">
                            <span className="text-primary">#</span>{tag}
                        </h1>
                        <p className="text-muted-foreground max-w-lg mx-auto text-lg">
                            Diving deep into the latest stories, analysis, and updates related to <strong>{tag}</strong>.
                        </p>
                        <div className="w-24 h-1 bg-primary/20 mx-auto mt-8 rounded-full" />
                    </header>

                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <NewsCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : articles && articles.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {articles.map((article) => (
                                <NewsCard key={article._id} article={article} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground text-lg">No stories found with this tag.</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
