import React from 'react';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Check, Zap, Crown, Sparkles, Star, Play, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getPlans } from '@/lib/vtagu.api';
import { API_BASE } from '@/lib/api-client';

export const metadata: Metadata = {
  title: 'Plans & Pricing | PrimeTime',
  description: 'Choose the perfect PrimeTime plan. Unlock unlimited movies, originals, and interactive experiences.',
};

const planStyles: Record<string, any> = {
  starter: {
    color: 'from-white/10 to-white/5',
    borderColor: 'border-white/10',
    icon: Play,
    iconColor: 'text-white/60',
    glow: '',
  },
  basic: {
    color: 'from-[#3299ff]/15 to-[#3299ff]/5',
    borderColor: 'border-[#3299ff]/30',
    icon: Zap,
    iconColor: 'text-[#3299ff]',
    glow: 'shadow-[0_0_40px_rgba(50,153,255,0.1)]',
    badge: 'Popular',
  },
  standard: {
    color: 'from-[#3299ff]/20 to-[#9248ff]/10',
    borderColor: 'border-[#3299ff]/40',
    icon: Crown,
    iconColor: 'text-[#3299ff]',
    glow: 'shadow-[0_0_50px_rgba(50,153,255,0.15)]',
    badge: 'Recommended',
    featured: true,
  },
  premium: {
    color: 'from-[#9248ff]/20 to-[#9248ff]/10',
    borderColor: 'border-[#9248ff]/40',
    icon: Sparkles,
    iconColor: 'text-[#9248ff]',
    glow: 'shadow-[0_0_60px_rgba(146,72,255,0.15)]',
    badge: 'Best Value',
  },
};

const getCompatibilityLabel = (comp?: number) => {
  if (comp === 1) return "Mobile & Tablet Access";
  if (comp === 2) return "Mobile, Tablet & Laptop Access";
  if (comp === 3) return "Mobile, Tablet, Laptop & TV Access";
  return "All Screen Access (Mobile, TV, Browser)";
};

export default async function PricingPage() {
  const plans = await getPlans();
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has('token');
  const token = cookieStore.get('token')?.value;
  const userIdStr = cookieStore.get('userId')?.value;
  const userId = userIdStr ? parseInt(userIdStr, 10) : null;

  let activeSubscription: any = null;
  if (token && userId) {
    try {
      const response = await fetch(`${API_BASE}/subscriptions/user/${userId}/active`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      });
      if (response.ok) {
        const result = await response.json();
        if (result.status && result.data) {
          activeSubscription = result.data;
        }
      }
    } catch (err) {
      console.error("Failed to fetch active subscription on pricing page:", err);
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0c] text-white selection:bg-cyan-500/30">
      
      {/* SECTION 1: HERO */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-28 px-6 text-center overflow-hidden">
        {/* Cinematic Image Background */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/pricing_hero.png" 
            alt="Cinematic background" 
            fill 
            className="object-cover opacity-40 brightness-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/40 to-[#0a0a0c]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c] via-transparent to-[#0a0a0c]" />
        </div>

        {/* Cinematic background elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#3299ff]/20 blur-[180px] rounded-full pointer-events-none opacity-40" />
        <div className="absolute top-40 left-1/4 w-[400px] h-[400px] bg-[#9248ff]/8 blur-[140px] rounded-full pointer-events-none opacity-40" />
        
        <div className="relative z-10 max-w-[95%] md:max-w-[90%] mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 mb-6 md:mb-8 animate-fade-in">
            <Star size={12} fill="currentColor" className="animate-pulse" />
            Vtagu Premium Experience
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-[45px] font-black tracking-tight md:tracking-[0.04em] mb-4 md:mb-6 leading-[1.1] md:leading-[0.9]" style={{ fontFamily: 'var(--font-montserrat)' }}>
            Pick the Plan That 
            <span className="block md:inline text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 md:pl-2">Powers Your Entertainment</span>
          </h1>
          
          <p className="text-white/50 text-base md:text-xl max-w-2xl mx-auto leading-relaxed font-medium" style={{ fontFamily: 'var(--font-inter)' }}>
            Experience cinema-grade streaming with flexible plans tailored for every screen. No commitments, just pure storytelling.
          </p>
        </div>
      </section>

      {/* SECTION 2: PRICING CARDS */}
      <section className="px-6 pb-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {plans.map((plan) => {
            const style = planStyles[plan.name.toLowerCase()] || planStyles.starter;
            const Icon = style.icon;
            const isActivePlan = activeSubscription && activeSubscription.planId === plan.planId && activeSubscription.status === 1;
            
            const isInteractiveOnly = (plan.quality?.toLowerCase() === 'none' || !plan.quality || plan.isStandardIncluded === 0) && (plan.isInteractiveIncluded === 1 || plan.is_interactive_included === 1);

            return (
                <div 
                  key={plan.planId}
                  className={`
                    relative flex flex-col rounded-[2rem] md:rounded-[2.5rem] border bg-gradient-to-br p-6 md:p-8
                    transition-all duration-700 hover:scale-[1.03] group
                    ${isActivePlan ? 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.1)]' : style.color} 
                    ${isActivePlan ? 'border-emerald-500/30' : style.borderColor} 
                    ${isActivePlan ? '' : style.glow}
                    ${style.featured && !isActivePlan ? 'ring-2 ring-cyan-500/30' : ''}
                    ${isActivePlan ? 'ring-2 ring-emerald-500/30' : ''}
                  `}
                >
                  {/* Badge */}
                  {(style.badge || isActivePlan || isInteractiveOnly) && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className={`px-5 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white whitespace-nowrap shadow-2xl ${
                        isActivePlan
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-600'
                          : (isInteractiveOnly
                              ? 'bg-gradient-to-r from-purple-500 to-indigo-600'
                              : (style.featured 
                                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600' 
                                  : 'bg-white/10 backdrop-blur-md border border-white/20'
                                )
                            )
                      }`}>
                        {isActivePlan ? 'Active Plan' : (isInteractiveOnly ? 'Interactive Only' : style.badge)}
                      </div>
                    </div>
                  )}

                  {/* Header */}
                  <div className="mb-6 md:mb-8">
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 md:mb-6 group-hover:rotate-12 transition-transform duration-500 ${isActivePlan ? 'text-emerald-400' : style.iconColor}`}>
                      <Icon size={24} className="md:w-7 md:h-7" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase mb-1 italic">
                      {plan.name}
                    </h2>
                    <div className="text-[9px] md:text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                      {plan.validity} ACCESS
                    </div>
                    
                    {isInteractiveOnly && (
                      <div className="mt-3 bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-semibold p-3 rounded-2xl">
                        Recommended: Interactive Movies only. Standard streaming is not included.
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mb-8 md:mb-10">
                    <div className="flex items-baseline gap-1">
                      <span className="text-white/40 text-lg md:text-xl font-bold italic">₹</span>
                      <span className="text-5xl md:text-6xl font-black text-white tracking-tighter">
                        {plan.price}
                      </span>
                      <span className="text-white/30 text-xs md:text-sm font-bold uppercase tracking-widest ml-1">
                        / {plan.validity.split(' ')[1] === 'Year' ? 'yr' : 'mo'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {plan.discount > 0 && (
                        <div className="text-cyan-400 text-[11px] font-black uppercase tracking-widest bg-cyan-400/10 px-3 py-1 rounded-full inline-block">
                          Save {plan.discount}% Off
                        </div>
                      )}
                      {isActivePlan && (
                        <div className="text-emerald-400 text-[11px] font-black uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full inline-block">
                          Subscribed
                        </div>
                      )}
                    </div>
                    {isActivePlan && activeSubscription.timestamp_to && (
                      <div className="mt-3 text-white/50 text-[10px] font-black uppercase tracking-[0.1em] border-t border-white/5 pt-3">
                        Renews: {new Date(activeSubscription.timestamp_to * 1000).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {/* Main Features Summary */}
                  <ul className="space-y-4 mb-10 flex-1">
                     {/* Stream Quality / Standard Streams */}
                     {!isInteractiveOnly ? (
                       <li className="flex items-center gap-3 text-sm font-bold text-white/80">
                          <div className="w-5 h-5 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                             <Check size={12} className="text-cyan-400" />
                          </div>
                          {plan.quality} Stream Quality
                       </li>
                     ) : (
                       <li className="flex items-center gap-3 text-sm font-bold text-white/30">
                          <div className="w-5 h-5 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                             <X size={12} className="text-red-400" />
                          </div>
                          No Standard Video Streams
                       </li>
                     )}

                     {/* Screens limit */}
                     {!isInteractiveOnly ? (
                       <li className="flex items-center gap-3 text-sm font-bold text-white/80">
                          <div className="w-5 h-5 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                             <Check size={12} className="text-cyan-400" />
                          </div>
                          {plan.screens} Active Screen{Number(plan.screens) > 1 ? 's' : ''}
                       </li>
                     ) : (
                       <li className="flex items-center gap-3 text-sm font-bold text-white/30">
                          <div className="w-5 h-5 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                             <X size={12} className="text-red-400" />
                          </div>
                          No Concurrent Standard Screens
                       </li>
                     )}

                     {/* Interactive Movies Access */}
                     {(plan.isInteractiveIncluded === 1 || plan.is_interactive_included === 1) ? (
                       <li className="flex items-center gap-3 text-sm font-bold text-white/80">
                          <div className="w-5 h-5 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                             <Check size={12} className="text-cyan-400" />
                          </div>
                          {isInteractiveOnly ? "Premium Interactive Movies Only" : "Includes Premium Interactive Movies"}
                       </li>
                     ) : (
                       <li className="flex items-center gap-3 text-sm font-bold text-white/30">
                          <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center opacity-40">
                             <span className="w-1.5 h-px bg-white/50" />
                          </div>
                          No Interactive Movies
                       </li>
                     )}

                     {/* Device Compatibility */}
                     <li className="flex items-center gap-3 text-sm font-bold text-white/80">
                        <div className="w-5 h-5 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                           <Check size={12} className="text-cyan-400" />
                        </div>
                        {getCompatibilityLabel(plan.compatibility)}
                     </li>

                     {/* Unlimited library */}
                     <li className="flex items-center gap-3 text-sm font-bold text-white/80">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.unlimited === 1 ? 'bg-cyan-500/10 border border-cyan-500/30' : 'bg-white/5 border border-white/10 opacity-40'}`}>
                          {plan.unlimited === 1 ? <Check size={12} className="text-cyan-400" /> : <div className="w-1.5 h-px bg-white/50" />}
                        </div>
                        <span className={plan.unlimited === 1 ? '' : 'text-white/30'}>Unlimited Library</span>
                     </li>

                     {/* Free cancellation */}
                     <li className="flex items-center gap-3 text-sm font-bold text-white/80">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.cancellation === 1 ? 'bg-cyan-500/10 border border-cyan-500/30' : 'bg-white/5 border border-white/10 opacity-40'}`}>
                          {plan.cancellation === 1 ? <Check size={12} className="text-cyan-400" /> : <div className="w-1.5 h-px bg-white/50" />}
                        </div>
                        <span className={plan.cancellation === 1 ? '' : 'text-white/30'}>Cancel Anytime</span>
                     </li>
                  </ul>

                  {/* CTA */}
                  <Link
                    href={isActivePlan ? "/account" : (isLoggedIn ? `/checkout?plan=${plan.planId}` : `/register?plan=${plan.planId}`)}
                    className={`
                      w-full py-5 rounded-[1.5rem] text-xs font-black uppercase tracking-[0.2em] text-center transition-all duration-300 flex items-center justify-center gap-2 group/btn
                      ${isActivePlan 
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_15px_40px_rgba(16,185,129,0.3)]' 
                        : (style.featured 
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_15px_40px_rgba(6,182,212,0.3)]' 
                          : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                        )
                      }
                    `}
                  >
                    {isActivePlan ? "Current Plan" : `Get ${plan.name}`}
                    <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
            );
          })}
        </div>

        {/* Minimal Footer Note */}
        <div className="mt-20 text-center">
          <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] mb-4">
            Security & Trust Guaranteed
          </p>
          <div className="flex justify-center items-center gap-8 opacity-20 grayscale">
             {/* Simple brand icons or text */}
             <span className="text-xs font-bold uppercase tracking-widest">VISA</span>
             <span className="text-xs font-bold uppercase tracking-widest">MASTERCARD</span>
             <span className="text-xs font-bold uppercase tracking-widest">UPI</span>
             <span className="text-xs font-bold uppercase tracking-widest">RAZORPAY</span>
          </div>
        </div>
      </section>
    </main>
  );
}
