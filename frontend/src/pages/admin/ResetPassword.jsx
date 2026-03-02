import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== passwordConfirm) {
            return toast.error('Shield mismatch: Passwords do not match');
        }

        setLoading(true);
        try {
            const data = await fetchApi(`/auth/reset-password/${token}`, {
                method: 'POST',
                body: JSON.stringify({ password, passwordConfirm })
            });

            if (data.status === 'success') {
                toast.success('Access credentials updated! Proceed to login.');
                navigate('/admin/login');
            } else {
                toast.error(data.message || 'Verification failed');
            }
        } catch (error) {
            toast.error(error.message || 'An error occurred during verification');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-slate-900 border-slate-800 text-white">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto p-3 rounded-xl w-fit bg-blue-600/20 text-blue-500">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-2xl font-bold font-black italic uppercase italic">Secure Re-Entry</CardTitle>
                    <CardDescription className="text-slate-400 italic">
                        Credential verification successful. Please define your new secure entry sequence.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500 italic">New Secure Key</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 rounded-xl h-12"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500 italic">Confirm Key Sequence</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                required
                                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 rounded-xl h-12"
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 h-12 rounded-xl text-white font-black italic uppercase tracking-widest"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                            Update Credentials & Access Portal
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
