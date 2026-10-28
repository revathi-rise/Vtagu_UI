import React, { useState, useEffect } from 'react';
import { Star, Wifi, CheckCircle2, Loader2, Sparkles, ArrowRight, ShieldCheck, Laptop, Film, Clapperboard, Clock, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth.api';
import { getPlans, Plan } from '@/lib/vtagu.api';

export default function BillingTab({ billing }: { billing: any }) {
  const router = useRouter();
  const [currentBilling, setCurrentBilling] = useState<any>(billing || {});
  const [isChangingPlan, setIsChangingPlan] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);

  const resolveBillingData = (user: any) => {
    const activeSub = user.active_subscription;
    const nowSec = Math.floor(Date.now() / 1000);
    const expiryTimestamp = activeSub?.timestamp_to;

    // Strict expiry check: If API marks is_expired, or if timestamp_to is in the past
    const isExpired = activeSub?.is_expired !== undefined
      ? Boolean(activeSub.is_expired)
      : (expiryTimestamp ? Number(expiryTimestamp) < nowSec : false);

    const isSubscribed = Boolean(user.is_subscribed && !isExpired);

    const planName = activeSub?.planName || (user.plan === '4' ? 'Premium' : user.plan) || (isSubscribed ? "Active Subscription" : (isExpired ? (activeSub?.planName || "Expired Plan") : "No Active Plan"));
    const nextBilling = expiryTimestamp ? new Date(expiryTimestamp * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : "N/A";
    const amount = user.plan_price ? `INR ${user.plan_price}` : (activeSub?.paid_amount ? `INR ${activeSub.paid_amount}` : (activeSub?.price ? `INR ${activeSub.price}` : "Free"));

    const screens = activeSub?.screens || 1;
    const quality = activeSub?.quality || 'HD';
    const isInteractiveIncluded = activeSub?.isInteractiveIncluded !== undefined ? Number(activeSub.isInteractiveIncluded) : 0;
    const isStandardIncluded = activeSub?.isStandardIncluded !== undefined ? Number(activeSub.isStandardIncluded) : (activeSub?.isShortsIncluded !== undefined ? Number(activeSub.isShortsIncluded) : 0);
    const validity = activeSub?.validity || '';

    const cardNum = user.card_number || "";
    const last4Str = cardNum ? (cardNum.length >= 4 ? cardNum.slice(-4) : cardNum) : "****";

    return {
      planName,
      planDescription: isExpired
        ? "Your subscription has expired. Renew your plan to continue watching."
        : ((user.plan === '4' ? 'Premium Plan' : user.planName) || (isSubscribed ? "Active Subscription Plan" : "Manage your subscription plan")),
      nextBillingDate: nextBilling,
      amount,
      screens,
      quality,
      isInteractiveIncluded,
      isStandardIncluded,
      validity,
      is_subscribed: isSubscribed,
      is_expired: isExpired,
      paymentMethod: {
        type: activeSub?.payment_method || (user.upi ? "UPI" : "Online Payment"),
        last4: last4Str,
        nameOnCard: user.card_name || user.user_name || "N/A",
        expiry: user.card_expiry || "N/A",
      }
    };
  };

  useEffect(() => {
    const fetchLatestBilling = async () => {
      const storedUser = localStorage.getItem('user');
      const storedUserId = localStorage.getItem('userId');

      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          const resolved = resolveBillingData(user);
          setCurrentBilling(resolved);

          if (resolved.is_expired && user.is_subscribed) {
            user.is_subscribed = false;
            user.is_expired = true;
            localStorage.setItem('user', JSON.stringify(user));
          }
        } catch (e) {
          console.error("Error parsing stored user in BillingTab:", e);
        }
      }

      if (storedUserId) {
        try {
          const res = await authApi.getProfile(storedUserId);
          if (res.status && res.data) {
            const user = res.data;
            const resolved = resolveBillingData(user);
            setCurrentBilling(resolved);

            if (resolved.is_expired) {
              user.is_subscribed = false;
              user.is_expired = true;
            }
            localStorage.setItem('user', JSON.stringify(user));
          }
        } catch (e) {
          console.error("Error fetching fresh profile in BillingTab:", e);
        }
      }
    };

    fetchLatestBilling();
  }, [billing]);

  useEffect(() => {
    if (isChangingPlan) {
      const fetchAvailablePlans = async () => {
        setLoadingPlans(true);
        try {
          const res = await getPlans();
          setPlans(res || []);
        } catch (err) {
          console.error("Error fetching plans in BillingTab:", err);
        } finally {
          setLoadingPlans(false);
        }
      };
      fetchAvailablePlans();
    }
  }, [isChangingPlan]);

  // View 1: Inline Plan Selection View
  if (isChangingPlan) {
    return (
      <section className="bg-[#1a1329]/90 backdrop-blur-xl border border-[#9248FF]/30 rounded-2xl p-6 lg:p-8 shadow-2xl animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-[#b28cff] text-xs font-black uppercase tracking-widest mb-1">
              <Sparkles size={14} /> Subscription Options
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide">
              Choose a New Plan
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.push('/pricing')} 
              className="text-[#b28cff] hover:text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl border border-[#9248FF]/30 bg-[#9248FF]/10 transition-colors"
            >
              Full Comparison Page
            </button>
            <button 
              onClick={() => setIsChangingPlan(false)} 
              className="text-gray-400 hover:text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl bg-white/5 transition-colors"
            >
              Back to Billing
            </button>
          </div>
        </div>

        {loadingPlans ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-3">
            <Loader2 size={32} className="animate-spin text-[#9248FF]" />
            <p className="text-sm font-medium">Loading available subscription plans...</p>
          </div>
        ) : plans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const isCurrent = currentBilling.planName.toLowerCase().includes(plan.name.toLowerCase());
              return (
                <div 
                  key={plan.planId} 
                  className={`border rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 relative ${
                    isCurrent 
                      ? 'border-[#9248FF] bg-[#9248FF]/10 shadow-[0_0_30px_rgba(146,72,255,0.2)]' 
                      : 'border-white/10 hover:border-[#9248FF]/60 hover:-translate-y-1 bg-white/5'
                  }`}
                >
                  {isCurrent && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#9248FF] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                      <ShieldCheck size={12} /> Active Plan
                    </span>
                  )}

                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">{plan.name}</h4>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-3xl font-black text-white">₹{plan.price}</span>
                      <span className="text-xs text-gray-400 font-medium">/ {plan.validity}</span>
                    </div>

                    <ul className="text-xs text-gray-300 space-y-3 mb-6 border-t border-white/10 pt-4">
                      <li className="flex items-center gap-2">
                        {Number(plan.isInteractiveIncluded || plan.is_interactive_included) === 1
                          ? <CheckCircle2 size={14} className="text-emerald-400" />
                          : <XCircle size={14} className="text-red-400/60" />}
                        <span>Interactive Content: <strong className={Number(plan.isInteractiveIncluded || plan.is_interactive_included) === 1 ? 'text-emerald-400' : 'text-red-400'}>{Number(plan.isInteractiveIncluded || plan.is_interactive_included) === 1 ? 'Included' : 'Not Included'}</strong></span>
                      </li>
                      <li className="flex items-center gap-2">
                        {Number(plan.isStandardIncluded || plan.is_standard_included || plan.unlimited) === 1
                          ? <CheckCircle2 size={14} className="text-emerald-400" />
                          : <XCircle size={14} className="text-red-400/60" />}
                        <span>Standard Content: <strong className={Number(plan.isStandardIncluded || plan.is_standard_included || plan.unlimited) === 1 ? 'text-emerald-400' : 'text-red-400'}>{Number(plan.isStandardIncluded || plan.is_standard_included || plan.unlimited) === 1 ? 'Included' : 'Not Included'}</strong></span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-[#9248FF]" />
                        <span>Screens: <strong className="text-white">{plan.screens || '1'}</strong></span>
                      </li>
                      {plan.quality && plan.quality.toLowerCase() !== 'none' && (
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-[#9248FF]" />
                          <span>Quality: <strong className="text-white">{plan.quality}</strong></span>
                        </li>
                      )}
                    </ul>
                  </div>

                  <button 
                    onClick={() => router.push(`/checkout?plan=${plan.planId}`)}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                      isCurrent 
                        ? 'bg-[#25183d] text-[#b28cff] hover:bg-[#352554]' 
                        : 'bg-[#9248FF] hover:bg-[#a663ff] text-white shadow-lg shadow-[#9248FF]/20'
                    }`}
                  >
                    {isCurrent ? 'Renew Current Plan' : 'Select & Checkout'}
                    <ArrowRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400 space-y-4">
            <p className="text-sm">No plans available at the moment.</p>
            <button 
              onClick={() => router.push('/pricing')}
              className="px-6 py-2.5 bg-[#9248FF] text-white font-bold text-sm rounded-xl"
            >
              Go to Pricing Page
            </button>
          </div>
        )}
      </section>
    );
  }

  // View 2: Default Billing Overview View
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 min-w-0">
      {/* Plan Box */}
      <section className="bg-[#1a1329]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 lg:p-8 flex flex-col justify-between shadow-xl">
        <div>
          <div className="flex items-start justify-between mb-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
              currentBilling.is_expired
                ? 'bg-red-500 shadow-red-500/30'
                : (currentBilling.is_subscribed ? 'bg-[#9248FF] shadow-[0_0_20px_rgba(146,72,255,0.5)]' : 'bg-gray-700 shadow-gray-700/30')
            }`}>
              <Star size={20} className="text-white fill-white" />
            </div>
            {currentBilling.is_subscribed && !currentBilling.is_expired ? (
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border bg-[#b28cff]/20 text-[#cca8ff] border-[#9248FF]/30">
                Active Subscription
              </span>
            ) : currentBilling.is_expired ? (
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border bg-red-500/20 text-red-400 border-red-500/30 flex items-center gap-1.5">
                <XCircle size={11} className="text-red-400" /> Subscription Expired
              </span>
            ) : (
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border bg-gray-500/20 text-gray-400 border-gray-500/30">
                No Active Plan
              </span>
            )}
          </div>

          <h3 className="text-2xl font-bold text-white mb-1">{currentBilling.planName}</h3>
          <p className="text-gray-400 text-sm mb-4 font-medium">{currentBilling.planDescription}</p>

          {/* Expiration Notice Banner */}
          {currentBilling.is_expired && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3.5 mb-5 flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Clock size={12} className="text-red-400" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-red-400 mb-0.5">Your Plan Expired on {currentBilling.nextBillingDate}</div>
                <div className="text-red-200/80 leading-relaxed">
                  Renew your subscription now to restore full access to premium Movies, Web Series, and interactive content.
                </div>
              </div>
            </div>
          )}

          {/* Full Plan Details Breakdown */}
          <div className="bg-[#25183d]/60 border border-[#9248FF]/20 rounded-xl p-4 mb-6 space-y-3">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-gray-300 flex items-center gap-2 font-medium">
                <Clapperboard size={16} className="text-[#b28cff]" /> Interactive Content
              </span>
              <span className={`font-extrabold ${Number(currentBilling.isInteractiveIncluded) === 1 ? 'text-emerald-400' : 'text-red-400'}`}>
                {Number(currentBilling.isInteractiveIncluded) === 1 ? '✓ Included' : '✗ Not Included'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-gray-300 flex items-center gap-2 font-medium">
                <Film size={16} className="text-[#b28cff]" /> Standard Content (Movies / Series)
              </span>
              <span className={`font-extrabold ${Number(currentBilling.isStandardIncluded) === 1 ? 'text-emerald-400' : 'text-red-400'}`}>
                {Number(currentBilling.isStandardIncluded) === 1 ? '✓ Included' : '✗ Not Included'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-gray-300 flex items-center gap-2 font-medium">
                <Laptop size={16} className="text-[#b28cff]" /> Screens
              </span>
              <span className="text-white font-extrabold">{currentBilling.screens} Device{Number(currentBilling.screens) > 1 ? 's' : ''}</span>
            </div>
            {currentBilling.quality && currentBilling.quality !== 'none' && (
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-gray-300 flex items-center gap-2 font-medium">
                  <CheckCircle2 size={16} className="text-[#b28cff]" /> Video Quality
                </span>
                <span className="text-white font-extrabold">{currentBilling.quality}</span>
              </div>
            )}
            {currentBilling.validity && (
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-gray-300 flex items-center gap-2 font-medium">
                  <Clock size={16} className="text-[#b28cff]" /> Validity
                </span>
                <span className="text-white font-extrabold">{currentBilling.validity}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-sm mb-3">
            <span className="text-gray-400 font-medium">
              {currentBilling.is_expired ? 'Expiration Date' : 'Next Billing / Expiration'}
            </span>
            <span className={`font-bold flex items-center gap-2 ${currentBilling.is_expired ? 'text-red-400' : 'text-white'}`}>
              {currentBilling.nextBillingDate}
              {currentBilling.is_expired && (
                <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                  Expired
                </span>
              )}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mb-8">
            <span className="text-gray-400 font-medium">Amount</span>
            <span className="text-white font-bold">{currentBilling.amount}</span>
          </div>
        </div>

        <button 
          onClick={() => setIsChangingPlan(true)} 
          className={`w-full py-3.5 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
            currentBilling.is_expired
              ? 'bg-gradient-to-r from-red-600 via-[#9248FF] to-[#b28cff] hover:from-red-500 hover:to-[#a663ff] text-white shadow-red-500/25 ring-1 ring-red-400/40'
              : 'bg-[#9248FF] hover:bg-[#a663ff] text-white shadow-[#9248FF]/20'
          }`}
        >
          {currentBilling.is_expired ? 'Renew Expired Plan' : (currentBilling.is_subscribed ? 'Change / Renew Plan' : 'Subscribe to a Plan')}
          <ArrowRight size={16} />
        </button>
      </section>

      {/* Payment Box */}
      <section className="bg-[#1a1329]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 lg:p-8 flex flex-col shadow-xl justify-between">
        <div>
          <h3 className="text-lg font-bold text-white mb-6 tracking-wide">Payment Method</h3>

          {/* Credit / Debit / UPI Card */}
          <div className="relative bg-gradient-to-br from-[#1a1a24] to-[#0f0a14] rounded-2xl p-6 border border-white/10 shadow-2xl overflow-hidden mb-8">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent skew-x-12 translate-x-10" />
            
            <div className="flex justify-between items-center mb-8 relative z-10">
              <Wifi size={24} className="text-gray-400 rotate-90" />
              <span className="text-white font-black italic text-xl tracking-tighter drop-shadow-md">{currentBilling.paymentMethod.type}</span>
            </div>

            <div className="flex items-center text-xl tracking-[0.2em] font-mono text-gray-200 mb-4 relative z-10 overflow-hidden text-clip whitespace-nowrap">
              <span className="mr-3">••••</span>
              <span className="mr-3">••••</span>
              <span className="mr-3">••••</span>
              <span>{currentBilling.paymentMethod.last4}</span>
            </div>

            <div className="flex justify-between items-center text-[10px] uppercase font-semibold text-gray-500 tracking-widest relative z-10 w-full overflow-hidden">
              <span className="truncate mr-4">{currentBilling.paymentMethod.nameOnCard}</span>
              <span className="shrink-0">Exp {currentBilling.paymentMethod.expiry}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => setIsChangingPlan(true)}
            className="flex-1 py-3.5 rounded-xl bg-[#25183d] hover:bg-[#352554] text-white font-bold transition-colors border border-white/5 shadow-inner text-sm"
          >
            Change Plan
          </button>
          <button 
            onClick={() => router.push('/pricing')}
            className="flex-1 py-3.5 rounded-xl bg-[#25183d] hover:bg-[#352554] text-white font-bold transition-colors border border-white/5 shadow-inner text-sm"
          >
            All Options
          </button>
        </div>
      </section>
    </div>
  );
}
