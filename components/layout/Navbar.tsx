"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, Menu } from "lucide-react";
import { Genre } from "@/lib/vtagu.api";

export default function Navbar({ genres = [] }: { genres?: Genre[] }) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 flex justify-center transition-all duration-500 ${scrolled ? 'px-4' : 'px-0'}`}>
      {/* Top Gradient Overlay for readability against bright images */}
      <div className={`absolute top-0 left-0 w-full bg-gradient-to-b from-[#0B0A10]/90 to-transparent pointer-events-none transition-all duration-500 ${scrolled ? 'h-[100px] opacity-0' : 'h-[140px] opacity-100'}`} />
      
      <div
        className={`
          flex items-center justify-between gap-6 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
          ${scrolled
            ? "relative mt-6 px-6 py-2.5 rounded-full bg-[#120d1d]/85 backdrop-blur-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.15),0_0_0_1px_rgba(255,255,255,0.05)] scale-95 w-full max-w-[1440px]"
            : "relative mt-0 px-12 py-5 rounded-none bg-transparent w-full border-b border-white/5"
          }
          before:absolute before:inset-0 before:rounded-inherit before:bg-gradient-to-b before:from-white/5 before:to-transparent before:pointer-events-none
        `}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center hover:scale-105 transition-transform duration-300">
          <Image
            src="/vtagu_primetime_logo.png"
            alt="PrimeTime Logo"
            width={360}
            height={160}
            className={`w-auto transition-all duration-500 ${scrolled ? 'h-7 md:h-8' : 'h-8 md:h-10'} object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]`}
            priority
          />
        </Link>

        {/* Menu */}
        <nav className="hidden lg:flex items-center gap-1">
          <NavItem href="/" label="HOME" active={pathname === "/"} scrolled={scrolled} />

          <DropdownNavItem
            label="MOVIES"
            href="/movies"
            items={genres}
            active={pathname === "/movies"}
            scrolled={scrolled}
          />

          <DropdownNavItem
            label="SERIES"
            href="/shows"
            items={genres}
            active={pathname === "/shows"}
            scrolled={scrolled}
          />

          <NavItem href="/interactive/the-choice" label="INTERACTIVE" active={pathname?.startsWith("/interactive")} scrolled={scrolled} />
          <NavItem href="/originals" label="ORIGINALS" active={pathname === "/originals"} scrolled={scrolled} />

          <div className="relative group ml-1">
            <button className={`font-medium px-4 py-2 text-white/70 hover:text-white transition-all uppercase flex items-center gap-1 group ${scrolled ? 'text-sm xl:text-base' : 'text-base xl:text-lg'}`}>
              LANGUAGES
              <svg className="w-3 h-3 transition-transform group-hover:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
            </button>
          </div>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <button className={`flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all border border-white/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.3)] group active:scale-95 active:shadow-inner ${scrolled ? 'w-9 h-9' : 'w-11 h-11'}`}>
            <Search className={`group-hover:scale-110 transition-transform ${scrolled ? 'w-4 h-4' : 'w-5 h-5'}`} />
          </button>

          {/* Profile */}
          <Link
            href="/account"
            className={`flex items-center gap-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all group shadow-[inset_0_1px_2px_rgba(255,255,255,0.05),0_2px_5px_rgba(0,0,0,0.2)] ${scrolled ? 'pl-2 pr-4 py-1' : 'pl-3 pr-5 py-2'}`}
          >
            <div className={`rounded-full bg-gradient-to-tr from-purple-600 to-orange-500 border border-white/30 shadow-[0_2px_10px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.3)] flex items-center justify-center font-bold text-white overflow-hidden uppercase transition-all ${scrolled ? 'w-7 h-7 text-[9px]' : 'w-9 h-9 text-xs'}`}>
              VU
            </div>
            <span className={`hidden sm:block font-black tracking-widest text-white/90 group-hover:text-white transition-colors uppercase ${scrolled ? 'text-[9px] xl:text-[10px]' : 'text-[10px] xl:text-xs'}`}>
              PROFILE
            </span>
          </Link>

          {/* Mobile Menu */}
          <button className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white border border-white/10 shadow-md">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}

function DropdownNavItem({
  label,
  href,
  items,
  active,
  scrolled
}: {
  label: string;
  href: string;
  items: Genre[];
  active?: boolean;
  scrolled: boolean;
}) {
  return (
    <div className="relative group/dropdown px-1">
      <Link
        href={href}
        className={`
          relative font-medium px-5 rounded-full transition-all duration-300 uppercase flex items-center gap-1.5
          ${scrolled ? 'py-2 text-sm xl:text-base' : 'py-3 text-base xl:text-lg'}
          ${active
            ? "bg-[#1e172e] text-cyan-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4),0_1px_1px_rgba(255,255,255,0.1)] border border-white/10"
            : "text-white/60 hover:text-white hover:bg-white/5 active:bg-black/20"
          }
        `}
      >
        {label}
        <svg
          className="w-2.5 h-2.5 transition-transform duration-300 group-hover/dropdown:rotate-180 opacity-60"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </Link>

      {/* Dropdown Menu */}
      <div className={`absolute top-full left-1/2 -translate-x-1/2 w-64 opacity-0 translate-y-2 pointer-events-none group-hover/dropdown:opacity-100 group-hover/dropdown:translate-y-0 group-hover/dropdown:pointer-events-auto transition-all duration-300 z-[60] ${scrolled ? 'pt-2' : 'pt-4'}`}>
        <div className="bg-[#161121]/95 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] p-2 overflow-hidden overflow-y-auto max-h-[450px] scrollbar-hide">
          <div className="grid grid-cols-1 gap-1">
            {(items && items.length > 0) ? (
              items.map((genre) => (
                <Link
                  key={genre.genre_id}
                  href={`${href}?genre=${genre.path}`}
                  className="px-4 py-3 rounded-xl text-xs font-semibold text-white/50 hover:text-white hover:bg-white/5 transition-all uppercase flex items-center justify-between group/item"
                >
                  {genre.name}
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 opacity-0 group-hover/item:opacity-100 transition-opacity shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                </Link>
              ))
            ) : (
              <div className="px-4 py-3 text-[10px] text-white/30 italic text-center uppercase tracking-widest">
                Loading genres...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({
  href,
  label,
  active,
  scrolled
}: {
  href: string;
  label: string;
  active?: boolean;
  scrolled: boolean;
}) {
  return (
    <Link
      href={href}
      className={`
        relative font-medium px-5 rounded-full transition-all duration-300 uppercase block
        ${scrolled ? 'py-2 text-sm xl:text-base' : 'py-3 text-base xl:text-lg'}
        ${active
          ? "bg-[#1e172e] text-cyan-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4),0_1px_1px_rgba(255,255,255,0.1)] border border-white/10"
          : "text-white/60 hover:text-white hover:bg-white/5 active:bg-black/20"
        }
      `}
    >
      {label}
    </Link>
  );
}
