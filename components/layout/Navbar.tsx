"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled
          ? "bg-black/70 backdrop-blur-xl shadow-lg"
          : "bg-transparent"
        }`}
    >
      <div className="max-w-[90%] mx-auto py-6 flex items-center justify-between">

        {/* Left */}
        <div className="flex items-center gap-8 lg:gap-14">

          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white flex items-center justify-center rounded-md">
              <span className="text-primary font-bold text-xl md:text-2xl">
                P
              </span>
            </div>

            <span className="font-bold text-xl md:text-2xl tracking-tight text-white hidden sm:block">
              PrimeTime
            </span>
          </Link>

          {/* Menu */}
          <nav className="hidden md:flex items-center gap-8 font-medium">

            <NavItem href="/" label="Home" active={pathname === "/"} />

            <NavItem href="/movies" label="Movies" active={pathname === "/movies"} />

            <NavItem href="/shows" label="Series" active={pathname === "/shows"} />
            <NavItem href="/interactive/the-choice" label="Interactive" active={pathname?.startsWith("/interactive")} />
            <NavItem href="/originals" label="Originals" active={pathname === "/originals"} />

          </nav>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4 md:gap-3">

          {/* Search */}
          <div className="hidden md:flex items-center bg-white/10 rounded-full px-4 py-2 border border-white/10 backdrop-blur-sm">
            <Search className="w-5 h-5 text-white/60" />

            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-white px-3 w-[150px] lg:w-[250px] placeholder:text-white/50"
            />
          </div>

          <button className="text-white/80 hover:text-white transition-colors">
            <Search className="w-6 h-6 md:hidden" />
          </button>

          {/* Bell */}
          <button className="text-white/80 hover:text-white transition-colors relative">
            <Bell className="w-6 h-6" />

            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-primary rounded-full border-2 border-black"></span>
          </button>

          {/* Profile */}
          <Link 
            href="/account" 
            className={`w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-purple-500 to-orange-400 border-2 transition-all duration-300 hover:scale-110 shadow-lg ${
              pathname === "/account" 
                ? "border-[#cca8ff] shadow-[0_0_15px_rgba(146,72,255,0.8)]" 
                : "border-white/20 hover:border-white/60"
            }`}
          />

          {/* Mobile Menu */}
          <button className="md:hidden text-white">
            <Menu className="w-7 h-7" />
          </button>

        </div>
      </div>
    </header>
  );
}

/* Menu Item Component */

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
      className={`group relative text-sm lg:text-base font-medium transition-colors ${active ? "text-white" : "text-white/70 hover:text-white"
        }`}
    >
      {label}

      {/* Hover Animation */}
      <span
        className={`absolute left-0 -bottom-1 h-[2px] bg-primary transition-all duration-300 ${active ? "w-full" : "w-0 group-hover:w-full"
          }`}
      />
    </Link>
  );
}