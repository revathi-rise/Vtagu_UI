import type { Metadata } from 'next';
import { Montserrat, Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getGenres, Genre, getLanguages, Language } from '@/lib/vtagu.api';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat'
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: 'VTAGU Primetime | TV Optimized',
  description: 'Premium streaming entertainment platform.',
};

import { ReduxProvider } from './providers';
import NewsPopup from '@/components/shared/NewsPopup';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  let genres: Genre[] = [];
  try {
    genres = await getGenres();
  } catch (error) {
    console.error("Error fetching genres in RootLayout:", error);
  }

  let languages: Language[] = [];
  try {
    languages = await getLanguages();
  } catch (error) {
    console.error("Error fetching languages in RootLayout:", error);
  }


  return (

    <html lang="en" className={`${montserrat.variable} ${inter.variable}`}>
      <body className={`${montserrat.className} antialiased`}>
        <ReduxProvider>
          <Navbar genres={genres} languages={languages} />
          <div className="pt-24 min-h-screen">
            {children}
          </div>
          <NewsPopup />
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
