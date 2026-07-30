'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Genre, Language } from '@/lib/vtagu.api';

// Routes that should have NO navbar/footer (immersive full-screen pages)
const IMMERSIVE_ROUTES = ['/shorts'];

interface ConditionalLayoutProps {
  genres: Genre[];
  languages: Language[];
  children: React.ReactNode;
}

export default function ConditionalLayout({ genres, languages, children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isImmersive = IMMERSIVE_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'));

  if (isImmersive) {
    // Full-screen immersive — no navbar, no footer, no padding
    return (
      <div style={{ position: 'fixed', inset: 0, background: '#000', overflow: 'hidden' }}>
        {children}
      </div>
    );
  }

  return (
    <>
      <Navbar genres={genres} languages={languages} />
      <div className="pt-24 min-h-screen">
        {children}
      </div>
      <Footer />
    </>
  );
}
