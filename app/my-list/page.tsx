import React from 'react';
import MyListClient from './components/MyListClient';

export const metadata = {
  title: "My List - PrimeTime",
  description: "Your personalized watchlist of movies and TV shows.",
};

export default function MyListPage() {
  return (
     <div className="min-h-screen bg-[#0f0a19] pt-20 sm:pt-24 pb-24 lg:pb-20">
        <div className="standard-container">
           <MyListClient />
        </div>
     </div>
  );
}
