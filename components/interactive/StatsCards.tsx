'use client';

import React from 'react';
import { Zap, Map, Clock } from 'lucide-react';

const STATS = [
    { label: 'Key Decisions', value: '12', sub: 'Unique Turning Points', icon: Zap },
    { label: 'Distinct Finales', value: '4', sub: 'Main Story Endings', icon: Map },
    { label: 'Runtime', value: '1.5', sub: 'Hours per Session', icon: Clock },
];

export default function StatsCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STATS.map((stat) => {
                const Icon = stat.icon;
                return (
                    <div 
                        key={stat.label}
                        className="relative group p-6 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-300"
                    >
                        <div className="absolute left-0 top-0 w-1 h-full bg-[#9248FF] opacity-50 transition-all group-hover:opacity-100" />
                        
                        <div className="flex items-center gap-3 mb-6 text-[#9248FF]">
                            <Icon size={18} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">{stat.label}</span>
                        </div>
                        
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-white">{stat.value}</span>
                            <span className="text-gray-500 text-xs font-semibold">{stat.sub}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
