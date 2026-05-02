"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, Menu, X, ChevronRight, LogOut, User, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Genre, InteractiveMovie, getInteractiveMovies } from "@/lib/vtagu.api";
import { removeToken } from "@/lib/api-client";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { setUser } from "@/store/slices/authSlice";

export default function Navbar({ genres = [] }: { genres?: Genre[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [interactiveMovies, setInteractiveMovies] = useState<InteractiveMovie[]>([]);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const pathname = usePathname();

  const userName = user?.user_name || user?.name || null;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    const fetchInteractive = async () => {
      const data = await getInteractiveMovies();
      setInteractiveMovies(data);
    };

    const loadUser = () => {
      const userJson = localStorage.getItem('user');
      if (userJson) {
        try {
          const userData = JSON.parse(userJson);
          dispatch(setUser(userData));
        } catch (e) {
          console.error("Error parsing user in Navbar:", e);
        }
      } else {
        dispatch(setUser(null));
      }
    };

    window.addEventListener("scroll", handleScroll);
    fetchInteractive();
    loadUser();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [dispatch]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 flex justify-center transition-all duration-500 ${scrolled ? 'px-4' : 'px-0'}`}>
      {/* Top Gradient Overlay for readability against bright images */}
      <div className={`absolute top-0 left-0 w-full bg-gradient-to-b from-background/90 to-transparent pointer-events-none transition-all duration-500 ${scrolled ? 'h-[100px] opacity-0' : 'h-[140px] opacity-100'}`} />

      <div
        className={`
          flex items-center justify-between gap-2 sm:gap-6 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
          ${scrolled
            ? "relative mt-2 sm:mt-6 px-3 sm:px-6 overflow-hidden py-1.5 sm:py-2 rounded-full bg-secondary/85 backdrop-blur-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.15),0_0_0_1px_rgba(255,255,255,0.05)] w-[94%] lg:w-full max-w-[1440px]"
            : "relative mt-0 px-4 sm:px-18 rounded-none bg-transparent w-full border-b border-white/5"
          }
          before:absolute before:inset-0 before:rounded-inherit before:bg-gradient-to-b before:from-white/5 before:to-transparent before:pointer-events-none
        `}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center hover:scale-105 transition-transform duration-300">
          <Image
            src="/vtagu_logo.png"
            alt="PrimeTime Logo"
            width={160}
            height={80}
            className={`${scrolled ? 'h-[70px] w-auto object-cover scale-200 px-5' : 'h-[90px] w-auto object-cover scale-150'}`}
            priority
          />
        </Link>

        {/* Menu */}
        <nav className="hidden lg:flex items-center gap-1">
          <NavItem href="/" label="HOME" active={pathname === "/"} scrolled={scrolled} />

          <DropdownNavItem
            label="MOVIES"
            href="/movies"
            items={genres.map(g => ({ id: g.genre_id, name: g.name, path: g.path }))}
            active={pathname === "/movies"}
            scrolled={scrolled}
          />

          <DropdownNavItem
            label="EPISODES"
            href="/episodes"
            items={genres.map(g => ({ id: g.genre_id, name: g.name, path: g.path }))}
            active={pathname === "/episodes"}
            scrolled={scrolled}
          />

          <DropdownNavItem
            label="INTERACTIVE"
            href="/interactive"
            items={interactiveMovies.map(m => ({ id: m.interactive_movie_id, name: m.title, path: m.interactive_movie_id.toString() }))}
            active={pathname?.startsWith("/interactive")}
            scrolled={scrolled}
            isInteractive
          />

          <NavItem href="/pricing" label="PRICING" active={pathname === "/pricing"} scrolled={scrolled} />

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
          <button className={`flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all border border-white/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.3)] group active:scale-95 active:shadow-inner ${scrolled ? 'w-8 h-8 sm:w-9 sm:h-9' : 'w-10 h-10 sm:w-11 sm:h-11'}`}>
            <Search className={`group-hover:scale-110 transition-transform ${scrolled ? 'w-3.5 h-3.5 sm:w-4 sm:h-4' : 'w-4.5 h-4.5 sm:w-5 sm:h-5'}`} />
          </button>

          {/* Profile / Login */}
          {userName ? (
            <div className="flex items-center gap-2">
              <Link
                href="/account"
                className={`flex items-center gap-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all group shadow-[inset_0_1px_2px_rgba(255,255,255,0.05),0_2px_5px_rgba(0,0,0,0.2)] ${scrolled ? 'pl-1.5 pr-3 py-1' : 'pl-3 pr-5 py-2'}`}
              >
                <div className={`rounded-full bg-brand-gradient border border-white/30 shadow-[0_2px_10px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.3)] flex items-center justify-center font-bold text-white overflow-hidden uppercase transition-all ${scrolled ? 'w-6 h-6 text-[8px]' : 'w-9 h-9 text-xs'}`}>
                  {userName.substring(0, 2)}
                </div>
                <span className={`hidden sm:block font-black tracking-widest text-white/90 group-hover:text-white transition-colors uppercase ${scrolled ? 'text-[9px] xl:text-[10px]' : 'text-[10px] xl:text-xs'}`}>
                  {userName}
                </span>
              </Link>
              <button
                onClick={() => {
                  removeToken();
                  localStorage.removeItem('user');
                  localStorage.removeItem('userId');
                  document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                  dispatch(setUser(null));
                  window.location.href = '/';
                }}
                className={`flex items-center justify-center rounded-full bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition-all border border-red-500/20 active:scale-95 ${scrolled ? 'w-8 h-8 sm:w-9 sm:h-9' : 'w-10 h-10 sm:w-11 sm:h-11'}`}
                title="Logout"
              >
                <svg className={scrolled ? "w-3.5 h-3.5" : "w-4.5 h-4.5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className={`
                relative flex items-center gap-3 rounded-full overflow-hidden transition-all duration-500 group active:scale-95
                ${scrolled ? 'px-4 sm:px-6 py-4 text-[9px] sm:text-[10px]' : 'px-6 sm:px-9 py-2.5 sm:py-3.5 text-[10px] sm:text-xs'} 
                font-black uppercase tracking-[0.25em] text-white shadow-2xl
              `}
            >
              {/* Animated Gradient Background */}
              <div className="absolute inset-0 bg-brand-gradient opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              {/* Border Glow Effect */}
              <div className="absolute inset-0 rounded-full border border-white/20 group-hover:border-white/40 transition-colors" />

              {/* Inner Gloss */}
              <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

              <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                Sign In
              </span>

              {/* Shine Animation */}
              <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] group-hover:left-full transition-all duration-1000 ease-in-out" />
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden relative z-[70] w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white border border-white/20 shadow-lg active:scale-90 transition-all hover:bg-white/20"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-2xl lg:hidden flex flex-col"
          >
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
              <Image
                src="/vtagu_primetime_logo.png"
                alt="PrimeTime Logo"
                width={180}
                height={50}
                className="w-auto h-8 object-contain"
              />
              {/* Spacing for the fixed close button */}
              <div className="w-10 h-10" />
            </div>

            {/* Mobile Menu Links */}
            <div className="flex-1 overflow-y-auto px-6 py-8 space-y-1">
              <MobileNavItem href="/" label="HOME" active={pathname === "/"} onClick={() => setIsMobileMenuOpen(false)} />

              <MobileDropdownNavItem
                label="MOVIES"
                href="/movies"
                items={genres.map(g => ({ id: g.genre_id, name: g.name, path: g.path }))}
                onClick={() => setIsMobileMenuOpen(false)}
              />

              <MobileDropdownNavItem
                label="EPISODES"
                href="/episodes"
                items={genres.map(g => ({ id: g.genre_id, name: g.name, path: g.path }))}
                onClick={() => setIsMobileMenuOpen(false)}
              />

              <MobileDropdownNavItem
                label="INTERACTIVE"
                href="/interactive"
                items={interactiveMovies.map(m => ({ id: m.interactive_movie_id, name: m.title, path: m.interactive_movie_id.toString() }))}
                isInteractive
                onClick={() => setIsMobileMenuOpen(false)}
              />

              <MobileNavItem href="/pricing" label="PRICING" active={pathname === "/pricing"} onClick={() => setIsMobileMenuOpen(false)} />

              <div className="py-4 px-4 mt-4 border-t border-white/5 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                    <Globe className="w-4 h-4 text-white/60" />
                  </div>
                  <span className="text-sm font-bold text-white/60 uppercase tracking-widest">Languages</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-primary">ENGLISH</span>
                  <ChevronRight className="w-4 h-4 text-white/20" />
                </div>
              </div>
            </div>

            {/* Mobile Menu Footer (Profile/Login) */}
            <div className="p-6 border-t border-white/5 bg-white/5">
              {userName ? (
                <div className="space-y-4">
                  <Link
                    href="/account"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10"
                  >
                    <div className="w-12 h-12 rounded-full bg-brand-gradient flex items-center justify-center font-bold text-white shadow-lg border border-white/20 uppercase text-sm">
                      {userName.substring(0, 2)}
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-0.5">Signed in as</p>
                      <p className="text-sm font-black text-white uppercase tracking-wider">{userName}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/20" />
                  </Link>
                  <button
                    onClick={() => {
                      removeToken();
                      localStorage.removeItem('user');
                      localStorage.removeItem('userId');
                      document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                      dispatch(setUser(null));
                      setIsMobileMenuOpen(false);
                      window.location.href = '/';
                    }}
                    className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-red-500/10 text-red-500 font-bold uppercase tracking-widest text-xs border border-red-500/20 active:scale-95 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full relative flex items-center justify-center py-4 rounded-2xl overflow-hidden group active:scale-95 transition-all shadow-xl"
                >
                  <div className="absolute inset-0 bg-brand-gradient" />
                  <span className="relative z-10 text-white font-black uppercase tracking-[0.2em] text-sm">Sign In to PrimeTime</span>
                  <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] group-hover:left-full transition-all duration-1000" />
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function DropdownNavItem({
  label,
  href,
  items,
  active,
  scrolled,
  isInteractive = false
}: {
  label: string;
  href: string;
  items: { id: number | string, name: string, path: string }[];
  active?: boolean;
  scrolled: boolean;
  isInteractive?: boolean;
}) {
  return (
    <div className="relative group/dropdown px-1">
      <Link
        href={href}
        className={`
          relative font-medium px-5 rounded-full transition-all duration-300 uppercase flex items-center gap-1.5
          ${scrolled ? 'py-2 text-sm xl:text-base' : 'py-3 text-base xl:text-lg'}
          ${active
            ? "bg-secondary text-primary shadow-[inset_0_2px_4px_rgba(0,0,0,0.4),0_1px_1px_rgba(255,255,255,0.1)] border border-white/10"
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
        <div className="bg-secondary/95 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] p-2 overflow-hidden overflow-y-auto max-h-[450px] scrollbar-hide">
          <div className="grid grid-cols-1 gap-1">
            {(items && items.length > 0) ? (
              items.map((item) => (
                <Link
                  key={item.id}
                  href={isInteractive ? `${href}/${item.id}` : `${href}?genre=${item.path}`}
                  className="px-4 py-3 rounded-xl text-xs font-semibold text-white/50 hover:text-white hover:bg-white/5 transition-all uppercase flex items-center justify-between group/item"
                >
                  {item.name}
                  <div className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover/item:opacity-100 transition-opacity shadow-[0_0_8px_rgba(50,153,255,0.8)]" />
                </Link>
              ))
            ) : (
              <div className="px-4 py-3 text-[10px] text-white/30 italic text-center uppercase tracking-widest">
                Loading {label.toLowerCase()}...
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
          ? "bg-secondary text-primary shadow-[inset_0_2px_4px_rgba(0,0,0,0.4),0_1px_1px_rgba(255,255,255,0.1)] border border-white/10"
          : "text-white/60 hover:text-white hover:bg-white/5 active:bg-black/20"
        }
      `}
    >
      {label}
    </Link>
  );
}

function MobileNavItem({
  href,
  label,
  active,
  onClick
}: {
  href: string;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        flex items-center justify-between px-4 py-4 rounded-2xl transition-all duration-300 group
        ${active ? "bg-white/10 text-primary" : "text-white/60 hover:text-white hover:bg-white/5"}
      `}
    >
      <span className="text-sm font-bold uppercase tracking-[0.2em]">{label}</span>
      <ChevronRight className={`w-4 h-4 transition-transform ${active ? "opacity-100" : "opacity-0 group-hover:opacity-40"}`} />
    </Link>
  );
}

function MobileDropdownNavItem({
  label,
  href,
  items,
  isInteractive = false,
  onClick
}: {
  label: string;
  href: string;
  items: { id: number | string, name: string, path: string }[];
  isInteractive?: boolean;
  onClick: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-all duration-300
          ${isOpen ? "bg-white/5 text-white" : "text-white/60 hover:text-white hover:bg-white/5"}
        `}
      >
        <span className="text-sm font-bold uppercase tracking-[0.2em]">{label}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : "opacity-40"}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-white/5 rounded-2xl mx-2"
          >
            <div className="p-2 space-y-1">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={isInteractive ? `${href}/${item.id}` : `${href}?genre=${item.path}`}
                  onClick={onClick}
                  className="block px-4 py-3 rounded-xl text-xs font-bold text-white/40 hover:text-white hover:bg-white/5 transition-all uppercase"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
