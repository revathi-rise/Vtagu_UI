"use client";
import React, { useState } from 'react';
import { Shield, Eye, Mail, Lock } from 'lucide-react';

export default function PrivacyTab() {
  const [marketing, setMarketing] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [watchHistory, setWatchHistory] = useState(true);

  return (
    <section className="bg-[#1a1329]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 lg:p-8 shadow-xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-full bg-[#9248FF]/20 flex items-center justify-center text-[#9248FF]">
          <Shield size={24} />
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-white tracking-wide">Privacy & Data</h3>
          <p className="text-sm text-gray-400">Manage how we use your information</p>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* Toggle 1 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-white/5 bg-white/5">
          <div className="flex items-start gap-4">
            <Mail size={20} className="text-gray-400 mt-1" />
            <div>
              <h4 className="text-white font-bold mb-1">Marketing Emails</h4>
              <p className="text-sm text-gray-400 max-w-sm">Receive updates about new shows, features, and personalized recommendations.</p>
            </div>
          </div>
          <button 
            onClick={() => setMarketing(!marketing)}
            className={`w-14 h-7 rounded-full transition-colors relative shrink-0 ${marketing ? 'bg-[#9248FF]' : 'bg-gray-600'}`}
          >
            <span className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full transition-transform ${marketing ? 'translate-x-7' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Toggle 2 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-white/5 bg-white/5">
          <div className="flex items-start gap-4">
            <Eye size={20} className="text-gray-400 mt-1" />
            <div>
              <h4 className="text-white font-bold mb-1">Watch History Profile</h4>
              <p className="text-sm text-gray-400 max-w-sm">Allow PrimeTime to track your progress and generate custom home feeds.</p>
            </div>
          </div>
          <button 
            onClick={() => setWatchHistory(!watchHistory)}
            className={`w-14 h-7 rounded-full transition-colors relative shrink-0 ${watchHistory ? 'bg-[#9248FF]' : 'bg-gray-600'}`}
          >
            <span className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full transition-transform ${watchHistory ? 'translate-x-7' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Toggle 3 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-white/5 bg-white/5">
          <div className="flex items-start gap-4">
            <Lock size={20} className="text-gray-400 mt-1" />
            <div>
              <h4 className="text-white font-bold mb-1">Third-Party Data Sharing</h4>
              <p className="text-sm text-gray-400 max-w-sm">Share usage analytics with our studio partners to improve content.</p>
            </div>
          </div>
          <button 
            onClick={() => setDataSharing(!dataSharing)}
            className={`w-14 h-7 rounded-full transition-colors relative shrink-0 ${dataSharing ? 'bg-[#9248FF]' : 'bg-gray-600'}`}
          >
            <span className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full transition-transform ${dataSharing ? 'translate-x-7' : 'translate-x-0'}`} />
          </button>
        </div>

      </div>

      <div className="mt-8 pt-8 border-t border-white/5">
        <button className="text-red-400 hover:text-red-300 font-semibold text-sm transition-colors">
          Delete Account Data
        </button>
      </div>
    </section>
  );
}
