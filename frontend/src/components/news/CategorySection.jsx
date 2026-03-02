import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useArticlesByCategory } from '@/hooks/useArticles';
import { NewsCard } from '@/components/news/NewsCard';
import { NewsCardSkeleton } from '@/components/news/NewsCardSkeleton';

export function CategorySection({ category, title }) {
    const { data: articles, isLoading } = useArticlesByCategory(category, 6);

    return (
        <section className="animate-fade-in w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 sm:mb-8 md:mb-10 pb-3 sm:pb-4 border-b-4 border-zinc-900 relative gap-3">
                {/* Category Title */}
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter text-zinc-900 leading-none truncate">
                        {title}
                    </h2>
                </div>

                {/* View All Button */}
                <Link
                    to={`/category/${category}`}
                    className="
                        flex-shrink-0
                        flex items-center gap-1.5
                        text-white bg-red-600
                        hover:bg-zinc-900
                        transition-all duration-200
                        font-black uppercase tracking-widest
                        shadow-lg hover:shadow-xl
                        rounded-lg
                        /* Mobile: compact horizontal button */
                        text-[9px] px-3 py-2
                        /* Small screens and up: slightly larger */
                        sm:text-[10px] sm:px-4 sm:py-2.5
                        /* Medium screens and up: full size */
                        md:text-[10px] md:px-5 md:py-3
                        whitespace-nowrap
                        active:scale-95
                    "
                >
                    <span className="hidden xs:inline sm:inline">View All</span>
                    <span className="xs:hidden sm:hidden">All</span>
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                </Link>

                {/* Red accent underline */}
                <div className="absolute bottom-[-4px] left-0 w-24 sm:w-36 md:w-48 h-1 bg-red-600" />
            </div>

            {/* Articles Grid */}
            {articles && articles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8 lg:gap-10">
                    {isLoading
                        ? Array.from({ length: 3 }).map((_, i) => (
                            <NewsCardSkeleton key={i} />
                        ))
                        : articles.slice(0, 3).map((article) => (
                            <div key={article._id} className="h-full animate-fade-in">
                                <NewsCard article={article} />
                            </div>
                        ))
                    }
                </div>
            ) : !isLoading && (
                <div className="py-12 sm:py-16 md:py-20 text-center border-2 border-dashed border-zinc-200 bg-zinc-50 rounded-lg">
                    <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs sm:text-sm px-4">
                        No stories published in {title} yet.
                    </p>
                </div>
            )}
        </section>
    );
}