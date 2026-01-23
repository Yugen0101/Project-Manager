'use client';

import { useState, useRef, useEffect } from 'react';
import {
    EllipsisHorizontalIcon,
    KeyIcon,
    NoSymbolIcon,
    CheckIcon,
    TrashIcon
} from '@heroicons/react/24/outline';
import { toggleUserStatus, resetUserPassword, deleteUser } from '@/app/actions/users';

interface User {
    id: string;
    is_active: boolean;
}

export default function UserActionMenu({ user }: { user: User }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggle = async () => {
        const result = await toggleUserStatus(user.id, !user.is_active);
        if (!result.success) alert(result.error);
        else window.location.reload();
    };

    const handleReset = async () => {
        const result = await resetUserPassword(user.id);
        if (!result.success) alert(result.error);
        else alert(`Temporary password: ${result.data?.tempPassword}`);
    };

    const handleDelete = async () => {
        if (confirm('Permanently delete this user?')) {
            const result = await deleteUser(user.id);
            if (!result.success) alert(result.error);
            else window.location.reload();
        }
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-9 h-9 flex items-center justify-center bg-[#f7f3ed] hover:bg-[#d97757] hover:text-white rounded-xl text-[#1c1917]/20 border border-[#e5dec9] transition-all duration-300"
            >
                <EllipsisHorizontalIcon className="w-5 h-5" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-[1.5rem] shadow-2xl shadow-[#d9cfb0]/40 border border-[#e5dec9] py-2 z-50 animate-in fade-in zoom-in-95 duration-300">
                    <button
                        onClick={handleToggle}
                        className="w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-[0.15em] text-[#1c1917]/60 hover:bg-[#f7f3ed] hover:text-[#d97757] flex items-center gap-3 transition-colors"
                    >
                        {user.is_active ? <NoSymbolIcon className="w-4 h-4" /> : <CheckIcon className="w-4 h-4" />}
                        {user.is_active ? 'Deactivate Node' : 'Initialize Node'}
                    </button>
                    <button
                        onClick={handleReset}
                        className="w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-[0.15em] text-[#1c1917]/60 hover:bg-[#f7f3ed] hover:text-[#d97757] flex items-center gap-3 transition-colors"
                    >
                        <KeyIcon className="w-4 h-4" />
                        Reset Sequence
                    </button>
                    <div className="border-t border-[#f7f3ed] my-2 mx-5" />
                    <button
                        onClick={handleDelete}
                        className="w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-[0.15em] text-red-700 hover:bg-red-50 flex items-center gap-3 transition-colors italic"
                    >
                        <TrashIcon className="w-4 h-4" />
                        Purge Entity
                    </button>
                </div>
            )}
        </div>
    );
}
