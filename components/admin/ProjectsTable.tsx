'use client';

import { archiveProject, deleteProject } from '@/app/actions/projects';
import { toast } from 'sonner';
import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import {
    ChevronRightIcon,
    EllipsisHorizontalIcon,
    ArrowTopRightOnSquareIcon,
    CalendarIcon,
    UserGroupIcon,
    HashtagIcon,
    ArchiveBoxIcon, // Added
    TrashIcon // Added
} from '@heroicons/react/24/outline';

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

export default function ProjectsTable({ projects, userRole = 'admin' }: { projects: Project[]; userRole?: string }) {
    const [isActionPending, setIsActionPending] = useState<string | null>(null);
    const isAdmin = userRole === 'admin';
    const basePath = isAdmin ? '/admin' : userRole === 'associate' ? '/associate' : '/member';

    const handleArchive = async (id: string) => {
        setIsActionPending(id);
        const result = await archiveProject(id);
        setIsActionPending(null);
        if (result.success) {
            toast.success('Project archived successfully');
        } else {
            toast.error(result.error || 'Failed to archive project');
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to permanently delete project "${name}"? This action cannot be undone.`)) return;

        setIsActionPending(id);
        const result = await deleteProject(id);
        setIsActionPending(null);
        if (result.success) {
            toast.success('Project deleted successfully');
        } else {
            toast.error(result.error || 'Failed to delete project');
        }
    };

    return (
        <div className="bg-white rounded-[2rem] border border-[#e5dec9] overflow-hidden shadow-2xl shadow-[#d9cfb0]/10">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#f7f3ed]/50 border-b border-[#e5dec9]">
                            <th className="px-8 py-5 text-[10px] font-medium uppercase tracking-[0.2em] text-[#1c1917]/70 w-16">ID</th>
                            <th className="px-8 py-5 text-[10px] font-medium uppercase tracking-[0.2em] text-[#1c1917]/70">Project Name</th>
                            <th className="px-8 py-5 text-[10px] font-medium uppercase tracking-[0.2em] text-[#1c1917]/70">Owner</th>
                            <th className="px-8 py-5 text-[10px] font-medium uppercase tracking-[0.2em] text-[#1c1917]/70">Status</th>
                            <th className="px-8 py-5 text-[10px] font-medium uppercase tracking-[0.2em] text-[#1c1917]/70 text-center">Tasks</th>
                            <th className="px-8 py-5 text-[10px] font-medium uppercase tracking-[0.2em] text-[#1c1917]/70 text-center">Phases</th>
                            <th className="px-8 py-5 text-[10px] font-medium uppercase tracking-[0.2em] text-[#1c1917]/70">Timeline</th>
                            <th className="px-8 py-5 text-[10px] font-medium uppercase tracking-[0.2em] text-[#1c1917]/70 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f7f3ed]">
                        {projects.length > 0 ? (
                            projects.map((project, idx) => (
                                <tr key={project.id} className={`group hover:bg-[#f7f3ed]/20 transition-all ${isActionPending === project.id ? 'opacity-50 pointer-events-none' : ''}`}>
                                    <td className="px-8 py-6 text-[11px] font-normal text-[#1c1917]/50">{(idx + 1).toString().padStart(2, '0')}</td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1">
                                            <Link
                                                href={`${basePath}/projects/${project.id}`}
                                                className="text-sm font-medium text-[#1c1917] hover:text-accent-600 transition-colors uppercase tracking-tight"
                                            >
                                                {project.name}
                                            </Link>
                                            <span className="text-[10px] text-[#1c1917]/60 font-medium italic truncate max-w-[200px]">
                                                {project.description || 'No description provided.'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-accent-500 text-white flex items-center justify-center font-medium text-[10px]">
                                                {project.name.charAt(0)}
                                            </div>
                                            <span className="text-[11px] font-medium text-[#1c1917]/80 uppercase tracking-tight">System Admin</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`badge inline-flex !px-3 !py-1 text-[9px] font-medium uppercase tracking-widest ${project.status === 'active' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                                            project.status === 'completed' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                                                'bg-[#1c1917]/5 text-[#1c1917]/50 border-[#1c1917]/20'
                                            }`}>
                                            {project.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="flex flex-col gap-1.5 items-center">
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1c1917]/5 rounded-full text-[10px] font-medium text-[#1c1917]/70">
                                                <HashtagIcon className="w-3 h-3 text-accent-500" />
                                                {project.tasks?.length || 0} Tasks
                                            </div>
                                            <div className="w-20 h-1 bg-[#f7f3ed] rounded-full overflow-hidden border border-[#e5dec9]">
                                                <div
                                                    className="h-full bg-accent-500"
                                                    style={{
                                                        width: `${project.tasks && project.tasks.length > 0
                                                            ? (project.tasks.filter((t: any) => t.status === 'completed').length / project.tasks.length) * 100
                                                            : 0}%`
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent-500/5 rounded-full text-[10px] font-medium text-accent-600">
                                            <Square3Stack3DIcon className="w-3 h-3" />
                                            {project.sprints?.length || 0}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-[10px] font-medium text-[#1c1917]/70 uppercase tracking-widest">
                                            <CalendarIcon className="w-4 h-4 text-accent-500/40" />
                                            {format(new Date(project.end_date), 'MMM dd, yyyy')}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`${basePath}/projects/${project.id}`}
                                                title="View Project"
                                                className="p-2 text-[#1c1917]/50 hover:text-accent-600 transition-all bg-[#f7f3ed]/50 hover:bg-white border border-transparent hover:border-[#e5dec9] rounded-lg"
                                            >
                                                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                                            </Link>
                                            {isAdmin && project.status !== 'archived' && (
                                                <button
                                                    onClick={() => handleArchive(project.id)}
                                                    title="Archive Project"
                                                    className="p-2 text-[#1c1917]/50 hover:text-amber-600 transition-all bg-[#f7f3ed]/50 hover:bg-white border border-transparent hover:border-[#e5dec9] rounded-lg"
                                                >
                                                    <ArchiveBoxIcon className="w-4 h-4" />
                                                </button>
                                            )}
                                            {isAdmin && (
                                                <button
                                                    onClick={() => handleDelete(project.id, project.name)}
                                                    title="Delete Project"
                                                    className="p-2 text-[#1c1917]/50 hover:text-red-500 transition-all bg-[#f7f3ed]/50 hover:bg-white border border-transparent hover:border-[#e5dec9] rounded-lg"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="px-8 py-20 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 bg-[#f7f3ed] rounded-2xl flex items-center justify-center text-[#1c1917]/10">
                                            <HashtagIcon className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-[#1c1917] uppercase tracking-widest">No projects found</p>
                                            <p className="text-[10px] text-[#1c1917]/30 font-medium mt-2 uppercase tracking-tight">Try adjusting your filters or create a new project.</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function Square3Stack3DIcon(props: any) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L12 7.5l5.571 2.25m0 0L21.75 12l-4.179 2.25m0-4.5l-5.571 3L12 14.25m11.142 0L12 14.25m0 0l5.571-3m-11.142 3L12 12m0 0l-5.571-3" />
        </svg>
    );
}
