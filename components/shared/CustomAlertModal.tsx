'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';

export type AlertType = 'warning' | 'info' | 'success' | 'error';

interface AlertOptions {
  title?: string;
  message: string;
  type?: AlertType;
  actionText?: string;
  onAction?: () => void;
  showLoginAction?: boolean;
}

interface AlertContextType {
  showAlert: (options: AlertOptions | string) => void;
  closeAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alertConfig, setAlertConfig] = useState<AlertOptions | null>(null);
  const router = useRouter();

  const showAlert = (options: AlertOptions | string) => {
    if (typeof options === 'string') {
      const isLoginPrompt = options.toLowerCase().includes('log in') || options.toLowerCase().includes('sign in');
      setAlertConfig({
        message: options,
        type: isLoginPrompt ? 'warning' : 'info',
        showLoginAction: isLoginPrompt,
      });
    } else {
      const isLoginPrompt = options.message.toLowerCase().includes('log in') || options.message.toLowerCase().includes('sign in');
      setAlertConfig({
        ...options,
        showLoginAction: options.showLoginAction ?? isLoginPrompt,
      });
    }
  };

  const closeAlert = () => {
    setAlertConfig(null);
  };

  const getIcon = (type: AlertType = 'info') => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-7 h-7 text-amber-400" />;
      case 'success':
        return <CheckCircle2 className="w-7 h-7 text-emerald-400" />;
      case 'error':
        return <AlertCircle className="w-7 h-7 text-red-400" />;
      case 'info':
      default:
        return <Info className="w-7 h-7 text-cyan-400" />;
    }
  };

  const getTypeGlow = (type: AlertType = 'info') => {
    switch (type) {
      case 'warning':
        return 'from-amber-500/20 to-orange-500/5 border-amber-500/30';
      case 'success':
        return 'from-emerald-500/20 to-teal-500/5 border-emerald-500/30';
      case 'error':
        return 'from-red-500/20 to-pink-500/5 border-red-500/30';
      case 'info':
      default:
        return 'from-cyan-500/20 to-blue-500/5 border-cyan-500/30';
    }
  };

  return (
    <AlertContext.Provider value={{ showAlert, closeAlert }}>
      {children}
      
      <AnimatePresence>
        {alertConfig && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeAlert}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Alert Card Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`relative w-full max-w-md bg-[#141022] border rounded-3xl p-6 sm:p-8 text-center shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden bg-gradient-to-b ${getTypeGlow(alertConfig.type)}`}
            >
              {/* Close Button */}
              <button
                onClick={closeAlert}
                className="absolute top-4 right-4 p-2 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <div className="flex flex-col items-center space-y-4">
                {/* Icon Container */}
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                  {getIcon(alertConfig.type)}
                </div>

                {/* Title & Message */}
                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold text-white tracking-tight">
                    {alertConfig.title || (alertConfig.showLoginAction ? 'Authentication Required' : 'Notice')}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed font-medium">
                    {alertConfig.message}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="w-full pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  {alertConfig.showLoginAction ? (
                    <>
                      <button
                        onClick={() => {
                          closeAlert();
                          router.push('/login');
                        }}
                        className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-extrabold text-xs uppercase tracking-widest shadow-lg shadow-cyan-500/25 transition-all duration-300 flex items-center justify-center gap-2 active:scale-95"
                      >
                        <LogIn size={15} />
                        Sign In Now
                      </button>
                      <button
                        onClick={closeAlert}
                        className="w-full py-3 px-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white font-extrabold text-xs uppercase tracking-widest transition-all active:scale-95"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        if (alertConfig.onAction) alertConfig.onAction();
                        closeAlert();
                      }}
                      className="w-full py-3.5 px-8 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs uppercase tracking-widest shadow-lg shadow-cyan-500/25 transition-all duration-300 active:scale-95"
                    >
                      {alertConfig.actionText || 'OK'}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AlertContext.Provider>
  );
};
