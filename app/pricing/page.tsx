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
    color: 'from-white/[0.05] via-white/[0.02] to-transparent',
    borderColor: 'border-white/10',
    icon: Play,
    iconColor: 'text-white/70',
    glow: 'hover:border-white/30 hover:shadow-[0_10px_30px_rgba(255,255,255,0.05)]',
    badge: null,
  },
  basic: {
    color: 'from-blue-500/10 via-white/[0.02] to-transparent',
    borderColor: 'border-blue-500/20',
    icon: Zap,
    iconColor: 'text-blue-400',
    glow: 'hover:border-blue-400/50 hover:shadow-[0_10px_35px_rgba(59,130,246,0.2)]',
    badge: 'Popular',
  },
  standard: {
    color: 'from-cyan-500/15 via-blue-600/10 to-purple-600/10',
    borderColor: 'border-cyan-500/50',
    icon: Crown,
    iconColor: 'text-cyan-400',
    glow: 'hover:border-cyan-400 hover:shadow-[0_15px_45px_rgba(6,182,212,0.3)]',
    badge: 'Highly Recommended',
    featured: true,
  },
  premium: {
    color: 'from-purple-500/15 via-indigo-600/10 to-transparent',
    borderColor: 'border-purple-500/30',
    icon: Sparkles,
    iconColor: 'text-purple-400',
    glow: 'hover:border-purple-400/60 hover:shadow-[0_10px_35px_rgba(168,85,247,0.25)]',
    badge: 'Best Value',
  },
};

const getPlanStyle = (name: string, index: number) => {
  const lower = (name || '').toLowerCase();
  if (lower.includes('combo') || lower.includes('recommended') || lower.includes('pass')) return planStyles.standard;
  if (lower.includes('weekend')) return planStyles.basic;
  if (lower.includes('pulse') || lower.includes('starter')) return planStyles.starter;
  if (lower.includes('premium')) return planStyles.premium;
  const keys = ['starter', 'basic', 'standard', 'premium'];
  return planStyles[keys[index % keys.length]] || planStyles.starter;
};

const getCompatibilityLabel = (comp?: number) => {
  if (comp === 1) return "Mobile & Tablet Access";
  if (comp === 2) return "Mobile, Tablet & Laptop";
  if (comp === 3) return "Mobile, Tablet, Laptop & TV";
  return "All Screens (Mobile, TV, Browser)";
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
    <main className="min-h-screen bg-[#0a0a0c] text-white selection:bg-cyan-500/30 overflow-x-hidden">
      
      {/* SECTION 1: HERO */}
      <section className="relative pt-20 pb-10 sm:pt-28 sm:pb-14 md:pt-36 md:pb-20 px-4 sm:px-6 text-center overflow-hidden">
        {/* Cinematic Image Background */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/pricing_hero.png" 
            alt="Cinematic background" 
            fill 
            className="object-cover opacity-30 brightness-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/60 to-[#0a0a0c]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c] via-transparent to-[#0a0a0c]" />
        </div>

        {/* Cinematic background elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[900px] h-[250px] sm:h-[450px] bg-[#3299ff]/15 blur-[140px] rounded-full pointer-events-none opacity-50" />
        <div className="absolute top-32 left-1/4 w-[200px] sm:w-[350px] h-[200px] sm:h-[350px] bg-[#9248ff]/10 blur-[120px] rounded-full pointer-events-none opacity-40" />
        
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-cyan-500/20 rounded-full px-4 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-cyan-400 mb-4 sm:mb-6 backdrop-blur-md">
            <Star size={13} fill="currentColor" className="animate-pulse text-cyan-400" />
            Vtagu Premium Experience
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3 sm:mb-4 leading-tight">
            Pick the Plan That 
            <span className="block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 sm:pl-2">
              Powers Your Entertainment
            </span>
          </h1>
          
          <p className="text-white/60 text-xs sm:text-sm md:text-base max-w-xl mx-auto leading-relaxed font-medium">
            Experience cinema-grade streaming with flexible plans tailored for every screen. No commitments, cancel anytime.
          </p>
        </div>
      </section>

      {/* SECTION 2: PRICING CARDS */}
      <section className="px-4 sm:px-6 pb-20 md:pb-28 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch justify-center">
          {plans.map((plan, index) => {
            const style = getPlanStyle(plan.name, index);
            const Icon = style.icon;
            const isActivePlan = activeSubscription && activeSubscription.planId === plan.planId && activeSubscription.status === 1;
            const isInteractiveOnly = (plan.quality?.toLowerCase() === 'none' || !plan.quality || plan.isStandardIncluded === 0) && (plan.isInteractiveIncluded === 1 || plan.is_interactive_included === 1);
            const isFeatured = style.featured || isInteractiveOnly || plan.discount > 0;

            return (
              <div 
                key={plan.planId}
                className={`
                  relative flex flex-col items-center text-center rounded-3xl border bg-gradient-to-b p-6 sm:p-7 md:p-8
                  transition-all duration-300 hover:-translate-y-2 group backdrop-blur-sm
                  ${isActivePlan ? 'from-emerald-500/15 via-emerald-500/5 to-transparent border-emerald-500/50 shadow-[0_0_35px_rgba(16,185,129,0.2)]' : style.color} 
                  ${isActivePlan ? 'border-emerald-500/50' : style.borderColor} 
                  ${isActivePlan ? '' : style.glow}
                  ${isFeatured && !isActivePlan ? 'ring-1 ring-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.15)]' : ''}
                `}
              >
                {/* Top Badge */}
                {(style.badge || isActivePlan || isInteractiveOnly) && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                    <div className={`px-4 py-1 rounded-full text-[9px] sm:text-[10px] font-extrabold uppercase tracking-[0.2em] text-white whitespace-nowrap shadow-xl flex items-center gap-1.5 ${
                      isActivePlan
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-500/30'
                        : (isInteractiveOnly
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 shadow-purple-500/30'
                            : (style.featured 
                                ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 shadow-cyan-500/30 ring-2 ring-cyan-400/40 animate-pulse' 
                                : 'bg-white/10 backdrop-blur-md border border-white/20'
                              )
                          )
                    }`}>
                      {isActivePlan ? (
                        <>
                          <Check size={11} className="text-white" /> Active Subscription
                        </>
                      ) : (isInteractiveOnly ? (
                        <>
                          <Sparkles size={11} className="text-purple-200" /> Interactive Only
                        </>
                      ) : (
                        <>
                          <Star size={11} className="text-amber-300 fill-amber-300" /> {style.badge}
                        </>
                      ))}
                    </div>
                  </div>
                )}

                {/* Header Icon & Title */}
                <div className="flex flex-col items-center mb-5 w-full">
                  <div className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 ${isActivePlan ? 'text-emerald-400 bg-emerald-500/10' : style.iconColor}`}>
                    <Icon size={22} />
                  </div>
                  
                  <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-wide uppercase mb-1 group-hover:text-cyan-300 transition-colors">
                    {plan.name}
                  </h2>
                  
                  <div className="text-[9px] sm:text-[10px] font-extrabold text-cyan-400/80 uppercase tracking-[0.2em] bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full">
                    {plan.validity} ACCESS
                  </div>
                  
                  {isInteractiveOnly && (
                    <div className="mt-3 bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[11px] font-medium p-2.5 rounded-xl leading-relaxed text-center w-full">
                      Interactive Movies access only. Standard video library not included.
                    </div>
                  )}
                </div>

                {/* Price Display */}
                <div className="flex flex-col items-center justify-center mb-6 w-full py-2 border-y border-white/5">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-white/40 text-sm font-semibold">₹</span>
                    <span className="text-3xl sm:text-4xl font-black text-white tracking-tight group-hover:scale-105 transition-transform duration-300">
                      {plan.price}
                    </span>
                    <span className="text-white/40 text-xs font-semibold uppercase tracking-wider ml-0.5">
                      / {plan.validity?.toLowerCase().includes('year') ? 'yr' : 'mo'}
                    </span>
                  </div>
                  
                  {plan.discount > 0 && (
                    <div className="text-cyan-400 text-[10px] font-bold uppercase tracking-widest bg-cyan-400/10 border border-cyan-400/20 px-2.5 py-0.5 rounded-full mt-2">
                      Save {plan.discount}% Off
                    </div>
                  )}
                  
                  {isActivePlan && activeSubscription.timestamp_to && (
                    <div className="mt-2 text-emerald-400/80 text-[10px] font-semibold tracking-wider">
                      Renews: {new Date(activeSubscription.timestamp_to * 1000).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {/* Features List (Center Aligned Item Content) */}
                <ul className="w-full space-y-3 mb-7 flex-1 text-left">
                   {/* Stream Quality */}
                   {!isInteractiveOnly ? (
                     <li className="flex items-center gap-2.5 text-xs font-medium text-white/80 group-hover:text-white transition-colors">
                        <div className="w-4 h-4 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0">
                           <Check size={10} className="text-cyan-400" />
                        </div>
                        <span><strong className="text-white font-bold">{plan.quality}</strong> Stream Quality</span>
                     </li>
                   ) : (
                     <li className="flex items-center gap-2.5 text-xs font-medium text-white/30">
                        <div className="w-4 h-4 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                           <X size={10} className="text-red-400" />
                        </div>
                        <span>No Standard Video Streams</span>
                     </li>
                   )}

                   {/* Active Screens */}
                   {!isInteractiveOnly ? (
                     <li className="flex items-center gap-2.5 text-xs font-medium text-white/80 group-hover:text-white transition-colors">
                        <div className="w-4 h-4 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0">
                           <Check size={10} className="text-cyan-400" />
                        </div>
                        <span><strong className="text-white font-bold">{plan.screens}</strong> Active Screen{Number(plan.screens) > 1 ? 's' : ''}</span>
                     </li>
                   ) : (
                     <li className="flex items-center gap-2.5 text-xs font-medium text-white/30">
                        <div className="w-4 h-4 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                           <X size={10} className="text-red-400" />
                        </div>
                        <span>No Concurrent Standard Screens</span>
                     </li>
                   )}

                   {/* Interactive Movies Access */}
                   {(plan.isInteractiveIncluded === 1 || plan.is_interactive_included === 1) ? (
                     <li className="flex items-center gap-2.5 text-xs font-medium text-white/80 group-hover:text-white transition-colors">
                        <div className="w-4 h-4 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0">
                           <Check size={10} className="text-cyan-400" />
                        </div>
                        <span>{isInteractiveOnly ? "Premium Interactive Movies Only" : "Includes Interactive Movies"}</span>
                     </li>
                   ) : (
                     <li className="flex items-center gap-2.5 text-xs font-medium text-white/30">
                        <div className="w-4 h-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                           <span className="w-1.5 h-px bg-white/40" />
                        </div>
                        <span>No Interactive Movies</span>
                     </li>
                   )}

                   {/* Device Compatibility */}
                   <li className="flex items-center gap-2.5 text-xs font-medium text-white/80 group-hover:text-white transition-colors">
                      <div className="w-4 h-4 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0">
                         <Check size={10} className="text-cyan-400" />
                      </div>
                      <span>{getCompatibilityLabel(plan.compatibility)}</span>
                   </li>

                   {/* Unlimited Library */}
                   <li className="flex items-center gap-2.5 text-xs font-medium text-white/80 group-hover:text-white transition-colors">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${plan.unlimited === 1 ? 'bg-cyan-500/15 border border-cyan-500/30' : 'bg-white/5 border border-white/10 opacity-40'}`}>
                        {plan.unlimited === 1 ? <Check size={10} className="text-cyan-400" /> : <span className="w-1.5 h-px bg-white/40" />}
                      </div>
                      <span className={plan.unlimited === 1 ? '' : 'text-white/30'}>Unlimited Library</span>
                   </li>

                   {/* Cancel Anytime */}
                   <li className="flex items-center gap-2.5 text-xs font-medium text-white/80 group-hover:text-white transition-colors">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${plan.cancellation === 1 ? 'bg-cyan-500/15 border border-cyan-500/30' : 'bg-white/5 border border-white/10 opacity-40'}`}>
                        {plan.cancellation === 1 ? <Check size={10} className="text-cyan-400" /> : <span className="w-1.5 h-px bg-white/40" />}
                      </div>
                      <span className={plan.cancellation === 1 ? '' : 'text-white/30'}>Cancel Anytime</span>
                   </li>
                </ul>

                {/* CTA Action Button */}
                <Link
                  href={isActivePlan ? "/account" : (isLoggedIn ? `/checkout?plan=${plan.planId}` : `/register?plan=${plan.planId}`)}
                  className={`
                    w-full py-3 rounded-2xl text-xs font-bold uppercase tracking-wider text-center transition-all duration-300 flex items-center justify-center gap-2 group/btn relative overflow-hidden
                    ${isActivePlan 
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25' 
                      : (style.featured 
                        ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.02]' 
                        : 'bg-white/10 hover:bg-white/20 border border-white/10 text-white hover:border-white/30 hover:scale-[1.02]'
                      )
                    }
                  `}
                >
                  <span className="relative z-10">{isActivePlan ? "Current Plan" : `Get ${plan.name}`}</span>
                  <ChevronRight size={14} className="relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Minimal Footer Note */}
        <div className="mt-14 sm:mt-18 text-center">
          <p className="text-white/40 text-[10px] font-extrabold uppercase tracking-[0.3em] mb-4">
            Encrypted & Secure Payment Gateway
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 opacity-40 grayscale hover:grayscale-0 transition-all duration-300">
             <span className="text-[11px] font-bold uppercase tracking-widest hover:text-cyan-400">VISA</span>
             <span className="text-[11px] font-bold uppercase tracking-widest hover:text-cyan-400">MASTERCARD</span>
             <span className="text-[11px] font-bold uppercase tracking-widest hover:text-cyan-400">UPI</span>
             <span className="text-[11px] font-bold uppercase tracking-widest hover:text-cyan-400">RAZORPAY</span>
          </div>
        </div>
      </section>
    </main>
  );
}
