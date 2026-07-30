import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vtagu Shorts | PrimeTime',
  description: 'Watch vertical short videos on Vtagu PrimeTime.',
};

/**
 * Isolated layout for the /shorts page.
 * Deliberately does NOT include the global Navbar or Footer — the shorts player
 * is a full-screen immersive experience with its own navigation UI.
 */
export default function ShortsPlayerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
}
