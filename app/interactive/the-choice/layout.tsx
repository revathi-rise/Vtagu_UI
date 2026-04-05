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
        </div>
    );
}
