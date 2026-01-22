'use client';

import { useEffect, useState, useRef } from 'react';
import { getNotifications, markAsRead, clearAllNotifications } from '@/app/actions/notifications';
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

    const unreadCount = notifications.filter(n => !n.is_read).length;

    useEffect(() => {
        async function loadNotifications() {
            const res = await getNotifications();
            if (res.success) setNotifications(res.data);
            setLoading(false);
        }
        loadNotifications();

        // Close dropdown on click outside
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
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
                className="relative p-2 text-slate-400 hover:text-primary-600 transition-colors bg-slate-50 rounded-xl"
            >
                <BellIcon className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full ring-2 ring-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden transform origin-top-right transition-all">
                    <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleClearAll}
                                className="text-[10px] font-black uppercase text-primary-600 hover:text-primary-700"
                            >
                                Clear All
                            </button>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length === 0 && !loading && (
                            <div className="p-10 text-center">
                                <InboxIcon className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">No notifications yet</p>
                            </div>
                        )}

                        {notifications.map((n) => (
                            <div
                                key={n.id}
                                className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors group relative ${!n.is_read ? 'bg-primary-50/30' : ''}`}
                            >
                                <div className="flex gap-3">
                                    <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${n.type === 'task_assigned' ? 'bg-blue-100 text-blue-600' :
                                            n.type === 'mention' ? 'bg-purple-100 text-purple-600' :
                                                'bg-slate-100 text-slate-600'
                                        }`}>
                                        <BellIcon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-xs font-black text-slate-900 leading-tight">{n.title}</p>
                                        <p className="text-[11px] font-medium text-slate-500 leading-snug">{n.content}</p>
                                        {n.link && (
                                            <Link
                                                href={n.link}
                                                onClick={() => {
                                                    setIsOpen(false);
                                                    handleMarkAsRead(n.id);
                                                }}
                                                className="text-[10px] font-black text-primary-600 uppercase hover:underline block pt-1"
                                            >
                                                View Details
                                            </Link>
                                        )}
                                    </div>
                                    {!n.is_read && (
                                        <button
                                            onClick={() => handleMarkAsRead(n.id)}
                                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-emerald-500 transition-all"
                                        >
                                            <CheckCircleIcon className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-3 bg-slate-50/50 text-center border-t border-slate-50">
                        <button className="text-[10px] font-black uppercase text-slate-400 hover:text-slate-600">
                            Settings
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
