import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Youtube, Globe, ArrowUpRight, Play, Film, Sparkles, Smartphone, ShieldCheck, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#050505] border-t border-white/[0.03] pt-24 pb-12 relative overflow-hidden">
      {/* Cinematic Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 blur-[150px] pointer-events-none opacity-50" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[300px] bg-accent/5 blur-[120px] pointer-events-none opacity-50" />
      
      <div className="max-w-[90%] mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-6">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-10">
            <Link href="/" className="flex items-center group">
              <Image
                src="/vtagu_primetime_logo.png"
                alt="PrimeTime Logo"
                width={260}
                height={70}
                className="w-auto h-14 md:h-16 object-contain drop-shadow-[0_0_20px_rgba(50,153,255,0.4)] group-hover:drop-shadow-[0_0_35px_rgba(50,153,255,0.6)] transition-all duration-700 group-hover:scale-[1.02]"
              />
            </Link>
            <p className="text-white/40 max-w-sm text-base md:text-lg leading-relaxed font-medium italic">
              "The next generation of cinematic storytelling. Experience entertainment beyond boundaries."
            </p>
            <div className="flex items-center gap-4">
              <SocialButton Icon={Facebook} href="#" label="Facebook" />
              <SocialButton Icon={Twitter} href="#" label="Twitter" />
              <SocialButton Icon={Instagram} href="#" label="Instagram" />
              <SocialButton Icon={Youtube} href="#" label="Youtube" />
            </div>
          </div>

          {/* Quick Links Sections */}
          <div className="lg:col-span-2 space-y-8">
            <h4 className="font-black text-white text-[10px] uppercase tracking-[0.3em] opacity-40">Library</h4>
            <ul className="space-y-4">
              <FooterLink href="/movies" Icon={Film}>Movies</FooterLink>
              <FooterLink href="/episodes" Icon={Play}>Episodes</FooterLink>
              <FooterLink href="/interactive" Icon={Sparkles}>Interactive</FooterLink>
              <FooterLink href="/pricing" Icon={ShieldCheck}>Membership</FooterLink>
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <h4 className="font-black text-white text-[10px] uppercase tracking-[0.3em] opacity-40">Platform</h4>
            <ul className="space-y-4">
              <FooterLink href="#">Features</FooterLink>
              <FooterLink href="#">Device List</FooterLink>
              <FooterLink href="#">Live Events</FooterLink>
              <FooterLink href="#">Global Access</FooterLink>
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <h4 className="font-black text-white text-[10px] uppercase tracking-[0.3em] opacity-40">Support</h4>
            <ul className="space-y-4">
              <FooterLink href="#">Help Center</FooterLink>
              <FooterLink href="#">Account</FooterLink>
              <FooterLink href="#">Privacy Policy</FooterLink>
              <FooterLink href="#">Contact Us</FooterLink>
            </ul>
          </div>

          {/* Newsletter / App */}
          <div className="lg:col-span-2 space-y-8">
            <h4 className="font-black text-white text-[10px] uppercase tracking-[0.3em] opacity-40">Stay Updated</h4>
            <div className="space-y-5">
               <Link 
                href="/pricing"
                className="w-full bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 border border-white/5 rounded-2xl py-4 px-5 flex items-center justify-between group transition-all duration-500 shadow-lg shadow-black/20"
               >
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] font-black uppercase tracking-[0.1em] text-primary mb-1">Coming Soon</span>
                    <span className="text-xs font-bold text-white group-hover:text-primary transition-colors">Mobile App</span>
                  </div>
                  <Smartphone size={20} className="text-white/20 group-hover:text-primary transition-all duration-500" />
               </Link>
               <div className="relative group">
                  <input 
                    type="email" 
                    placeholder="Join Newsletter" 
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-5 pr-12 text-xs font-bold focus:outline-none focus:border-primary/40 transition-all placeholder:text-white/20"
                  />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-primary transition-colors">
                    <Mail size={16} />
                  </button>
               </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-white/[0.03] text-white/20 text-[10px] font-black uppercase tracking-[0.25em]">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-center md:text-left">
            <p>© 2024 VTAGU PRIMETIME · ALL RIGHTS RESERVED</p>
            <div className="hidden md:block w-px h-4 bg-white/10" />
            <div className="flex items-center gap-6">
              <button className="hover:text-white transition-colors">Terms</button>
              <button className="hover:text-white transition-colors">Privacy</button>
              <button className="hover:text-white transition-colors">Cookies</button>
            </div>
          </div>
          
          <div className="flex items-center gap-6 mt-8 md:mt-0">
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
