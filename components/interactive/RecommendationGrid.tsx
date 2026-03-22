'use client';

import React from 'react';

const RECOMMENDATIONS = [
    {
        id: 1,
        title: "Neon Protocol",
        meta: "18 Decisions",
        image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=800&auto=format&fit=crop",
    },
    {
        id: 2,
        title: "Silent Void",
        meta: "8 Finales",
        image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=800&auto=format&fit=crop",
    },
    {
        id: 3,
        title: "The Basement",
        meta: "1.2h Runtime",
        image: "https://images.unsplash.com/photo-1485081666477-7493ee9393e9?q=80&w=800&auto=format&fit=crop",
    },
    {
        id: 4,
        title: "Mind Loop",
        meta: "Complex Web",
        image: "https://images.unsplash.com/photo-1478720568477-151d9b1472ae?q=80&w=800&auto=format&fit=crop",
    },
];

function RecommendationCard({ title, meta, image }: { title: string, meta: string, image: string }) {
    return (
        <div className="group relative aspect-[3/4] rounded-3xl overflow-hidden border border-white/5 cursor-pointer transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10">
            <img 
                src={image} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                alt={title} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
            
            <div className="absolute bottom-0 left-0 right-0 p-6">
                <h5 className="text-white font-black text-lg mb-1 tracking-tight group-hover:text-[#9248FF] transition-colors">{title}</h5>
                <span className="text-[#9248FF] text-[10px] font-bold uppercase tracking-widest bg-[#9248FF]/10 px-2 py-0.5 rounded border border-[#9248FF]/20">
                    {meta}
                </span>
            </div>
        </div>
    );
}

export default function RecommendationGrid() {
    return (
        <section className="flex flex-col gap-6">
            <h3 className="text-white text-xl font-bold tracking-tight">
                Recommended Interactive Stories
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {RECOMMENDATIONS.map((item) => (
                    <RecommendationCard key={item.id} {...item} />
                ))}
            </div>
        </section>
    );
}
