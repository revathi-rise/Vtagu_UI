'use client';

import React, { useState } from 'react';
import { PenSquare, Save, X, Loader2 } from 'lucide-react';
import { authApi } from '@/lib/api/auth.api';
import { useRouter } from 'next/navigation';

export default function ProfileTab({ profile }: { profile: any }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    user_name: profile.name,
    email: profile.email,
    age: profile.age || '',
    gender: profile.gender || '',
    mobile: profile.mobile || '',
    profile_picture: profile.avatarUrl || '',
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.isGuest) return;
    
    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        age: formData.age ? parseInt(formData.age.toString(), 10) : undefined
      };
      const res = await authApi.updateProfile(profile.id, payload);
      if (res.status) {
        setIsEditing(false);
        router.refresh(); // Refresh server component data
      } else {
        alert(res.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("An error occurred while updating profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (isEditing) {
    return (
      <section className="bg-[#1a1329]/80 backdrop-blur-xl border border-[#b28cff]/30 rounded-2xl p-6 lg:p-8 shadow-2xl relative">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
          <button onClick={() => setIsEditing(false)} className="text-white/40 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Username</label>
            <input 
              type="text"
              value={formData.user_name}
              onChange={(e) => setFormData({...formData, user_name: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-[#b28cff] transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Email</label>
            <input 
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-[#b28cff] transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Mobile</label>
            <input 
              type="text"
              value={formData.mobile}
              onChange={(e) => setFormData({...formData, mobile: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-[#b28cff] transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Age</label>
              <input 
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-[#b28cff] transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Gender</label>
              <select 
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-[#b28cff] transition-all appearance-none"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Profile Picture URL</label>
            <input 
              type="text"
              value={formData.profile_picture}
              onChange={(e) => setFormData({...formData, profile_picture: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-[#b28cff] transition-all"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-4 mt-4">
            <button 
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-8 py-3 rounded-xl font-bold text-white/60 hover:text-white transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isLoading}
              className="bg-[#b28cff] hover:bg-white text-[#1a1329] px-8 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Save Changes
            </button>
          </div>
        </form>
      </section>
    );
  }

  return (
    <section className="bg-[#1a1329]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 lg:p-8 flex items-center justify-between shadow-2xl overflow-hidden relative group">
      <div className="flex items-center gap-6">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-2 border-[#b28cff]/50 shadow-[0_0_30px_rgba(146,72,255,0.2)] bg-[#2a2438]">
            <img 
              src={profile.avatarUrl} 
              alt={profile.name} 
              className="w-full h-full object-cover"
            />
          </div>
          {!profile.isGuest && (
            <button className="absolute -bottom-2 -right-2 bg-[#d1aaff] hover:bg-white text-black p-2 rounded-lg shadow-lg transition-colors border border-black/10">
              <PenSquare size={16} strokeWidth={2.5} />
            </button>
          )}
        </div>

        {/* Info */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-1 drop-shadow-sm">{profile.name}</h2>
          <p className="text-gray-400 text-sm md:text-base mb-4 font-medium">{profile.email}</p>
          
          <div className="flex items-center gap-3 text-[10px] md:text-xs font-bold tracking-widest text-white/80">
            {profile.badges.map((badge: string) => (
              <span key={badge} className="bg-[#2a2438] border border-white/10 px-3 py-1.5 rounded-full uppercase shadow-inner">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      {!profile.isGuest && (
        <div className="hidden sm:block">
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-[#cca8ff] hover:bg-white text-[#1a1329] px-6 py-2.5 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(146,72,255,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)]"
          >
            Edit Profile
          </button>
        </div>
      )}
    </section>
  );
}
