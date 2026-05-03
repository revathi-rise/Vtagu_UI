import React from 'react';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import { Shield } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Forgot Password - PrimeTime',
  description: 'Reset your PrimeTime streaming account password.',
};

export default function ForgotPasswordPage() {
  return (
    <div className="fixed inset-0 z-[200] w-full min-h-screen flex bg-[#0B0914] overflow-hidden">

      {/* Left Column (Form) */}
      <div className="w-full lg:w-[45%] flex flex-col justify-between px-8 sm:px-16 xl:px-24 py-10 min-h-screen overflow-y-auto custom-scrollbar">
        <div>
          <div className='flex justify-between items-center pb-4'>
            <Link href="/" className="flex items-center hover:scale-105 transition-transform duration-300">
              <Image
                src="/vtagu_logo.png"
                alt="PrimeTime Logo"
                width={160}
                height={80}
                className="h-[70px] w-auto object-cover scale-200 px-5"
                priority
              />
            </Link>
          </div>
          <div className="flex justify-center xl:justify-start">
            <ForgotPasswordForm />
          </div>
        </div>

        <div className="flex justify-between items-center text-[10px] text-gray-500 mt-12 py-4">
          <p>© 2026 PrimeTime. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>

      {/* Right Column (Cinematic) */}
      <div className="hidden lg:flex lg:w-[55%] relative flex-col justify-center p-16 xl:p-24 bg-black overflow-hidden border-l border-white/5 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]">
        {/* Cinematic Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2000&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-30 contrast-125"
            alt="Secure Theater"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0914] via-[#0B0914]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0914] via-transparent to-transparent opacity-80" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 max-w-2xl mt-auto pb-12">
          {/* SECURE Badge */}
          <div className="inline-flex items-center gap-2 bg-[#1a1329]/80 backdrop-blur-md border border-[#b28cff]/20 rounded-full px-4 py-1.5 mb-8 shadow-lg">
            <Shield size={14} className="text-[#b28cff]" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#e2d4ff] font-bold">Account Recovery</span>
          </div>

          <h1 className="text-6xl xl:text-7xl font-bold text-white leading-[1.1] mb-6 tracking-tight drop-shadow-2xl">
            Secure<br />Your<br />Access
          </h1>
          <p className="text-lg xl:text-xl text-gray-300 max-w-lg leading-relaxed drop-shadow-md">
            Regain entry to the ultimate cinematic experience. We'll help you reset your password safely and securely.
          </p>
        </div>
      </div>
    </div>
  );
}
