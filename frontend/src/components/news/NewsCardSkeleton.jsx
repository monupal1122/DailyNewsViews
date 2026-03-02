export function NewsCardSkeleton({ variant = 'default' }) {
    if (variant === 'featured') {
        return (
            <div className="rounded-xl overflow-hidden">
                <div className="relative aspect-[16/10] skeleton-shimmer rounded-xl">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="w-24 h-6 skeleton-shimmer rounded-full" />
                        <div className="mt-3 h-8 w-3/4 skeleton-shimmer rounded" />
                        <div className="mt-2 h-4 w-full skeleton-shimmer rounded" />
                        <div className="mt-3 flex items-center gap-4">
                            <div className="h-4 w-24 skeleton-shimmer rounded" />
                            <div className="h-4 w-16 skeleton-shimmer rounded" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (variant === 'horizontal') {
        return (
            <div className="flex gap-4 p-3">
                <div className="flex-shrink-0 w-24 h-24 skeleton-shimmer rounded-lg" />
                <div className="flex-1">
                    <div className="w-16 h-5 skeleton-shimmer rounded-full" />
                    <div className="mt-2 h-4 w-full skeleton-shimmer rounded" />
                    <div className="mt-1 h-4 w-2/3 skeleton-shimmer rounded" />
                    <div className="mt-2 h-3 w-20 skeleton-shimmer rounded" />
                </div>
            </div>
        );
    }

    if (variant === 'compact') {
        return (
            <div className="py-4 border-b border-border">
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 skeleton-shimmer rounded" />
                    <div className="flex-1">
                        <div className="h-4 w-full skeleton-shimmer rounded" />
                        <div className="mt-1 h-4 w-2/3 skeleton-shimmer rounded" />
                        <div className="mt-2 flex items-center gap-2">
                            <div className="w-16 h-5 skeleton-shimmer rounded-full" />
                            <div className="w-12 h-4 skeleton-shimmer rounded" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl overflow-hidden bg-card">
            <div className="aspect-[16/10] skeleton-shimmer" />
            <div className="p-4">
                <div className="w-20 h-5 skeleton-shimmer rounded-full" />
                <div className="mt-2 h-5 w-full skeleton-shimmer rounded" />
                <div className="mt-1 h-5 w-3/4 skeleton-shimmer rounded" />
                <div className="mt-2 h-4 w-full skeleton-shimmer rounded" />
                <div className="mt-3 flex items-center justify-between">
                    <div className="h-3 w-20 skeleton-shimmer rounded" />
                    <div className="h-3 w-16 skeleton-shimmer rounded" />
                </div>
            </div>
        </div>
    );
}
