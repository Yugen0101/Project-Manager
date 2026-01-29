'use client';

import { useState } from 'react';
import { generateShareLink, revokeShareLink } from '@/app/actions/sharing';
import { toast } from 'sonner';
import { XMarkIcon } from '@heroicons/react/24/outline';

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
            if (result.success && result.data) {
                setIsPublic(true);
                setToken(result.data.token);
                toast.success('Sharing enabled');
            } else if (!result.success) {
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
        <div className="fixed inset-0 bg-[#1c1917]/20 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="glass rounded-[2.5rem] w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-500">
                <div className="px-10 py-8 border-b border-[#f7f3ed]/50 flex items-center justify-between bg-[#f7f3ed]/20">
                    <div>
                        <h2 className="text-2xl font-black text-[#1c1917] tracking-tighter uppercase">Share Settings</h2>
                        <p className="text-[10px] font-black text-[#1c1917]/30 uppercase tracking-[0.3em] mt-1">Project Sharing</p>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-white border border-[#e5dec9] flex items-center justify-center text-[#1c1917]/40 hover:text-[#d97757] transition-all">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-10 space-y-8">
                    <div className="flex items-center justify-between p-6 bg-[#fdfcf9] rounded-[2rem] border border-[#e5dec9]">
                        <div>
                            <p className="text-xs font-black text-[#1c1917] uppercase tracking-tight">Enable Public Link</p>
                            <p className="text-[9px] font-black text-[#1c1917]/30 uppercase tracking-[0.2em] mt-1 italic font-serif">Allow anyone with the link to view this project</p>
                        </div>
                        <button
                            onClick={handleToggleShare}
                            disabled={loading}
                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all focus:outline-none ${isPublic ? 'bg-[#d97757] shadow-lg shadow-[#d97757]/20' : 'bg-[#e5dec9]'}`}
                        >
                            <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${isPublic ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>

                    {isPublic && token && (
                        <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
                            <p className="text-[10px] font-black text-[#1c1917]/40 uppercase tracking-[0.3em] ml-1">Public URL</p>
                            <div className="flex gap-4">
                                <div className="flex-1 bg-[#f7f3ed]/50 p-4 rounded-xl border border-[#e5dec9] font-mono text-[10px] text-[#1c1917]/60 truncate italic">
                                    {shareUrl}
                                </div>
                                <button
                                    onClick={copyToClipboard}
                                    className="w-12 h-12 bg-white border border-[#e5dec9] text-[#d97757] rounded-xl hover:bg-[#d97757] hover:text-white transition-all shadow-sm active:scale-95 flex items-center justify-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125  0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex items-center gap-4 p-5 bg-orange-50 border border-orange-100 rounded-[1.5rem]">
                                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-[#d97757]">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                    </svg>
                                </div>
                                <p className="text-[10px] font-black italic text-[#1c1917]/40 uppercase tracking-tight leading-tight">
                                    CAUTION: Anyone with this link can view the project details.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="px-10 py-8 bg-[#f7f3ed]/30 border-t border-[#f7f3ed] flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-10 py-5 bg-white border border-[#e5dec9] text-[#1c1917]/30 text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:text-[#d97757] hover:border-[#d97757] transition-all"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
