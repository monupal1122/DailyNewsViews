import React, { useState } from 'react';
import { fetchApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await fetchApi('/auth/forgot-password', {
                method: 'POST',
                body: JSON.stringify({ email })
            });

            if (data.status === 'success') {
                setSubmitted(true);
                toast.success('Reset link sent to your email');
            } else {
                toast.error(data.message || 'Failed to send reset link');
            }
        } catch (error) {
            toast.error(error.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-slate-900 border-slate-800 text-white">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto p-3 rounded-xl w-fit bg-green-600/20 text-green-500">
                        <Mail className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-2xl font-bold font-black italic uppercase italic">Forget Password?</CardTitle>
                    <CardDescription className="text-slate-400 italic">
                        No worries! Enter your recovery email below and we'll send you a secure entry link.
                    </CardDescription>
                </CardHeader>

                {!submitted ? (
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500 italic">Recovery Email</label>
                                <Input
                                    type="email"
                                    placeholder="your-account@chronicle.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 rounded-xl h-12"
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button
                                type="submit"
                                className="w-full bg-green-600 hover:bg-green-700 h-12 rounded-xl text-white font-black italic uppercase tracking-widest"
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                                Dispatch Recovery Link
                            </Button>
                            <Link to="/admin/login" className="text-xs text-slate-500 hover:text-green-500 transition-colors flex items-center font-bold italic">
                                <ArrowLeft className="w-3 h-3 mr-1" /> Return to Secure Login
                            </Link>
                        </CardFooter>
                    </form>
                ) : (
                    <CardContent className="py-8 text-center space-y-6">
                        <div className="p-4 bg-green-600/10 border border-green-600/20 rounded-2xl">
                            <p className="text-green-400 font-bold italic">
                                Recovery credentials dispatched! Check your inbox for further instructions.
                            </p>
                        </div>
                        <Link to="/admin/login">
                            <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 rounded-xl font-bold italic">
                                Back to Portal
                            </Button>
                        </Link>
                    </CardContent>
                )}
            </Card>
        </div>
    );
}
