"use client";
import { Twitter, Youtube, Instagram } from "lucide-react";

const sections = {
  Browse: ["Featured Originals", "Top Movies", "Trending Series", "Interactive Experience"],
  Company: ["About PrimeTime", "Careers", "Press Room", "Contact Us"],
  Support: ["Help Center", "Devices", "Account & Billing", "Gift Cards"],
  Legal: ["Terms of Use", "Privacy Policy", "Cookie Prefs"],
};

export default function Footer() {
  return (
    <footer className="bg-[#0A0714] border-t border-white/10 py-10">
      <div className="tv-container mx-auto px-5 tablet:px-10 grid gap-8 tablet:grid-cols-5">
        <div>
          <h4 className="text-2xl font-black">PrimeTime</h4>
          <p className="mt-2 text-sm text-white/70 max-w-xs">
            Experience the next generation of entertainment. Original stories, interactive worlds, and cinematic masterpieces.
          </p>
        </div>
        {Object.entries(sections).map(([title, items]) => (
          <div key={title}>
            <h5 className="mb-3 text-sm font-bold uppercase tracking-wider text-white/80">{title}</h5>
            <ul className="space-y-2 text-sm text-white/70">
              {items.map((item) => (
                <li key={item}><a className="hover:text-white transition">{item}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="tv-container mx-auto px-5 tablet:px-10 mt-8 border-t border-white/10 pt-4 flex flex-col tablet:flex-row justify-between items-center gap-3 text-xs text-white/60">
        <div>© 2026 PRIMETIME ORIGINALS. ALL RIGHTS RESERVED.</div>
        <div className="flex items-center gap-3">
          <span>ENGLISH (US)</span>
          <span>AUDIO DESCRIPTION</span>
          <div className="flex items-center gap-2 text-white">
            <Twitter size={16} />
            <Youtube size={16} />
            <Instagram size={16} />
          </div>
        </div>
      </div>
    </footer>
  );
}