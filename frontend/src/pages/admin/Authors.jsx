import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
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
    Mail,
    Shield,
    User as UserIcon,
    Search,
    ExternalLink,
    MoreHorizontal,
    Verified,
    X,
    Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { getFullImageUrl } from '@/lib/utils';

export default function Authors() {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedAuthor, setSelectedAuthor] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const prefix = location.pathname.startsWith('/author') ? '/author' : '/admin';

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'author',
        bio: ''
    });

    const { data: authors, isLoading } = useQuery({
        queryKey: ['admin', 'authors'],
        queryFn: () => fetchApi('/admin/authors').then(res => res.data)
    });

    const createMutation = useMutation({
        mutationFn: (data) => fetchApi('/admin/authors', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'authors']);
            toast.success('Journalist onboarded successfully');
            setIsAddOpen(false);
            setFormData({ name: '', email: '', password: '', role: 'author', bio: '' });
        },
        onError: (err) => toast.error(err.message)
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => fetchApi(`/admin/authors/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'authors']);
            toast.success('Profile updated');
            setIsEditOpen(false);
        },
        onError: (err) => toast.error(err.message)
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => fetchApi(`/admin/authors/${id}`, { method: 'DELETE' }),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin', 'authors']);
            toast.success('Author access revoked');
        },
        onError: (err) => toast.error(err.message)
    });

    const handleEdit = (auth) => {
        setSelectedAuthor(auth);
        setFormData({
            name: auth.name || '',
            email: auth.email || '',
            role: auth.role || 'author',
            bio: auth.bio || '',
            password: '' // Reset password field empty for editing
        });
        setIsEditOpen(true);
    };

    const filteredAuthors = authors?.filter(a =>
        a.name?.toLowerCase().includes(search.toLowerCase()) ||
        a.email?.toLowerCase().includes(search.toLowerCase())
    );

    if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-green-500 w-12 h-12" /></div>;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-slate-900 italic uppercase">Editorial Team</h1>
                    <p className="text-slate-500 mt-2 font-medium">Manage the voices behind the Daily News Chronicle.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative group w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-green-500 transition-colors" />
                        <Input
                            placeholder="Filter by name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-white border-slate-200 pl-11 h-12 rounded-2xl shadow-sm focus:ring-green-500"
                        />
                    </div>

                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-green-600 hover:bg-green-700 text-white shadow-xl shadow-green-200 rounded-2xl h-12 px-6">
                                <Plus className="w-5 h-5 mr-2" /> Onboard Journalist
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white border-none rounded-[2rem] max-w-lg p-8">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black italic uppercase text-slate-900">New Journalist Account</DialogTitle>
                                <DialogDescription className="font-medium text-slate-500 italic">Create a secure portal access for your team member.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6 pt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</Label>
                                        <Input
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="bg-slate-50 border-slate-100 rounded-xl font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Role Assign</Label>
                                        <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
                                            <SelectTrigger className="bg-slate-50 border-slate-100 rounded-xl font-bold">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-slate-100 font-bold">
                                                <SelectItem value="author">Author</SelectItem>
                                                <SelectItem value="admin">Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</Label>
                                    <Input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="bg-slate-50 border-slate-100 rounded-xl font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security Password</Label>
                                    <Input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="bg-slate-50 border-slate-100 rounded-xl font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Author Narrative</Label>
                                    <Textarea
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        rows={3}
                                        className="bg-slate-50 border-slate-100 rounded-xl font-medium"
                                    />
                                </div>
                            </div>
                            <DialogFooter className="pt-6">
                                <Button onClick={() => createMutation.mutate(formData)} className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl h-12 font-black italic">
                                    {createMutation.isLoading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                                    Finalize Onboarding
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAuthors?.map((auth) => (
                    <Card key={auth._id} className="bg-white border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                        <div className="h-32 bg-gradient-to-br from-green-50 to-emerald-100 relative">
                            <div className="absolute -bottom-12 left-8">
                                <div className="p-1.5 bg-white rounded-full shadow-lg">
                                    <img
                                        src={getFullImageUrl(auth.profileImage) || `https://ui-avatars.com/api/?name=${encodeURIComponent(auth.name)}&background=22c55e&color=fff&size=128`}
                                        className="w-24 h-24 rounded-full object-cover border-4 border-white"
                                        alt={auth.name}
                                    />
                                </div>
                            </div>
                            <div className="absolute top-4 right-4">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button size="icon" variant="ghost" className="rounded-full bg-white/50 backdrop-blur-md hover:bg-white text-slate-600 h-10 w-10">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-white border-slate-100 p-2 rounded-xl shadow-2xl">
                                        <DropdownMenuItem onClick={() => navigate(`${prefix}/articles?authorId=${auth._id}`)} className="rounded-lg font-bold text-slate-600 hover:text-blue-600 cursor-pointer">
                                            <ExternalLink className="w-4 h-4 mr-2" /> View Dispatches
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleEdit(auth)} className="rounded-lg font-bold text-slate-600 hover:text-green-600 cursor-pointer">
                                            <Edit className="w-4 h-4 mr-2" /> Modify Profile
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="rounded-lg font-bold text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                                            onClick={() => { if (confirm('Revoke Access?')) deleteMutation.mutate(auth._id); }}
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" /> Revoke Access
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        <CardContent className="pt-16 pb-8 px-8 space-y-6">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-xl font-black text-slate-800 italic">{auth.name || 'Staff'}</h3>
                                    {auth.role === 'admin' && <Verified className="w-5 h-5 text-green-500" />}
                                </div>
                                <div className="flex items-center text-slate-400 font-bold text-xs uppercase tracking-widest gap-2">
                                    <Shield className={`w-3 h-3 ${auth.role === 'admin' ? 'text-purple-500' : 'text-blue-500'}`} />
                                    {auth.role}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-2xl border border-slate-100">
                                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none mb-1">Direct Contact</p>
                                    <p className="text-xs font-bold text-slate-600 truncate italic">{auth.email}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-[1.5rem] text-center border border-transparent hover:border-green-100 transition-colors group/stat">
                                    <p className="text-2xl font-black text-slate-900 group-hover/stat:text-green-600 transition-colors">{auth.articleCount || 0}</p>
                                    <p className="text-[9px] text-slate-400 uppercase font-black tracking-tighter italic">Dispatches</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-[1.5rem] flex flex-col items-center justify-center text-center border border-transparent hover:border-blue-100 transition-colors">
                                    <ExternalLink className="w-5 h-5 text-slate-300 mb-1" />
                                    <p className="text-[9px] text-slate-400 uppercase font-black tracking-tighter italic">Portfolio</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="bg-white border-none rounded-[2rem] max-w-lg p-8">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black italic uppercase text-slate-900">Modify Journalist</DialogTitle>
                        <DialogDescription className="font-medium text-slate-500 italic">Adjust account credentials or profile narrative.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 pt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</Label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="bg-slate-50 border-slate-100 rounded-xl font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Role Assign</Label>
                                <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
                                    <SelectTrigger className="bg-slate-50 border-slate-100 rounded-xl font-bold">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-slate-100 font-bold">
                                        <SelectItem value="author">Author</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-bold">Credential Overhaul (Leave blank to keep current)</Label>
                            <Input
                                type="password"
                                placeholder="Define New Secure Key"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="bg-slate-50 border-slate-100 rounded-xl font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Updated Narrative</Label>
                            <Textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                rows={4}
                                className="bg-slate-50 border-slate-100 rounded-xl font-medium"
                            />
                        </div>
                    </div>
                    <DialogFooter className="pt-6">
                        <Button onClick={() => updateMutation.mutate({ id: selectedAuthor._id, data: formData })} className="w-full bg-slate-900 hover:bg-black text-white rounded-xl h-12 font-black italic shadow-2xl">
                            {updateMutation.isLoading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                            Secure Update
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
