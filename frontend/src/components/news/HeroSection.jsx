import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { useTopHeadlines } from '@/hooks/useArticles';
import { NewsCard } from '@/components/news/NewsCard';
import { NewsCardSkeleton } from '@/components/news/NewsCardSkeleton';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export function HeroSection() {
    // Fetch 8 articles: 5 for slider, 3 for sidebar
    const { data: articles, isLoading } = useTopHeadlines(8);
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 });
    const [selectedIndex, setSelectedIndex] = useState(0);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);

        // Auto-play
        let intervalId;
        const startAutoplay = () => {
            intervalId = setInterval(() => {
                if (emblaApi.canScrollNext()) {
                    emblaApi.scrollNext();
                } else {
                    emblaApi.scrollTo(0);
                }
            }, 5000);
        };

        startAutoplay();

        // Pause on interaction (simple approach: clear interval on unmount/re-mount or just keep running)
        // For a more robust pause-on-hover, we'd need event listeners, but this is a simple auto-play.

        return () => {
            clearInterval(intervalId);
            emblaApi.off('select', onSelect);
        };
    }, [emblaApi, onSelect]);

    if (isLoading) {
        return (
            <section className="container mx-auto px-4 py-4 md:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8 min-h-[360px] md:h-[500px] bg-zinc-100 animate-pulse rounded-xl" />
                    <div className="lg:col-span-4 flex flex-col gap-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <NewsCardSkeleton key={i} variant="horizontal" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (!articles?.length) return null;

    const sliderArticles = articles.slice(0, 5);
    const sideArticles = articles.slice(5, 8);

    return (
        <section className="container mx-auto px-4 py-4 md:py-8 mb-5">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

                {/* Main Slider Area */}
                <div className="lg:col-span-8 relative group lg:h-[560px]">
                    <div
                        className="overflow-hidden rounded-xl border border-zinc-100 shadow-sm bg-white h-full"
                        ref={emblaRef}
                    >
                        <div className="flex touch-pan-y h-full">
                            {sliderArticles.map((article) => (
                                <div className="flex-[0_0_100%] min-w-0 h-full" key={article._id}>
                                    <NewsCard article={article} variant="featured" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Slider Controls — always visible on mobile, hover-only on desktop */}
                    <button
                        onClick={scrollPrev}
                        className="absolute left-3 md:left-4 md:top-1/2 top-1/5 -translate-y-1/2 bg-white/90 hover:bg-white text-zinc-900 p-2 md:p-3 rounded-full shadow-lg opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity z-30"
                        aria-label="Previous slide"
                    >
                        <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                    <button
                        onClick={scrollNext}
                        className="absolute right-3 md:right-4 md:top-1/2 top-1/5 -translate-y-1/2 bg-white/90 hover:bg-white text-zinc-900 p-2 md:p-3 rounded-full shadow-lg opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity z-10"
                        aria-label="Next slide"
                    >
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {sliderArticles.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => emblaApi && emblaApi.scrollTo(index)}
                                className={`h-2 mt-9 rounded-full transition-all ${index === selectedIndex
                                    ? 'bg-red-600 w-6'
                                    : 'bg-white/70 w-2 hover:bg-white'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Side Articles */}
                <div className="lg:col-span-4 flex flex-col bg-white border border-slate-200 shadow-xl shadow-slate-200/50 rounded-2xl overflow-y-hidden max-h-[420px] lg:max-h-none lg:h-[560px]">
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 flex-shrink-0">
                        <h3 className="text-sm md:text-base font-black uppercase tracking-widest text-white italic">
                            Latest Feed
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-slate-100">
                        {sideArticles.map((article) => (
                            <NewsCard
                                key={article._id}
                                article={article}
                                variant="horizontal"
                            />
                        ))}
                    </div>
                    <div className="p-4 bg-slate-50 border-t border-slate-100 text-center flex-shrink-0">
                        <a
                            href="/search"
                            className="text-xs font-black uppercase tracking-widest text-green-600 hover:text-green-700 transition-colors inline-flex items-center gap-2"
                        >
                            Explore All Chronicles <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                </div>

            </div>
        </section>
    );
}
