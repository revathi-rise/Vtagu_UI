"use client";
import { Bell, UserCircle } from "lucide-react";

const navItems = ["Movies", "Series", "Interactive", "Originals"];

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-black/30 backdrop-blur-xl border-b border-white/10">
      <div className="tv-container mx-auto flex items-center justify-between py-4 px-5 tablet:px-10">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-black tracking-wide text-purple-300">PrimeTime</span>
          <nav className="hidden mobile-lg:flex items-center gap-6 text-sm text-white/80">
            {navItems.map((item) => (
              <a key={item} className={`relative px-1 py-1 ${item === "Originals" ? "text-white" : "hover:text-white"} ${item === "Originals" ? "font-bold" : ""}`}>
                {item}
                {item === "Originals" && <span className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-purple-400 to-orange-300" />}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden mobile-lg:flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 backdrop-blur-sm">
            <input type="search" placeholder="Search titles..." className="bg-transparent outline-none text-sm text-white placeholder:text-white/50" />
          </div>
          <button className="p-2 text-white/90 rounded-full hover:bg-white/10"><Bell size={18} /></button>
          <button className="p-1 rounded-full border border-white/20 text-white/90 hover:bg-white/10"><UserCircle size={26} /></button>
        </div>
      </div>
    </header>
  );
}