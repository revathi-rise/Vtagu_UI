"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getPlans, Plan, getInteractiveMovies, purchaseMovie } from '@/lib/vtagu.api';
import { transactionsApi } from '@/lib/api/transactions.api';
import { subscriptionsApi } from '@/lib/api/subscriptions.api';
import { Loader2, ShieldCheck, Crown, ArrowRight, Play } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const loadScript = (src: string) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planIdParam = searchParams.get('plan');
  const checkoutType = searchParams.get('type') || 'plan'; // 'plan' or 'movie'
  const movieIdParam = searchParams.get('id');
  
  const [user, setUser] = useState<any>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [movie, setMovie] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          const redirectUrl = checkoutType === 'movie' 
            ? `/login?type=movie&id=${movieIdParam}` 
            : `/login${planIdParam ? `?plan=${planIdParam}` : ''}`;
          router.push(redirectUrl);
          return;
        }
        
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        if (checkoutType === 'movie') {
          if (!movieIdParam) {
            setError('No movie selected. Please select a movie first.');
            setIsLoading(false);
            return;
          }
          const allMovies = await getInteractiveMovies();
          const selectedMovie = allMovies.find(m => m.interactive_movie_id.toString() === movieIdParam);
          
          if (!selectedMovie) {
            setError('Selected movie not found.');
          } else {
            setMovie(selectedMovie);
          }
        } else {
          if (!planIdParam) {
            setError('No plan selected. Please select a plan first.');
            setIsLoading(false);
            return;
          }
          const allPlans = await getPlans();
          const selectedPlan = allPlans.find(p => p.planId.toString() === planIdParam);
          
          if (!selectedPlan) {
            setError('Selected plan not found.');
          } else {
            setPlan(selectedPlan);
          }
        }
      } catch (err) {
        setError('Failed to initialize checkout.');
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [planIdParam, checkoutType, movieIdParam, router]);

  const calculateValidityTimestamps = (validityStr: string) => {
    const now = Math.floor(Date.now() / 1000);
    let days = 30; // Default 1 month
    
    if (!validityStr) return { timestamp_from: now, timestamp_to: now + (30 * 86400) };

    const dateMatch = validityStr.match(/\d{4}-\d{2}-\d{2}/);
    if (dateMatch) {
      const targetTime = Math.floor(new Date(dateMatch[0] + 'T23:59:59').getTime() / 1000);
      if (!isNaN(targetTime) && targetTime > now) {
        return { timestamp_from: now, timestamp_to: targetTime };
      }
    }

    const lower = validityStr.toLowerCase();
    if (lower.includes('year')) {
      const match = lower.match(/(\d+)/);
      const years = match ? parseInt(match[1]) : 1;
      days = years * 365;
    } else if (lower.includes('month')) {
      const match = lower.match(/(\d+)/);
      const months = match ? parseInt(match[1]) : 1;
      days = months * 30;
    } else if (lower.includes('day')) {
      const match = lower.match(/(\d+)/);
      days = match ? parseInt(match[1]) : 1;
    } else if (lower.includes('week')) {
      const match = lower.match(/(\d+)/);
      const weeks = match ? parseInt(match[1]) : 1;
      days = weeks * 7;
    }
    
    const timestamp_to = now + (days * 86400);
    return { timestamp_from: now, timestamp_to };
  };

  const handlePayment = async () => {
    if (!user || (checkoutType === 'plan' && !plan) || (checkoutType === 'movie' && !movie)) return;
    
    setIsProcessing(true);
    setError('');

    try {
      const userId = user.userId || user.id;
      const amount = checkoutType === 'movie'
        ? parseFloat(movie.price.toString().replace(/,/g, ''))
        : parseFloat(plan!.price.replace(/,/g, ''));

      if (amount === 0) {
        if (checkoutType === 'movie') {
          const purchaseRes = await purchaseMovie(
            movie.interactive_movie_id,
            userId,
            'FREE',
            0,
            'INR'
          );
          if (purchaseRes.status === 'success' || (purchaseRes as any).status === true) {
            setSuccess(true);
          } else {
            setError('Failed to activate free movie access.');
          }
        } else {
          const { timestamp_from, timestamp_to } = calculateValidityTimestamps(plan!.validity);
          const subRes = await subscriptionsApi.create({
            planId: plan!.planId,
            userId: userId,
            payment_method: 'FREE',
            payment_details: 'Free Plan Activation',
            timestamp_from,
            timestamp_to,
          });
          if (subRes.status) {
            setSuccess(true);
          } else {
            setError('Failed to activate free subscription.');
          }
        }
        setIsProcessing(false);
        return;
      }

      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!res) {
        setError('Razorpay SDK failed to load. Are you offline?');
        setIsProcessing(false);
        return;
      }

      // Re-use pre-calculated userId and amount values
      
      console.log('[DEBUG] Initiating payment:', { userId, amount, type: checkoutType });
      
      const orderData = await transactionsApi.createOrder({ userId, amount });
      console.log('[DEBUG] Received order data:', orderData);
      
      if (!orderData.status || !orderData.data) {
        setError(orderData.message || 'Could not create order.');
        setIsProcessing(false);
        return;
      }

      const order = orderData.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_45mZ4X3bfF1Mt7', 
        amount: Math.round(order.amount), // Ensure it's an integer in paisa
        currency: order.currency,
        name: 'PrimeTime',
        description: checkoutType === 'movie' ? `Unlock Movie: ${movie.title}` : `${plan!.name} Subscription`,
        order_id: order.id,
        prefill: {
          name: (user.user_name || user.name || '').trim(),
          email: (user.email || '').trim(),
          contact: (user.mobile || '').replace(/\s+/g, '').replace(/[^\d+]/g, '')
        },
        handler: async function (response: any) {
          try {
            setIsProcessing(true);
            const verifyRes = await transactionsApi.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });

            if (verifyRes.status) {
              if (checkoutType === 'movie') {
                const purchaseRes = await purchaseMovie(
                  movie.interactive_movie_id,
                  userId,
                  response.razorpay_payment_id,
                  amount,
                  order.currency
                );
                if (purchaseRes.status === 'success') {
                  setSuccess(true);
                } else {
                  setError('Payment verified but failed to activate movie access. Please contact support.');
                }
              } else {
                const { timestamp_from, timestamp_to } = calculateValidityTimestamps(plan!.validity);
                
                const subRes = await subscriptionsApi.create({
                  planId: plan!.planId,
                  userId: userId,
                  payment_method: 'RAZORPAY',
                  payment_details: response.razorpay_payment_id,
                  timestamp_from,
                  timestamp_to,
                });
                
                if (subRes.status) {
                  setSuccess(true);
                } else {
                  setError('Payment verified but failed to activate subscription. Please contact support.');
                }
              }
            } else {
              setError(verifyRes.message || 'Payment verification failed.');
            }
          } catch (err: any) {
            setError('An error occurred during verification.');
          } finally {
            setIsProcessing(false);
          }
        },
        theme: {
          color: '#b28cff'
        }
      };

      console.log('[DEBUG] Razorpay options:', { 
        key: options.key, 
        order_id: options.order_id, 
        amount: options.amount, 
        currency: options.currency 
      });

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on('payment.failed', function (response: any) {
        setError(response.error.description || 'Payment failed. Please try again.');
        setIsProcessing(false);
      });
      
      paymentObject.open();
    } catch (err: any) {
      setError('An unexpected error occurred while initiating payment.');
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-cyan-500" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center p-6">
        <div className="bg-[#161224] border border-[#3299ff]/30 rounded-3xl p-10 max-w-lg w-full text-center shadow-[0_0_50px_rgba(50,153,255,0.1)]">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/20">
            <ShieldCheck size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-white mb-4 tracking-tight">
            {checkoutType === 'movie' ? 'Experience Unlocked' : 'Welcome to Premium'}
          </h1>
          <p className="text-gray-400 mb-8 leading-relaxed">
            {checkoutType === 'movie' 
              ? `Your payment was successful and access to ${movie?.title} is now unlocked.` 
              : `Your payment was successful and your ${plan?.name} subscription is now active. Get ready to experience cinema like never before.`}
          </p>
          <Link 
            href={checkoutType === 'movie' ? `/interactive/${movie?.interactive_movie_id}` : '/'} 
            className="inline-flex items-center gap-2 bg-white text-black font-bold px-8 py-4 rounded-full hover:scale-105 transition-transform duration-300"
          >
            <Play size={18} fill="currentColor" />
            Start Watching
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] flex flex-col">
      <header className="p-6 md:p-10">
        <Link href="/" className="inline-block hover:scale-105 transition-transform duration-300">
          <Image src="/vtagu_logo.png" alt="PrimeTime Logo" width={140} height={60} className="h-10 w-auto object-contain" />
        </Link>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-6 pb-20">
        <div className="w-full max-w-4xl grid md:grid-cols-2 gap-10 md:gap-0 items-stretch bg-[#161224]/50 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-sm">
          
          {/* Left Side: Summary */}
          <div className="p-8 md:p-12 bg-gradient-to-br from-white/5 to-transparent flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#b28cff]/10 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-[#b28cff]/10 text-[#b28cff] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-[#b28cff]/20">
                <Crown size={14} />
                Order Summary
              </div>
              
              {checkoutType === 'movie' && movie ? (
                <>
                  <h2 className="text-4xl font-black text-white mb-2 uppercase italic tracking-tighter">
                    {movie.title}
                  </h2>
                  <p className="text-gray-400 text-sm mb-10 font-medium">
                    Lifetime Interactive Experience
                  </p>
                  
                  <div className="space-y-6 mb-10 border-t border-white/10 pt-8">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400 font-bold">Experience Price</span>
                      <span className="text-white font-bold">₹{movie.price}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400 font-bold">Tax & Fees</span>
                      <span className="text-white font-bold">Included</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-end border-t border-white/10 pt-8">
                    <span className="text-gray-400 text-sm font-bold uppercase tracking-widest">Total</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-white/50 text-xl font-bold italic">₹</span>
                      <span className="text-5xl font-black text-white tracking-tighter">{movie.price}</span>
                    </div>
                  </div>
                </>
              ) : checkoutType === 'plan' && plan ? (
                <>
                  <h2 className="text-4xl font-black text-white mb-2 uppercase italic tracking-tighter">
                    {plan.name}
                  </h2>
                  <p className="text-gray-400 text-sm mb-10 font-medium">
                    {plan.validity} of unlimited streaming
                  </p>
                  
                  <div className="space-y-6 mb-10 border-t border-white/10 pt-8">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400 font-bold">Plan Price</span>
                      <span className="text-white font-bold">₹{plan.price}</span>
                    </div>
                    {plan.discount > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-cyan-400 font-bold">Discount Applied</span>
                        <span className="text-cyan-400 font-bold">-{plan.discount}%</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400 font-bold">Tax & Fees</span>
                      <span className="text-white font-bold">Included</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-end border-t border-white/10 pt-8">
                    <span className="text-gray-400 text-sm font-bold uppercase tracking-widest">Total</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-white/50 text-xl font-bold italic">₹</span>
                      <span className="text-5xl font-black text-white tracking-tighter">{plan.price}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-red-400">{error || 'Selection not found'}</div>
              )}
            </div>
            
            <div className="mt-12 text-gray-500 text-[10px] font-bold uppercase tracking-widest relative z-10">
              Secure Encrypted Checkout
            </div>
          </div>
          
          {/* Right Side: Payment Action */}
          <div className="p-8 md:p-12 flex flex-col justify-center relative">
            <h3 className="text-2xl font-bold text-white mb-6">Complete your payment</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              You will be securely redirected to Razorpay to complete your payment. All major credit cards, UPI, and net banking options are supported.
            </p>
            
            {error && (
              <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}
            
            <button
              onClick={handlePayment}
              disabled={isProcessing || (checkoutType === 'plan' ? !plan : !movie)}
              className="w-full bg-gradient-to-r from-[#b28cff] to-[#9248ff] text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform duration-300 shadow-[0_10px_30px_rgba(146,72,255,0.3)] disabled:opacity-70 disabled:hover:scale-100 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              {isProcessing ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Pay Securely via Razorpay
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            
            <div className="mt-8 flex items-center justify-center gap-4 opacity-50 grayscale">
              <span className="text-xs font-bold uppercase tracking-widest text-white">VISA</span>
              <span className="text-xs font-bold uppercase tracking-widest text-white">Mastercard</span>
              <span className="text-xs font-bold uppercase tracking-widest text-white">UPI</span>
            </div>
          </div>
        </div>
      </main>
    </div>

  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-cyan-500" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
