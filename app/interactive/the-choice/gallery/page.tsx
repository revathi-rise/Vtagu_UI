"use client";
import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

const IMAGES = [
  "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1478479405421-ce83c92fb3ba?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop"
];

export default function GalleryPage() {
    return (
        <main className="p-8 pt-28 lg:p-12 lg:pt-32 flex flex-col gap-12 max-w-[1400px] mx-auto w-full">
            <div className="flex flex-col gap-3">
              <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-md flex items-center gap-4">
                 <ImageIcon className="text-[#9248FF]" size={40} />
                 Production Gallery
              </h1>
              <p className="text-gray-400">Exclusive production stills and behind-the-scenes moments from The Choice.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               {IMAGES.map((src, idx) => (
                  <div key={idx} className="group relative rounded-2xl overflow-hidden aspect-video bg-[#1a1329] border border-white/5 cursor-pointer shadow-lg hover:shadow-[0_10px_30px_rgba(146,72,255,0.2)] transition-all duration-300 hover:-translate-y-1">
                     <img 
                       src={src} 
                       className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
                       alt={`Gallery Image ${idx + 1}`} 
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a19] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                        <p className="text-white font-bold tracking-wide">Scene Fragment 0{idx + 1}</p>
                     </div>
                  </div>
               ))}
            </div>

            {/* Footer Spacer */}
            <div className="h-24" />
        </main>
    );
}
