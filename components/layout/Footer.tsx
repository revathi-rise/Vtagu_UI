import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-background-base border-t border-white/5 pt-16 md:pt-24 pb-8">
      <div className="tv-container px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16 md:mb-24">
          
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-white flex items-center justify-center rounded-md">
                <span className="text-primary font-bold text-xl leading-none">P</span>
              </div>
              <span className="font-bold text-xl tracking-tight">PrimeTime</span>
            </Link>
            <p className="text-text-secondary max-w-sm text-base md:text-lg leading-relaxed">
              The ultimate streaming destination for premium entertainment. Originals, blockbuster movies, and hit shows.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm md:text-base">Explore</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-text-secondary hover:text-white transition-colors block text-base md:text-lg">Movies</Link></li>
              <li><Link href="#" className="text-text-secondary hover:text-white transition-colors block text-base md:text-lg">TV Shows</Link></li>
              <li><Link href="#" className="text-text-secondary hover:text-white transition-colors block text-base md:text-lg">Originals</Link></li>
              <li><Link href="#" className="text-text-secondary hover:text-white transition-colors block text-base md:text-lg">New Arrivals</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm md:text-base">Support</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-text-secondary hover:text-white transition-colors block text-base md:text-lg">Help Center</Link></li>
              <li><Link href="#" className="text-text-secondary hover:text-white transition-colors block text-base md:text-lg">Terms of Service</Link></li>
              <li><Link href="#" className="text-text-secondary hover:text-white transition-colors block text-base md:text-lg">Privacy Policy</Link></li>
              <li><Link href="/account" className="text-text-secondary hover:text-white transition-colors block text-base md:text-lg">Account</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm md:text-base">Connect</h4>
            <div className="flex items-center gap-4">
              {/* Placeholder social circles */}
              <a href="#" className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <span className="w-4 h-4 md:w-5 md:h-5 bg-text-secondary rounded-full"></span>
              </a>
              <a href="#" className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <span className="w-4 h-4 md:w-5 md:h-5 bg-text-secondary rounded-sm"></span>
              </a>
            </div>
          </div>

        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 text-text-secondary text-sm md:text-base">
          <p>© 2024 VTAGU Primetime. All rights reserved.</p>
          <div className="flex items-center gap-2 mt-4 md:mt-0 cursor-pointer hover:text-white transition-colors">
            <span className="w-4 h-4 border-2 border-current rounded-full flex items-center justify-center text-[8px] font-bold">EN</span>
            <span>English (US)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
