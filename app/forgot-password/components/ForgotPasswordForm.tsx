"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { authApi } from '../../../lib/api/auth.api';

export default function ForgotPasswordForm() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [apiSuccess, setApiSuccess] = useState('');
  const [step, setStep] = useState<1 | 2>(1); // 1: Email, 2: OTP & New Password

  const userEmail = watch('email');

  const onRequestOtp = async (data: any) => {
    setIsLoading(true);
    setApiError('');
    setApiSuccess('');
    try {
      const res = await authApi.forgotPassword({ email: data.email });
      if (res.status) {
        setApiSuccess(res.message || 'OTP sent successfully! Please check your email.');
        setStep(2);
      } else {
        setApiError(res.message || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      setApiError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onResetPassword = async (data: any) => {
    setIsLoading(true);
    setApiError('');
    setApiSuccess('');
    try {
      const payload = {
        email: userEmail,
        otp: data.otp,
        new_password: data.new_password
      };
      const res = await authApi.resetPassword(payload);
      if (res.status) {
        setApiSuccess('Password reset successfully! Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } else {
        setApiError(res.message || 'Failed to reset password.');
      }
    } catch (error) {
      setApiError('An unexpected error occurred during password reset.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[500px]">
      <Link href="/login" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 text-sm">
        <ArrowLeft size={16} />
        Back to Login
      </Link>
      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-3">Account Recovery</p>
      <h1 className="text-4xl font-bold text-white mb-10 tracking-tight drop-shadow-sm">Reset Password</h1>

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
        <form onSubmit={handleSubmit(onRequestOtp)} className="space-y-6">
          <div>
             <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2 ml-1">Email Address</label>
             <input 
               {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
               className={`w-full bg-[#161224] border ${errors.email ? 'border-red-500/50' : 'border-transparent'} rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-1 focus:ring-[#b28cff] transition-all text-sm placeholder:text-gray-600 shadow-inner`}
               placeholder="name@example.com"
               autoComplete="email"
             />
             {errors.email && <span className="text-red-500 text-xs mt-1 ml-1">Please enter a valid email.</span>}
          </div>

          <button 
            disabled={isLoading}
            className="w-full bg-[#b28cff] hover:bg-[#c3a5ff] text-[#0B0914] font-bold py-4 rounded-xl transition-all shadow-lg mt-8 flex justify-center items-center gap-2 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Send Recovery OTP'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit(onResetPassword)} className="space-y-6">
          <div>
             <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2 ml-1">Enter OTP sent to {userEmail}</label>
             <input 
               type="text" 
               name="hidden-username" 
               autoComplete="username" 
               className="hidden" 
               style={{ display: 'none' }} 
             />
             <input 
               type="text"
               inputMode="numeric"
               id="otp"
               {...register("otp", { required: true, minLength: 6, maxLength: 6 })}
               className={`w-full bg-[#161224] border ${errors.otp ? 'border-red-500/50' : 'border-transparent'} rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-1 focus:ring-[#b28cff] transition-all text-sm placeholder:text-gray-600 shadow-inner tracking-[0.5em] text-center`}
               placeholder="123456"
               autoComplete="off"
             />
             {errors.otp && <span className="text-red-500 text-xs mt-1 ml-1 block text-center">OTP must be 6 digits.</span>}
          </div>

          <div className="relative">
             <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2 ml-1">New Password</label>
             <input 
               type={showPassword ? "text" : "password"}
               {...register("new_password", { required: true, minLength: 8 })}
               className={`w-full bg-[#161224] border ${errors.new_password ? 'border-red-500/50' : 'border-transparent'} rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-1 focus:ring-[#b28cff] transition-all text-sm placeholder:text-gray-600 shadow-inner pr-12`}
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
             {errors.new_password && <span className="text-red-500 text-xs mt-1 ml-1">Password must be at least 8 characters.</span>}
          </div>
          
          <button 
            disabled={isLoading}
            className="w-full bg-[#b28cff] hover:bg-[#c3a5ff] text-[#0B0914] font-bold py-4 rounded-xl transition-all shadow-lg mt-8 flex justify-center items-center gap-2 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Confirm New Password'}
          </button>
          
          <button 
            type="button"
            disabled={isLoading}
            onClick={() => setStep(1)}
            className="w-full text-sm text-gray-400 hover:text-white transition-colors mt-4"
          >
            Use a different email address
          </button>
        </form>
      )}
    </div>
  );
}
