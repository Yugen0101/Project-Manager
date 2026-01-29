'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    MagnifyingGlassIcon,
    AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';
import { globalSearch } from '@/app/actions/search';
import { useDebounce } from '@/lib/hooks/use-debounce';

export default function GlobalSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<{ projects: any[], users: any[] }>({ projects: [], users: [] });
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const debouncedQuery = useDebounce(query, 300);
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const performSearch = async () => {
            if (debouncedQuery.length < 2) {
                setResults({ projects: [], users: [] });
                setIsOpen(false);
                return;
            }

            setIsLoading(true);
            const response: any = await globalSearch(debouncedQuery);
            if (response.success) {
                setResults(response.data);
                setIsOpen(true);
            }
            setIsLoading(false);
        };

        performSearch();
    }, [debouncedQuery]);

    const handleSelect = (type: 'project' | 'user', id: string, name: string) => {
        setIsOpen(false);
        setQuery('');
        if (type === 'project') {
            // Check role to determine path prefix (simplified for now)
            const currentPath = window.location.pathname;
            const prefix = currentPath.split('/')[1]; // member, admin, or associate
            router.push(`/${prefix}/projects/${id}`);
        } else {
            // Users might be viewed in different places depending on role
            const currentPath = window.location.pathname;
            if (currentPath.startsWith('/admin')) {
                router.push(`/admin/users?search=${encodeURIComponent(name)}`);
            }
        }
    };

    return (
        <div className="flex-1 max-w-md hidden md:block relative text-[#1c1917]" ref={containerRef}>
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#101010]/60 group-focus-within:text-accent-600 transition-colors">
                    <MagnifyingGlassIcon className={`w-4 h-4 ${isLoading ? 'animate-pulse' : ''}`} />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                    placeholder="Search projects and people..."
                    className="w-full bg-[#f7f3ed] border border-[#e5dec9] rounded-xl py-3 pl-11 pr-4 text-xs font-bold focus:ring-8 focus:ring-accent-500/5 focus:bg-white focus:border-accent-500/40 transition-all outline-none placeholder:text-[#1c1917]/50"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button className="p-1.5 text-[#1c1917]/50 hover:text-accent-500 transition-colors">
                        <AdjustmentsHorizontalIcon className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Results Dropdown */}
            {isOpen && (results.projects.length > 0 || results.users.length > 0) && (
                <div className="absolute top-full mt-2 w-full bg-white border border-[#e1d8bc] rounded-2xl shadow-2xl shadow-[#d9cfb0]/30 z-[60] overflow-hidden backdrop-blur-xl">
                    {results.projects.length > 0 && (
                        <div className="p-2">
                            <h3 className="px-3 py-2 text-[10px] font-black text-accent-600 uppercase tracking-widest border-b border-[#f7f3ed] mb-1">Projects</h3>
                            {results.projects.map((project) => (
                                <button
                                    key={project.id}
                                    onClick={() => handleSelect('project', project.id, project.name)}
                                    className="w-full text-left px-4 py-3 hover:bg-[#f7f3ed] rounded-xl transition-colors flex items-center justify-between group"
                                >
                                    <div>
                                        <p className="text-xs font-bold text-[#1c1917] group-hover:text-accent-600 transition-colors uppercase tracking-tight">{project.name}</p>
                                        <p className="text-[9px] text-[#1c1917]/50 font-medium uppercase tracking-tighter mt-0.5">{project.status} • {project.priority} priority</p>
                                    </div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </button>
                            ))}
                        </div>
                    )}

                    {results.users.length > 0 && (
                        <div className={`p-2 ${results.projects.length > 0 ? 'border-t border-[#f7f3ed]' : ''}`}>
                            <h3 className="px-3 py-2 text-[10px] font-black text-accent-600 uppercase tracking-widest border-b border-[#f7f3ed] mb-1">People</h3>
                            {results.users.map((user) => (
                                <button
                                    key={user.id}
                                    onClick={() => handleSelect('user', user.id, user.full_name)}
                                    className="w-full text-left px-4 py-3 hover:bg-[#f7f3ed] rounded-xl transition-colors flex items-center gap-3 group"
                                >
                                    <div className="w-7 h-7 rounded-lg bg-[#f7f3ed] flex items-center justify-center font-bold text-[10px] text-accent-600 group-hover:bg-white transition-colors">
                                        {user.full_name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-[#1c1917] group-hover:text-accent-600 transition-colors uppercase tracking-tight">{user.full_name}</p>
                                        <p className="text-[9px] text-[#1c1917]/50 font-medium uppercase tracking-tighter mt-0.5">{user.role}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
