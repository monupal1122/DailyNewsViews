import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import { useAdminAuth } from '@/context/AdminAuthContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card';
import {
    Plus,
    Save,
    X,
    Image as ImageIcon,
    Loader2,
    Link as LinkIcon,
    Sparkles,
    ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Tag } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export default function ArticleForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const prefix = location.pathname.startsWith('/author') ? '/author' : '/admin';
    const queryClient = useQueryClient();
    const isEdit = !!id;

    const { user } = useAdminAuth();


    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        summary: '',
        content: '',
        category: '',
        author: '',
        subcategories: [], // multi-select handled differently in React
        publishStatus: 'draft',
        isFeatured: false,
        tags: '',
        sourceName: '',
        sourceUrl: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch Authors (Admin only)
    const { data: authorsData } = useQuery({
        queryKey: ['admin', 'authors'],
        queryFn: () => fetchApi('/admin/authors').then(res => res.data),
        enabled: !!(user?.role === 'admin')
    });

    // Fetch Categories
    const { data: categoriesData } = useQuery({
        queryKey: ['admin', 'categories'],
        queryFn: () => fetchApi('/admin/categories').then(res => res.data)
    });

    // Fetch Subcategories for the selected category
    const { data: subcategoriesData, isLoading: loadingSubcategories } = useQuery({
        queryKey: ['admin', 'subcategories', formData.category],
        queryFn: () => fetchApi(`/admin/subcategories?category=${formData.category}`).then(res => res.data),
        enabled: !!formData.category
    });

    // Fetch Article Data if editing
    const { data: editArticle, isLoading: fetchingArticle } = useQuery({
        queryKey: ['admin', 'articles', id],
        queryFn: () => fetchApi(`/admin/articles/${id}`).then(res => res.data),
        enabled: isEdit
    });

    useEffect(() => {
        if (editArticle) {
            setFormData({
                title: editArticle.title || '',
                slug: editArticle.slug || '',
                summary: editArticle.summary || '',
                content: editArticle.content || '',
                category: typeof editArticle.category === 'object' ? editArticle.category._id : editArticle.category,
                author: typeof editArticle.author === 'object' ? editArticle.author._id : editArticle.author,
                subcategories: editArticle.subcategories?.map(s => typeof s === 'object' ? s._id : s) || [],
                publishStatus: editArticle.publishStatus || 'draft',
                isFeatured: editArticle.isFeatured || false,
                tags: Array.isArray(editArticle.tags) ? editArticle.tags.join(', ') : editArticle.tags || '',
                sourceName: editArticle.sourceName || '',
                sourceUrl: editArticle.sourceUrl || ''
            });
            if (editArticle.featuredImage) setImagePreview(editArticle.featuredImage);
        } else if (!isEdit && user?.role === 'author') {
            // For new articles, if the user is an author, pre-fill their ID
            setFormData(prev => ({ ...prev, author: user._id }));
        }
    }, [editArticle, isEdit, user]);

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubcategoryToggle = (subId) => {
        setFormData(prev => {
            const current = [...prev.subcategories];
            const index = current.indexOf(subId);
            if (index > -1) {
                current.splice(index, 1);
            } else {
                current.push(subId);
            }
            return { ...prev, subcategories: current };
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSuggestTags = async () => {
        if (!formData.title) return toast.error('Please enter a title first');
        try {
            const data = await fetchApi('/admin/articles/suggest-tags', {
                method: 'POST',
                body: JSON.stringify({ title: formData.title, summary: formData.summary })
            });
            if (data.tags) {
                const currentTags = formData.tags ? formData.tags.split(',').map(t => t.trim()) : [];
                const newTags = [...new Set([...currentTags, ...data.tags])].filter(Boolean);
                handleChange('tags', newTags.join(', '));
                toast.success('Tags suggested');
            }
        } catch (err) {
            toast.error('AI Suggestion failed');
        }
    };

    const handleGenerateSlug = async () => {
        if (!formData.title) return toast.error('Please enter a title first');
        try {
            const data = await fetchApi('/admin/articles/generate-slug', {
                method: 'POST',
                body: JSON.stringify({ title: formData.title })
            });
            if (data.slug) {
                handleChange('slug', data.slug);
                toast.success('Slug generated');
            }
        } catch (err) {
            toast.error('Slug generation failed');
        }
    };

    const [quickCatOpen, setQuickCatOpen] = useState(false);
    const [quickSubOpen, setQuickSubOpen] = useState(false);
    const [quickCatName, setQuickCatName] = useState('');
    const [quickSubName, setQuickSubName] = useState('');

    const createCatMutation = useMutation({
        mutationFn: (name) => fetchApi('/admin/categories', {
            method: 'POST',
            body: JSON.stringify({ name })
        }),
        onSuccess: (res) => {
            queryClient.invalidateQueries(['admin', 'categories']);
            setQuickCatName('');
            setQuickCatOpen(false);
            handleChange('category', res.data._id);
            toast.success('Category created and selected');
        }
    });

    const createSubMutation = useMutation({
        mutationFn: (data) => fetchApi('/admin/subcategories', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        onSuccess: (res) => {
            queryClient.invalidateQueries(['admin', 'subcategories']);
            setQuickSubName('');
            setQuickSubOpen(false);
            handleSubcategoryToggle(res.data._id);
            toast.success('Subcategory appended to selection');
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'subcategories') {
                formData[key].forEach(sub => data.append('subcategories[]', sub));
            } else {
                data.append(key, formData[key]);
            }
        });
        if (imageFile) data.append('image', imageFile);

        try {
            const url = isEdit ? `/admin/articles/${id}` : '/admin/articles';
            const result = await fetchApi(url, {
                method: 'POST', // Backend currently uses POST for both creation and updates with Multer
                body: data,
                headers: {} // Remove content-type to let browser set boundary for multipart
            });

            toast.success(isEdit ? 'Article updated' : 'Article published');
            queryClient.invalidateQueries(['admin', 'articles']);
            navigate(`${prefix}/articles`);
        } catch (err) {
            toast.error(err.message || 'Submission failed');
        } finally {
            setLoading(false);
        }
    };

    if (fetchingArticle) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-green-500" />
            </div>
        );
    }

    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image', 'video'],
            ['clean']
        ],
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(`${prefix}/articles`)} className="rounded-full hover:bg-slate-100 h-10 w-10">
                        <ArrowLeft className="w-5 h-5 text-slate-500" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 italic">
                            {isEdit ? 'Refine Story' : 'Compose News'}
                        </h1>
                        <p className="text-slate-500 mt-1 font-medium">Drafting the next big headline for the Chronicle.</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-white border-slate-200 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden border-none">
                        <CardContent className="p-8 space-y-8">
                            <div className="space-y-3">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Main Headline</Label>
                                <Input
                                    placeholder="Enter a power-packed title..."
                                    value={formData.title}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                    required
                                    className="bg-slate-50 border-slate-200 text-xl font-black py-7 rounded-2xl focus:ring-green-500 focus:border-green-500"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400">SEO Permaslug</Label>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleGenerateSlug}
                                            className="text-[10px] font-black uppercase tracking-widest text-green-600 hover:bg-green-50 px-2 py-0 h-6"
                                        >
                                            <LinkIcon className="w-3 h-3 mr-1" /> Auto-sync
                                        </Button>
                                    </div>
                                    <Input
                                        placeholder="url-path-slug"
                                        value={formData.slug}
                                        onChange={(e) => handleChange('slug', e.target.value)}
                                        className="bg-slate-50 border-slate-200 font-mono text-xs rounded-xl h-12"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Keywords (Meta)</Label>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleSuggestTags}
                                            className="text-[10px] font-black uppercase tracking-widest text-green-600 hover:bg-green-50 px-2 py-0 h-6"
                                        >
                                            <Sparkles className="w-3 h-3 mr-1" /> AI Suggest
                                        </Button>
                                    </div>
                                    <Input
                                        placeholder="Add tag markers..."
                                        value={formData.tags}
                                        onChange={(e) => handleChange('tags', e.target.value)}
                                        className="bg-slate-50 border-slate-200 rounded-xl h-12"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Executive Summary</Label>
                                <Textarea
                                    placeholder="Hook your readers with a summary..."
                                    value={formData.summary}
                                    onChange={(e) => handleChange('summary', e.target.value)}
                                    className="bg-slate-50 border-slate-200 rounded-xl font-medium"
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-3">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Story Body</Label>
                                <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-inner">
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.content}
                                        onChange={(val) => handleChange('content', val)}
                                        modules={quillModules}
                                        className="editor-modern min-h-[400px]"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="bg-white border-slate-200 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden border-none sticky top-20">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-800">Dispatch Controls</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-500">Live Status</Label>
                                <Select
                                    value={formData.publishStatus}
                                    onValueChange={(val) => handleChange('publishStatus', val)}
                                >
                                    <SelectTrigger className="bg-slate-50 border-slate-200 rounded-xl font-bold h-11">
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-slate-200 text-slate-700 font-medium">
                                        <SelectItem value="draft" className="rounded-lg">Draft (In-Office)</SelectItem>
                                        <SelectItem value="pending" className="rounded-lg">Awaiting Review</SelectItem>
                                        <SelectItem value="published" className="rounded-lg text-green-600 font-bold">Go Live (Public)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-bold text-slate-500">Category Feed</Label>
                                    <Dialog open={quickCatOpen} onOpenChange={setQuickCatOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-6 text-[10px] uppercase font-black tracking-widest text-green-600 hover:text-green-700 hover:bg-green-50 px-1 italic">
                                                <Plus className="w-3 h-3 mr-1" /> Quick Define
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="bg-white border-none rounded-[2rem] p-8">
                                            <DialogHeader>
                                                <DialogTitle className="text-2xl font-black italic uppercase">New Navigation Node</DialogTitle>
                                                <DialogDescription className="italic font-medium">Add a top-level section to the portal.</DialogDescription>
                                            </DialogHeader>
                                            <div className="py-6">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Node Name</Label>
                                                <Input
                                                    value={quickCatName}
                                                    onChange={(e) => setQuickCatName(e.target.value)}
                                                    className="bg-slate-50 border-slate-100 rounded-xl font-bold mt-2 h-12"
                                                    placeholder="e.g. Technology"
                                                />
                                            </div>
                                            <DialogFooter>
                                                <Button
                                                    onClick={() => createCatMutation.mutate(quickCatName)}
                                                    disabled={!quickCatName || createCatMutation.isLoading}
                                                    className="w-full bg-green-600 h-12 rounded-xl text-white font-black italic"
                                                >
                                                    {createCatMutation.isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <Plus className="w-5 h-5 mr-1" />}
                                                    Anchor New Section
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <Select
                                    value={formData.category}
                                    onValueChange={(val) => {
                                        handleChange('category', val);
                                        handleChange('subcategories', []); // Clear subcategories on category change
                                    }}
                                >
                                    <SelectTrigger className="bg-slate-50 border-slate-200 rounded-xl font-bold h-11">
                                        <SelectValue placeholder="Assign Section" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-slate-200 text-slate-700 font-medium">
                                        {categoriesData?.map(cat => (
                                            <SelectItem key={cat._id} value={cat._id} className="rounded-lg">{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {formData.category && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-bold text-slate-500">Sub-Sections</Label>
                                        <Dialog open={quickSubOpen} onOpenChange={setQuickSubOpen}>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-6 text-[10px] uppercase font-black tracking-widest text-green-600 hover:text-green-700 hover:bg-green-50 px-1 italic">
                                                    <Tag className="w-3 h-3 mr-1" /> Append Sub-Node
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="bg-white border-none rounded-[2rem] p-8">
                                                <DialogHeader>
                                                    <DialogTitle className="text-2xl font-black italic uppercase">Append Sub-Section</DialogTitle>
                                                    <DialogDescription className="italic font-medium text-green-600">Nesting under {categoriesData?.find(c => c._id === formData.category)?.name}</DialogDescription>
                                                </DialogHeader>
                                                <div className="py-6">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Node Label</Label>
                                                    <Input
                                                        value={quickSubName}
                                                        onChange={(e) => setQuickSubName(e.target.value)}
                                                        className="bg-slate-50 border-slate-100 rounded-xl font-bold mt-2 h-12"
                                                        placeholder="e.g. AI & Robotics"
                                                    />
                                                </div>
                                                <DialogFooter>
                                                    <Button
                                                        onClick={() => createSubMutation.mutate({ name: quickSubName, category: formData.category })}
                                                        disabled={!quickSubName || createSubMutation.isLoading}
                                                        className="w-full bg-green-600 h-12 rounded-xl text-white font-black italic"
                                                    >
                                                        {createSubMutation.isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <Plus className="w-5 h-5 mr-1" />}
                                                        Anchor Sub-Section
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl min-h-[44px]">
                                        {loadingSubcategories ? (
                                            <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                                        ) : subcategoriesData?.length > 0 ? (
                                            subcategoriesData.map(sub => (
                                                <Badge
                                                    key={sub._id}
                                                    variant={formData.subcategories.includes(sub._id) ? "default" : "outline"}
                                                    className={`cursor-pointer transition-all px-3 py-1 text-[10px] uppercase font-black tracking-widest ${formData.subcategories.includes(sub._id)
                                                        ? "bg-green-600 hover:bg-green-700 text-white border-none shadow-md shadow-green-100"
                                                        : "bg-white border-slate-200 text-slate-400 hover:bg-slate-100"
                                                        }`}
                                                    onClick={() => handleSubcategoryToggle(sub._id)}
                                                >
                                                    {sub.name}
                                                </Badge>
                                            ))
                                        ) : (
                                            <p className="text-[10px] text-slate-400 italic">No subcategories available.</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-500">Editorial Byline</Label>
                                {user?.role === 'admin' ? (
                                    <Select
                                        value={formData.author}
                                        onValueChange={(val) => handleChange('author', val)}
                                    >
                                        <SelectTrigger className="bg-slate-50 border-slate-200 rounded-xl font-bold h-11">
                                            <SelectValue placeholder="Assign Journalist" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-slate-200 text-slate-700 font-medium">
                                            {authorsData?.map(auth => (
                                                <SelectItem key={auth._id} value={auth._id} className="rounded-lg">{auth.name || auth.email}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-[10px] font-black text-green-600">
                                            {user?.name?.charAt(0)}
                                        </div>
                                        <span className="text-sm font-bold text-slate-500 italic">{user?.name} (Locked)</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <Label className="text-xs font-bold text-slate-500">Cover Visual</Label>
                                <div
                                    className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center cursor-pointer hover:bg-slate-50 transition-all group overflow-hidden bg-slate-50/50"
                                    onClick={() => document.getElementById('imageInput').click()}
                                >
                                    {imagePreview ? (
                                        <div className="relative group">
                                            <img src={imagePreview} className="w-full h-48 object-cover rounded-xl shadow-md" alt="Preview" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all rounded-xl">
                                                <ImageIcon className="text-white w-8 h-8" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-48 flex flex-col items-center justify-center text-slate-400">
                                            <ImageIcon className="w-12 h-12 mb-3 text-slate-200" />
                                            <p className="text-[10px] font-black uppercase tracking-widest italic">Drop Hero Image Here</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        id="imageInput"
                                        className="hidden"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                    />
                                    <Button variant="outline" size="sm" type="button" className="mt-4 border-slate-200 text-slate-500 font-bold rounded-full w-full bg-white hover:bg-slate-50">
                                        {imagePreview ? 'Update Asset' : 'Select From Local'}
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-5 bg-green-50/50 rounded-2xl border border-green-100 shadow-sm shadow-green-100/50">
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-black text-green-700 italic">Featured Slot</Label>
                                    <p className="text-[10px] text-green-600 font-medium">Front-page highlights</p>
                                </div>
                                <Switch
                                    checked={formData.isFeatured}
                                    onCheckedChange={(val) => handleChange('isFeatured', val)}
                                    className="data-[state=checked]:bg-green-600"
                                />
                            </div>

                            <div className="flex flex-col gap-3 pt-4">
                                <Button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-700 text-white font-black py-7 rounded-2xl shadow-xl shadow-green-200 italic text-lg"
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className="w-6 h-6 animate-spin mr-3" /> : <Save className="w-6 h-6 mr-3" />}
                                    {isEdit ? 'Secure Update' : 'Initialize Feed'}
                                </Button>
                                <Button variant="ghost" type="button" onClick={() => navigate(`${prefix}/articles`)} className="text-slate-400 font-bold hover:bg-slate-50 rounded-xl">
                                    Discard Changes
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    );
}
