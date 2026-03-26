import React from 'react';
import { PenSquare } from 'lucide-react';

export default function ProfileTab({ profile }: { profile: any }) {
  return (
    <section className="bg-[#1a1329]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 lg:p-8 flex items-center justify-between shadow-2xl overflow-hidden relative group">
      <div className="flex items-center gap-6">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-2 border-[#b28cff]/50 shadow-[0_0_30px_rgba(146,72,255,0.2)]">
            <img 
              src={profile.avatarUrl} 
              alt={profile.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <button className="absolute -bottom-2 -right-2 bg-[#d1aaff] hover:bg-white text-black p-2 rounded-lg shadow-lg transition-colors border border-black/10">
            <PenSquare size={16} strokeWidth={2.5} />
          </button>
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

      <div className="hidden sm:block">
        <button className="bg-[#cca8ff] hover:bg-white text-[#1a1329] px-6 py-2.5 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(146,72,255,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)]">
          Edit Profile
        </button>
      </div>
    </section>
  );
}
