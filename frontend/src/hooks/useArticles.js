import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '../lib/api';

export function useTopHeadlines(limit = 10) {
    return useQuery({
        queryKey: ['articles', 'top-headlines', limit],
        queryFn: async () => {
            const data = await fetchApi(`/articles?limit=${limit}`);
            return data.articles;
        },
    });
}

export function useFeaturedArticles(limit = 5) {
    return useQuery({
        queryKey: ['articles', 'featured', limit],
        queryFn: async () => {
            return fetchApi('/articles/featured');
        },
    });
}

export function useTrendingArticles(limit = 5) {
    return useQuery({
        queryKey: ['articles', 'trending', limit],
        queryFn: async () => {
            const data = await fetchApi(`/articles?limit=${limit}&sort=views`);
            return data.articles;
        },
    });
}

export function useArticlesByCategory(category, limit = 20) {
    return useQuery({
        queryKey: ['articles', 'category', category, limit],
        queryFn: async () => {
            return fetchApi(`/articles/category/${category}?limit=${limit}`);
        },
    });
}

export function useArticlesBySubcategory(categorySlug, subcategorySlug, limit = 20) {
    return useQuery({
        queryKey: ['articles', 'subcategory', categorySlug, subcategorySlug, limit],
        queryFn: async () => {
            return fetchApi(`/articles/subcategory/${categorySlug}/${subcategorySlug}?limit=${limit}`);
        },
    });
}

export function useArticle(seoPath) {
    return useQuery({
        queryKey: ['articles', 'single', seoPath],
        queryFn: async () => {
            return fetchApi(`/articles/${seoPath}`);
        },
        enabled: !!seoPath,
    });
}

export function useSearchArticles(query, limit = 20) {
    return useQuery({
        queryKey: ['articles', 'search', query, limit],
        queryFn: async () => {
            if (!query.trim()) return [];
            return fetchApi(`/articles/search?q=${query}&limit=${limit}`);
        },
        enabled: query.length > 0,
    });
}

export function useRelatedArticles(article, limit = 4) {
    return useQuery({
        queryKey: ['articles', 'related', article?._id, limit],
        queryFn: async () => {
            if (!article) return [];
            const categoryId = typeof article.category === 'object' ? article.category._id : article.category;
            const data = await fetchApi(`/articles/category/${categoryId}?limit=${limit + 1}`);
            return data.filter(a => a._id !== article._id).slice(0, limit);
        },
        enabled: !!article,
    });
}

export function useCategories() {
    return useQuery({
        queryKey: ['categories', 'full'],
        queryFn: async () => {
            return fetchApi('/categories/full');
        },
    });
}

export function useAuthorInfo(id) {
    return useQuery({
        queryKey: ['authors', id],
        queryFn: async () => {
            return fetchApi(`/authors/${id}`);
        },
        enabled: !!id,
    });
}

export function useAuthorArticles(id, limit = 20) {
    return useQuery({
        queryKey: ['articles', 'author', id, limit],
        queryFn: async () => {
            return fetchApi(`/articles/author/${id}?limit=${limit}`);
        },
        enabled: !!id,
    });
}

export function useArticlesByTag(tag, limit = 20) {
    return useQuery({
        queryKey: ['articles', 'tag', tag, limit],
        queryFn: async () => {
            return fetchApi(`/articles/tag/${tag}?limit=${limit}`);
        },
        enabled: !!tag,
    });
}
