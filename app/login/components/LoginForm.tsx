"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/slices/authSlice';
import { authApi } from '../../../lib/api/auth.api';
import { setToken } from '../../../lib/api-client';
import { useGoogleLogin } from '@react-oauth/google';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get('plan');
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors }, setError, setValue } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [loginMode, setLoginMode] = useState<'email' | 'mobile'>('email');
  const [otpStep, setOtpStep] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && planId) {
      router.push(`/checkout?plan=${planId}`);
    }
  }, [planId, router]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setApiError('');
    try {
      if (loginMode === 'email') {
        const res = await authApi.login({ email: data.email, password: data.password });
        handleLoginResponse(res, data.email);
      } else {
        if (!otpStep) {
          // Step 1: Send OTP
          const res = await authApi.mobileLogin({ mobile: data.mobile });
          if (res.status) {
            setMobileNumber(data.mobile);
            setOtpStep(true);
            setValue('otp', '');
            setIsLoading(false);
          } else {
            setApiError(res.message || 'Failed to send OTP. Please try again.');
            setIsLoading(false);
          }
        } else {
          // Step 2: Verify OTP
          const res = await authApi.verifyMobileLogin({ mobile: mobileNumber, otp: data.otp });
          handleLoginResponse(res);
        }
      }
    } catch (error) {
      setApiError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleLoginResponse = (res: any, email?: string) => {
    if (res.status && res.token) {
      setToken(res.token);

      // Handle variations in where user data is returned
      const userData = res.data || res.user || (res as any).userData;

      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        const userId = userData.userId || userData.id;
        if (userId) {
          localStorage.setItem('userId', userId.toString());
          document.cookie = `userId=${userId}; path=/; max-age=86400; SameSite=Lax`;
        }

        console.log('[DEBUG] Login successful, user saved:', userData);
        dispatch(setUser(userData));
      } else {
        console.warn('[DEBUG] Login successful but no user data returned in res.data or res.user');
      }

      if (planId) {
        router.push(`/checkout?plan=${planId}`);
      } else if (userData && userData.is_subscribed === false) {
        router.push('/pricing');
      } else {
        router.push('/');
      }
    } else {
      if (res.message === 'Please verify OTP first' && email) {
        setApiError('Account not verified. Sending a new OTP and redirecting...');
        authApi.resendOtp({ email }).catch(console.error);
        setTimeout(() => {
          router.push(`/register?verify_email=${encodeURIComponent(email)}`);
        }, 2000);
      } else {
        setApiError(res.message || 'Login failed. Please try again.');
        setIsLoading(false);
      }
    }
  };

  const googleLoginFn = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      setApiError('');
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
          if (planId) {
            router.push(`/checkout?plan=${planId}`);
          } else if (userData && userData.is_subscribed === false) {
            router.push('/pricing');
          } else {
            router.push('/');
          }
        } else {
          setApiError(res.message || 'Google Login failed. Please try again.');
        }
      } catch (error) {
        setApiError('An unexpected error occurred during Google Login.');
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => setApiError('Google Login was unsuccessful.')
  });

  return (
    <div className="w-full]">
      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-3">Welcome Back</p>
      <h1 className="text-4xl font-bold text-white mb-10 tracking-tight drop-shadow-sm">
        Resume the Experience
      </h1>
      {apiError && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm">
          {apiError}
        </div>
      )}

      {/* Mode Switcher */}
      <div className="flex gap-1 p-1 bg-[#161224] rounded-xl mb-8 w-fit">
        <button
          type="button"
          onClick={() => { setLoginMode('email'); setOtpStep(false); setApiError(''); }}
          className={`px-6 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${loginMode === 'email' ? 'bg-[#b28cff] text-[#0B0914]' : 'text-gray-400 hover:text-white'}`}
        >
          Email
        </button>
        <button
          type="button"
          onClick={() => { setLoginMode('mobile'); setOtpStep(false); setApiError(''); }}
          className={`px-6 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${loginMode === 'mobile' ? 'bg-[#b28cff] text-[#0B0914]' : 'text-gray-400 hover:text-white'}`}
        >
          Mobile
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {loginMode === 'email' ? (
          <>
            <div>
              <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <input
                {...register("email", { required: loginMode === 'email', pattern: /^\S+@\S+$/i })}
                className={`w-full bg-[#161224] border ${errors.email ? 'border-red-500/50' : 'border-transparent'} rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-1 focus:ring-[#b28cff] transition-all text-sm placeholder:text-gray-600 shadow-inner`}
                placeholder="name@example.com"
              />
            </div>

            <div className="relative">
              <div className="flex items-center justify-between mb-2 ml-1 pr-1">
                <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest">Password</label>
                <Link href="/forgot-password" className="text-[10px] text-[#b28cff] font-bold hover:text-white transition-colors">Forgot Password?</Link>
              </div>

              <input
                type={showPassword ? "text" : "password"}
                {...register("password", { required: loginMode === 'email' })}
                className={`w-full bg-[#161224] border ${errors.password ? 'border-red-500/50' : 'border-transparent'} rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-1 focus:ring-[#b28cff] transition-all text-sm placeholder:text-gray-600 shadow-inner pr-12`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 bottom-[14px] text-gray-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </>
        ) : (
          <>
            {!otpStep ? (
              <div>
                <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2 ml-1">Mobile Number</label>
                <input
                  key="mobile-input"
                  {...register("mobile", { required: loginMode === 'mobile', pattern: /^[0-9]{10,12}$/ })}
                  className={`w-full bg-[#161224] border ${errors.mobile ? 'border-red-500/50' : 'border-transparent'} rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-1 focus:ring-[#b28cff] transition-all text-sm placeholder:text-gray-600 shadow-inner`}
                  placeholder="Enter mobile number"
                />
                {errors.mobile && <p className="text-red-500 text-[10px] mt-1 ml-1">Please enter a valid mobile number</p>}
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-2 ml-1 pr-1">
                  <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest">Verification Code</label>
                  <button
                    type="button"
                    onClick={() => setOtpStep(false)}
                    className="text-[10px] text-[#b28cff] font-bold hover:text-white transition-colors"
                  >
                    Change Number
                  </button>
                </div>
                <input
                  key="otp-input"
                  {...register("otp", { required: otpStep, minLength: 6, maxLength: 6 })}
                  className={`w-full bg-[#161224] border ${errors.otp ? 'border-red-500/50' : 'border-transparent'} rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-1 focus:ring-[#b28cff] transition-all text-sm tracking-[0.5em] text-center placeholder:tracking-normal placeholder:text-gray-600 shadow-inner`}
                  placeholder="000000"
                  maxLength={6}
                  autoFocus
                />
                <p className="text-[10px] text-gray-500 mt-3 text-center">We've sent a 6-digit code to {mobileNumber}</p>
              </div>
            )}
          </>
        )}

        <button
          disabled={isLoading}
          className="w-full bg-[#b28cff] hover:bg-[#c3a5ff] text-[#0B0914] font-bold py-4 rounded-xl transition-all shadow-lg mt-8 flex justify-center items-center gap-2 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {isLoading ? <Loader2 size={20} className="animate-spin" /> : (
            loginMode === 'email' ? 'Sign In' : (otpStep ? 'Verify & Sign In' : 'Get OTP')
          )}
        </button>
      </form>

      <div className="flex items-center gap-4 my-8 opacity-70">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.15em]">Or sign in with</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <button
        onClick={() => googleLoginFn()}
        disabled={isLoading}
        type="button"
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

      <p className="text-center text-sm text-gray-400 mt-10">
        New to PrimeTime? <Link href={`/register${planId ? `?plan=${planId}` : ''}`} className="text-[#b28cff] font-bold hover:text-white transition-colors">Create Account</Link>
      </p>
    </div>
  );
}
