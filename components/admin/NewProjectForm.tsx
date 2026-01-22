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
        <div className="max-w-2xl mx-auto py-8">
            <Link
                href="/admin/projects"
                className="flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors mb-6 group"
            >
                <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Projects
            </Link>

            <div className="card shadow-2xl shadow-primary-900/5 overflow-hidden">
                <div className="bg-primary-600 p-8 text-white relative">
                    <div className="relative z-10">
                        <h1 className="text-2xl font-bold flex items-center gap-3">
                            <RocketLaunchIcon className="w-8 h-8" />
                            Launch New Project
                        </h1>
                        <p className="text-primary-100 mt-2">
                            Initialize a new workspace for your team to start collaborating.
                        </p>
                    </div>
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white">
                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Project Name
                            </label>
                            <input
                                name="name"
                                type="text"
                                required
                                placeholder="e.g. Q1 Marketing Campaign"
                                className="input focus:ring-4 ring-primary-50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                rows={4}
                                placeholder="What is this project about? Goals, objectives..."
                                className="input py-3 focus:ring-4 ring-primary-50"
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Target Completion Date
                            </label>
                            <input
                                name="end_date"
                                type="date"
                                required
                                className="input focus:ring-4 ring-primary-50"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex items-center gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-1 btn-primary py-3 flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Launching...
                                </>
                            ) : 'Create & Initialize Project'}
                        </button>
                        <Link
                            href="/admin/projects"
                            className="px-6 py-3 text-slate-500 font-bold hover:text-slate-700 transition-colors"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
