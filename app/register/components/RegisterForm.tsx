"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi } from '../../../lib/api/auth.api';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/slices/authSlice';
import { setToken } from '../../../lib/api-client';
import { useGoogleLogin } from '@react-oauth/google';

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [apiSuccess, setApiSuccess] = useState('');
  const [step, setStep] = useState<1 | 2>(1); // 1: Register, 2: OTP

  const userEmail = watch('email');

  useEffect(() => {
    const verifyEmail = searchParams.get('verify_email');
    if (verifyEmail) {
      setValue('email', verifyEmail);
      setStep(2);
      setApiSuccess(`Verification code has been sent to ${verifyEmail}`);
    }
  }, [searchParams, setValue]);

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

  const googleLoginFn = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      setApiError('');
      setApiSuccess('');
      try {
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }).then(res => res.json());

        const res = await authApi.googleLogin({
          email: userInfo.email,
          user_name: userInfo.name,
          login_oauth_uid: userInfo.sub,
          profile_picture: userInfo.picture
        });

        if (res.status && res.token) {
          setApiSuccess('Google Authentication successful! Redirecting...');
          setToken(res.token);
          const userData = res.data || res.user || (res as any).userData;
          if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));
            const userId = userData.userId || userData.id;
            if (userId) {
              localStorage.setItem('userId', userId.toString());
              document.cookie = `userId=${userId}; path=/; max-age=86400; SameSite=Lax`;
            }
            dispatch(setUser(userData));
          }
          setTimeout(() => {
            router.push('/browse');
          }, 1500);
        } else {
          setApiError(res.message || 'Google Registration failed. Please try again.');
        }
      } catch (error) {
        setApiError('An unexpected error occurred during Google Registration.');
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => setApiError('Google Authentication was unsuccessful.')
  });

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

          <button 
            type="button"
            disabled={isLoading}
            onClick={() => googleLoginFn()}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-[#3c4043] font-medium py-3 rounded border border-[#dadce0] transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:shadow-sm disabled:hover:translate-y-0">
             <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
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
