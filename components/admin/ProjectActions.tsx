'use client';

import { useState } from 'react';
import { ShareIcon, ArchiveBoxIcon, ArrowPathIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import ShareModal from '@/components/admin/ShareModal';
import { archiveProject, restoreProject, exportProjectData } from '@/app/actions/projects';
import { toast } from 'sonner';

export default function ProjectActions({
    projectId,
    status,
    isPublic,
    shareToken
}: {
    projectId: string;
    status: string;
    isPublic: boolean;
    shareToken?: string;
}) {
    const [showShareModal, setShowShareModal] = useState(false);
    const [isArchiving, setIsArchiving] = useState(false);

    async function handleArchive() {
        if (!confirm('Are you sure you want to archive this project? It will be hidden from the main dashboard.')) return;

        setIsArchiving(true);
        const result = await archiveProject(projectId);
        if (result.success) {
            toast.success('Project archived successfully');
        } else {
            toast.error(result.error || 'Failed to archive project');
        }
        setIsArchiving(false);
    }

    async function handleRestore() {
        setIsArchiving(true);
        const result = await restoreProject(projectId);
        if (result.success) {
            toast.success('Project restored successfully');
        } else {
            toast.error(result.error || 'Failed to restore project');
        }
        setIsArchiving(false);
    }

    async function handleExport() {
        const result = await exportProjectData(projectId);
        if (result.success && result.csv) {
            const blob = new Blob([result.csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = result.fileName || 'export.csv';
            a.click();
            window.URL.revokeObjectURL(url);
            toast.success('Project data exported');
        } else {
            toast.error(result.error || 'Failed to export data');
        }
    }

    return (
        <div className="flex gap-3">
            <button
                onClick={handleExport}
                className="btn-secondary flex items-center gap-2"
            >
                <ArrowDownTrayIcon className="w-5 h-5" />
                Export
            </button>

            <button
                onClick={() => setShowShareModal(true)}
                className="btn-secondary flex items-center gap-2"
            >
                <ShareIcon className="w-5 h-5" />
                Share
            </button>

            {status === 'archived' ? (
                <button
                    onClick={handleRestore}
                    disabled={isArchiving}
                    className="btn-secondary flex items-center gap-2 text-green-600 border-green-200 hover:bg-green-50"
                >
                    <ArrowPathIcon className="w-5 h-5" />
                    Restore
                </button>
            ) : (
                <button
                    onClick={handleArchive}
                    disabled={isArchiving}
                    className="btn-secondary flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                >
                    <ArchiveBoxIcon className="w-5 h-5" />
                    Archive
                </button>
            )}

            {showShareModal && (
                <ShareModal
                    projectId={projectId}
                    initialIsPublic={isPublic}
                    initialToken={shareToken}
                    onClose={() => setShowShareModal(false)}
                />
            )}
        </div>
    );
}
