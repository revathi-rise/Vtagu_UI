'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, Eye, EyeOff, ShieldCheck, AlertCircle, Home } from 'lucide-react';
import Link from 'next/link';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  requiredPassword?: string;
}

export const PasswordModal = ({
  isOpen,
  onClose,
  onSuccess,
  requiredPassword = 'Vtagu@In!23',
}: PasswordModalProps) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  // Check for existing authorization on mount
  React.useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      const isAuth = sessionStorage.getItem('vtagu_authorized') === 'true';
      if (isAuth) {
        onSuccess();
      }
    }
  }, [isOpen, onSuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidating(true);
    setError(false);

    // Simulate a brief validation delay for better UX feel
    setTimeout(() => {
      if (password === requiredPassword) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('vtagu_authorized', 'true');
        }
        onSuccess();
        setPassword('');
        setError(false);
      } else {
        setError(true);
      }
      setIsValidating(false);
    }, 600);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-[#1a1125] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Header Gradient */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-gradient" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="p-8 pt-10">
              <div className="flex flex-col items-center text-center space-y-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                  <Lock size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                    Protected Content
                  </h2>
                  <p className="text-white/50 text-sm font-medium mt-1">
                    Please enter the authorization password to continue.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center text-white/20 group-focus-within:text-primary transition-colors">
                    <ShieldCheck size={20} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(false);
                    }}
                    placeholder="Enter Password"
                    autoFocus
                    className={`w-full bg-white/5 border ${
                      error ? 'border-red-500/50 ring-2 ring-red-500/10' : 'border-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/10'
                    } rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-white/20 outline-none transition-all duration-300 font-medium tracking-wider`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-4 flex items-center text-white/20 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider bg-red-400/10 p-3 rounded-xl border border-red-400/20"
                  >
                    <AlertCircle size={14} />
                    Incorrect password. Access denied.
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={!password || isValidating}
                  className="w-full bg-brand-gradient hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-primary/20 uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-2"
                >
                  {isValidating ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Verify & Access'
                  )}
                </button>

                <div className="pt-2">
                  <Link
                    href="/"
                    className="w-full flex items-center justify-center gap-2 text-white/40 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest py-2 group/home"
                  >
                    <Home size={14} className="group-hover/home:-translate-y-0.5 transition-transform" />
                    Back to Home
                  </Link>
                </div>
              </form>
            </div>

            {/* Footer decoration */}
            <div className="p-4 bg-white/[0.02] border-t border-white/5 flex justify-center">
              <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">
                Secure Access Portal
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
