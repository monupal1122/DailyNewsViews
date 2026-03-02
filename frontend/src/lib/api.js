const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function fetchJson(endpoint, options = {}) {
    const headers = {
        'Accept': 'application/json',
        ...(options.headers || {})
    };

    // Only set Content-Type to JSON if not uploading FormData
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    } else {
        // When sending FormData, we MUST NOT set Content-Type manually
        // so the browser can set the boundary automatically.
        delete headers['Content-Type'];
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include'
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(error.message || `API Error: ${response.status}`);
    }

    return response.json();
}

// Helper for legacy hooks and direct calls
export async function fetchApi(endpoint, options = {}) {
    return fetchJson(endpoint, options);
}

export const api = {
    // Articles
    getArticles: (params = '') => fetchJson(`/articles${params}`),
    getArticle: (id) => fetchJson(`/articles/${id}`),
    getFeaturedArticles: () => fetchJson('/articles/featured'),

    // Ads
    getAds: () => fetchJson('/ads'),

    // Categories
    getCategories: () => fetchJson('/categories/full'),
    getSubcategories: (catId) => fetchJson(`/categories/${catId}/subcategories`),

    // Helper for direct raw fetch if needed
    fetchRaw: (endpoint) => fetchJson(endpoint)
};

export default api;
