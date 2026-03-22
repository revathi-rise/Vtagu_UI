import React from 'react';
import SearchClient from './components/SearchClient';

export const metadata = {
  title: "Search - PrimeTime",
  description: "Search for movies, TV shows, and PrimeTime originals.",
};

export default function SearchPage() {
  return (
     <div className="min-h-screen bg-[#0f0a19] pt-24 px-6 md:px-12 lg:px-20 pb-20">
        <SearchClient />
     </div>
  );
}
