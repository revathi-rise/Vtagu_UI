"use client";
import React, { useState } from 'react';
import { HelpCircle, Search, ChevronDown, MessageSquare } from 'lucide-react';

const faqs = [
  { question: "How do I change my billing cycle?", answer: "You can update your billing details in the Billing tab. Changes take effect at the start of your next cycle." },
  { question: "Why is 4K HDR not working?", answer: "Ensure you are on the Ultra 4K plan and using a compatible device (e.g., Apple TV 4K, recent smart TVs) connected to a 25Mbps+ network." },
  { question: "Can I share my account?", answer: "Your account supports simultaneous streaming on up to 4 devices depending on your selected plan. Password sharing outside your household violates our terms." },
];

export default function HelpCenterTab() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Search Header */}
      <section className="bg-[#1a1329]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 lg:p-10 shadow-xl text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#9248FF]/20 flex items-center justify-center text-[#9248FF] mb-6">
          <HelpCircle size={32} />
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">How can we help?</h3>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">Search our knowledge base or get in touch with our legendary 24/7 support team.</p>
        
        <div className="relative max-w-xl mx-auto">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search problems, billing, devices..."
            className="w-full bg-[#25183d] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#9248FF] transition-colors shadow-inner"
          />
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* FAQs */}
        <section className="md:col-span-2 bg-[#1a1329]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 lg:p-8 shadow-xl">
          <h4 className="text-lg font-bold text-white mb-6">Frequently Asked Questions</h4>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-white/5 rounded-xl bg-white/5 overflow-hidden transition-colors hover:border-white/10 cursor-pointer" onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                <div className="flex items-center justify-between p-5">
                  <h5 className="font-semibold text-white text-sm md:text-base">{faq.question}</h5>
                  <ChevronDown size={18} className={`text-gray-400 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                </div>
                <div className={`px-5 overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-sm text-gray-400 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Support */}
        <section className="bg-gradient-to-b from-[#b28cff] to-[#9248FF] rounded-2xl p-6 lg:p-8 shadow-2xl flex flex-col justify-between relative overflow-hidden">
          {/* Subtle overlay reflection */}
          <div className="absolute inset-0 bg-white/10 skew-y-12 translate-y-20 scale-150 pointer-events-none" />
          
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white mb-6 border border-white/30">
              <MessageSquare size={24} className="fill-white/20" />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Live Chat</h4>
            <p className="text-white/80 text-sm mb-8 leading-relaxed">
              Our support team is online and ready to assist you right now. Average response time is 2 minutes.
            </p>
          </div>

          <button className="w-full bg-white text-[#1a1329] font-black py-4 rounded-xl shadow-xl hover:bg-gray-100 transition-colors relative z-10">
            Start Conversation
          </button>
        </section>
      </div>

    </div>
  );
}
