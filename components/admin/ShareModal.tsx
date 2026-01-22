'use client';

import { useState } from 'react';
import { generateShareLink, revokeShareLink } from '@/app/actions/sharing';
import { toast } from 'sonner';

export default function ShareModal({
    projectId,
    initialIsPublic,
    initialToken,
    onClose
}: {
    projectId: string;
    initialIsPublic: boolean;
    initialToken?: string;
    onClose: () => void;
}) {
    const [isPublic, setIsPublic] = useState(initialIsPublic);
    const [token, setToken] = useState(initialToken);
    const [loading, setLoading] = useState(false);

    const shareUrl = `${window.location.origin}/public/project/${token}`;

    async function handleToggleShare() {
        setLoading(true);
        if (isPublic) {
            const result = await revokeShareLink(projectId);
            if (result.success) {
                setIsPublic(false);
                setToken(undefined);
                toast.success('Sharing disabled');
            } else {
                toast.error(result.error || 'Failed to revoke link');
            }
        } else {
            const result = await generateShareLink(projectId);
            if (result.success) {
                setIsPublic(true);
                setToken(result.token);
                toast.success('Sharing enabled');
            } else {
                toast.error(result.error || 'Failed to generate link');
            }
        }
        setLoading(false);
    }

    function copyToClipboard() {
        if (!token) return;
        navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard');
    }

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-slate-900">Share Project</h2>
                        <p className="text-xs font-medium text-slate-500">Enable public access to this board</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-slate-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div>
                            <p className="text-sm font-bold text-slate-900">Public Sharing</p>
                            <p className="text-[10px] font-medium text-slate-500">Anyone with the link can view</p>
                        </div>
                        <button
                            onClick={handleToggleShare}
                            disabled={loading}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isPublic ? 'bg-primary-600' : 'bg-slate-200'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPublic ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>

                    {isPublic && token && (
                        <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Share Link</p>
                            <div className="flex gap-2">
                                <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono text-xs text-slate-600 truncate">
                                    {shareUrl}
                                </div>
                                <button
                                    onClick={copyToClipboard}
                                    className="p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 active:scale-95"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125  0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-xl border border-orange-100">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-orange-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                </svg>
                                <p className="text-[10px] font-medium text-orange-700">
                                    Anyone with this link can view all tasks, sprints, and progress in real-time.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}
