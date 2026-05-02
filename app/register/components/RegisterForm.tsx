"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { authApi } from '../../../lib/api/auth.api';

export default function RegisterForm() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [apiSuccess, setApiSuccess] = useState('');
  const [step, setStep] = useState<1 | 2>(1); // 1: Register, 2: OTP

  const userEmail = watch('email');

  const onRegisterSubmit = async (data: any) => {
    setIsLoading(true);
    setApiError('');
    setApiSuccess('');
    try {
      const payload = {
        email: data.email,
        user_name: data.name,
        password: data.password,
        mobile: data.mobile || '',
        type: 'U'
      };
      const res = await authApi.register(payload);
      if (res.status) {
        setApiSuccess(res.message || 'Registration successful. Please check your email for OTP.');
        setStep(2); // Move to OTP step
      } else {
        setApiError(res.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setApiError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onOtpSubmit = async (data: any) => {
    setIsLoading(true);
    setApiError('');
    setApiSuccess('');
    try {
      const payload = {
        email: userEmail,
        otp: data.otp
      };
      const res = await authApi.verifyOtp(payload);
      if (res.status) {
        setApiSuccess('OTP verified successfully! Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } else {
        setApiError(res.message || 'OTP verification failed.');
      }
    } catch (error) {
      setApiError('An unexpected error occurred during verification.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[500px]">
      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-3">Step into the spotlight</p>
      <h1 className="text-4xl font-bold text-white mb-10 tracking-tight drop-shadow-sm">Join PrimeTime</h1>

      {apiError && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm">
          {apiError}
        </div>
      )}
      
      {apiSuccess && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-xl text-green-400 text-sm">
          {apiSuccess}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleSubmit(onRegisterSubmit)} className="space-y-6">
          <div>
            <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2 ml-1">Full Name</label>
            <input 
              {...register("name", { required: true })}
              className={`w-full bg-[#161224] border ${errors.name ? 'border-red-500/50' : 'border-transparent'} rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-1 focus:ring-[#b28cff] transition-all text-sm placeholder:text-gray-600 shadow-inner`}
              placeholder="Enter your full name"
              autoComplete="name"
            />
          </div>

          <div>
             <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2 ml-1">Email Address</label>
             <input 
               {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
               className={`w-full bg-[#161224] border ${errors.email ? 'border-red-500/50' : 'border-transparent'} rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-1 focus:ring-[#b28cff] transition-all text-sm placeholder:text-gray-600 shadow-inner`}
               placeholder="name@example.com"
               autoComplete="email"
             />
          </div>

          <div>
             <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2 ml-1">Mobile Number</label>
             <input 
               {...register("mobile")}
               className="w-full bg-[#161224] border border-transparent rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-1 focus:ring-[#b28cff] transition-all text-sm placeholder:text-gray-600 shadow-inner"
               placeholder="+91-9876543210"
             />
          </div>

          <div className="relative">
             <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2 ml-1">Password</label>
             <input 
               type={showPassword ? "text" : "password"}
               {...register("password", { required: true })}
               className={`w-full bg-[#161224] border ${errors.password ? 'border-red-500/50' : 'border-transparent'} rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-1 focus:ring-[#b28cff] transition-all text-sm placeholder:text-gray-600 shadow-inner pr-12`}
               placeholder="••••••••"
               autoComplete="new-password"
             />
             <button 
               type="button" 
               onClick={() => setShowPassword(!showPassword)}
               className="absolute right-5 top-[38px] text-gray-500 hover:text-white transition-colors"
             >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
             </button>
          </div>

          <button 
            disabled={isLoading}
            className="w-full bg-[#b28cff] hover:bg-[#c3a5ff] text-[#0B0914] font-bold py-4 rounded-xl transition-all shadow-lg mt-8 flex justify-center items-center gap-2 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Sign Up'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit(onOtpSubmit)} className="space-y-6">
          <div>
             <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2 ml-1">Enter OTP sent to {userEmail}</label>
             <input 
               key="otp-input"
               id="otp"
               {...register("otp", { required: true, minLength: 6, maxLength: 6 })}
               className={`w-full bg-[#161224] border ${errors.otp ? 'border-red-500/50' : 'border-transparent'} rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-1 focus:ring-[#b28cff] transition-all text-sm placeholder:text-gray-600 shadow-inner tracking-[0.5em] text-center`}
               placeholder="123456"
               autoComplete="one-time-code"
             />
          </div>
          
          <button 
            disabled={isLoading}
            className="w-full bg-[#b28cff] hover:bg-[#c3a5ff] text-[#0B0914] font-bold py-4 rounded-xl transition-all shadow-lg mt-8 flex justify-center items-center gap-2 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Verify OTP'}
          </button>
          
          <button 
            type="button"
            onClick={() => setStep(1)}
            className="w-full text-sm text-gray-400 hover:text-white transition-colors mt-4"
          >
            Back to registration
          </button>
        </form>
      )}

      {step === 1 && (
        <>
          <div className="flex items-center gap-4 my-8 opacity-70">
             <div className="h-px flex-1 bg-white/10" />
             <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.15em]">Or register with</span>
             <div className="h-px flex-1 bg-white/10" />
          </div>

          <button className="w-full flex items-center justify-center gap-3 bg-[#161224] hover:bg-[#1f1a30] text-white font-bold py-4 rounded-xl transition-all shadow-inner border border-white/5 hover:-translate-y-0.5">
             <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.64 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
             </svg>
             Continue with Google
          </button>
        </>
      )}

      <p className="text-center text-sm text-gray-400 mt-10">
        Already have an account? <Link href="/login" className="text-[#b28cff] font-bold hover:text-white transition-colors">Sign In</Link>
      </p>
    </div>
  );
}
