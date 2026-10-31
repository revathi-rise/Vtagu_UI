'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Film, Tv, Sparkles, User, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import KidsIcon from '@/components/icons/KidsIcon';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<any>(null);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    setMounted(true);
    const loadProfile = () => {
      try {
        const stored = localStorage.getItem('currentProfile');
        if (stored) {
          setCurrentProfile(JSON.parse(stored));
        } else {
          setCurrentProfile(null);
        }
      } catch (e) {
        setCurrentProfile(null);
      }
    };
    loadProfile();
    window.addEventListener('profileChanged', loadProfile);
    return () => window.removeEventListener('profileChanged', loadProfile);
  }, []);

  // Hide on full-screen / immersive player pages
  if (pathname === '/shorts' || pathname.startsWith('/shorts/') || pathname.startsWith('/cinematic-exit-demo')) {
    return null;
  }

  const isHome = pathname === '/';
  const isMovies = pathname.startsWith('/movies') || pathname.startsWith('/movie');
  const isEpisodes = pathname.startsWith('/episodes') || pathname.startsWith('/shows');
  const isShorts = pathname.startsWith('/shorts');
  const isMyList = pathname.startsWith('/my-list');
  const isAccount = pathname.startsWith('/account') || pathname.startsWith('/browse');

  const navItems = [
    {
      label: 'Home',
      href: '/',
      active: isHome,
      icon: Home,
    },
    {
      label: 'Movies',
      href: '/movies',
      active: isMovies,
      icon: Film,
    },
    {
      label: 'Series',
      href: '/episodes',
      active: isEpisodes,
      icon: Tv,
    },
    {
      label: 'Shorts',
      href: '/shorts',
      active: isShorts,
      icon: Sparkles,
      badge: 'HOT',
    },
    {
      label: 'My List',
      href: '/my-list',
      active: isMyList,
      icon: Bookmark,
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#090611]/95 backdrop-blur-2xl border-t border-white/10 shadow-[0_-8px_30px_rgba(0,0,0,0.85)]"
      style={{
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 6px)',
      }}
    >
      <div className="grid grid-cols-5 items-center justify-around h-14 max-w-lg mx-auto px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.active;

          return (
            <Link
              key={item.label}
              href={item.href}
              className="relative flex flex-col items-center justify-center py-1 group select-none active:scale-95 transition-transform"
            >
              {/* Active Glow Pill */}
              {isActive && (
                <motion.div
                  layoutId="activeBottomTab"
                  className="absolute -top-1 w-8 h-1 rounded-full bg-gradient-to-r from-[#3299ff] to-[#9248ff] shadow-[0_0_12px_rgba(50,153,255,0.8)]"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}

              <div className="relative flex items-center justify-center">
                <Icon
                  size={19}
                  className={`transition-all duration-200 ${
                    isActive
                      ? 'text-[#3299ff] drop-shadow-[0_0_8px_rgba(50,153,255,0.7)] scale-110'
                      : 'text-white/50 group-hover:text-white/80'
                  }`}
                />

                {item.badge && (
                  <span className="absolute -top-1.5 -right-3 text-[8px] font-black tracking-tight px-1 py-0.2 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white animate-pulse shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[9px] sm:text-[10px] font-bold tracking-tight mt-1 transition-colors whitespace-nowrap truncate max-w-[56px] text-center ${
                  isActive
                    ? 'text-white font-extrabold'
                    : 'text-white/45 group-hover:text-white/70'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
