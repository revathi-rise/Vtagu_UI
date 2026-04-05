import type { Metadata } from 'next';
import { Poppins, Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getGenres, Genre } from '@/lib/vtagu.api';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins'
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


  return (

    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <Navbar genres={genres} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
