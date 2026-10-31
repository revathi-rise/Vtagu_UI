import React from 'react';
import SearchClient from './components/SearchClient';

export const metadata = {
  title: "Search - PrimeTime",
  description: "Search for movies, TV shows, and PrimeTime originals.",
};

export default function SearchPage() {
  return (
     <div className="min-h-screen bg-[#0f0a19] pt-16 sm:pt-24 md:pt-28 pb-24 lg:pb-20">
        <div className="standard-container">
           <SearchClient />
        </div>
     </div>
  );
}
