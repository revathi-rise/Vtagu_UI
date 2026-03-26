import React from 'react';
import MyListClient from './components/MyListClient';

export const metadata = {
  title: "My List - PrimeTime",
  description: "Your personalized watchlist of movies and TV shows.",
};

export default function MyListPage() {
  return (
     <div className="min-h-screen bg-[#0f0a19] pt-24 px-6 md:px-12 lg:px-20 pb-20">
        <MyListClient />
     </div>
  );
}
