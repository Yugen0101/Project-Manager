'use client';

import { useState } from 'react';
import {
    PlusIcon,
    MagnifyingGlassIcon,
    SparklesIcon,
    FunnelIcon,
    QueueListIcon,
    Squares2X2Icon
} from '@heroicons/react/24/outline';
import ProjectsTable from './ProjectsTable';
import ProjectsGrid from './ProjectsGrid';

interface Project {
    id: string;
    name: string;
    description: string;
    status: string;
    end_date: string;
    user_projects?: any[];
    tasks?: any[];
    sprints?: any[];
}

interface Template {
    id: string;
    name: string;
    description: string;
    category: string;
}

import { useRouter, useSearchParams } from 'next/navigation';

export default function ProjectsRegistryClient({
    initialProjects,
    templates,
    userRole = 'admin',
    initialTab = 'active'
}: {
    initialProjects: Project[];
    templates: Template[];
    userRole?: string;
    initialTab?: string;
}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab') || initialTab;
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

    const isAdmin = userRole === 'admin';
    const basePath = isAdmin ? '/admin' : userRole === 'associate' ? '/associate' : '/member';

    const handleTabChange = (newTab: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', newTab);
        router.push(`${basePath}/projects?${params.toString()}`);
    };

    const tabs = [
        { id: 'active', label: 'Active Projects' },
        ...(isAdmin ? [
            { id: 'archived', label: 'Archived Projects' },
        ] : []),
    ];

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Projects');

    // Filter projects client-side
    const filteredProjects = initialProjects.filter(project => {
        const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = selectedCategory === 'All Projects' || project.status === selectedCategory; // Adjust category logic if needed

        return matchesSearch; // For now just search, can add category later if project.category exists
    });

    return (
        <div className="space-y-10 pb-20 animate-in fade-in duration-1000">
            {/* Elegant Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-accent-700 mb-2">
                        <SparklesIcon className="w-5 h-5 shadow-sm" />
                        <span className="text-[10px] font-medium uppercase tracking-[0.4em]">Infrastructure Registry</span>
                    </div>
                    <h1 className="text-5xl font-semibold text-[#1c1917] tracking-tighter uppercase leading-none">
                        Projects <span className="text-accent-600">Registry</span>
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    {isAdmin && (
                        <button
                            onClick={() => router.push(`${basePath}/projects/new`)}
                            className="btn-primary flex items-center gap-3 !px-8 !py-4 !rounded-2xl shadow-xl shadow-accent-500/20"
                        >
                            <PlusIcon className="w-6 h-6" />
                            <span className="text-xs font-medium uppercase tracking-widest">New Project</span>
                        </button>
                    )}
                    <button className="p-4 bg-white border border-[#e5dec9] rounded-2xl text-[#1c1917]/40 hover:text-[#1c1917] transition-all">
                        <EllipsisHorizontalIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Tabbed Navigation */}
            <div className="border-b border-[#e5dec9] flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-2 overflow-x-auto pb-px">
                    {tabs.map(t => (
                        <button
                            key={t.id}
                            onClick={() => handleTabChange(t.id)}
                            className={`px-6 py-4 text-[10px] font-medium uppercase tracking-widest transition-all relative ${tab === t.id ? 'text-[#1c1917]' : 'text-[#1c1917]/60 hover:text-[#1c1917]/90'}`}
                        >
                            {t.label}
                            {tab === t.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent-500 rounded-t-full shadow-[0_-2px_8px_rgba(217,119,87,0.4)]" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-6 pb-2 md:pb-0">
                    <div className="flex items-center gap-3 p-2 bg-[#f7f3ed] rounded-2xl border border-[#e5dec9] shadow-inner">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white text-accent-500 shadow-md shadow-accent-500/5 ring-1 ring-accent-500/10' : 'text-[#1c1917]/40 hover:text-[#1c1917]/60'}`}
                        >
                            <QueueListIcon className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white text-accent-500 shadow-md shadow-accent-500/5 ring-1 ring-accent-500/10' : 'text-[#1c1917]/40 hover:text-[#1c1917]/60'}`}
                        >
                            <Squares2X2Icon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e5dec9] rounded-xl text-[10px] font-medium uppercase tracking-widest text-[#1c1917]/80 hover:text-[#1c1917] transition-colors">
                        <span>{selectedCategory}</span>
                        <ChevronDownIcon className="w-3 h-3 text-accent-600" />
                    </div>

                </div>
                <div className="relative w-full lg:w-[28rem] group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#1c1917]/40 group-focus-within:text-accent-600 transition-colors">
                        <MagnifyingGlassIcon className="w-5 h-5" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search infrastructure registry..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-14 pl-12 pr-4 bg-white border border-[#e5dec9] rounded-2xl text-[11px] font-bold text-[#1c1917] placeholder-[#1c1917]/50 focus:outline-none focus:border-accent-500/40 focus:ring-8 focus:ring-accent-500/5 transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Registry Views */}
            {viewMode === 'list' ? (
                <ProjectsTable projects={filteredProjects} userRole={userRole} />
            ) : (
                <ProjectsGrid projects={filteredProjects} userRole={userRole} />
            )}
        </div>
    );
}

function EllipsisHorizontalIcon(props: any) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>
    );
}

function ChevronDownIcon(props: any) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
    );
}
