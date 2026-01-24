'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const errorParam = searchParams.get('error');
        if (errorParam === 'inactive') {
            setError('Your account is inactive. Please contact an administrator.');
        }
    }, [searchParams]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const supabase = createClient();

            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                setError(signInError.message);
                setLoading(false);
                return;
            }

            // Force page reload to trigger middleware
            window.location.href = '/admin/dashboard';
        } catch (err) {
            console.error('Login error:', err);
            setError('An unexpected error occurred. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-beige-50 relative overflow-hidden px-6 selection:bg-accent-500 selection:text-white">
            {/* Warm Beige Decorative Background Elements */}
            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] bg-beige-100/50 blur-[120px] rounded-full -z-10"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[50%] bg-accent-100/30 blur-[100px] rounded-full -z-10"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="card shadow-2xl shadow-beige-300/20 border-beige-200 !p-10">
                    <div className="text-center mb-10">
                        <div className="relative w-16 h-16 flex items-center justify-center mx-auto mb-6">
                            <Image src="/logo.png" alt="Logo" width={40} height={40} className="object-contain" />
                        </div>
                        <h1 className="text-3xl font-bold text-[#1c1917] mb-2 tracking-tight">
                            Task<span className="text-accent-600">Forge</span>
                        </h1>
                        <p className="text-xs font-bold uppercase tracking-wider text-[#1c1917]/40">
                            Secure Workspace Access
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="bg-status-error/10 border border-status-error/20 text-status-error px-4 py-3 rounded-xl text-xs font-bold tracking-tight">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-xs font-bold text-[#1c1917]/50 ml-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="input !py-3.5"
                                placeholder="name@company.com"
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label htmlFor="password" className="block text-xs font-bold text-slate-500">
                                    Password
                                </label>
                                <a href="#" className="text-[10px] font-bold text-primary-500 hover:text-primary-600">Forgot Password?</a>
                            </div>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="input !py-3.5"
                                placeholder="••••••••"
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary !py-4 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-primary-500/30"
                        >
                            {loading ? 'Authorizing...' : 'Sign In to Workspace'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Enterprise Protocol 2.6.0</p>
                    </div>
                </div>

                <div className="mt-8 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <p>© 2026 TaskForge. All Rights Reserved.</p>
                </div>
            </div>

            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-surface-50">
                <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
