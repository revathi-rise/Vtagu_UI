"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Edit2 } from 'lucide-react';
import { authApi } from '@/lib/api/auth.api';
import { getUserId } from '@/lib/api-client';

export default function ProfileSelector() {
  const router = useRouter();
  const [isManaging, setIsManaging] = useState(false);
  const [profiles, setProfiles] = useState([
    { id: 1, name: "Loading...", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop", color: "from-blue-500 to-purple-600" },
    { id: 2, name: "Kids", avatar: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?q=80&w=200&auto=format&fit=crop", color: "from-yellow-400 to-orange-500", isKids: true }
  ]);

  useEffect(() => {
    const loadData = async () => {
      let userJson = localStorage.getItem('user');
      let userData = null;

      if (userJson) {
        try {
          userData = JSON.parse(userJson);
        } catch (e) {
          console.error("Error parsing user in ProfileSelector:", e);
        }
      }

      // If no user in localStorage, try fetching from API using userId/token
      if (!userData) {
        const userId = getUserId();
        if (userId) {
          try {
            const res = await authApi.getProfile(userId);
            if (res.status && res.data) {
              userData = res.data;
              localStorage.setItem('user', JSON.stringify(userData));
            }
          } catch (e) {
            console.error("Error fetching profile in ProfileSelector:", e);
          }
        }
      }

      if (userData) {
        setProfiles([
          { 
            id: userData.userId || userData.id || 1, 
            name: userData.user_name || userData.name || "User", 
            avatar: userData.profile_picture || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop", 
            color: "from-blue-500 to-purple-600" 
          },
          { 
            id: 2, 
            name: "Kids", 
            avatar: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?q=80&w=200&auto=format&fit=crop", 
            color: "from-yellow-400 to-orange-500",
            isKids: true
          }
        ]);
      } else {
        // Guest mode
        setProfiles([
          { id: 1, name: "Guest", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop", color: "from-blue-500 to-purple-600" },
          { id: 2, name: "Kids", avatar: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?q=80&w=200&auto=format&fit=crop", color: "from-yellow-400 to-orange-500", isKids: true }
        ]);
      }
    };

    loadData();
  }, []);

  const handleProfileClick = (e: React.MouseEvent, profile: any) => {
    // If not logged in and not a public profile, redirect to login
    const userJson = localStorage.getItem('user');
    if (!userJson && !profile.isKids) {
      e.preventDefault();
      router.push('/login');
      return;
    }

    // Save selected profile for the session
    localStorage.setItem('currentProfile', JSON.stringify(profile));
  };

  return (
    <div className="fixed inset-0 z-[200] w-full min-h-screen bg-[#0f0a19] flex flex-col items-center justify-center overflow-y-auto">
      {/* Brand Logo Header */}
      <Link href="/" className="absolute top-8 left-8 sm:left-12 flex items-center gap-2 hover:opacity-80 transition-opacity">
         <div className="w-10 h-10 bg-white flex items-center justify-center rounded-lg shadow-lg">
            <span className="text-[#1a1329] font-black text-2xl">P</span>
         </div>
         <span className="font-extrabold text-2xl tracking-tighter text-white">PrimeTime</span>
      </Link>

      <div className="flex flex-col items-center mt-16 sm:mt-0 animate-in fade-in zoom-in duration-500">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-10 tracking-tight drop-shadow-lg text-center">Who's watching?</h1>
        
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
           {profiles.map(profile => (
             <Link 
               href="/" 
               key={profile.id} 
               onClick={(e) => handleProfileClick(e, profile)}
               className="group flex flex-col items-center gap-4"
             >
               <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(146,72,255,0.4)] border-4 border-transparent group-hover:border-white">
                  <div className={`absolute inset-0 bg-gradient-to-tr ${profile.color} opacity-20`} />
                  {profile.avatar && (
                    <img src={profile.avatar} className="w-full h-full object-cover" alt={profile.name} />
                  )}
                  
                  {isManaging && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity border-4 border-white/20 rounded-xl">
                       <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center text-white bg-black/40 backdrop-blur-sm shadow-xl">
                          <Edit2 size={20} />
                       </div>
                    </div>
                  )}
               </div>
               <span className="text-gray-400 font-medium group-hover:text-white transition-colors tracking-wide text-lg sm:text-xl">
                 {profile.name}
               </span>
             </Link>
           ))}

           {/* Add Profile Button */}
           <button className="group flex flex-col items-center gap-4">
             <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl border-2 border-white/20 flex items-center justify-center bg-[#1a1329] transition-all duration-300 group-hover:border-white group-hover:bg-[#25183d]">
                <Plus size={48} className="text-gray-500 group-hover:text-white transition-colors" />
             </div>
             <span className="text-gray-400 font-medium group-hover:text-white transition-colors tracking-wide text-lg sm:text-xl">
               Add Profile
             </span>
           </button>
        </div>

        <button 
          onClick={() => setIsManaging(!isManaging)}
          className="mt-16 sm:mt-24 px-8 py-3 rounded-full border border-gray-500 text-gray-400 font-bold hover:border-white hover:text-white hover:bg-white/5 transition-colors tracking-widest text-sm uppercase"
        >
          {isManaging ? "Done" : "Manage Profiles"}
        </button>
      </div>
    </div>
  );
}
