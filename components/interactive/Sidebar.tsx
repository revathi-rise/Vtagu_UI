'use client';

import React from 'react';
import { Info, Map, Image, Star, Film } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const MENU_ITEMS = [
    { name: 'Overview', icon: Info, href: '/interactive/the-choice' },
    { name: 'Decisions Map', icon: Map, href: '/interactive/the-choice/map' },
    { name: 'Gallery', icon: Image, href: '/interactive/the-choice/gallery' },
    { name: 'Reviews', icon: Star, href: '/interactive/the-choice/reviews' },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 flex-shrink-0 bg-[#0f0a19] flex flex-col gap-8 py-8 pt-28 px-4 border-r border-white/5 h-screen sticky top-0 overflow-y-auto no-scrollbar">
            {/* Movie Title & Info */}
            <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#2a1b4a] flex items-center justify-center text-[#9248FF] shadow-lg shadow-purple-500/10">
                    <Film size={24} />
                </div>
                <div>
                    <h1 className="text-white font-bold text-lg tracking-tight">The Choice</h1>
                    <p className="text-[#9248FF] text-[10px] font-bold uppercase tracking-wider">
                        THRILLER • 2024
                    </p>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex flex-col gap-2">
                {MENU_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-300 group",
                                isActive 
                                    ? "bg-gradient-to-r from-[#9248FF] to-[#7030e6] text-white shadow-lg shadow-purple-500/20" 
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Icon 
                                size={18} 
                                className={cn(
                                    isActive ? "text-white" : "text-gray-500 group-hover:text-purple-400"
                                )} 
                            />
                            <span className="text-sm font-semibold">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
