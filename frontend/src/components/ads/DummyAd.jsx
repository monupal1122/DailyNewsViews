import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const DummyAd = ({
    className = '',
    label = 'Sponsored Content',
    variant = 'leaderboard'
}) => {
    const { ads } = useApp();
    const [currentAdIndex, setCurrentAdIndex] = useState(0);

    const variantToPlacement = {
        leaderboard: ['header', 'footer', 'hero'],
        rectangle: ['inline', 'sidebar'],
        sidebar: ['sidebar'],
        square: ['inline', 'sidebar']
    };

    const filteredAds = ads?.filter(ad =>
        variantToPlacement[variant]?.includes(ad.placement)
    ) || [];

    useEffect(() => {
        if (filteredAds.length > 0) {
            // Random start index to avoid all ads syncing
            setCurrentAdIndex(Math.floor(Math.random() * filteredAds.length));

            const adInterval = setInterval(() => {
                setCurrentAdIndex((prev) => (prev + 1) % filteredAds.length);
            }, 7000);
            return () => clearInterval(adInterval);
        }
    }, [filteredAds.length]);

    const scrollPrev = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentAdIndex((prev) => (prev - 1 + filteredAds.length) % filteredAds.length);
    };

    const scrollNext = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentAdIndex((prev) => (prev + 1) % filteredAds.length);
    };

    const dimensions = {
        leaderboard: 'w-full max-w-[1000px]',
        rectangle: 'w-full max-w-[300px]',
        sidebar: 'w-full max-w-[300px]',
        square: 'w-full max-w-[400px]'
    };

    if (!filteredAds || filteredAds.length === 0) {
        return (
            <div className={`relative bg-zinc-100 flex items-center justify-center border border-zinc-200 transition-all hover:bg-zinc-200/50  ${dimensions[variant]} ${className} mx-auto`}>
                <div className="flex flex-col items-center gap-1 text-center p-4">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em]">Ad Placement</span>
                    <span className="text-[9px] text-zinc-300 italic">{variant}</span>
                </div>
            </div>
        );
    }

    const currentAd = filteredAds[currentAdIndex];
    let adImage = currentAd?.imageUrl || currentAd?.image;

    // Handle relative paths for local uploads
    if (adImage && !adImage.startsWith('http') && !adImage.startsWith('data:')) {
        const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/api$/, '');
        adImage = `${baseUrl}/${adImage.replace(/\\/g, '/')}`;
    }

    return (
        <a
            href={currentAd?.redirectUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={`group/ad relative flex flex-col items-center justify-center overflow-hidden transition-all duration-300 ${dimensions[variant]} ${className} mx-auto`}
        >
            {/* Advertisement Label */}
            <div className="absolute top-0 right-0 px-2 py-0.5 bg-black/10 backdrop-blur-sm text-[8px] font-black uppercase tracking-widest text-zinc-500 z-20 rounded-bl-lg pointer-events-none">
                ADVERTISEMENT
            </div>

            {filteredAds.length > 1 && (
                <>
                    <button
                        onClick={scrollPrev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-zinc-900 p-2 rounded-full shadow-lg opacity-0 group-hover/ad:opacity-100 transition-opacity z-30 cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={scrollNext}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-zinc-900 p-2 rounded-full shadow-lg opacity-0 group-hover/ad:opacity-100 transition-opacity z-30 cursor-pointer"
                    >
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </>
            )}

            {adImage ? (
                <img
                    src={adImage}
                    alt={currentAd?.title || label}
                    className="w-auto h-auto block relative z-10 transition-transform duration-700 group-hover/ad:scale-[1.01]"
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.classList.add('bg-zinc-100', 'min-h-[90px]', 'border', 'border-zinc-200');
                    }}
                />
            ) : (
                <div className="flex items-center justify-center bg-zinc-100 border border-zinc-200 z-10 w-full min-h-[90px] p-6 text-center">
                    <span className="text-xs text-zinc-400 font-medium">{currentAd?.title || 'Sponsored'}</span>
                </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/ad:animate-[shimmer_2s_infinite] z-20 pointer-events-none" />
        </a>
    );
};
