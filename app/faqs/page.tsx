"use client";
import React, { useEffect, useState } from 'react';
import { faqApi, FAQItem } from '@/lib/api/faq.api';
import { Loader2, ChevronDown, HelpCircle, Search, Mail, MessageSquare } from 'lucide-react';

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchFaqs = async () => {
      const res = await faqApi.getFaqs();
      if (res.status && res.data.length > 0) {
        setFaqs(res.data);
      } else {
        // Mock data if API is empty
        setFaqs([
          {
            faq_id: 1,
            question: "How do I update my profile details?",
            answer: "You can update your profile details by navigating to the 'Account' section in the sidebar. There, you can edit your username, age, gender, and mobile number. Don't forget to click 'Save Changes' to apply your updates.",
            category: "Account",
            created_on: new Date().toISOString()
          },
          {
            faq_id: 2,
            question: "What is PrimeTime Originals?",
            answer: "PrimeTime Originals are exclusive movies and series produced specifically for our platform. You can find them under the 'Originals' section in the main navigation.",
            category: "Content",
            created_on: new Date().toISOString()
          },
          {
            faq_id: 3,
            question: "Can I watch on multiple devices simultaneously?",
            answer: "Yes, depending on your subscription plan, you can stream on up to 4 devices at the same time. Check your 'Billing' tab in account settings to see your current plan limits.",
            category: "Subscription",
            created_on: new Date().toISOString()
          },
          {
            faq_id: 4,
            question: "How do I reset my password?",
            answer: "Go to the login page and click on 'Forgot Password'. Enter your registered email address, and we'll send you an OTP to reset your password securely.",
            category: "Security",
            created_on: new Date().toISOString()
          }
        ]);
      }
      setLoading(false);
    };
    fetchFaqs();
  }, []);

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0914] text-white pb-20 pt-10">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">How can we help?</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Everything you need to know about PrimeTime. Can't find the answer you're looking for? Reach out to our support team.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-16">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={24} />
          <input 
            type="text"
            placeholder="Search for questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#161224] border border-white/5 rounded-[2rem] py-6 pl-16 pr-8 text-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-gray-600"
          />
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq) => (
            <div 
              key={faq.faq_id}
              className={`bg-[#161224] border rounded-3xl overflow-hidden transition-all duration-300 ${
                openId === faq.faq_id ? 'border-purple-500/50 shadow-lg shadow-purple-500/5' : 'border-white/5'
              }`}
            >
              <button 
                onClick={() => setOpenId(openId === faq.faq_id ? null : faq.faq_id)}
                className="w-full px-8 py-7 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <HelpCircle className={openId === faq.faq_id ? 'text-purple-500' : 'text-gray-500'} size={24} />
                  <span className="text-lg font-bold">{faq.question}</span>
                </div>
                <ChevronDown 
                  className={`text-gray-500 transition-transform duration-300 ${openId === faq.faq_id ? 'rotate-180 text-purple-500' : ''}`} 
                  size={24} 
                />
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ${openId === faq.faq_id ? 'max-h-96' : 'max-h-0'}`}>
                <div className="px-8 pb-8 pt-0 text-gray-400 leading-relaxed text-lg border-t border-white/5 mt-0 pt-6">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
          
          {filteredFaqs.length === 0 && (
            <div className="text-center py-20 bg-[#161224] rounded-[2rem] border border-dashed border-white/10">
              <p className="text-gray-500">No results found for "{searchQuery}"</p>
            </div>
          )}
        </div>

        {/* Contact Support */}
        <div className="mt-20 p-10 bg-gradient-to-br from-purple-600/20 to-transparent border border-purple-500/20 rounded-[3rem] text-center">
          <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">We're here to help you get the most out of your PrimeTime experience.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <button className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-bold hover:bg-purple-500 hover:text-white transition-all">
              <Mail size={20} /> Email Support
            </button>
            <button className="flex items-center gap-3 bg-[#161224] border border-white/5 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/5 transition-all">
              <MessageSquare size={20} /> Live Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
