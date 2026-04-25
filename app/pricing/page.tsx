import React from 'react';
import { Metadata } from 'next';
import PricingClient from './PricingClient';


export const metadata: Metadata = {
  title: 'Plans & Pricing | PrimeTime',
  description:
    'Choose the perfect PrimeTime plan. Unlock unlimited movies, originals, and interactive experiences in stunning 4K HDR.',
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0c] text-white overflow-x-hidden">
      <PricingClient />
    </main>
  );
}
