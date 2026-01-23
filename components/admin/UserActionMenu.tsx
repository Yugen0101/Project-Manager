'use client';

import { useState, useRef, useEffect } from 'react';
import {
    EllipsisHorizontalIcon,
    KeyIcon,
    NoSymbolIcon,
    CheckIcon,
    TrashIcon
} from '@heroicons/react/24/outline';
import { toggleUserStatus, resetUserPassword, deleteUser, toggleMeetingPermission } from '@/app/actions/users';
import { VideoCameraIcon } from '@heroicons/react/24/outline';

interface User {
    id: string;
    is_active: boolean;
    role: string;
    can_schedule_meetings: boolean;
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

    const handleTogglePermission = async () => {
        const result = await toggleMeetingPermission(user.id, !user.can_schedule_meetings);
        if (!result.success) alert(result.error);
        else window.location.reload();
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
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
            >
                <EllipsisHorizontalIcon className="w-6 h-6" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-10">
                    <button
                        onClick={handleToggle}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                        {user.is_active ? <NoSymbolIcon className="w-4 h-4" /> : <CheckIcon className="w-4 h-4" />}
                        {user.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    {user.role === 'associate' && (
                        <button
                            onClick={handleTogglePermission}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                            <VideoCameraIcon className={`w-4 h-4 ${user.can_schedule_meetings ? 'text-indigo-500' : 'text-slate-400'}`} />
                            {user.can_schedule_meetings ? 'Disable Zoom' : 'Allow Zoom'}
                        </button>
                    )}
                    <button
                        onClick={handleReset}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                        <KeyIcon className="w-4 h-4" />
                        Reset Password
                    </button>
                    <div className="border-t border-slate-50 my-1" />
                    <button
                        onClick={handleDelete}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                        <TrashIcon className="w-4 h-4" />
                        Delete User
                    </button>
                </div>
            )}
        </div>
    );
}
