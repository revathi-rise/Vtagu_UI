'use client';

import React, { useState } from 'react';
import { Check, Zap, Crown, Sparkles, Star, Play, Shield, Tv, Download, Users } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    tagline: 'Start your journey',
    monthlyPrice: 99,
    yearlyPrice: 79,
    color: 'from-white/10 to-white/5',
    borderColor: 'border-white/10',
    glowColor: '',
    badgeText: null,
    icon: Play,
    iconColor: 'text-white/60',
    features: [
      { text: 'HD Streaming (1080p)', included: true },
      { text: '1 Screen at a time', included: true },
      { text: 'Movies & Episodes', included: true },
      { text: 'Mobile & Tablet', included: true },
      { text: '4K Ultra HD', included: false },
      { text: 'Interactive Movies', included: false },
      { text: 'Offline Downloads', included: false },
      { text: 'Multi-Screen (4 devices)', included: false },
      { text: 'Early Access Originals', included: false },
    ],
    cta: 'Get Started',
    ctaStyle: 'bg-white/10 hover:bg-white/15 border border-white/20 text-white',
  },
  {
    id: 'premium',
    name: 'Premium',
    tagline: 'Most Popular Choice',
    monthlyPrice: 199,
    yearlyPrice: 159,
    color: 'from-[#3299ff]/20 to-[#9248ff]/10',
    borderColor: 'border-[#3299ff]/40',
    glowColor: 'shadow-[0_0_60px_rgba(50,153,255,0.15)]',
    badgeText: 'MOST POPULAR',
    icon: Crown,
    iconColor: 'text-[#3299ff]',
    features: [
      { text: 'HD Streaming (1080p)', included: true },
      { text: '2 Screens at a time', included: true },
      { text: 'Movies & Episodes', included: true },
      { text: 'Mobile, Tablet & TV', included: true },
      { text: '4K Ultra HD', included: true },
      { text: 'Interactive Movies', included: true },
      { text: 'Offline Downloads', included: true },
      { text: 'Multi-Screen (4 devices)', included: false },
      { text: 'Early Access Originals', included: false },
    ],
    cta: 'Start Free Trial',
    ctaStyle: 'bg-gradient-to-r from-[#3299ff] to-[#9248ff] text-white hover:opacity-90 shadow-[0_10px_30px_rgba(50,153,255,0.3)]',
  },
  {
    id: 'ultimate',
    name: 'Ultimate',
    tagline: 'The full experience',
    monthlyPrice: 349,
    yearlyPrice: 279,
    color: 'from-[#9248ff]/20 to-[#9248ff]/5',
    borderColor: 'border-[#9248ff]/40',
    glowColor: 'shadow-[0_0_60px_rgba(146,72,255,0.15)]',
    badgeText: 'BEST VALUE',
    icon: Sparkles,
    iconColor: 'text-[#9248ff]',
    features: [
      { text: 'HD Streaming (1080p)', included: true },
      { text: '4 Screens at a time', included: true },
      { text: 'Movies & Episodes', included: true },
      { text: 'All Devices + Smart TV', included: true },
      { text: '4K Ultra HD + Dolby Vision', included: true },
      { text: 'Interactive Movies', included: true },
      { text: 'Unlimited Downloads', included: true },
      { text: 'Multi-Screen (4 devices)', included: true },
      { text: 'Early Access Originals', included: true },
    ],
    cta: 'Go Ultimate',
    ctaStyle: 'bg-gradient-to-r from-[#9248ff] to-[#3299ff] text-white hover:opacity-90 shadow-[0_10px_30px_rgba(146,72,255,0.3)]',
  },
];

const perks = [
  { icon: Tv, title: '4K on Every Screen', desc: 'Watch in Ultra HD on your TV, laptop, tablet, or phone.' },
  { icon: Download, title: 'Download & Go', desc: 'Save episodes and movies for offline viewing anywhere.' },
  { icon: Shield, title: 'Cancel Anytime', desc: 'No contracts, no lock-ins. Freedom is yours.' },
  { icon: Users, title: 'Family Profiles', desc: 'Create individual profiles for everyone in your household.' },
];

const faqs = [
  { q: 'Can I switch plans?', a: 'Yes! Upgrade or downgrade at any time. Changes take effect on your next billing cycle.' },
  { q: 'Is there a free trial?', a: 'Premium and Ultimate plans come with a 7-day free trial. No charges until after the trial ends.' },
  { q: 'How many devices can I use?', a: 'Depends on your plan — Basic supports 1 screen, Premium supports 2, and Ultimate supports 4 simultaneously.' },
  { q: 'What payment methods are accepted?', a: 'We accept all major credit/debit cards, UPI, net banking, and popular digital wallets.' },
  { q: 'What is an Interactive Movie?', a: 'Interactive movies let you make real-time choices that shape the story — exclusively available on Premium and Ultimate plans.' },
];

export default function PricingClient() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative pt-36 pb-24 px-6 text-center overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#3299ff]/8 blur-[160px] rounded-full pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-[400px] h-[300px] bg-[#9248ff]/6 blur-[120px] rounded-full pointer-events-none" />

        {/* Label */}
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#3299ff] mb-8">
          <Zap size={12} fill="currentColor" />
          Flexible Plans
        </div>

        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 leading-[0.95]">
          One Subscription,{' '}
          <span className="text-gradient">Infinite Entertainment</span>
        </h1>

        <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12 font-medium">
          Choose the plan that fits your world. No hidden fees, no compromises — just premium entertainment at its finest.
        </p>

        {/* Billing toggle */}
        <div className="inline-flex items-center gap-1 bg-white/5 border border-white/10 rounded-2xl p-1.5">
          <button
            onClick={() => setBilling('monthly')}
            className={`px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all duration-300 ${
              billing === 'monthly'
                ? 'bg-white text-black shadow-lg'
                : 'text-white/50 hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling('yearly')}
            className={`px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${
              billing === 'yearly'
                ? 'bg-white text-black shadow-lg'
                : 'text-white/50 hover:text-white'
            }`}
          >
            Yearly
            <span className="text-[10px] bg-gradient-to-r from-[#3299ff] to-[#9248ff] text-white px-2 py-0.5 rounded-full font-black">
              SAVE 20%
            </span>
          </button>
        </div>
      </section>

      {/* ── Pricing Cards ── */}
      <section className="px-6 pb-28 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const price = billing === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;

            return (
              <div
                key={plan.id}
                className={`
                  relative flex flex-col rounded-[2rem] border bg-gradient-to-b p-8
                  transition-all duration-500
                  ${plan.color} ${plan.borderColor} ${plan.glowColor}
                  ${plan.id === 'premium' ? 'ring-1 ring-[#3299ff]/30 scale-[1.02] z-10' : ''}
                `}
              >
                {/* Badge */}
                {plan.badgeText && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white ${
                      plan.id === 'premium'
                        ? 'bg-gradient-to-r from-[#3299ff] to-[#9248ff] shadow-[0_0_20px_rgba(50,153,255,0.5)]'
                        : 'bg-gradient-to-r from-[#9248ff] to-[#3299ff] shadow-[0_0_20px_rgba(146,72,255,0.5)]'
                    }`}>
                      {plan.badgeText}
                    </div>
                  </div>
                )}

                {/* Plan header */}
                <div className="mb-8">
                  <div className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 ${plan.iconColor}`}>
                    <Icon size={24} />
                  </div>
                  <div className={`text-[11px] font-black uppercase tracking-[0.2em] mb-1 ${plan.iconColor}`}>
                    {plan.tagline}
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight">{plan.name}</h2>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-end gap-1">
                    <span className="text-white/40 text-lg font-bold">₹</span>
                    <span className="text-5xl font-black text-white tracking-tighter">{price}</span>
                    <span className="text-white/40 text-sm font-bold mb-2">/mo</span>
                  </div>
                  {billing === 'yearly' && (
                    <p className="text-[11px] text-white/30 mt-1 font-bold">
                      Billed ₹{price * 12}/year · Save ₹{(plan.monthlyPrice - price) * 12}
                    </p>
                  )}
                </div>

                {/* CTA */}
                <Link
                  href="/register"
                  className={`w-full py-4 rounded-[1.2rem] text-sm font-black uppercase tracking-widest text-center transition-all duration-300 active:scale-95 mb-8 block ${plan.ctaStyle}`}
                >
                  {plan.cta}
                </Link>

                {/* Divider */}
                <div className="w-full h-px bg-white/8 mb-8" />

                {/* Features */}
                <ul className="space-y-4 flex-1">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                        feat.included
                          ? plan.id === 'ultimate'
                            ? 'bg-[#9248ff]/20 border border-[#9248ff]/40'
                            : plan.id === 'premium'
                            ? 'bg-[#3299ff]/20 border border-[#3299ff]/40'
                            : 'bg-white/10 border border-white/20'
                          : 'bg-white/5 border border-white/10'
                      }`}>
                        {feat.included ? (
                          <Check size={11} className={
                            plan.id === 'ultimate' ? 'text-[#9248ff]' :
                            plan.id === 'premium' ? 'text-[#3299ff]' : 'text-white/60'
                          } />
                        ) : (
                          <div className="w-1.5 h-px bg-white/20 rounded-full" />
                        )}
                      </div>
                      <span className={`text-sm font-medium ${feat.included ? 'text-white/80' : 'text-white/25 line-through'}`}>
                        {feat.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Trust note */}
        <p className="text-center text-white/25 text-xs font-bold uppercase tracking-widest mt-10">
          All plans include a 7-day free trial · Cancel anytime · No contracts
        </p>
      </section>

      {/* ── Why PrimeTime Perks ── */}
      <section className="py-24 px-6 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#3299ff]/3 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#9248ff] mb-4">
              <Star size={12} fill="currentColor" /> Every plan includes
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
              Built for <span className="text-gradient">Premium</span> Viewers
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {perks.map((perk, i) => {
              const Icon = perk.icon;
              return (
                <div
                  key={i}
                  className="group p-6 rounded-[1.5rem] bg-white/[0.03] border border-white/8 hover:border-[#3299ff]/30 hover:bg-[#3299ff]/5 transition-all duration-500"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#3299ff]/20 to-[#9248ff]/10 border border-white/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <Icon size={20} className="text-[#3299ff]" />
                  </div>
                  <h3 className="font-black text-white text-base mb-2 uppercase tracking-tight">{perk.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed font-medium">{perk.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Comparison Table ── */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
            Compare <span className="text-gradient">Plans</span>
          </h2>
          <p className="text-white/40 text-lg font-medium">Everything side by side, so you can choose with confidence.</p>
        </div>

        <div className="rounded-[2rem] border border-white/8 overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-4 bg-white/[0.03] border-b border-white/8">
            <div className="p-6 text-white/30 text-xs font-black uppercase tracking-widest">Feature</div>
            {plans.map((plan) => (
              <div key={plan.id} className={`p-6 text-center ${plan.id === 'premium' ? 'bg-[#3299ff]/8' : ''}`}>
                <p className={`text-xs font-black uppercase tracking-widest ${
                  plan.id === 'premium' ? 'text-[#3299ff]' :
                  plan.id === 'ultimate' ? 'text-[#9248ff]' : 'text-white/50'
                }`}>{plan.name}</p>
              </div>
            ))}
          </div>

          {[
            { label: 'Video Quality', values: ['HD 1080p', '4K HDR', '4K Dolby Vision'] },
            { label: 'Simultaneous Screens', values: ['1', '2', '4'] },
            { label: 'Offline Downloads', values: [false, '25 titles', 'Unlimited'] },
            { label: 'Interactive Movies', values: [false, true, true] },
            { label: 'Early Access Originals', values: [false, false, true] },
            { label: 'Family Profiles', values: ['2', '4', '6'] },
            { label: 'Live Events', values: [false, false, true] },
          ].map((row, i) => (
            <div key={i} className={`grid grid-cols-4 border-b border-white/5 ${i % 2 === 0 ? '' : 'bg-white/[0.015]'}`}>
              <div className="p-5 text-white/50 text-sm font-medium">{row.label}</div>
              {row.values.map((val, j) => (
                <div key={j} className={`p-5 text-center ${j === 1 ? 'bg-[#3299ff]/5' : ''}`}>
                  {typeof val === 'boolean' ? (
                    val ? (
                      <Check size={18} className="mx-auto text-[#3299ff]" />
                    ) : (
                      <div className="w-4 h-px bg-white/15 mx-auto rounded-full" />
                    )
                  ) : (
                    <span className="text-sm font-bold text-white/80">{val}</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 px-6 max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
            Got <span className="text-gradient">Questions?</span>
          </h2>
          <p className="text-white/40 text-lg font-medium">Everything you need to know about our plans.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`rounded-[1.5rem] border transition-all duration-300 overflow-hidden ${
                openFaq === i
                  ? 'border-[#3299ff]/30 bg-[#3299ff]/5'
                  : 'border-white/8 bg-white/[0.02] hover:border-white/15'
              }`}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-black text-white text-base pr-4">{faq.q}</span>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
                  openFaq === i
                    ? 'bg-[#3299ff]/20 border-[#3299ff]/40 rotate-45'
                    : 'border-white/15 bg-white/5'
                }`}>
                  <span className={`text-lg font-black leading-none ${openFaq === i ? 'text-[#3299ff]' : 'text-white/50'}`}>+</span>
                </div>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-6">
                  <p className="text-white/60 text-sm leading-relaxed font-medium">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA Banner ── */}
      <section className="py-24 px-6 max-w-5xl mx-auto mb-8">
        <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#3299ff]/15 via-[#9248ff]/10 to-transparent border border-[#3299ff]/20 p-16 text-center shadow-[0_0_80px_rgba(50,153,255,0.1)]">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 pointer-events-none" />
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[600px] h-32 bg-[#3299ff]/10 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#9248ff] mb-6">
              <Sparkles size={12} fill="currentColor" /> Limited Offer
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-tight">
              Start Watching<br />
              <span className="text-gradient">Free for 7 Days</span>
            </h2>
            <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto font-medium leading-relaxed">
              Join millions of viewers. Cancel before the trial ends and you won't be charged a single rupee.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/register"
                className="px-10 py-4 rounded-[1.5rem] bg-gradient-to-r from-[#3299ff] to-[#9248ff] text-white font-black text-sm uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-[0_15px_40px_rgba(50,153,255,0.3)]"
              >
                Try Free for 7 Days
              </Link>
              <Link
                href="/movies"
                className="px-10 py-4 rounded-[1.5rem] bg-white/5 border border-white/15 text-white font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                Browse Content
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
