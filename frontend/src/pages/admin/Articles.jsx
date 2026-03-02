import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { fetchApi } from '@/lib/api';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent
} from '@/components/ui/card';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Eye,
    Edit,
    Trash2,
    Loader2,
    Calendar,
    User as UserIcon,
    Tag,
    Image as ImageIcon,
    ChevronRight,
    ArrowUpRight,
    X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function ArticlesList() {
    const navigate = useNavigate();
    const location = useLocation();
    const prefix = location.pathname.startsWith('/author') ? '/author' : '/admin';
    const queryClient = useQueryClient();
    const queryParams = new URLSearchParams(location.search);
    const filterAuthorId = queryParams.get('authorId');

    const { data: allArticles, isLoading } = useQuery({
        queryKey: ['admin', 'articles'],
        queryFn: () => fetchApi('/admin/articles').then(res => res.data)
    });

    const articles = filterAuthorId
        ? allArticles?.filter(a => a.author?._id === filterAuthorId || a.author === filterAuthorId)
        : allArticles;

    const deleteMutation = useMutation({
        mutationFn: (id) => fetchApi(`/admin/articles/${id}`, { method: 'DELETE' }),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'articles']);
            toast.success('Article moved to trash');
        },
        onError: (err) => {
            toast.error(err.message || 'Delete failed');
        }
    });

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this article?')) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-green-500" />
                <p className="text-slate-400 font-medium animate-pulse">Gathering your stories...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 italic underline decoration-green-500 decoration-4">Editorial Hub</h1>
                    <p className="text-slate-500 mt-1 font-medium">Manage, publish, and track your news cycle with precision.</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    {filterAuthorId && (
                        <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full border border-blue-100 animate-in slide-in-from-right-4 duration-300">
                            <UserIcon className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Journalist Filter Active</span>
                            <button onClick={() => navigate(`${prefix}/articles`)} className="hover:bg-blue-200 rounded-full p-0.5 transition-colors">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}
                    <Button onClick={() => navigate(`${prefix}/articles/create`)} className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200 rounded-full px-8 py-6 font-bold text-lg">
                        <Plus className="w-5 h-5 mr-3" /> New Publication
                    </Button>
                </div>
            </div>

            <Card className="bg-white border-slate-200 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden border-none">
                <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 bg-slate-50/30">
                    <div className="relative flex-1 max-w-lg">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                            placeholder="Search by publication ID, headline, or author..."
                            className="bg-white border-slate-200 pl-12 h-12 rounded-2xl focus-visible:ring-green-500 focus-visible:border-green-500 font-medium"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="outline" className="h-12 border-slate-200 text-slate-600 font-bold px-6 rounded-2xl bg-white hover:bg-slate-50">
                            <Filter className="w-4 h-4 mr-2" /> Filter
                        </Button>
                        <Select defaultValue="all">
                            <SelectTrigger className="h-12 border-slate-200 text-slate-600 font-bold px-6 rounded-2xl bg-white w-40">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-slate-200 font-medium text-slate-700">
                                <SelectItem value="all">All Articles</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="draft">Drafts</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-widest border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-5">Publication & Context</th>
                                <th className="px-6 py-5">Visibility</th>
                                <th className="px-6 py-5">Engagement</th>
                                <th className="px-6 py-5">Editorial Info</th>
                                <th className="px-6 py-5 text-right w-20">Control</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {articles.map((article) => (
                                <tr key={article._id} className="hover:bg-slate-50/50 transition-all group">
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-5">
                                            <div className="h-16 w-24 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-200 shadow-inner group-hover:scale-105 transition-transform duration-500">
                                                {article.featuredImage ? (
                                                    <img src={article.featuredImage} className="w-full h-full object-cover" alt="" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <ImageIcon className="w-6 h-6 text-slate-300" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-1.5 min-w-0">
                                                <span className="font-bold text-slate-900 group-hover:text-green-600 transition-colors text-base truncate max-w-md">{article.title}</span>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-none px-2 py-0.5 text-[10px] font-black rounded-full uppercase tracking-tighter italic">
                                                        {article.category?.name || 'Uncategorized'}
                                                    </Badge>
                                                    {article.subcategories?.map(sub => (
                                                        <Badge key={sub._id} variant="outline" className="text-[9px] uppercase font-black tracking-widest text-slate-400 border-slate-100 bg-white/50 px-2 py-0">
                                                            {sub.name}
                                                        </Badge>
                                                    ))}
                                                    <span className="text-[10px] text-slate-400 font-black tracking-tighter uppercase pl-2">#{article.publicId || article._id.slice(-6)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <Badge className={`px-4 py-1 rounded-full font-black text-[10px] uppercase tracking-widest border-2 ${article.publishStatus === 'published'
                                            ? 'bg-green-50 text-green-600 border-green-100'
                                            : 'bg-amber-50 text-amber-600 border-amber-100'
                                            }`} variant="outline">
                                            {article.publishStatus || 'Draft'}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1 rounded-md bg-green-100">
                                                    <Eye className="w-3.5 h-3.5 text-green-600" />
                                                </div>
                                                <span className="font-black text-slate-700 text-sm">{(article.viewCount || 0).toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 px-1">
                                                <ArrowUpRight className="w-3 h-3 text-green-500" />
                                                <span className="text-[10px] font-bold text-slate-400">+4.2% Growth</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[11px] font-black text-slate-500 italic">
                                                    {article.author?.name?.charAt(0) || 'U'}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-slate-800 leading-none">{article.author?.name || 'In-House'}</span>
                                                    <span className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tight">Author</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1.5 px-1 text-slate-400">
                                                <Calendar className="w-3 h-3" />
                                                <span className="text-[10px] font-medium">{new Date(article.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="hover:bg-slate-100 rounded-full h-10 w-10 text-slate-400 hover:text-green-600 border border-transparent hover:border-slate-200">
                                                    <MoreVertical className="w-5 h-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56 bg-white border-slate-200 text-slate-700 shadow-2xl p-2 rounded-2xl">
                                                <DropdownMenuItem className="flex items-center rounded-xl px-4 py-2.5 cursor-pointer hover:bg-slate-50">
                                                    <Eye className="w-4 h-4 mr-3 text-green-500" /> <span className="font-bold">View Publication</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => navigate(`${prefix}/articles/edit/${article._id}`)} className="flex items-center rounded-xl px-4 py-2.5 cursor-pointer hover:bg-slate-50">
                                                    <Edit className="w-4 h-4 mr-3 text-blue-500" /> <span className="font-bold">Edit Content</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-slate-100" />
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(article._id)}
                                                    className="flex items-center text-red-500 focus:text-red-700 rounded-xl px-4 py-2.5 cursor-pointer hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-3" /> <span className="font-bold">Discontinue Article</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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
