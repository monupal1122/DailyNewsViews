import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useAuthorArticles, useAuthorInfo } from '@/hooks/useArticles';
import { NewsCard } from '@/components/news/NewsCard';
import { NewsCardSkeleton } from '@/components/news/NewsCardSkeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Twitter, Linkedin, Facebook, Instagram } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function AuthorProfile() {
    const { id } = useParams();
    const { data: author, isLoading: authorLoading } = useAuthorInfo(id || '');
    const { data: articles, isLoading: articlesLoading } = useAuthorArticles(id || '');

    if (authorLoading) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-4xl mx-auto items-center flex flex-col">
                        <div className="w-32 h-32 rounded-full skeleton-shimmer mb-6" />
                        <div className="h-8 w-64 skeleton-shimmer rounded mb-4" />
                        <div className="h-4 w-96 skeleton-shimmer rounded mb-8" />
                    </div>
                </div>
            </Layout>
        );
    }

    if (!author) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-16 text-center">
                    <h1 className="text-3xl font-bold mb-4">Author not found</h1>
                    <Link to="/">
                        <Button>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <Helmet>
                <title>{author.name} | Daily News Views Author</title>
                <meta name="description" content={author.bio} />
            </Helmet>

            <div className="bg-muted/30 border-b border-border">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-4xl mx-auto text-center">
                        <img
                            src={author.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&size=200&background=random`}
                            className="w-32 h-32 rounded-full mx-auto mb-6 shadow-xl border-4 border-white object-cover"
                            alt={author.name}
                        />
                        <h1 className="text-4xl font-bold mb-2">{author.name}</h1>
                        <p className="text-muted-foreground mb-4 font-medium">
                            {author.articleCount || 0} Articles Published
                        </p>
                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            {author.bio || 'Professional journalist and content creator at Daily Chronicle.'}
                        </p>

                        <div className="flex justify-center gap-4">
                            {author.socialLinks?.twitter && (
                                <a href={author.socialLinks.twitter} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-white shadow-sm hover:text-primary transition-colors">
                                    <Twitter className="w-5 h-5" />
                                </a>
                            )}
                            {author.socialLinks?.linkedin && (
                                <a href={author.socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-white shadow-sm hover:text-primary transition-colors">
                                    <Linkedin className="w-5 h-5" />
                                </a>
                            )}
                            {author.socialLinks?.facebook && (
                                <a href={author.socialLinks.facebook} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-white shadow-sm hover:text-primary transition-colors">
                                    <Facebook className="w-5 h-5" />
                                </a>
                            )}
                            {author.socialLinks?.instagram && (
                                <a href={author.socialLinks.instagram} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-white shadow-sm hover:text-primary transition-colors">
                                    <Instagram className="w-5 h-5" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl font-bold mb-8">Articles by {author.name}</h2>

                    {articlesLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <NewsCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : articles && articles.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {articles.map((article) => (
                                <NewsCard key={article._id} article={article} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No articles published yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
