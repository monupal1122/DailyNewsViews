import { useSearchParams, Link } from 'react-router-dom';
import { Search, ArrowLeft } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useSearchArticles } from '@/hooks/useArticles';
import { NewsCard } from '@/components/news/NewsCard';
import { NewsCardSkeleton } from '@/components/news/NewsCardSkeleton';

export default function SearchPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const { data: articles, isLoading } = useSearchArticles(query, 20);

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
                    <div className="flex items-center gap-3">
                        <Search className="w-8 h-8 text-primary" />
                        <div>
                            <h1 className="text-3xl font-bold">Search Results</h1>
                            {query && (
                                <p className="text-muted-foreground mt-1">
                                    Showing results for "{query}"
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Results */}
                {!query ? (
                    <div className="text-center py-16">
                        <Search className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Enter a search term</h2>
                        <p className="text-muted-foreground">
                            Use the search bar above to find news articles
                        </p>
                    </div>
                ) : isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <NewsCardSkeleton key={i} />
                        ))}
                    </div>
                ) : articles && articles.length > 0 ? (
                    <>
                        <p className="text-muted-foreground mb-6">
                            Found {articles.length} article{articles.length !== 1 ? 's' : ''}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {articles.map((article) => (
                                <NewsCard key={article._id} article={article} />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-16">
                        <Search className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">No results found</h2>
                        <p className="text-muted-foreground">
                            Try searching with different keywords
                        </p>
                    </div>
                )}
            </div>
        </Layout>
    );
}
