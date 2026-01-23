'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProject } from '@/app/actions/projects';
import {
    ArrowLeftIcon,
    RocketLaunchIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function NewProjectForm() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const end_date = formData.get('end_date') as string;

        try {
            const result = await createProject({
                name,
                description,
                end_date,
            });

            if (result.success) {
                router.push('/admin/projects');
                router.refresh();
            } else {
                setError(result.error || 'Failed to create project.');
            }
        } catch (err) {
            setError('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Link
                href="/admin/projects"
                className="flex items-center gap-3 text-[#1c1917]/40 hover:text-[#d97757] transition-all mb-10 group no-underline"
            >
                <div className="w-8 h-8 rounded-full border border-[#e5dec9] flex items-center justify-center group-hover:border-[#d97757] transition-colors">
                    <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.2em]">Back to Projects</span>
            </Link>

            <div className="bg-white rounded-[3rem] shadow-2xl shadow-[#d9cfb0]/20 overflow-hidden border border-[#e5dec9]">
                <div className="bg-[#f7f3ed]/50 p-12 border-b border-[#f7f3ed] relative overflow-hidden">
                    <div className="relative z-10 flex items-center gap-6">
                        <div className="w-16 h-16 bg-[#d97757] rounded-[1.5rem] flex items-center justify-center text-white shadow-lg shadow-[#d97757]/30">
                            <RocketLaunchIcon className="w-9 h-9" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-[#1c1917] tracking-tighter uppercase leading-none">
                                Initialize Project Node
                            </h1>
                            <p className="text-[#1c1917]/40 text-[10px] font-black uppercase tracking-[0.3em] mt-2">
                                New Operational Workspace / Node Deployment
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-12 space-y-8 bg-white">
                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-800 p-5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                            {error}
                        </div>
                    )}

                    <div className="space-y-8">
                        <div className="space-y-3">
                            <label className="block text-[10px] font-black text-[#1c1917]/40 uppercase tracking-[0.3em] ml-1">
                                Project Designation
                            </label>
                            <input
                                name="name"
                                type="text"
                                required
                                placeholder="e.g. Q1 Marketing Campaign"
                                className="input py-5 bg-[#fdfcf9] border-[#e5dec9] focus:border-[#d97757] focus:ring-4 ring-[#d97757]/5"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="block text-[10px] font-black text-[#1c1917]/40 uppercase tracking-[0.3em] ml-1">
                                Operational Briefing
                            </label>
                            <textarea
                                name="description"
                                rows={5}
                                placeholder="Describe the mission objectives and strategic goals..."
                                className="input py-5 bg-[#fdfcf9] border-[#e5dec9] focus:border-[#d97757] focus:ring-4 ring-[#d97757]/5 resize-none italic font-serif"
                            ></textarea>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-[10px] font-black text-[#1c1917]/40 uppercase tracking-[0.3em] ml-1">
                                Deadline Synchronicity
                            </label>
                            <input
                                name="end_date"
                                type="date"
                                required
                                className="input py-5 bg-[#fdfcf9] border-[#e5dec9] focus:border-[#d97757] focus:ring-4 ring-[#d97757]/5"
                            />
                        </div>
                    </div>

                    <div className="pt-10 flex items-center gap-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-[2] btn-primary py-5 flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#d97757]/20 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Synchronizing...
                                </>
                            ) : 'Establish Workspace'}
                        </button>
                        <Link
                            href="/admin/projects"
                            className="flex-1 px-8 py-5 text-center text-[#1c1917]/30 font-black uppercase tracking-[0.2em] hover:text-[#d97757] border border-[#e5dec9] rounded-2xl transition-all text-[10px]"
                        >
                            Abort
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
