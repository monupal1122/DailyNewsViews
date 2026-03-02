import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card';
import {
    FileText,
    Eye,
    Star,
    TrendingUp,
    Clock,
    ChevronRight,
    ArrowUpRight,
    ArrowDownRight,
    Loader2,
    Plus,
    Image as ImageIcon
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getFullImageUrl } from '@/lib/utils';

import { useAdminAuth } from '@/context/AdminAuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const { user } = useAdminAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const prefix = location.pathname.startsWith('/author') ? '/author' : '/admin';

    const { data: dashboardData, isLoading } = useQuery({
        queryKey: ['admin', 'dashboard'],
        queryFn: () => fetchApi('/admin/dashboard').then(res => res.data)
    });

    if (isLoading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-green-500" />
            </div>
        );
    }

    const { stats, chartData, topArticles, latestArticles } = dashboardData;

    const cards = [
        { label: 'Total Articles', value: stats.articleCount, icon: FileText, color: 'text-white', bg: 'bg-gradient-to-br from-blue-500 to-blue-600', shadow: 'shadow-blue-200' },
        { label: 'Featured Articles', value: stats.featuredCount, icon: Star, color: 'text-white', bg: 'bg-gradient-to-br from-amber-400 to-orange-500', shadow: 'shadow-orange-200' },
        { label: 'Total Views', value: stats.totalViews.toLocaleString(), icon: Eye, color: 'text-white', bg: 'bg-gradient-to-br from-green-500 to-emerald-600', shadow: 'shadow-emerald-200' },
        { label: 'Growth', value: '+12.5%', icon: TrendingUp, color: 'text-white', bg: 'bg-gradient-to-br from-purple-500 to-indigo-600', shadow: 'shadow-indigo-200' },
    ];

    // Map chartData for Recharts
    const areaData = chartData.labels.map((label, i) => ({
        name: label,
        views: chartData.data[i]
    }));

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                            Welcome back, <span className="text-green-600">{user.name.split(' ')[0]}</span>! 👋
                        </h1>
                    </div>
                    <p className="text-slate-500 font-medium">
                        {user.role === 'admin'
                            ? "Manage your news ecosystem and track overall performance."
                            : "Here are your latest stats and published stories."}
                    </p>
                </div>
                <Button onClick={() => navigate(`${prefix}/articles/create`)} className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200 rounded-full px-6">
                    <Plus className="w-4 h-4 mr-2" /> New Article
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <Card key={i} className={`border-none ${card.bg} ${card.shadow} shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl overflow-hidden relative group`}>
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                            <card.icon className="w-20 h-20 -mr-6 -mt-6" />
                        </div>
                        <CardHeader className="pb-2 space-y-0 relative z-10">
                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-white/80">{card.label}</CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-3xl font-black text-white">{card.value}</div>
                            <div className="mt-4 flex items-center gap-2">
                                <div className="p-1 rounded-full bg-white/20 text-white">
                                    <card.icon className="w-3 h-3" />
                                </div>
                                <span className="text-[10px] font-bold text-white/70 uppercase">Live Stats</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Popular Articles */}
                <Card className="lg:col-span-2 bg-white border-slate-200 shadow-sm overflow-hidden">
                    <CardHeader className="border-b border-slate-50 bg-slate-50/30">
                        <CardTitle className="text-lg font-bold">Trending Stories</CardTitle>
                        <CardDescription>Articles with highest reach and engagement</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-100">
                            {topArticles.map((article, i) => (
                                <div key={article._id} className="flex items-center gap-4 p-4 group hover:bg-slate-50/80 transition-all cursor-pointer" onClick={() => navigate(`${prefix}/articles/edit/${article._id}`)}>
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-300 group-hover:bg-green-600 group-hover:text-white transition-all italic underline">
                                        #{i + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-slate-800 truncate group-hover:text-green-600">{article.title}</h4>
                                        <div className="flex items-center gap-3 mt-1">
                                            <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-none px-2 py-0 text-[10px]">
                                                {article.category?.name || 'News'}
                                            </Badge>
                                            <span className="text-[11px] text-slate-400 flex items-center">
                                                <Eye className="w-3 h-3 mr-1 text-green-500" />
                                                {article.viewCount.toLocaleString()} views
                                            </span>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Info / User Summary */}
                <Card className="bg-gradient-to-br from-green-500 to-emerald-600 border-none text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/20 blur-3xl -mr-16 -mt-16 rounded-full" />
                    <CardHeader>
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            Editorial Team
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 relative z-10">
                        <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/5">
                            <Avatar className="h-12 w-12 border-2 border-green-500 shadow-xl shadow-green-500/10">
                                <AvatarImage src={getFullImageUrl(user.profileImage)} />
                                <AvatarFallback className="bg-green-600 text-white font-bold">{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-bold text-white leading-none">{user.name}</p>
                                <p className="text-xs text-green-400 mt-1 uppercase font-black">{user.role}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400 italic">Account Status</span>
                                <Badge className="bg-green-500 text-white border-none">Active</Badge>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400 italic">Member Since</span>
                                <span className="font-bold">2024</span>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white mt-4" onClick={() => navigate(`${prefix}/account`)}>
                            Edit My Profile
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Latest Content Table */}
            <Card className="bg-white border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 bg-slate-50/20 p-6">
                    <div>
                        <CardTitle className="text-xl font-bold text-slate-900">Recent Publications</CardTitle>
                        <CardDescription className="text-slate-500 font-medium italic">Monitor your editorial team's latest outputs</CardDescription>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-green-600 hover:bg-green-50 font-bold"
                        onClick={() => navigate(`${prefix}/articles`)}
                    >
                        View Full List <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </CardHeader>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                            <tr>
                                <th className="px-6 py-4">Title & Context</th>
                                <th className="px-6 py-4">Author</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Date Published</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {latestArticles.map((article) => (
                                <tr key={article._id} className="hover:bg-slate-50/50 transition-all group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200">
                                                {article.featuredImage ? (
                                                    <img src={getFullImageUrl(article.featuredImage)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <ImageIcon className="w-4 h-4 text-slate-300" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-slate-800 truncate max-w-[240px] group-hover:text-green-600 transition-colors">
                                                    {article.title}
                                                </p>
                                                <p className="text-[10px] text-slate-400 line-clamp-1 uppercase font-bold mt-0.5">#{article.publicId || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-[10px] text-green-700 font-bold border border-green-200 uppercase">
                                                {article.author?.name?.charAt(0) || 'U'}
                                            </div>
                                            {article.author?.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant="outline" className="border-slate-100 bg-slate-50 text-slate-500 font-bold px-2 py-0 text-[10px] rounded-full">
                                            {article.category?.name}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-slate-400 text-xs">
                                        <div className="flex items-center font-medium">
                                            <Clock className="w-3.5 h-3.5 mr-2 text-slate-300" />
                                            {new Date(article.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="hover:bg-green-50 hover:text-green-600 h-8 w-8 rounded-full"
                                            onClick={() => navigate(`${prefix}/articles/edit/${article._id}`)}
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
