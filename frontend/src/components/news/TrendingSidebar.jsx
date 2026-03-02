import { TrendingUp } from 'lucide-react';
import { useTrendingArticles } from '@/hooks/useArticles';
import { NewsCard } from '@/components/news/NewsCard';
import { NewsCardSkeleton } from '@/components/news/NewsCardSkeleton';

export function TrendingSidebar() {
    const { data: trending, isLoading } = useTrendingArticles(6);

    return (
        <aside className="bg-white border border-zinc-100 shadow-sm overflow-hidden rounded-2xl">
            <div className="bg-zinc-900 text-white p-4 flex items-center justify-between border-b border-zinc-800 rounded-t-2xl">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-red-600 rounded-full" />
                    <h2 className="text-md font-black uppercase tracking-widest text-white">Trending Now</h2>
                </div>
                <div className="bg-zinc-800 p-1.5 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-red-500 animate-pulse" />
                </div>
            </div>
            <div className="flex flex-col p-2 gap-1">
                {isLoading
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="rounded-xl overflow-hidden">
                            <NewsCardSkeleton variant="horizontal" />
                        </div>
                    ))
                    : trending?.map((article) => (
                        <div key={article._id} className="rounded-xl overflow-hidden hover:bg-zinc-50 transition-colors">
                            <NewsCard article={article} variant="horizontal" />
                        </div>
                    ))}
            </div>
        </aside>
    );
}