import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0f0a10] flex flex-col items-center justify-center p-4">
      {/* PrimeTime Logo Skeleton */}
      <div className="w-48 h-12 bg-white/5 rounded-lg animate-pulse mb-12" />
      
      {/* Main Hero Skeleton */}
      <div className="w-full max-w-6xl aspect-[21/9] bg-white/5 rounded-3xl animate-pulse mb-12 shadow-2xl" />
      
      {/* Row Skeletons */}
      <div className="w-full max-w-6xl space-y-12">
        {[1, 2].map((i) => (
          <div key={i} className="space-y-4">
            <div className="w-64 h-8 bg-white/5 rounded-md animate-pulse ml-4" />
            <div className="flex gap-4 px-4 overflow-hidden">
              {[1, 2, 3, 4, 5, 6].map((j) => (
                <div 
                  key={j} 
                  className="min-w-[200px] aspect-[2/3] bg-white/5 rounded-2xl animate-pulse" 
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Cinematic Pulse Effect */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-t from-[#0f0a10] via-transparent to-transparent opacity-50" />
    </div>
  );
}
