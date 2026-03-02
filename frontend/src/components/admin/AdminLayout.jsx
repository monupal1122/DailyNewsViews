import React, { useState } from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    Layers,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronRight,
    User,
    Bell,
    Search,
    Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuItem,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { getFullImageUrl } from '@/lib/utils';

export default function AdminLayout() {
    const { user, logout, loading } = useAdminAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    if (loading) return null;
    if (!user) {
        const redirectPath = location.pathname.startsWith('/author') ? '/author/login' : '/admin/login';
        navigate(redirectPath);
        return null;
    }

    // Role-based portal enforcement
    const isAuthorPortal = location.pathname.startsWith('/author');
    const isAdminPortal = location.pathname.startsWith('/admin');

    if (user.role === 'author' && isAdminPortal) {
        navigate('/author/dashboard');
        return null;
    }

    if (user.role === 'admin' && isAuthorPortal) {
        navigate('/admin/dashboard');
        return null;
    }

    const prefix = location.pathname.startsWith('/author') ? '/author' : '/admin';

    const menuItems = [
        { label: 'Dashboard', icon: LayoutDashboard, path: `${prefix}/dashboard` },
        { label: 'Articles', icon: FileText, path: `${prefix}/articles` },
        { label: 'Categories', icon: Layers, path: `${prefix}/categories` },
        { label: 'Authors', icon: Users, path: `${prefix}/authors`, roles: ['admin'] },
        { label: 'Ads Management', icon: Bell, path: `${prefix}/ads` },
        { label: 'Account', icon: User, path: `${prefix}/account` },
        { label: 'Settings', icon: Settings, path: `${prefix}/settings`, roles: ['admin'] },
    ];

    const filteredItems = menuItems.filter(item => !item.roles || item.roles.includes(user.role));

    return (
        <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-inter">
            {/* Sidebar */}
            <aside
                className={`${sidebarOpen ? 'w-64' : 'w-20'
                    } bg-white border-r border-slate-200 transition-all duration-300 flex flex-col z-50`}
            >
                <div className="p-6 flex items-center justify-between">
                    {sidebarOpen && <h1 className="text-xl font-bold text-green-500">Chronicle</h1>}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="hover:bg-slate-100 text-slate-500"
                    >
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </Button>
                </div>

                <ScrollArea className="flex-1 px-3">
                    <nav className="space-y-2 mt-4">
                        {filteredItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${location.pathname === item.path
                                    ? 'bg-green-600 text-white shadow-lg shadow-green-600/20'
                                    : 'text-slate-500 hover:text-green-600 hover:bg-green-50'
                                    }`}
                            >
                                <item.icon className="w-5 h-5 flex-shrink-0" />
                                {sidebarOpen && <span className="font-medium">{item.label}</span>}
                                {sidebarOpen && location.pathname === item.path && (
                                    <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                                )}
                            </Link>
                        ))}
                    </nav>
                </ScrollArea>

                <div className="p-4 border-t border-slate-200">
                    <Button
                        variant="ghost"
                        onClick={logout}
                        className="w-full flex items-center justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                        <LogOut className="w-5 h-5" />
                        {sidebarOpen && <span className="font-medium">Logout</span>}
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 z-40 sticky top-0 shadow-sm shadow-slate-200/50">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-bold text-slate-800 capitalize">
                            {location.pathname.split('/').pop().replace(/-/g, ' ')}
                        </h2>
                        <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-3 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider">
                            {user.role}
                        </Badge>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search everything..."
                                className="bg-slate-100 border-none rounded-full pl-10 pr-4 py-1.5 text-sm ring-1 ring-slate-200/50 focus:ring-green-500 transition-all w-64 focus:bg-white focus:shadow-inner"
                            />
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1 rounded-full px-3 py-1 transition-all border border-transparent hover:border-slate-200">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-sm font-bold text-slate-800 leading-none">{user.name}</p>
                                        <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-tighter">{user.role}</p>
                                    </div>
                                    <img
                                        src={getFullImageUrl(user.profileImage) || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=22c55e&color=fff`}
                                        className="w-8 h-8 rounded-full border border-slate-200 object-cover shadow-sm shadow-green-500/10"
                                        alt={user.name}
                                    />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 bg-white border-slate-200 text-slate-700 shadow-2xl shadow-slate-200/50 p-2">
                                <DropdownMenuLabel className="text-xs text-slate-400 font-bold uppercase tracking-widest px-2 py-1.5">Settings</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-slate-100 my-1 mx-1" />
                                <DropdownMenuItem onClick={() => navigate(`${prefix}/account`)} className="rounded-md cursor-pointer hover:bg-green-50 hover:text-green-600 px-3 py-2">
                                    Profile Settings
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate(`${prefix}/articles/create`)} className="rounded-md cursor-pointer hover:bg-green-50 hover:text-green-600 px-3 py-2">
                                    New Article
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-slate-100 my-1 mx-1" />
                                <DropdownMenuItem onClick={logout} className="text-red-500 focus:text-red-700 rounded-md cursor-pointer hover:bg-red-50 px-3 py-2">
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Dynamic Page Content */}
                <div className="flex-1 overflow-auto p-8 custom-scrollbar">
                    <div className="mx-auto max-w-7xl">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
}
