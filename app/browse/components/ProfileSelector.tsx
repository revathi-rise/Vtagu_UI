"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Edit2 } from 'lucide-react';
import { authApi } from '@/lib/api/auth.api';
import { getUserId } from '@/lib/api-client';
import KidsIcon from '@/components/icons/KidsIcon';

export default function ProfileSelector() {
  const router = useRouter();
  const [isManaging, setIsManaging] = useState(false);

  const [profiles, setProfiles] = useState([
    { id: 1, name: "Loading...", avatar: "", color: "from-purple-600 to-indigo-600" },
    { id: 2, name: "Kids", avatar: "", color: "from-amber-400 to-orange-500", isKids: true }
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
            avatar: userData.profile_picture || "", 
            color: "from-purple-600 to-indigo-600" 
          },
          { 
            id: 2, 
            name: "Kids", 
            avatar: "", 
            color: "from-amber-400 to-orange-500",
            isKids: true
          }
        ]);
      } else {
        // Guest mode
        setProfiles([
          { id: 1, name: "Guest", avatar: "", color: "from-purple-600 to-indigo-600" },
          { id: 2, name: "Kids", avatar: "", color: "from-amber-400 to-orange-500", isKids: true }
        ]);
      }
    };

    loadData();
  }, []);

  // Parental PIN restriction commented out for now per client requirement
  // const [showPinModal, setShowPinModal] = useState(false);
  // const [pinInput, setPinInput] = useState('');
  // const [pinError, setPinError] = useState('');
  // const [pendingTargetProfile, setPendingTargetProfile] = useState<any>(null);

  const handleProfileClick = async (e: React.MouseEvent, profile: any) => {
    e.preventDefault();

    const userJson = localStorage.getItem('user');
    if (!userJson && !profile.isKids) {
      router.push('/login');
      return;
    }

    // Switching into Kids Mode
    if (profile.isKids) {
      try {
        await authApi.kidsLogin();
      } catch (err) {
        console.warn("Kids mode activation API call optional", err);
      }
      localStorage.setItem('currentProfile', JSON.stringify(profile));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('profileChanged'));
      }
      router.push('/');
      router.refresh();
      return;
    }

    // Switching into Standard Profile
    try {
      await authApi.exitKidsMode('');
    } catch (err) {
      console.warn("Exit kids mode API call optional", err);
    }
    localStorage.setItem('currentProfile', JSON.stringify(profile));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('profileChanged'));
    }
    router.push('/');
    router.refresh();
  };

  return (
    <div className="fixed inset-0 z-[200] w-full min-h-screen bg-[#0f0a19] flex flex-col items-center justify-center overflow-y-auto">
      {/* Brand Logo Header */}
      <Link href="/" className="absolute top-8 left-8 sm:left-12 flex items-center gap-2 hover:opacity-80 transition-opacity">
         <img
            src="/vtagu_logo.png"
            alt="PrimeTime Logo"
            className="h-10 sm:h-12 w-auto object-contain drop-shadow-md"
         />
      </Link>

      <div className="flex flex-col items-center mt-16 sm:mt-0 animate-in fade-in zoom-in duration-500">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-12 tracking-tight drop-shadow-xl text-center">
          Who's watching?
        </h1>
        
        <div className="flex flex-wrap justify-center gap-8 sm:gap-12">
           {profiles.map(profile => (
             <button 
               key={profile.id} 
               onClick={(e) => handleProfileClick(e, profile)}
               className="group flex flex-col items-center gap-4 text-left transition-all duration-300"
             >
               <div className={`relative w-32 h-32 sm:w-40 sm:h-40 rounded-3xl overflow-hidden transition-all duration-300 group-hover:scale-110 border-4 border-transparent ${
                 profile.isKids 
                   ? 'group-hover:border-amber-400 group-hover:shadow-[0_0_40px_rgba(251,191,36,0.6)] bg-gradient-to-tr from-amber-400 to-orange-500' 
                   : 'group-hover:border-[#b28cff] group-hover:shadow-[0_0_40px_rgba(178,140,255,0.6)] bg-gradient-to-tr from-purple-600 to-indigo-700'
               }`}>
                  {profile.isKids ? (
                    <KidsIcon className="w-full h-full p-2 group-hover:scale-105 transition-transform duration-300" />
                  ) : profile.avatar ? (
                    <img 
                      src={profile.avatar} 
                      className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-300" 
                      alt={profile.name} 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-black text-white text-5xl uppercase tracking-tighter drop-shadow-md">
                      {profile.name.substring(0, 1)}
                    </div>
                  )}
               </div>
               <span className="text-gray-400 font-bold group-hover:text-white transition-colors tracking-wide text-lg sm:text-xl text-center uppercase">
                 {profile.name}
               </span>
             </button>
           ))}
        </div>
      </div>

    </div>
  );
}
