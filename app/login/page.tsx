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
        <div className="min-h-screen flex items-center justify-center bg-[#fdfcf9] relative overflow-hidden px-6 selection:bg-[#d97757] selection:text-white">
            {/* Geometric Background Element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#f7f3ed] rounded-full -z-10 opacity-50"></div>
            <div className="absolute top-[-5%] right-[-5%] w-64 h-64 bg-[#d97757]/5 rounded-3xl rotate-12 -z-10"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="card shadow-2xl shadow-[#d9cfb0]/30 border-[#e5dec9]">
                    <div className="text-center mb-10">
                        <div className="relative w-12 h-12 mx-auto mb-6">
                            <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                        </div>
                        <h1 className="text-3xl font-black text-[#1c1917] mb-2 tracking-tighter">
                            Task<span className="text-[#d97757]">Forge</span>
                        </h1>
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#1c1917]/40">
                            Secure Workspace Access
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-900 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-widest text-[#1c1917]/50 ml-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="input"
                                placeholder="name@nexus.com"
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label htmlFor="password" className="block text-[10px] font-black uppercase tracking-widest text-[#1c1917]/50">
                                    Auth Key
                                </label>
                                <a href="#" className="text-[9px] font-black uppercase tracking-widest text-[#d97757] hover:text-[#c26242]">Request Reset</a>
                            </div>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="input"
                                placeholder="••••••••"
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-4 disabled:opacity-50 disabled:cursor-not-allowed text-[11px] font-black uppercase tracking-[0.2em]"
                        >
                            {loading ? 'Validating...' : 'Authorize Login'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-[9px] font-black text-[#1c1917]/30 uppercase tracking-[0.3em]">Restricted Node Protocol v.2.6</p>
                    </div>
                </div>

                <div className="mt-8 text-center text-[10px] font-black uppercase tracking-[0.2em] text-[#1c1917]/40">
                    <p>© 2026 TaskForge. All Rights Reserved.</p>
                </div>
            </div>

            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#fdfcf9]">
                <div className="w-8 h-8 border-4 border-[#d97757] border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
