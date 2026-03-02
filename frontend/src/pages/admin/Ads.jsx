import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
    Edit,
    Trash2,
    Loader2,
    Calendar,
    ExternalLink,
    Image as ImageIcon,
    Target,
    Layout,
    Save,
    X,
    Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from 'sonner';
import { getFullImageUrl } from '@/lib/utils';

export default function Ads() {
    const queryClient = useQueryClient();
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingAd, setEditingAd] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        type: 'banner',
        location: 'homepage-top',
        link: '',
        startDate: '',
        endDate: '',
        status: 'active'
    });

    const { data: ads, isLoading } = useQuery({
        queryKey: ['admin', 'ads'],
        queryFn: () => fetchApi('/admin/ads').then(res => res.data)
    });

    const mutation = useMutation({
        mutationFn: (data) => {
            const formDataToSend = new FormData();
            Object.keys(data).forEach(key => formDataToSend.append(key, data[key]));
            if (imageFile) formDataToSend.append('image', imageFile);

            const url = editingAd ? `/admin/ads/${editingAd._id}` : '/admin/ads';
            return fetchApi(url, {
                method: editingAd ? 'PUT' : 'POST',
                body: formDataToSend,
                headers: {}
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'ads']);
            toast.success(editingAd ? 'Campaign updated' : 'Campaign launched');
            resetForm();
        },
        onError: (err) => toast.error(err.message || 'Action failed')
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => fetchApi(`/admin/ads/${id}`, { method: 'DELETE' }),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'ads']);
            toast.success('Ad campaign removed');
        }
    });

    const handleEdit = (ad) => {
        setEditingAd(ad);
        setFormData({
            title: ad.title || '',
            type: ad.type || 'banner',
            location: ad.location || 'homepage-top',
            link: ad.link || '',
            startDate: ad.startDate ? new Date(ad.startDate).toISOString().split('T')[0] : '',
            endDate: ad.endDate ? new Date(ad.endDate).toISOString().split('T')[0] : '',
            status: ad.status || 'active'
        });
        setImagePreview(ad.image);
        setIsSheetOpen(true);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            type: 'banner',
            location: 'homepage-top',
            link: '',
            startDate: '',
            endDate: '',
            status: 'active'
        });
        setImageFile(null);
        setImagePreview(null);
        setEditingAd(null);
        setIsSheetOpen(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const getStatusBadge = (ad) => {
        const now = new Date();
        const start = new Date(ad.startDate);
        const end = new Date(ad.endDate);

        if (now < start) return <Badge variant="outline" className="text-amber-600 bg-amber-50 border-amber-100">Scheduled</Badge>;
        if (now > end) return <Badge variant="outline" className="text-slate-400 bg-slate-50 border-slate-100">Expired</Badge>;
        return <Badge variant="outline" className="text-green-600 bg-green-50 border-green-100 font-bold">Live</Badge>;
    };

    if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-green-500 w-10 h-10" /></div>;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 italic">Campaign Commander</h1>
                    <p className="text-slate-500 mt-1 font-medium">Strategize and deploy commercial slots across the Daily News portal.</p>
                </div>
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <Button onClick={() => { resetForm(); setIsSheetOpen(true); }} className="bg-green-600 hover:bg-green-700 text-white shadow-xl shadow-green-200 rounded-full h-12 px-6">
                            <Plus className="w-5 h-5 mr-2" /> Launch New Campaign
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="bg-white sm:max-w-md border-l border-slate-100 shadow-2xl p-0">
                        <div className="h-full flex flex-col">
                            <SheetHeader className="p-8 bg-slate-50/50 border-b border-slate-100 text-left">
                                <SheetTitle className="text-2xl font-black italic text-slate-900">{editingAd ? 'Adjust Campaign' : 'Initialize Campaign'}</SheetTitle>
                                <SheetDescription className="font-medium">Define your commercial asset and deployment zone.</SheetDescription>
                            </SheetHeader>
                            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Campaign Title</Label>
                                    <Input
                                        placeholder="e.g. Summer Festival 2024"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="h-12 bg-slate-50 border-slate-100 rounded-xl font-bold"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Ad Format</Label>
                                        <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                                            <SelectTrigger className="h-11 bg-slate-50 border-slate-100 rounded-xl font-bold">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-slate-200">
                                                <SelectItem value="banner">Static Banner</SelectItem>
                                                <SelectItem value="video">Promotional Video</SelectItem>
                                                <SelectItem value="sponsored">Native Article</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Deployment zone</Label>
                                        <Select value={formData.location} onValueChange={(v) => setFormData({ ...formData, location: v })}>
                                            <SelectTrigger className="h-11 bg-slate-50 border-slate-100 rounded-xl font-bold">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-slate-200">
                                                <SelectItem value="homepage-top">Homepage Hero</SelectItem>
                                                <SelectItem value="sidebar">Article Sidebar</SelectItem>
                                                <SelectItem value="article-middle">Inline Content</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Destination URL</Label>
                                    <Input
                                        placeholder="https://client-site.com"
                                        value={formData.link}
                                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                        className="h-12 bg-slate-50 border-slate-100 rounded-xl"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Commencement</Label>
                                        <div className="relative">
                                            <Input
                                                type="date"
                                                value={formData.startDate}
                                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                                className="h-11 bg-slate-50 border-slate-100 rounded-xl font-bold uppercase text-[10px]"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Termination</Label>
                                        <Input
                                            type="date"
                                            value={formData.endDate}
                                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                            className="h-11 bg-slate-50 border-slate-100 rounded-xl font-bold uppercase text-[10px]"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Visual Asset</Label>
                                    <div
                                        className="border-2 border-dashed border-slate-100 rounded-3xl p-6 text-center cursor-pointer hover:bg-slate-50 transition-all group overflow-hidden bg-slate-50/30"
                                        onClick={() => document.getElementById('adImageInput').click()}
                                    >
                                        {imagePreview ? (
                                            <img src={getFullImageUrl(imagePreview)} className="w-full h-40 object-cover rounded-2xl shadow-lg border-2 border-white" alt="Ad Preview" />
                                        ) : (
                                            <div className="h-40 flex flex-col items-center justify-center text-slate-300">
                                                <Upload className="w-10 h-10 mb-2 opacity-50" />
                                                <p className="text-[10px] uppercase font-black tracking-widest italic">Upload Ad Creative</p>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            id="adImageInput"
                                            className="hidden"
                                            onChange={handleImageChange}
                                            accept="image/*"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex gap-4">
                                <Button
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-black italic rounded-2xl h-14 shadow-xl shadow-green-100"
                                    onClick={() => mutation.mutate(formData)}
                                    disabled={mutation.isLoading}
                                >
                                    {mutation.isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                                    {editingAd ? 'Synchronize' : 'Authorize Feed'}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="px-6 rounded-2xl border-slate-200 text-slate-400 font-bold"
                                    onClick={resetForm}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {ads?.map((ad) => (
                    <Card key={ad._id} className="bg-white border-none shadow-xl shadow-slate-200/50 overflow-hidden group rounded-3xl transition-all hover:-translate-y-1">
                        <div className="h-48 bg-slate-100 relative overflow-hidden">
                            {ad.image ? (
                                <img src={getFullImageUrl(ad.image)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={ad.title} />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                                    <ImageIcon className="w-12 h-12 mb-2 opacity-30" />
                                    <p className="text-[10px] font-black uppercase tracking-widest italic">No Creative Asset</p>
                                </div>
                            )}
                            <div className="absolute top-4 right-4">
                                {getStatusBadge(ad)}
                            </div>
                            <div className="absolute bottom-4 left-4">
                                <Badge className="bg-white/90 backdrop-blur-md text-slate-900 border-none shadow-lg text-[9px] uppercase font-black tracking-widest px-3 py-1">
                                    {ad.type}
                                </Badge>
                            </div>
                        </div>
                        <CardContent className="p-6 space-y-6">
                            <div>
                                <h3 className="font-extrabold text-slate-800 text-xl italic leading-tight truncate">{ad.title}</h3>
                                <div className="flex items-center gap-3 mt-3">
                                    <div className="p-1.5 rounded-lg bg-green-50 text-green-600">
                                        <Target className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">{ad.location}</span>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                        <Calendar className="w-3 h-3 text-green-500" /> Deployment Schedule
                                    </div>
                                    <span className="text-xs font-bold text-slate-600 italic">
                                        {new Date(ad.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} — {new Date(ad.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                                {ad.link && (
                                    <a href={ad.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-slate-50 rounded-xl group/link hover:bg-green-50 transition-all border border-transparent hover:border-green-100">
                                        <span className="text-xs font-bold text-slate-500 group-hover/link:text-green-600">Destination Tunnel</span>
                                        <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover/link:text-green-500 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all" />
                                    </a>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-4">
                                <Button size="sm" variant="ghost" onClick={() => handleEdit(ad)} className="rounded-full hover:bg-green-50 hover:text-green-600 text-slate-400 font-bold px-4">
                                    <Edit className="w-3.5 h-3.5 mr-2" /> Modify
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="rounded-full hover:bg-red-50 hover:text-red-500 text-slate-400 font-bold px-4"
                                    onClick={() => { if (confirm('Terminate this Campaign?')) deleteMutation.mutate(ad._id); }}
                                >
                                    <Trash2 className="w-3.5 h-3.5 mr-2" /> Terminate
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {ads?.length === 0 && !isLoading && (
                    <div className="col-span-full py-24 text-center">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-slate-100">
                            <Layout className="w-10 h-10 text-slate-200" />
                        </div>
                        <h3 className="text-slate-900 font-black italic text-2xl uppercase tracking-tighter">No Active Campaigns</h3>
                        <p className="text-slate-500 max-w-sm mx-auto mt-2 font-medium">Capture your audience's attention by launching your first commercial slot deployment today.</p>
                        <Button onClick={() => setIsSheetOpen(true)} className="mt-8 bg-green-600 hover:bg-green-700 text-white rounded-full px-8 py-6 h-auto shadow-xl shadow-green-100 font-black italic uppercase tracking-widest text-xs">
                            Start First Campaign
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
