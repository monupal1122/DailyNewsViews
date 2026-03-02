import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
    User,
    Mail,
    Shield,
    Link as LinkIcon,
    Twitter,
    Facebook,
    Instagram,
    Save,
    Loader2,
    Camera
} from 'lucide-react';
import { toast } from 'sonner';
import { getFullImageUrl } from '@/lib/utils';

export default function Account() {
    const { user, checkAuth } = useAdminAuth();
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bio: '',
        twitter: '',
        facebook: '',
        instagram: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                bio: user.bio || '',
                twitter: user.socialLinks?.twitter || '',
                facebook: user.socialLinks?.facebook || '',
                instagram: user.socialLinks?.instagram || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const updateProfile = useMutation({
        mutationFn: (data) => {
            const formDataToSend = new FormData();
            formDataToSend.append('name', data.name);
            formDataToSend.append('email', data.email);
            formDataToSend.append('bio', data.bio);
            formDataToSend.append('socialLinks', JSON.stringify({
                twitter: data.twitter,
                facebook: data.facebook,
                instagram: data.instagram
            }));

            if (imageFile) {
                formDataToSend.append('image', imageFile);
            }

            return fetchApi('/admin/me', {
                method: 'PUT',
                body: formDataToSend,
                headers: {} // Let browser set boundary
            });
        },
        onSuccess: () => {
            toast.success('Profile updated successfully');
            checkAuth();
        },
        onError: (err) => {
            toast.error(err.message || 'Update failed');
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        updateProfile.mutate(formData);
    };

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 italic uppercase">
                    {location.pathname.includes('settings') ? 'System Settings' : 'Account Management'}
                </h1>
                <p className="text-slate-500 mt-1 font-medium">
                    {location.pathname.includes('settings')
                        ? 'Configure your portal preferences and system security.'
                        : 'Manage your public profile and account details with the Chronicle.'}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-6">
                    <Card className="bg-white border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden rounded-2xl">
                        <CardContent className="pt-8">
                            <div className="flex flex-col items-center text-center">
                                <div
                                    className="relative group cursor-pointer mb-6"
                                    onClick={() => document.getElementById('avatar-input').click()}
                                >
                                    <div className="w-36 h-36 rounded-full border-4 border-slate-50 p-1 bg-gradient-to-tr from-green-400 to-emerald-600 shadow-lg group-hover:scale-105 transition-transform duration-500">
                                        <img
                                            src={imagePreview || getFullImageUrl(user.profileImage) || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=22c55e&color=fff&size=200`}
                                            className="w-full h-full rounded-full object-cover border-2 border-white"
                                            alt={user.name}
                                        />
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center bg-green-600/40 rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-[2px]">
                                        <div className="bg-white p-2 rounded-full shadow-lg">
                                            <Camera className="w-6 h-6 text-green-600" />
                                        </div>
                                    </div>
                                    <input
                                        type="file"
                                        id="avatar-input"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 italic underline decoration-green-500">{user.name}</h3>
                                <Badge className="mt-2 bg-slate-900 text-white hover:bg-slate-900 px-4 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-widest">{user.role}</Badge>

                                <div className="mt-8 pt-6 border-t border-slate-100 w-full space-y-4">
                                    <div className="flex flex-col items-start gap-1">
                                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Email Address</p>
                                        <p className="text-slate-700 font-bold truncate w-full">{user.email}</p>
                                    </div>
                                    <div className="flex flex-col items-start gap-1">
                                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Security Level</p>
                                        <div className="flex items-center gap-2 text-green-600 font-bold">
                                            <Shield className="w-4 h-4" />
                                            <span>Tier 1 Authenticated</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-slate-200 shadow-lg shadow-slate-200/50 rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-xs uppercase tracking-widest text-slate-400 font-black">Security</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-xl">
                                Change Password
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <form onSubmit={handleSubmit}>
                        <Card className="bg-white border-slate-200 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                                <CardTitle className="text-xl font-black text-slate-800">Public Profile</CardTitle>
                                <CardDescription className="text-slate-500 font-medium italic">Information shared with your readers across the portal.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-slate-400">Full Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                                            <Input
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="bg-slate-50/50 border-slate-200 pl-10 focus:ring-green-500 rounded-xl font-bold"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-slate-400">Contact Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                                            <Input
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="bg-slate-50/50 border-slate-200 pl-10 focus:ring-green-500 rounded-xl font-bold"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio" className="text-xs font-black uppercase tracking-widest text-slate-400">Author Narrative</Label>
                                    <Textarea
                                        id="bio"
                                        name="bio"
                                        rows={4}
                                        value={formData.bio}
                                        onChange={handleChange}
                                        placeholder="Craft your author story here..."
                                        className="bg-slate-50/50 border-slate-200 focus:ring-green-500 rounded-xl font-medium"
                                    />
                                    <p className="text-[10px] text-slate-400 italic">Recommended length: 300-500 characters.</p>
                                </div>

                                <div className="space-y-6 bg-slate-50/30 p-6 rounded-2xl border border-slate-100">
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center">
                                        <LinkIcon className="w-4 h-4 mr-2 text-green-500" /> Digital Footprint
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="twitter" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                <Twitter className="w-3 h-3 text-sky-400" /> Twitter Handle
                                            </Label>
                                            <Input
                                                id="twitter"
                                                name="twitter"
                                                value={formData.twitter}
                                                onChange={handleChange}
                                                placeholder="username"
                                                className="bg-white border-slate-200 rounded-xl font-bold"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="facebook" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                <Facebook className="w-3 h-3 text-blue-600" /> Facebook Page
                                            </Label>
                                            <Input
                                                id="facebook"
                                                name="facebook"
                                                value={formData.facebook}
                                                onChange={handleChange}
                                                placeholder="profile-slug"
                                                className="bg-white border-slate-200 rounded-xl font-bold"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-6">
                                    <Button
                                        type="submit"
                                        className="bg-green-600 hover:bg-green-700 text-white min-w-[160px] rounded-full shadow-lg shadow-green-200 font-bold h-11"
                                        disabled={updateProfile.isLoading}
                                    >
                                        {updateProfile.isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                        Secure Changes
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </form>
                    <Card className="bg-white border-red-100 shadow-xl shadow-red-50/50 rounded-2xl overflow-hidden border-2 mt-8">
                        <CardHeader className="bg-red-50/50 border-b border-red-100">
                            <CardTitle className="text-xl font-black text-red-800 italic uppercase">System Revocation</CardTitle>
                            <CardDescription className="text-red-500 font-medium">Permanently disconnect your credentials from the Chronicle portal.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="space-y-1">
                                    <h4 className="font-bold text-slate-800">Deactivate Chronicle Access</h4>
                                    <p className="text-sm text-slate-500">This action will strip all editorial permissions and lock your public byline.</p>
                                </div>
                                <Button
                                    variant="destructive"
                                    onClick={() => { if (confirm('⚠️ WARNING: PERMANENT REVOCATION\n\nThis will terminate your account and all associated data. This action is irreversible.\n\nProceed with deactivation?')) { toast.error('Account deletion requires administrative manual override for security.'); } }}
                                    className="bg-red-600 hover:bg-red-700 font-black italic rounded-xl px-8 h-12 shadow-lg shadow-red-200"
                                >
                                    Revoke My Access
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
