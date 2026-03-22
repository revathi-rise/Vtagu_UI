import React from 'react';
import TitleDetailClient from './components/TitleDetailClient';

export function generateMetadata({ params }: { params: { id: string } }) {
  // Simulating dynamic metadata generation per movie ID for SEO value
  return {
    title: `Watch Title ${params.id} - PrimeTime`,
    description: `Stream Title ${params.id} in 4K HDR right now on PrimeTime.`,
  }
}

export default function TitlePage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-[#0f0a19]">
       <TitleDetailClient id={params.id} />
    </div>
  );
}
