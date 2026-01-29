'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import {
    BriefcaseIcon,
    CalendarIcon,
    UserGroupIcon,
    HashtagIcon,
    ChevronRightIcon,
    ArchiveBoxIcon,
    TrashIcon
} from '@heroicons/react/24/outline';
import { archiveProject, deleteProject } from '@/app/actions/projects';
import { toast } from 'sonner';
import { useState } from 'react';

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

export default function ProjectsGrid({ projects, userRole = 'admin' }: { projects: Project[]; userRole?: string }) {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {projects.map((project) => (
                <div
                    key={project.id}
                    className={`card !p-0 bg-white border-[#e5dec9] shadow-lg shadow-[#d9cfb0]/20 group transition-all duration-500 flex flex-col hover:border-accent-200 hover:shadow-2xl hover:shadow-[#d9cfb0]/30 hover:-translate-y-1 ${isActionPending === project.id ? 'opacity-50 pointer-events-none' : ''}`}
                >
                    <div className="p-8 pb-0">
                        <div className="flex justify-between items-start mb-8">
                            <div className="w-16 h-16 bg-[#f7f3ed] group-hover:bg-accent-50 text-[#1c1917]/40 group-hover:text-accent-500 rounded-2xl flex items-center justify-center border border-[#e5dec9] group-hover:border-accent-100 transition-all duration-300">
                                <BriefcaseIcon className="w-8 h-8" />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`badge shrink-0 text-[9px] font-medium uppercase tracking-widest py-1 px-3 ${project.status === 'active' ? 'bg-[#7c9473]/10 text-[#7c9473] border-[#7c9473]/20' :
                                    project.status === 'completed' ? 'bg-[#7a8fa3]/10 text-[#7a8fa3] border-[#7a8fa3]/20' :
                                        'bg-[#d97757]/10 text-[#d97757] border-[#d97757]/20'
                                    }`}>
                                    {project.status}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold text-[#1c1917] tracking-tight group-hover:text-accent-500 transition-colors uppercase leading-[0.9]">
                                {project.name}
                            </h3>
                            <p className="text-[#1c1917]/40 text-sm font-medium leading-relaxed italic h-10 line-clamp-2">
                                {project.description || 'A brief description of the project goals and objectives.'}
                            </p>

                            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-[#e5dec9]">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-medium text-[#1c1917]/20 uppercase tracking-[0.2em]">Team Members</p>
                                    <div className="flex items-center gap-2 text-sm font-medium text-[#1c1917]">
                                        <UserGroupIcon className="w-4 h-4 text-accent-500" />
                                        <span>{project.user_projects?.length || 0} Members</span>
                                    </div>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-[10px] font-medium text-[#1c1917]/20 uppercase tracking-[0.2em]">Tasks</p>
                                    <div className="flex items-center justify-end gap-2 text-sm font-medium text-[#1c1917]">
                                        <HashtagIcon className="w-4 h-4 text-[#d97757]" />
                                        <span>{project.tasks?.length || 0} Tasks</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] font-medium text-[#1c1917]/30 bg-[#f7f3ed] p-3 rounded-xl border border-[#e5dec9]">
                                <CalendarIcon className="w-4 h-4 text-accent-500" />
                                <span className="uppercase tracking-[0.2em]">Due Date: {format(new Date(project.end_date), 'MM.dd.yyyy')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 pt-10 mt-auto space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-medium text-[#1c1917]/30 tracking-[0.3em] uppercase">
                            <span>Progress</span>
                            <span className="text-accent-500">
                                {project.tasks && project.tasks.length > 0
                                    ? Math.round((project.tasks.filter((t: any) => t.status === 'completed').length / project.tasks.length) * 100)
                                    : 0}%
                            </span>
                        </div>
                        <div className="w-full h-1.5 bg-[#f7f3ed] rounded-full overflow-hidden border border-[#e5dec9]">
                            <div
                                className="h-full bg-accent-500 rounded-full shadow-[0_0_10px_rgba(217,119,87,0.3)]"
                                style={{
                                    width: `${project.tasks && project.tasks.length > 0
                                        ? (project.tasks.filter((t: any) => t.status === 'completed').length / project.tasks.length) * 100
                                        : 0}%`
                                }}
                            ></div>
                        </div>
                    </div>

                    <div className="flex border-t border-[#e5dec9] rounded-b-[2rem] overflow-hidden">
                        <Link
                            href={`${basePath}/projects/${project.id}`}
                            className="flex-1 bg-accent-500 p-6 flex items-center justify-center gap-3 text-[10px] font-medium text-white hover:bg-accent-600 uppercase tracking-[0.4em] transition-all"
                        >
                            View Project
                            <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        {isAdmin && (
                            <div className="flex bg-white group/actions">
                                {project.status !== 'archived' && (
                                    <button
                                        onClick={() => handleArchive(project.id)}
                                        title="Archive"
                                        className="px-6 border-l border-[#e5dec9] text-[#1c1917]/20 hover:text-amber-600 hover:bg-[#f7f3ed] transition-all"
                                    >
                                        <ArchiveBoxIcon className="w-5 h-5" />
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(project.id, project.name)}
                                    title="Delete"
                                    className="px-6 border-l border-[#e5dec9] text-[#1c1917]/20 hover:text-red-500 hover:bg-red-50 transition-all"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {projects.length === 0 && (
                <div className="col-span-full py-32 flex flex-col items-center justify-center card bg-white border-dashed border-2 border-[#e5dec9] rounded-[3rem]">
                    <div className="w-24 h-24 bg-[#f7f3ed] rounded-[2rem] flex items-center justify-center text-[#1c1917]/10 mb-8 animate-pulse">
                        <BriefcaseIcon className="w-12 h-12" />
                    </div>
                    <h3 className="text-3xl font-semibold text-[#1c1917] tracking-tighter uppercase">No Projects Found</h3>
                    <p className="text-[#1c1917]/30 text-sm font-normal uppercase tracking-widest mt-3 mb-12 text-center max-w-sm">No active projects found in your workspace.</p>
                </div>
            )}
        </div>
    );
}
