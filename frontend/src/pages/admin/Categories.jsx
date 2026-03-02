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
    Check,
    X,
    Layers,
    ChevronRight,
    Tag,
    Save,
    LayoutGrid
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { toast } from 'sonner';

export default function Categories() {
    const queryClient = useQueryClient();
    const [selectedCatId, setSelectedCatId] = useState('');

    // Category Management
    const [isAddCatOpen, setIsAddCatOpen] = useState(false);
    const [catName, setCatName] = useState('');
    const [editingCatId, setEditingCatId] = useState(null);
    const [editCatName, setEditCatName] = useState('');

    // Subcategory Management
    const [isAddSubOpen, setIsAddSubOpen] = useState(false);
    const [subName, setSubName] = useState('');
    const [editingSubId, setEditingSubId] = useState(null);
    const [editSubName, setEditSubName] = useState('');

    // Fetch Categories
    const { data: categories, isLoading: catsLoading } = useQuery({
        queryKey: ['admin', 'categories'],
        queryFn: () => fetchApi('/admin/categories').then(res => res.data),
        onSuccess: (data) => {
            if (data?.length > 0 && !selectedCatId) {
                setSelectedCatId(data[0]._id);
            }
        }
    });

    // Fetch Subcategories
    const { data: subcategories, isLoading: subsLoading } = useQuery({
        queryKey: ['admin', 'subcategories'],
        queryFn: () => fetchApi('/admin/subcategories').then(res => res.data)
    });

    const createCatMutation = useMutation({
        mutationFn: (name) => fetchApi('/admin/categories', {
            method: 'POST',
            body: JSON.stringify({ name })
        }),
        onSuccess: (res) => {
            queryClient.invalidateQueries(['admin', 'categories']);
            setCatName('');
            setIsAddCatOpen(false);
            toast.success('New section initialized');
            if (res.data?._id) setSelectedCatId(res.data._id);
        },
        onError: (err) => toast.error(err.message)
    });

    const updateCatMutation = useMutation({
        mutationFn: ({ id, name }) => fetchApi(`/admin/categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ name })
        }),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'categories']);
            setEditingCatId(null);
            toast.success('Section updated');
        }
    });

    const deleteCatMutation = useMutation({
        mutationFn: (id) => fetchApi(`/admin/categories/${id}`, { method: 'DELETE' }),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'categories']);
            toast.success('Section purged');
        }
    });

    const createSubMutation = useMutation({
        mutationFn: (data) => fetchApi('/admin/subcategories', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'subcategories']);
            setSubName('');
            setIsAddSubOpen(false);
            toast.success('Sub-node appended');
        },
        onError: (err) => toast.error(err.message)
    });

    const updateSubMutation = useMutation({
        mutationFn: ({ id, name }) => fetchApi(`/admin/subcategories/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ name })
        }),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'subcategories']);
            setEditingSubId(null);
            toast.success('Sub-node refined');
        }
    });

    const deleteSubMutation = useMutation({
        mutationFn: (id) => fetchApi(`/admin/subcategories/${id}`, { method: 'DELETE' }),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'subcategories']);
            toast.success('Sub-node detached');
        }
    });

    if (catsLoading || subsLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-green-500 w-12 h-12" /></div>;

    const currentSelectedCategory = categories?.find(c => c._id === selectedCatId);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-slate-900 italic uppercase">Hierarchy Control</h1>
                    <p className="text-slate-500 mt-2 font-medium">Engineer the portal's navigation via semantic content nodes.</p>
                </div>
                <div className="flex gap-3">
                    <Dialog open={isAddCatOpen} onOpenChange={setIsAddCatOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-slate-900 hover:bg-black text-white shadow-xl shadow-slate-200 rounded-2xl h-12 px-6 font-bold italic">
                                <Plus className="w-5 h-5 mr-2" /> Define Section
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white border-none rounded-[2rem] p-8">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black italic uppercase text-slate-900">New Category Node</DialogTitle>
                                <DialogDescription className="font-medium text-slate-500 italic">Add a top-level classification for the news engine.</DialogDescription>
                            </DialogHeader>
                            <div className="py-6">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Node Designation</Label>
                                <Input
                                    placeholder="e.g. World Affairs"
                                    value={catName}
                                    onChange={(e) => setCatName(e.target.value)}
                                    className="bg-slate-50 border-slate-100 rounded-xl font-bold h-12 mt-2"
                                />
                            </div>
                            <DialogFooter>
                                <Button onClick={() => createCatMutation.mutate(catName)} className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl h-12 font-black italic">
                                    <Plus className="w-5 h-5 mr-2" /> Initialize Section
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isAddSubOpen} onOpenChange={setIsAddSubOpen}>
                        <DialogTrigger asChild>
                            <Button disabled={!selectedCatId} className="bg-green-600 hover:bg-green-700 text-white shadow-xl shadow-green-200 rounded-2xl h-12 px-6 font-bold italic">
                                <Tag className="w-5 h-5 mr-2" /> Append Sub-Node
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white border-none rounded-[2rem] p-8">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black italic uppercase text-slate-900">Add Sub-Section</DialogTitle>
                                <DialogDescription className="font-medium text-slate-500 italic">Nesting under: <span className="text-green-600 font-black">{currentSelectedCategory?.name}</span></DialogDescription>
                            </DialogHeader>
                            <div className="py-6 space-y-4">
                                <div>
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Parent</Label>
                                    <Select value={selectedCatId} onValueChange={setSelectedCatId}>
                                        <SelectTrigger className="bg-slate-50 border-slate-100 rounded-xl font-bold h-12 mt-2">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-slate-100 font-bold">
                                            {categories?.map(c => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sub-Node Label</Label>
                                    <Input
                                        placeholder="e.g. European Union"
                                        value={subName}
                                        onChange={(e) => setSubName(e.target.value)}
                                        className="bg-slate-50 border-slate-100 rounded-xl font-bold h-12 mt-2"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={() => createSubMutation.mutate({ name: subName, category: selectedCatId })} className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl h-12 font-black italic">
                                    <Plus className="w-5 h-5 mr-2" /> Anchor Sub-Node
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* CATEGORIES SECTION */}
                <Card className="bg-white border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8 flex flex-row items-center gap-4">
                        <div className="p-3 bg-white rounded-2xl shadow-sm text-slate-900"><LayoutGrid className="w-6 h-6" /></div>
                        <div>
                            <CardTitle className="text-xl font-black text-slate-800 uppercase italic">Primary Feed Sections</CardTitle>
                            <CardDescription className="italic font-medium">High-level navigation anchors</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="space-y-3">
                            {categories?.map((cat) => (
                                <div
                                    key={cat._id}
                                    onClick={() => setSelectedCatId(cat._id)}
                                    className={`flex items-center justify-between p-5 rounded-3xl transition-all cursor-pointer border ${selectedCatId === cat._id ? 'bg-green-50/50 border-green-200 shadow-lg shadow-green-100/50 translate-x-1' : 'bg-white border-slate-100 hover:border-green-100 hover:bg-slate-50/50'}`}
                                >
                                    <div className="flex-1 min-w-0 pr-4">
                                        {editingCatId === cat._id ? (
                                            <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                                                <Input
                                                    value={editCatName}
                                                    onChange={(e) => setEditCatName(e.target.value)}
                                                    className="h-10 bg-white border-green-200 font-bold"
                                                    autoFocus
                                                />
                                                <Button size="icon" onClick={() => updateCatMutation.mutate({ id: cat._id, name: editCatName })} className="h-10 w-10 bg-green-600 shrink-0 rounded-xl"><Check size={18} /></Button>
                                                <Button variant="ghost" size="icon" onClick={() => setEditingCatId(null)} className="h-10 w-10 text-slate-400 shrink-0 rounded-xl"><X size={18} /></Button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-4">
                                                <div className={`w-3 h-3 rounded-full ${selectedCatId === cat._id ? 'bg-green-500 animate-pulse' : 'bg-slate-200'}`} />
                                                <span className="font-extrabold text-lg text-slate-800 italic">{cat.name}</span>
                                                <Badge variant="outline" className="text-[10px] uppercase font-black tracking-widest text-slate-400 border-none bg-slate-100/50 px-3">
                                                    {subcategories?.filter(s => (s.category?._id || s.category) === cat._id).length} Nodes
                                                </Badge>
                                            </div>
                                        )}
                                    </div>
                                    {editingCatId !== cat._id && (
                                        <div className="flex gap-2">
                                            <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); setEditingCatId(cat._id); setEditCatName(cat.name); }} className="h-10 w-10 text-slate-400 hover:text-green-600 hover:bg-white rounded-xl"><Edit size={16} /></Button>
                                            <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); if (confirm('Purge Category?')) deleteCatMutation.mutate(cat._id); }} className="h-10 w-10 text-slate-400 hover:text-red-500 hover:bg-white rounded-xl"><Trash2 size={16} /></Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* SUBCATEGORIES SECTION */}
                <Card className="bg-white border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="bg-green-50/50 border-b border-green-100 p-8 flex flex-row items-center gap-4">
                        <div className="p-3 bg-white rounded-2xl shadow-sm text-green-600"><Tag className="w-6 h-6" /></div>
                        <div>
                            <CardTitle className="text-xl font-black text-slate-800 uppercase italic">Sub-Section Distribution</CardTitle>
                            <CardDescription className="italic font-medium text-green-600/70">Nesting under {currentSelectedCategory?.name}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        {selectedCatId ? (
                            <div className="space-y-3">
                                {subcategories?.filter(s => (s.category?._id || s.category) === selectedCatId).map(sub => (
                                    <div key={sub._id} className="flex items-center justify-between p-5 rounded-3xl bg-slate-50/50 border border-slate-100 group hover:border-green-100 hover:bg-white transition-all">
                                        <div className="flex-1 min-w-0 pr-4">
                                            {editingSubId === sub._id ? (
                                                <div className="flex gap-2">
                                                    <Input
                                                        value={editSubName}
                                                        onChange={(e) => setEditSubName(e.target.value)}
                                                        className="h-10 bg-white border-green-200 font-bold"
                                                        autoFocus
                                                    />
                                                    <Button size="icon" onClick={() => updateSubMutation.mutate({ id: sub._id, name: editSubName })} className="h-10 w-10 bg-green-600 shrink-0 rounded-xl"><Check size={18} /></Button>
                                                    <Button variant="ghost" size="icon" onClick={() => setEditingSubId(null)} className="h-10 w-10 text-slate-400 shrink-0 rounded-xl"><X size={18} /></Button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-4">
                                                    <ChevronRight className="w-4 h-4 text-green-400" />
                                                    <span className="font-bold text-slate-600 uppercase tracking-tighter italic">{sub.name}</span>
                                                </div>
                                            )}
                                        </div>
                                        {editingSubId !== sub._id && (
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button size="icon" variant="ghost" onClick={() => { setEditingSubId(sub._id); setEditSubName(sub.name); }} className="h-10 w-10 text-slate-400 hover:text-green-600 hover:bg-slate-50 rounded-xl"><Edit size={16} /></Button>
                                                <Button size="icon" variant="ghost" onClick={() => { if (confirm('Remove Sub?')) deleteSubMutation.mutate(sub._id); }} className="h-10 w-10 text-slate-400 hover:text-red-500 hover:bg-slate-50 rounded-xl"><Trash2 size={16} /></Button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {subcategories?.filter(s => (s.category?._id || s.category) === selectedCatId).length === 0 && (
                                    <div className="p-16 text-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
                                        <Tag className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                        <p className="italic text-slate-400 font-medium">No sub-nodes defined for this segment.</p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setIsAddSubOpen(true)}
                                            className="mt-6 border-slate-200 text-slate-500 font-black italic rounded-full h-10 px-6"
                                        >
                                            Add First Sub-Section
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="p-16 border-2 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center text-center opacity-50">
                                <Layers className="w-16 h-16 text-slate-200 mb-4" />
                                <p className="font-black text-slate-300 uppercase tracking-widest text-xs">Awaiting Parent Node Selection <br /> to Manage Child Hierarchy</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
