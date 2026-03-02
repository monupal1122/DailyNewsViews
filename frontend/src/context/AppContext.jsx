import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

const AppContext = createContext();

/**
 * Global App Provider to manage all shared state (Ads, Categories, Headlines)
 * This avoids redundant API calls and makes data accessible anywhere.
 */
export const AppProvider = ({ children }) => {
    // State for Advertisements
    const [ads, setAds] = useState([]);
    const [isAdsLoading, setIsAdsLoading] = useState(false);
console.log("ads",ads);

    // State for Navigation / Categories
    const [categories, setCategories] = useState([]);
    console.log("categories",categories);
    
    const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);

    // State for Global Headlines / Featured
    const [headlines, setHeadlines] = useState([]);
    console.log("headlined",headlines);
    
    const [isHeadlinesLoading, setIsHeadlinesLoading] = useState(false);

    // Fetch Ads
    const refreshAds = useCallback(async () => {
        setIsAdsLoading(true);
        console.log('[API] Fetching Ads...');
        try {
            const data = await api.getAds();
            setAds(data);
        } catch (error) {
            console.error('[API Error] Ads:', error.message);
        } finally {
            setIsAdsLoading(false);
        }
    }, []);

    // Fetch Categories
    const refreshCategories = useCallback(async () => {
        setIsCategoriesLoading(true);
        console.log('[API] Fetching Categories...');
        try {
            const data = await api.getCategories();
            setCategories(data);
        } catch (error) {
            console.error('[API Error] Categories:', error.message);
        } finally {
            setIsCategoriesLoading(false);
        }
    }, []);

    // Fetch Headlines
    const refreshHeadlines = useCallback(async () => {
        setIsHeadlinesLoading(true);
        console.log('[API] Fetching Headlines...');
        try {
            const data = await api.getArticles('?limit=10');
            // Safely check if backend returned data in a wrapper or direct array
            const articles = data?.articles || data;
            setHeadlines(Array.isArray(articles) ? articles : []);
        } catch (error) {
            console.error('[API Error] Headlines:', error.message);
            setHeadlines([]); // Fallback to empty
        } finally {
            setIsHeadlinesLoading(false);
        }
    }, []);

    // Initialize data on mount
    useEffect(() => {
        refreshAds();
        refreshCategories();
        refreshHeadlines();
    }, [refreshAds, refreshCategories, refreshHeadlines]);

    const value = {
        ads,
        isAdsLoading,
        refreshAds,

        categories,
        isCategoriesLoading,
        refreshCategories,

        headlines,
        isHeadlinesLoading,
        refreshHeadlines
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

// Hook to use the AppContext
export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};

export default AppContext;
