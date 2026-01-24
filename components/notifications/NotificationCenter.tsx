'use client';

import { useEffect, useState, useRef } from 'react';
import { getNotifications, markAsRead, clearAllNotifications } from '@/app/actions/notifications';
import { createClient } from '@/lib/supabase/client';
import {
    BellIcon,
    CheckCircleIcon,
    InboxIcon,
    TrashIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function NotificationCenter() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    const unreadCount = notifications.filter(n => !n.is_read).length;

    useEffect(() => {
        async function loadNotifications() {
            const res = await getNotifications();
            if (res.success && res.data) setNotifications(res.data);
            setLoading(false);
        }
        loadNotifications();

        // 1. Subscribe to Realtime notifications
        const channel = supabase
            .channel('public:notifications')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                },
                (payload) => {
                    // Check if the notification is for the current user
                    // Note: RLS handles security, but we double check here if needed
                    // Usually, RLS sends only authorized payloads if configured correctly
                    setNotifications(prev => [payload.new, ...prev]);

                    // Optional: Play alert sound or browser notification
                }
            )
            .subscribe();

        // Close dropdown on click outside
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            supabase.removeChannel(channel);
        };
    }, []);

    const handleMarkAsRead = async (id: string) => {
        const res = await markAsRead(id);
        if (res.success) {
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        }
    };

    const handleClearAll = async () => {
        const res = await clearAllNotifications();
        if (res.success) {
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-primary-500 hover:text-white rounded-xl text-slate-400 border border-slate-100 transition-all duration-300 shadow-sm"
            >
                <BellIcon className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full ring-4 ring-white shadow-lg shadow-primary-500/20">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-4 w-96 bg-white rounded-[2rem] shadow-2xl shadow-secondary-500/10 border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-500">
                    <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
                                Notifications
                            </h3>
                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-tight mt-0.5 font-sans">Recent Workspace Updates</p>
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleClearAll}
                                className="text-[11px] font-bold uppercase tracking-tight text-primary-500 hover:opacity-70 transition-opacity flex items-center gap-2"
                            >
                                <TrashIcon className="w-4 h-4" />
                                Clear All
                            </button>
                        )}
                    </div>

                    <div className="max-h-[450px] overflow-y-auto custom-scrollbar bg-white">
                        {notifications.length === 0 && !loading && (
                            <div className="py-20 text-center px-10">
                                <div className="w-16 h-16 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 mx-auto mb-6">
                                    <InboxIcon className="w-8 h-8" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 tracking-tight">All caught up</h3>
                                <p className="text-xs font-medium text-slate-400 mt-2 text-center max-w-[200px] mx-auto">No new notifications at the moment.</p>
                            </div>
                        )}

                        {notifications.map((n) => (
                            <div
                                key={n.id}
                                className={`p-6 border-b border-slate-50 hover:bg-slate-50/50 transition-all group relative ${!n.is_read ? 'bg-primary-50/20' : ''}`}
                            >
                                <div className="flex gap-5">
                                    <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm ${!n.is_read ? 'bg-white border-primary-100 text-primary-500' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
                                        <BellIcon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-bold text-slate-900 leading-tight tracking-tight">{n.title}</p>
                                            {!n.is_read && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 shadow-sm shadow-primary-500/50"></span>
                                            )}
                                        </div>
                                        <p className="text-xs font-medium text-slate-500 leading-normal">{n.content}</p>
                                        {n.link && (
                                            <Link
                                                href={n.link}
                                                onClick={() => {
                                                    setIsOpen(false);
                                                    handleMarkAsRead(n.id);
                                                }}
                                                className="inline-block text-[11px] font-bold text-primary-500 hover:opacity-70 transition-opacity mt-2"
                                            >
                                                View Details →
                                            </Link>
                                        )}
                                    </div>
                                </div>
                                {!n.is_read && (
                                    <button
                                        onClick={() => handleMarkAsRead(n.id)}
                                        className="opacity-0 group-hover:opacity-100 absolute top-6 right-6 p-2 text-primary-500 hover:bg-primary-500 hover:text-white rounded-lg transition-all shadow-sm border border-primary-100"
                                        title="Mark as read"
                                    >
                                        <CheckCircleIcon className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="p-6 bg-slate-50/50 text-center border-t border-slate-50">
                        <button className="text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-primary-500 transition-all">
                            Notification Settings
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
