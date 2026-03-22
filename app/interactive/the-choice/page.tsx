'use client';

import React from 'react';
import Sidebar from '@/components/interactive/Sidebar';
import Hero from '@/components/interactive/Hero';
import StatsCards from '@/components/interactive/StatsCards';
import InteractivePreview from '@/components/interactive/InteractivePreview';
import RecommendationGrid from '@/components/interactive/RecommendationGrid';
import ProgressWidget from '@/components/interactive/ProgressWidget';


export const metadata = {
  title: 'The Choice - Interactive Experience',
  description: 'Step into the Spotlight. Shape the narrative in our exclusive interactive cinematic thriller.',
};

export default function InteractiveMoviePage() {
    return (
        <>
            {/* Page Content */}
            <main className="p-8 pt-28 lg:p-12 lg:pt-32 flex flex-col gap-12 max-w-[1400px] mx-auto w-full">
                <Hero />
                <StatsCards />
                <InteractivePreview />
                <RecommendationGrid />
            </main>
            
            {/* Footer Spacer */}
            <div className="h-24" />
        </>
    );
}
