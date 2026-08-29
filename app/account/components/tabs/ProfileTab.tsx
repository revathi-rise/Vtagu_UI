'use client';

import React, { useState, useRef, useEffect } from 'react';
import { PenSquare, Save, X, Loader2, ChevronDown } from 'lucide-react';
import { authApi } from '@/lib/api/auth.api';
import { userApi } from '@/lib/api/user.api';
import { useRouter } from 'next/navigation';
import { useAlert } from '@/components/shared/CustomAlertModal';

export default function ProfileTab({ profile }: { profile: any }) {
  const router = useRouter();
  const { showAlert } = useAlert();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentProfile, setCurrentProfile] = useState(profile);
  const [formData, setFormData] = useState({
    user_name: profile.name,
    email: profile.email,
    age: profile.age || '',
    gender: profile.gender || '',
    mobile: profile.mobile || '',
    profile_picture: profile.avatarUrl || '',
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await userApi.uploadImage(file);
      if (res.status && res.url) {
        setFormData(prev => ({ ...prev, profile_picture: res.url }));
        showAlert({ title: "Image Uploaded", message: "Profile picture uploaded successfully!", type: "success" });
      } else {
        showAlert({ title: "Upload Failed", message: res.message || "Failed to upload image", type: "error" });
      }
    } catch (error) {
      console.error("Image upload error:", error);
      showAlert({ title: "Error", message: "An error occurred during image upload", type: "error" });
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    const checkLocalUser = () => {
      const userJson = localStorage.getItem('user');
      if (userJson) {
        try {
          const user = JSON.parse(userJson);
          const localProfile = {
            id: user.userId || user.id,
            name: user.user_name || user.name || "User",
            email: user.email,
            avatarUrl: user.profile_picture || user.avatarUrl || "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=300&auto=format&fit=crop",
            badges: [user.plan || "Free Member"],
            age: user.age,
            gender: user.gender,
            mobile: user.mobile,
            isGuest: false
          };
          setCurrentProfile(localProfile);
          setFormData({
            user_name: localProfile.name,
            email: localProfile.email,
            age: localProfile.age || '',
            gender: localProfile.gender || '',
            mobile: localProfile.mobile || '',
            profile_picture: localProfile.avatarUrl || '',
          });
        } catch (e) {
          console.error("Error parsing local user in ProfileTab:", e);
        }
      } else {
        setCurrentProfile(profile);
      }
    };

    checkLocalUser();
  }, [profile]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentProfile.isGuest) return;
    
    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        age: formData.age ? parseInt(formData.age.toString(), 10) : undefined
      };
      const res = await authApi.updateProfile(currentProfile.id, payload);
      if (res.status) {
        setIsEditing(false);
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          const updatedUser = {
            ...parsedUser,
            name: payload.user_name,
            user_name: payload.user_name,
            email: payload.email,
            mobile: payload.mobile,
            age: payload.age,
            gender: payload.gender,
            avatarUrl: payload.profile_picture,
            profile_picture: payload.profile_picture,
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        router.refresh(); // Refresh server component data
        showAlert({ title: "Profile Updated", message: "Your profile details have been saved successfully!", type: "success" });
      } else {
        showAlert({ title: "Update Failed", message: res.message || "Failed to update profile", type: "error" });
      }
    } catch (error) {
      console.error("Update error:", error);
      showAlert({ title: "Error", message: "An error occurred while updating profile", type: "error" });
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
          {/* Avatar Edit/Upload Widget */}
          <div className="md:col-span-2 flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-2xl p-6 mb-2">
            <div className="relative group cursor-pointer" onClick={triggerFileInput}>
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-2 border-[#b28cff]/50 shadow-[0_0_30px_rgba(146,72,255,0.2)] bg-[#2a2438] transition-all duration-300 group-hover:scale-105">
                <img 
                  src={formData.profile_picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop'} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-black/60 rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <PenSquare size={20} className="text-[#b28cff] mb-1" />
                <span className="text-[10px] font-black text-white uppercase tracking-wider">Change</span>
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
            
            <button 
              type="button" 
              onClick={triggerFileInput}
              disabled={isUploading}
              className="mt-4 px-4 py-2 bg-[#b28cff]/10 hover:bg-[#b28cff]/20 text-[#cca8ff] text-xs font-bold uppercase tracking-wider rounded-xl transition-all border border-[#b28cff]/20 disabled:opacity-50"
            >
              {isUploading ? 'Uploading...' : 'Upload Photo'}
            </button>
            {isUploading && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-[#cca8ff]/80 animate-pulse font-medium">
                <Loader2 size={12} className="animate-spin" /> Uploading image...
              </div>
            )}
          </div>
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
            <div className="space-y-2 relative" ref={dropdownRef}>
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Gender</label>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-[#b28cff] transition-all flex items-center justify-between text-left text-sm"
              >
                <span>{formData.gender || 'Select'}</span>
                <ChevronDown size={16} className={`text-white/40 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-[#b28cff]' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute left-0 right-0 bottom-full mb-2 bg-[#1a1329] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                  {['Select', 'Male', 'Female', 'Other'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, gender: option === 'Select' ? '' : option });
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full px-5 py-3 text-left text-sm transition-all hover:bg-[#b28cff] hover:text-[#1a1329] font-medium ${
                        (option === 'Select' && !formData.gender) || formData.gender === option
                          ? 'bg-[#b28cff]/10 text-[#b28cff]'
                          : 'text-white/80 hover:text-black'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
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
              src={currentProfile.avatarUrl} 
              alt={currentProfile.name} 
              className="w-full h-full object-cover"
            />
          </div>
          {!currentProfile.isGuest && (
            <button 
              onClick={() => setIsEditing(true)}
              className="absolute -bottom-2 -right-2 bg-[#d1aaff] hover:bg-white text-black p-2 rounded-lg shadow-lg transition-colors border border-black/10"
            >
              <PenSquare size={16} strokeWidth={2.5} />
            </button>
          )}
        </div>

        {/* Info */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-1 drop-shadow-sm">{currentProfile.name}</h2>
          <p className="text-gray-400 text-sm md:text-base mb-4 font-medium">{currentProfile.email}</p>
          
          <div className="flex items-center gap-3 text-[10px] md:text-xs font-bold tracking-widest text-white/80">
            {currentProfile.badges.map((badge: string) => (
              <span key={badge} className="bg-[#2a2438] border border-white/10 px-3 py-1.5 rounded-full uppercase shadow-inner">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      {!currentProfile.isGuest && (
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
