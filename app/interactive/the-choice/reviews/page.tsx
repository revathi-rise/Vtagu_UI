"use client";
import React from 'react';
import { Star, ThumbsUp, MessageSquare } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    name: "Alex Vance",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop",
    rating: 5,
    date: "2 days ago",
    text: "Absolutely mind-bending. I've replayed 'The Choice' four times already and keep finding new scenes I missed. The branching logic is seamless.",
    likes: 342
  },
  {
    id: 2,
    name: "Sarah Jenkins",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
    rating: 4,
    date: "1 week ago",
    text: "The acting is superb, especially during the interrogation scenes. Only giving it 4 stars because one of the endings felt a little rushed, but overall a massive leap forward for interactive cinema.",
    likes: 128
  },
  {
    id: 3,
    name: "Marcus Thorne",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop",
    rating: 5,
    date: "3 weeks ago",
    text: "PrimeTime hit it out of the park with this one. The UI doesn't get in the way of the storytelling, it enhances it. The Red Pill path is highly recommended for thriller fans.",
    likes: 512
  }
];

export default function ReviewsPage() {
    return (
        <main className="p-8 pt-28 lg:p-12 lg:pt-32 flex flex-col gap-12 max-w-[1400px] mx-auto w-full">
            <div className="flex flex-col gap-3">
              <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-md flex items-center gap-4">
                 <Star className="text-[#9248FF]" size={40} fill="currentColor" />
                 Community Reviews
              </h1>
              <p className="text-gray-400">See what others are saying about the experience.</p>
            </div>

            {/* Overall Rating Block */}
            <div className="flex items-center gap-8 bg-[#1a1329] border border-white/5 p-8 rounded-3xl">
               <div className="flex flex-col items-center justify-center">
                  <span className="text-6xl font-black text-white">4.8</span>
                  <div className="flex text-[#b28cff] mt-2">
                     {[1,2,3,4,5].map(i => <Star key={i} size={16} fill={i === 5 ? "none" : "currentColor"} />)}
                  </div>
                  <span className="text-gray-500 text-xs mt-2">Based on 12,402 reviews</span>
               </div>
               <div className="h-24 w-px bg-white/10 hidden sm:block" />
               <div className="flex-1 hidden sm:flex flex-col gap-2">
                  {[5,4,3,2,1].map(star => (
                     <div key={star} className="flex items-center gap-3">
                        <span className="text-gray-400 text-xs w-10">{star} Stars</span>
                        <div className="flex-1 h-2 bg-black rounded-full overflow-hidden">
                           <div 
                             className="h-full bg-gradient-to-r from-[#9248FF] to-[#b28cff] rounded-full" 
                             style={{ width: star === 5 ? '80%' : star === 4 ? '15%' : star === 3 ? '4%' : '1%' }}
                           />
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Reviews List */}
            <div className="flex flex-col gap-6">
               {REVIEWS.map((review) => (
                  <div key={review.id} className="bg-[#1a1329]/50 border border-white/5 p-6 rounded-2xl flex flex-col sm:flex-row gap-6 hover:bg-[#1a1329] transition-colors">
                     {/* Avatar Col */}
                     <div className="flex-shrink-0">
                        <img src={review.avatar} className="w-12 h-12 rounded-full border border-white/10 object-cover" alt={review.name} />
                     </div>
                     
                     {/* Content Col */}
                     <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                           <div>
                              <h4 className="text-white font-bold">{review.name}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                 <div className="flex text-[#b28cff]">
                                    {[...Array(5)].map((_, i) => (
                                       <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />
                                    ))}
                                 </div>
                                 <span className="text-gray-500 text-xs">• {review.date}</span>
                              </div>
                           </div>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed mb-6 mt-2">
                           "{review.text}"
                        </p>

                        {/* Actions */}
                        <div className="flex items-center gap-6 mt-auto">
                           <button className="flex items-center gap-2 text-gray-500 hover:text-[#b28cff] transition-colors text-xs font-bold">
                              <ThumbsUp size={14} /> Helpful ({review.likes})
                           </button>
                           <button className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-xs font-bold">
                              <MessageSquare size={14} /> Reply
                           </button>
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            {/* Footer Spacer */}
            <div className="h-24" />
        </main>
    );
}
