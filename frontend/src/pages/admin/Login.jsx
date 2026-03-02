import React, { useState } from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Newspaper, Loader2, User } from 'lucide-react';
import { toast } from 'sonner';
export default function AdminLogin() {
    const location = useLocation();
    // Default to author if path is just /login or contains /author
    const isAuthor = location.pathname.includes('/author') || location.pathname === '/login';
    const isAdminPath = location.pathname.includes('/admin');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAdminAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await login(email, password);
            const userRole = data.data.user.role;

            // Verify role matches the portal entry point
            if (isAdminPath && userRole !== 'admin') {
                throw new Error('Access Denied: This portal is reserved for high-level Administrators only.');
            }

            toast.success(`Access Granted! Welcome back, ${data.data.user.name}.`);

            // Intelligence: Redirect to the CORRECT panel based on role
            // Admin always goes to /admin, Author always goes to /author
            const dashboardPath = userRole === 'admin' ? '/admin/dashboard' : '/author/dashboard';
            navigate(dashboardPath);
        } catch (error) {
            toast.error(error.message || 'Verification Failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-inter">
            <div className="absolute top-0 left-0 w-full h-1 bg-green-600"></div>
            <Card className="w-full max-w-md bg-white border-slate-200 shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden">
                <CardHeader className="text-center space-y-4 pb-8 pt-10">
                    <div className={`mx-auto p-4 rounded-2xl w-fit shadow-lg ${isAuthor ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-green-600 text-white shadow-green-200'}`}>
                        {isAuthor ? <User className="w-8 h-8" /> : <Newspaper className="w-8 h-8" />}
                    </div>
                    <div className="space-y-1">
                        <CardTitle className="text-3xl font-black text-slate-900 tracking-tight uppercase italic underline decoration-green-500/30 decoration-4 underline-offset-4">
                            {isAuthor ? 'Author Executive' : 'Master Administrator'}
                        </CardTitle>
                        <CardDescription className="text-slate-500 font-medium">
                            {isAuthor
                                ? 'Digital newsroom entry for verified journalists'
                                : 'High-level gateway for chronicle command & control'}
                        </CardDescription>
                    </div>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6 px-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Editorial Email</label>
                            <Input
                                type="email"
                                placeholder="journalist@chronicle.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-slate-50 border-slate-100 text-slate-900 placeholder:text-slate-400 h-12 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Security Key</label>
                                <Link to="/admin/forgot-password" title="Recover Access" className="text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-green-600 transition-colors italic">
                                    Lost Password?
                                </Link>
                            </div>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-slate-50 border-slate-100 text-slate-900 placeholder:text-slate-400 h-12 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium"
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="p-8 pt-4">
                        <Button
                            type="submit"
                            className={`w-full h-14 rounded-2xl text-white font-black italic uppercase tracking-widest text-sm shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] ${isAuthor
                                ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                                : 'bg-green-600 hover:bg-green-700 shadow-green-200'
                                }`}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                            {isAuthor ? 'Initialize Author Workspace' : 'Authorize Admin Access'}
                        </Button>
                    </CardFooter>
                </form>
                <div className="bg-slate-50 p-4 border-t border-slate-100 text-center">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        Daily Chronicle Engine Beta v2.4.0
                    </p>
                </div>
            </Card>
        </div>
    );
}
