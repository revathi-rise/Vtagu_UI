import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Youtube, Globe, ArrowUpRight, Play, Film, Sparkles, Smartphone, ShieldCheck, Mail } from 'lucide-react';

const XIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="w-full bg-[#050505] border-t border-white/[0.03] pt-12 sm:pt-16 lg:pt-24 pb-8 sm:pb-12 relative overflow-hidden">
      {/* Cinematic Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 blur-[150px] pointer-events-none opacity-50" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[300px] bg-accent/5 blur-[120px] pointer-events-none opacity-50" />

      <div className="max-w-[90%] mx-auto relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-8 lg:gap-6 mb-10 lg:mb-12">

          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-4 space-y-4 sm:space-y-5">
            <Link href="/" className="flex items-center group">
              <Image
                src="/vtagu_logo.png"
                alt="PrimeTime Logo"
                width={360}
                height={120}
                className="w-auto h-20 sm:h-24 lg:h-28 object-contain drop-shadow-[0_0_25px_rgba(50,153,255,0.4)] group-hover:drop-shadow-[0_0_40px_rgba(50,153,255,0.6)] transition-all duration-700 group-hover:scale-[1.02]"
              />
            </Link>
            <div className="flex items-center gap-3 pt-1">
              <SocialButton Icon={Facebook} href="#" label="Facebook" />
              <SocialButton Icon={XIcon} href="#" label="X" />
              <SocialButton Icon={Instagram} href="#" label="Instagram" />
              <SocialButton Icon={Youtube} href="#" label="Youtube" />
            </div>
          </div>

          {/* Quick Links Sections */}
          <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-4 sm:space-y-5">
            <h4 className="font-black text-white text-[10px] uppercase tracking-[0.3em] opacity-40">Library</h4>
            <ul className="space-y-2.5 sm:space-y-3">
              <FooterLink href="/movies" Icon={Film}>Movies</FooterLink>
              <FooterLink href="/episodes" Icon={Play}>Web Series</FooterLink>
              <FooterLink href="/interactive" Icon={Sparkles}>Interactive</FooterLink>
              <FooterLink href="/pricing" Icon={ShieldCheck}>Membership</FooterLink>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-4 sm:space-y-5">
            <h4 className="font-black text-white text-[10px] uppercase tracking-[0.3em] opacity-40">Platform</h4>
            <ul className="space-y-2.5 sm:space-y-3">
              <FooterLink href="#">Features</FooterLink>
              <FooterLink href="#">Device List</FooterLink>
              <FooterLink href="#">Live Events</FooterLink>
              <FooterLink href="#">Global Access</FooterLink>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-4 sm:space-y-5">
            <h4 className="font-black text-white text-[10px] uppercase tracking-[0.3em] opacity-40">Support</h4>
            <ul className="space-y-2.5 sm:space-y-3">
              <FooterLink href="#">Help Center</FooterLink>
              <FooterLink href="#">Account</FooterLink>
              <FooterLink href="#">Privacy Policy</FooterLink>
              <FooterLink href="#">Contact Us</FooterLink>
            </ul>
          </div>

          {/* Newsletter / App */}
          <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-4 sm:space-y-5">
            <h4 className="font-black text-white text-[10px] uppercase tracking-[0.3em] opacity-40">Stay Updated</h4>
            <div className="space-y-3 sm:space-y-4">
              <Link
                href="/pricing"
                className="w-full bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 border border-white/5 rounded-xl sm:rounded-2xl py-3 px-4 flex items-center justify-between group transition-all duration-500 shadow-lg shadow-black/20"
              >
                <div className="flex flex-col items-start">
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] text-primary mb-0.5">Coming Soon</span>
                  <span className="text-[11px] sm:text-xs font-bold text-white group-hover:text-primary transition-colors">Mobile App</span>
                </div>
                <Smartphone size={18} className="text-white/20 group-hover:text-primary transition-all duration-500" />
              </Link>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Newsletter"
                  className="w-full bg-white/[0.03] border border-white/5 rounded-xl sm:rounded-2xl py-3 px-4 pr-10 text-[11px] sm:text-xs font-bold focus:outline-none focus:border-primary/40 transition-all placeholder:text-white/20"
                />
                <button className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-primary transition-colors">
                  <Mail size={14} />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 sm:pt-10 border-t border-white/[0.03] text-white/30 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-center sm:text-left">
            <p>© 2026 VTAGU PRIMETIME · ALL RIGHTS RESERVED</p>
            <div className="hidden sm:block w-px h-3.5 bg-white/10" />
            <div className="flex items-center gap-4 sm:gap-6">
              <button className="hover:text-white transition-colors">Terms</button>
              <button className="hover:text-white transition-colors">Privacy</button>
              <button className="hover:text-white transition-colors">Cookies</button>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 hover:text-white transition-all group">
              <Globe size={14} className="text-primary group-hover:rotate-12 transition-transform duration-500" />
              <span>International (EN)</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children, Icon }: { href: string; children: React.ReactNode; Icon?: any }) {
  return (
    <li>
      <Link
        href={href}
        className="text-white/40 hover:text-white transition-all duration-500 flex items-center gap-2 text-sm md:text-base font-semibold group"
      >
        {Icon && <Icon size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-500 text-primary" />}
        <span className="group-hover:translate-x-1 transition-transform duration-500">{children}</span>
      </Link>
    </li>
  );
}

function SocialButton({ Icon, href, label }: { Icon: any; href: string; label: string }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="w-11 h-11 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center hover:bg-primary/10 hover:border-primary/20 text-white/30 hover:text-primary transition-all duration-500 group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <Icon size={20} className="group-hover:scale-110 transition-transform relative z-10" />
    </a>
  );
}
