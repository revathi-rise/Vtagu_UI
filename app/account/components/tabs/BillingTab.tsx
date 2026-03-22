"use client";
import React, { useState } from 'react';
import { Star, Wifi, CheckCircle2 } from 'lucide-react';

export default function BillingTab({ billing }: { billing: any }) {
  const [isChangingPlan, setIsChangingPlan] = useState(false);

  if (isChangingPlan) {
    return (
      <section className="bg-[#1a1329]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 lg:p-8 shadow-xl">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold text-white tracking-wide">Select a Plan</h3>
          <button onClick={() => setIsChangingPlan(false)} className="text-gray-400 hover:text-white text-sm font-semibold transition-colors">
            Cancel
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Plan 1 */}
          <div className="border border-white/10 rounded-xl p-6 hover:border-[#9248FF] transition-all cursor-pointer group hover:-translate-y-1 bg-white/5">
            <h4 className="text-lg font-bold text-white mb-2">Basic 1080p</h4>
            <p className="text-2xl font-black text-white mb-4">$9.99<span className="text-sm text-gray-400 font-medium">/mo</span></p>
            <ul className="text-sm text-gray-300 space-y-3 mb-8">
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-gray-500 group-hover:text-[#9248FF] transition-colors"/> 1080p Resolution</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-gray-500 group-hover:text-[#9248FF] transition-colors"/> Watch on 1 device</li>
            </ul>
            <button className="w-full py-2.5 rounded-lg bg-white/5 group-hover:bg-[#9248FF] text-white font-bold transition-colors">Select Basic</button>
          </div>
          {/* Plan 2 */}
          <div className="border border-white/10 rounded-xl p-6 hover:border-[#9248FF] transition-all cursor-pointer group hover:-translate-y-1 bg-white/5">
            <h4 className="text-lg font-bold text-white mb-2">Standard 4K</h4>
            <p className="text-2xl font-black text-white mb-4">$14.99<span className="text-sm text-gray-400 font-medium">/mo</span></p>
            <ul className="text-sm text-gray-300 space-y-3 mb-8">
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-gray-500 group-hover:text-[#9248FF] transition-colors"/> 4K Resolution</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-gray-500 group-hover:text-[#9248FF] transition-colors"/> Watch on 2 devices</li>
            </ul>
            <button className="w-full py-2.5 rounded-lg bg-white/5 group-hover:bg-[#9248FF] text-white font-bold transition-colors">Select Standard</button>
          </div>
          {/* Plan 3 */}
          <div className="border border-[#9248FF] rounded-xl p-6 relative bg-[#9248FF]/5 shadow-[0_0_30px_rgba(146,72,255,0.1)]">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#9248FF] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">Current Plan</span>
            <h4 className="text-lg font-bold text-white mb-2 text-center mt-2">Ultra 4K + HDR</h4>
            <p className="text-2xl font-black text-white mb-4 text-center">$18.99<span className="text-sm font-medium text-gray-400">/mo</span></p>
            <ul className="text-sm text-gray-300 space-y-3 mt-4">
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#9248FF]"/> 4K + HDR & Dolby</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#9248FF]"/> Watch on 4 devices</li>
            </ul>
            <button disabled className="mt-8 w-full py-2.5 rounded-lg bg-[#25183d] text-gray-400 font-bold cursor-not-allowed">Active Feature</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 min-w-0">
      {/* Plan Box */}
      <section className="bg-[#1a1329]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 lg:p-8 flex flex-col justify-between shadow-xl">
        <div>
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-full bg-[#9248FF] flex items-center justify-center shadow-[0_0_20px_rgba(146,72,255,0.5)]">
              <Star size={20} className="text-white fill-white" />
            </div>
            <span className="bg-[#b28cff]/20 text-[#cca8ff] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-[#9248FF]/30">
              Active Plan
            </span>
          </div>

          <h3 className="text-2xl font-bold text-white mb-1">{billing.planName}</h3>
          <p className="text-gray-400 text-sm mb-8 font-medium">{billing.planDescription}</p>

          <div className="flex items-center justify-between text-sm mb-3">
            <span className="text-gray-400 font-medium">Next Billing</span>
            <span className="text-white font-bold">{billing.nextBillingDate}</span>
          </div>
          <div className="flex items-center justify-between text-sm mb-8">
            <span className="text-gray-400 font-medium">Amount</span>
            <span className="text-white font-bold">{billing.amount}</span>
          </div>
        </div>

        <button onClick={() => setIsChangingPlan(true)} className="w-full py-3.5 rounded-xl bg-[#25183d] hover:bg-[#352554] text-white font-bold transition-colors border border-white/5 shadow-inner">
          Change Plan
        </button>
      </section>

      {/* Payment Box */}
      <section className="bg-[#1a1329]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 lg:p-8 flex flex-col shadow-xl justify-between">
        <div>
          <h3 className="text-lg font-bold text-white mb-6 tracking-wide">Payment Method</h3>

          {/* Mock Credit Card */}
          <div className="relative bg-gradient-to-br from-[#1a1a24] to-[#0f0a14] rounded-2xl p-6 border border-white/10 shadow-2xl overflow-hidden mb-8">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent skew-x-12 translate-x-10" />
            
            <div className="flex justify-between items-center mb-8 relative z-10">
              <Wifi size={24} className="text-gray-400 rotate-90" />
              <span className="text-white font-black italic text-xl tracking-tighter drop-shadow-md">{billing.paymentMethod.type}</span>
            </div>

            <div className="flex items-center text-xl tracking-[0.2em] font-mono text-gray-200 mb-4 relative z-10 overflow-hidden text-clip whitespace-nowrap">
              <span className="mr-3">••••</span>
              <span className="mr-3">••••</span>
              <span className="mr-3">••••</span>
              <span>{billing.paymentMethod.last4}</span>
            </div>

            <div className="flex justify-between items-center text-[10px] uppercase font-semibold text-gray-500 tracking-widest relative z-10 w-full overflow-hidden">
              <span className="truncate mr-4">{billing.paymentMethod.nameOnCard}</span>
              <span className="shrink-0">Exp {billing.paymentMethod.expiry}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button className="flex-1 py-3.5 rounded-xl bg-[#25183d] hover:bg-[#352554] text-white font-bold transition-colors border border-white/5 shadow-inner text-sm">
            Update
          </button>
          <button className="flex-1 py-3.5 rounded-xl bg-[#25183d] hover:bg-[#352554] text-white font-bold transition-colors border border-white/5 shadow-inner text-sm">
            History
          </button>
        </div>
      </section>
    </div>
  );
}
