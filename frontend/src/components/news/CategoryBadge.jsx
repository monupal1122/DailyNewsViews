import { Link } from 'react-router-dom';

export function CategoryBadge({ category, linked = true, size = 'sm' }) {
    const isObject = typeof category === 'object';
    const name = isObject ? category.name : category;
    const slug = isObject ? category.slug : (category || 'uncategorized');

    const sizeClasses = size === 'sm'
        ? 'px-2.5 py-0.5 text-[10px]'
        : 'px-3 py-1 text-xs';

    const className = `inline-block rounded-xl font-bold uppercase text-lg tracking-wider ${sizeClasses} bg-red-500 text-white border-white`;

    if (linked) {
        return (
            <Link
                to={`/category/${slug}`}
                className={`${className} hover:bg-black transition-all `}
            >
                {name}
            </Link>
        );
    }

    return <span className={className}>{name}</span>;
}
