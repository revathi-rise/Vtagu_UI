import React, { Suspense } from 'react';
import SearchClient from './components/SearchClient';

export const metadata = {
  title: "Search - PrimeTime",
  description: "Search for movies, TV shows, and PrimeTime originals.",
};

export default function SearchPage() {
  return (
     <div className="min-h-screen bg-[#0f0a19] pt-28 sm:pt-36 md:pt-40 lg:pt-44 pb-24 lg:pb-20">
        <div className="standard-container">
           <Suspense fallback={
             <div className="w-full animate-pulse space-y-6">
               <div className="h-14 sm:h-16 w-full rounded-2xl sm:rounded-3xl bg-white/5 border border-white/10" />
               <div className="flex gap-2">
                 {[...Array(6)].map((_, i) => (
                   <div key={i} className="h-8 w-20 rounded-full bg-white/5" />
                 ))}
               </div>
             </div>
           }>
             <SearchClient />
           </Suspense>
        </div>
     </div>
  );
}
