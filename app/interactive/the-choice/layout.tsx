"use client";
import React from 'react';
import Sidebar from '@/components/interactive/Sidebar';

export default function InteractiveMovieLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-[#0f0a19] text-white overflow-x-hidden">
            {/* Sidebar - Hidden on mobile, shown on desktop */}
            <div className="hidden lg:block">
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen">
                {children}
            </div>
            
            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                
                @keyframes pulse-soft {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                .animate-pulse-soft {
                    animation: pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>
        </div>
    );
}
