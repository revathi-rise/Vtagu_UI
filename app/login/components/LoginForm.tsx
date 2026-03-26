"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Login Payload:", data);
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-[400px]">
      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-3">Welcome Back</p>
      <h1 className="text-4xl lg:text-5xl font-bold text-white mb-10 tracking-tight drop-shadow-sm">Sign In</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
           <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2 ml-1">Email Address</label>
           <input 
             {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
             className={`w-full bg-[#161224] border ${errors.email ? 'border-red-500/50' : 'border-transparent'} rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-1 focus:ring-[#b28cff] transition-all text-sm placeholder:text-gray-600 shadow-inner`}
             placeholder="name@example.com"
           />
        </div>

        <div className="relative">
           <div className="flex items-center justify-between mb-2 ml-1 pr-1">
             <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest">Password</label>
             <Link href="#" className="text-[10px] text-[#b28cff] font-bold hover:text-white transition-colors">Forgot Password?</Link>
           </div>
           
           <input 
             type={showPassword ? "text" : "password"}
             {...register("password", { required: true })}
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

        <button 
          disabled={isLoading}
          className="w-full bg-[#b28cff] hover:bg-[#c3a5ff] text-[#0B0914] font-bold py-4 rounded-xl transition-all shadow-lg mt-8 flex justify-center items-center gap-2 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Sign In'}
        </button>
      </form>

      <div className="flex items-center gap-4 my-8 opacity-70">
         <div className="h-px flex-1 bg-white/10" />
         <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.15em]">Or sign in with</span>
         <div className="h-px flex-1 bg-white/10" />
      </div>

      <button className="w-full flex items-center justify-center gap-3 bg-[#161224] hover:bg-[#1f1a30] text-white font-bold py-4 rounded-xl transition-all shadow-inner border border-white/5 hover:-translate-y-0.5">
         <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.64 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
         </svg>
         Continue with Google
      </button>

      <p className="text-center text-sm text-gray-400 mt-10">
        New to PrimeTime? <Link href="/register" className="text-[#b28cff] font-bold hover:text-white transition-colors">Create Account</Link>
      </p>
    </div>
  );
}
