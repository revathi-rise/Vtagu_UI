"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, Bell, Menu } from "lucide-react";

export default function Navbar() {

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
    <header className="fixed top-6 left-0 w-full z-50 flex justify-center px-4 pointer-events-none">
      <div
        className={`
          pointer-events-auto flex items-center justify-between gap-6 px-6 py-3 rounded-full 
          border border-white/10 transition-all duration-500
          ${scrolled
            ? "bg-black/80 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.1)] py-2 scale-95"
            : "bg-[#161121]/90 backdrop-blur-md shadow-[0_15px_30px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.05)]"
          }
        `}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center hover:scale-105 transition-transform duration-300">
          <Image
            src="/vtagu_primetime_logo.png"
            alt="PrimeTime Logo"
            width={360}
            height={160}
            className="w-auto h-7 md:h-9 object-contain"
            priority
          />
        </Link>

        {/* Menu */}
        <nav className="hidden lg:flex items-center gap-1">
          <NavItem href="/" label="HOME" active={pathname === "/"} />
          <NavItem href="/movies" label="MOVIES" active={pathname === "/movies"} />
          <NavItem href="/shows" label="SERIES" active={pathname === "/shows"} />
          <NavItem href="/interactive/the-choice" label="INTERACTIVE" active={pathname?.startsWith("/interactive")} />
          <NavItem href="/originals" label="ORIGINALS" active={pathname === "/originals"} />

          <div className="relative group ml-1">
            <button className="text-[10px] xl:text-xs font-black tracking-[0.15em] px-4 py-2 text-white/70 hover:text-white transition-all uppercase flex items-center gap-1 group">
              LANGUAGES
              <svg className="w-3 h-3 transition-transform group-hover:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
            </button>
          </div>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all border border-white/5 shadow-inner group">
            <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

          {/* Profile */}
          <Link
            href="/account"
            className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all group lg:min-w-[120px]"
          >
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-tr from-purple-500 to-orange-400 border border-white/20 shadow-md flex items-center justify-center text-[10px] font-bold text-white overflow-hidden uppercase">
              {/* VU Initial or Placeholder */}
              VU
            </div>
            <span className="hidden sm:block text-[10px] xl:text-xs font-black tracking-widest text-white/90 group-hover:text-white transition-colors uppercase">
              PROFILE
            </span>
          </Link>

          {/* Mobile Menu */}
          <button className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}

/* Updated NavItem for pill style */
function NavItem({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`
        relative text-[10px] xl:text-xs font-black tracking-[0.15em] px-5 py-2.5 rounded-full transition-all duration-300 uppercase
        ${active
          ? "bg-[#1e172e] text-cyan-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_4px_10px_rgba(0,0,0,0.3)] border border-white/5"
          : "text-white/60 hover:text-white hover:bg-white/5"
        }
      `}
    >
      {label}
    </Link>
  );
}