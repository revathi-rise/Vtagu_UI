import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Youtube, Globe, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#050505] border-t border-white/5 pt-20 md:pt-32 pb-12 relative overflow-hidden">
      {/* Decorative Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-primary/5 blur-[120px] pointer-events-none" />
      
      <div className="max-w-[90%] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-16 mb-20">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-8">
            <Link href="/" className="flex items-center group">
              <Image
                src="/vtagu_primetime_logo.png"
                alt="PrimeTime Logo"
                width={180}
                height={50}
                className="w-auto h-10 object-contain drop-shadow-[0_0_15px_rgba(50,153,255,0.3)] group-hover:drop-shadow-[0_0_25px_rgba(50,153,255,0.5)] transition-all duration-500"
              />
            </Link>
            <p className="text-white/40 max-w-sm text-sm md:text-base leading-relaxed font-medium">
              The ultimate streaming destination for premium entertainment. Originals, blockbuster movies, and hit shows curated for the next generation of cinema.
            </p>
            <div className="flex items-center gap-4">
              <SocialButton Icon={Facebook} href="#" />
              <SocialButton Icon={Twitter} href="#" />
              <SocialButton Icon={Instagram} href="#" />
              <SocialButton Icon={Youtube} href="#" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-8">
            <h4 className="font-black text-white text-xs uppercase tracking-[0.2em]">Explore</h4>
            <ul className="space-y-4">
              <FooterLink href="/movies">Movies</FooterLink>
              <FooterLink href="/episodes">Episodes</FooterLink>
              <FooterLink href="/interactive">Interactive</FooterLink>
              <FooterLink href="#">Originals</FooterLink>
              <FooterLink href="/pricing">Pricing</FooterLink>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="font-black text-white text-xs uppercase tracking-[0.2em]">Company</h4>
            <ul className="space-y-4">
              <FooterLink href="#">About Us</FooterLink>
              <FooterLink href="#">Careers</FooterLink>
              <FooterLink href="#">Newsroom</FooterLink>
              <FooterLink href="#">Contact</FooterLink>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="font-black text-white text-xs uppercase tracking-[0.2em]">Support</h4>
            <ul className="space-y-4">
              <FooterLink href="#">Help Center</FooterLink>
              <FooterLink href="#">Terms of Service</FooterLink>
              <FooterLink href="#">Privacy Policy</FooterLink>
              <FooterLink href="#">Cookie Policy</FooterLink>
            </ul>
          </div>

          {/* App Download / Newsletter */}
          <div className="space-y-8">
            <h4 className="font-black text-white text-xs uppercase tracking-[0.2em]">Experience</h4>
            <div className="space-y-4">
               <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 px-4 flex items-center justify-between group transition-all">
                  <span className="text-xs font-bold uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">Get the App</span>
                  <ArrowUpRight size={16} className="text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
               </button>
               <p className="text-[10px] text-white/30 uppercase tracking-widest leading-relaxed">
                  Available on iOS, Android, and Smart TVs
               </p>
            </div>
          </div>

        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-10 border-t border-white/5 text-white/30 text-xs font-bold uppercase tracking-[0.15em]">
          <p>© 2024 VTAGU PRIMETIME. BEYOND ENTERTAINMENT.</p>
          <div className="flex items-center gap-6 mt-6 md:mt-0">
            <button className="flex items-center gap-2 hover:text-white transition-colors group">
              <Globe size={14} className="text-primary group-hover:rotate-12 transition-transform" />
              <span>English (US)</span>
            </button>
            <div className="w-1 h-1 rounded-full bg-white/10" />
            <button className="hover:text-white transition-colors">United States</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link 
        href={href} 
        className="text-white/40 hover:text-primary transition-all duration-300 block text-sm md:text-base font-semibold hover:translate-x-1"
      >
        {children}
      </Link>
    </li>
  );
}

function SocialButton({ Icon, href }: { Icon: any; href: string }) {
  return (
    <a 
      href={href} 
      className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-primary/10 hover:border-primary/30 text-white/40 hover:text-primary transition-all duration-500 group"
    >
      <Icon size={18} className="group-hover:scale-110 transition-transform" />
    </a>
  );
}
