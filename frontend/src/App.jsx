import React from 'react';
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AdminAuthProvider } from './context/AdminAuthContext';
import Index from "./pages/Index";
import AdminLogin from './pages/admin/Login';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminArticles from './pages/admin/Articles';
import AdminArticleForm from './pages/admin/ArticleForm';
import AdminCategories from './pages/admin/Categories';
import AdminAccount from './pages/admin/Account';
import AdminAuthors from './pages/admin/Authors';
import AdminAds from './pages/admin/Ads';
import ForgotPassword from './pages/admin/ForgotPassword';
import ResetPassword from './pages/admin/ResetPassword';
import ArticleDetail from "./pages/ArticleDetail";
import CategoryPage from "./pages/CategoryPage";
import SubcategoryPage from "./pages/SubcategoryPage";
import SearchPage from "./pages/SearchPage";
import AuthorProfile from "./pages/AuthorProfile";
import TagPage from "./pages/TagPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/utils/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Toaster />
            <Sonner />
            <AdminAuthProvider>
                <BrowserRouter>
                    <ScrollToTop />
                    <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/privacy" element={<PrivacyPolicy />} />

                        {/* Admin Routes */}
                        <Route path="/login" element={<AdminLogin />} />
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route path="/author/login" element={<AdminLogin />} />
                        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password/:token" element={<ResetPassword />} />

                        {/* Protective Portal Gates */}
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route index element={<AdminDashboard />} />
                            <Route path="dashboard" element={<AdminDashboard />} />
                            <Route path="articles" element={<AdminArticles />} />
                            <Route path="articles/create" element={<AdminArticleForm />} />
                            <Route path="articles/edit/:id" element={<AdminArticleForm />} />
                            <Route path="categories" element={<AdminCategories />} />
                            <Route path="authors" element={<AdminAuthors />} />
                            <Route path="ads" element={<AdminAds />} />
                            <Route path="account" element={<AdminAccount />} />
                            <Route path="settings" element={<AdminAccount />} />
                        </Route>

                        <Route path="/author" element={<AdminLayout />}>
                            <Route index element={<AdminDashboard />} />
                            <Route path="dashboard" element={<AdminDashboard />} />
                            <Route path="articles" element={<AdminArticles />} />
                            <Route path="articles/create" element={<AdminArticleForm />} />
                            <Route path="articles/edit/:id" element={<AdminArticleForm />} />
                            <Route path="categories" element={<AdminCategories />} />
                            <Route path="authors" element={<AdminAuthors />} />
                            <Route path="ads" element={<AdminAds />} />
                            <Route path="account" element={<AdminAccount />} />
                            <Route path="settings" element={<AdminAccount />} />
                        </Route>

                        <Route path="/:category/:subcategory/:slugId" element={<ArticleDetail />} />
                        <Route path="/category/:category" element={<CategoryPage />} />
                        <Route path="/subcategory/:category/:subcategory" element={<SubcategoryPage />} />
                        <Route path="/author/:id" element={<AuthorProfile />} />
                        <Route path="/tags/:tag" element={<TagPage />} />
                        <Route path="/search" element={<SearchPage />} />
                        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </BrowserRouter>
            </AdminAuthProvider>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;
