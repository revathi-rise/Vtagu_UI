"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Database,
  Share2,
  FileText,
  Baby,
  RefreshCw,
  Mail,
  MapPin,
  Printer,
  Copy,
  Check,
  Sparkles,
  ChevronRight,
  Search,
  BookOpen,
  Scale,
  Clock,
  ExternalLink,
  Shield,
  HelpCircle,
  AlertTriangle,
  CreditCard,
  Tv,
  Globe
} from 'lucide-react';

export default function PrivacyPolicyClient() {
  const [activeSection, setActiveSection] = useState<string>('section-1');
  const [copied, setCopied] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tocOpen, setTocOpen] = useState<boolean>(false);

  const sections = [
    { id: 'section-1', number: '1', title: 'Information We Collect', icon: Database },
    { id: 'section-2', number: '2', title: 'How We Use Your Information', icon: Sparkles },
    { id: 'section-3', number: '3', title: 'How We Share Your Information', icon: Share2 },
    { id: 'section-4', number: '4', title: 'Data Security', icon: Lock },
    { id: 'section-5', number: '5', title: 'Your Data Rights (DPDP Act 2023)', icon: Scale },
    { id: 'section-6', number: '6', title: "Children's Privacy", icon: Baby },
    { id: 'section-7', number: '7', title: 'Changes to This Privacy Policy', icon: RefreshCw },
    { id: 'section-8', number: '8', title: 'Contact Us & Grievance Redressal', icon: Mail },
  ];

  // ScrollSpy observer
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    setTocOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Structured Data Schema for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Privacy Policy - VtagU Prime Time',
    description: 'Official Privacy Policy for VtagU Prime Time application and website (www.vtagu.in), compliant with DPDP Act 2023 & IT Rules 2021 of India.',
    url: 'https://www.vtagu.in/privacy-policy',
    publisher: {
      '@type': 'Organization',
      name: 'VtagU Prime Time Private Limited',
      url: 'https://www.vtagu.in',
      logo: 'https://www.vtagu.in/vtagu_logo.png'
    },
    mainEntity: {
      '@type': 'PrivacyPolicy',
      name: 'VtagU Prime Time Privacy Policy',
      effectiveDate: '2026-10-04',
      jurisdiction: 'India'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-[#0B0914] text-white selection:bg-primary/30 selection:text-white pb-24 relative overflow-x-clip">
        {/* Background Ambient Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-primary/15 via-purple-600/10 to-transparent blur-[160px] pointer-events-none" />
        <div className="absolute top-1/3 left-[-200px] w-[500px] h-[500px] bg-cyan-500/10 blur-[180px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-[-200px] w-[600px] h-[600px] bg-purple-600/10 blur-[200px] pointer-events-none" />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative z-10">
          
          {/* Breadcrumb & Top Bar */}
          <div className="print:hidden flex items-center justify-between gap-4 text-xs font-semibold text-white/50 mb-8 border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight size={14} className="text-white/20" />
              <span className="text-white/80">Legal</span>
              <ChevronRight size={14} className="text-white/20" />
              <span className="text-primary font-bold">Privacy Policy</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/80 hover:text-white transition-all"
                title="Copy Direct Link"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copied ? 'Copied Link' : 'Copy Link'}</span>
              </button>
              
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/80 hover:text-white transition-all hidden sm:flex"
                title="Print Document"
              >
                <Printer size={14} />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Hero Header Card */}
          <div className="bg-gradient-to-b from-[#18132A]/80 to-[#120F20]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-10 lg:p-12 mb-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-extrabold uppercase tracking-wider">
                <ShieldCheck size={14} /> Official Legal Policy
              </span>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
                <Scale size={14} /> DPDP Act 2023 & IT Rules 2021 Compliant
              </span>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-semibold">
                <Clock size={14} /> Effective Date: October 4, 2026
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
              Privacy Policy for <span className="bg-gradient-to-r from-primary via-blue-400 to-accent bg-clip-text text-transparent">VtagU Prime Time</span>
            </h1>

            <p className="text-white/70 text-base sm:text-lg max-w-4xl leading-relaxed mb-6 font-normal">
              <strong className="text-white font-semibold">VtagU Prime Time Private Limited</strong> (&quot;VtagU,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the VtagU Prime Time application (the &quot;App&quot;) and the website <a href="https://www.vtagu.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold inline-flex items-center gap-1">www.vtagu.in <ExternalLink size={12} /></a> (the &quot;Service&quot;). We are committed to protecting the privacy and security of your personal data.
            </p>

            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 text-white/80 text-sm leading-relaxed">
              This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you use our App and Service. This policy is compliant with the <strong className="text-white">Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021</strong>, and the <strong className="text-white">Digital Personal Data Protection (DPDP) Act, 2023</strong>, of India. By accessing or using the Service, you consent to the data practices described in this policy.
            </div>

            {/* Quick Metadata Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10 text-xs">
              <div>
                <span className="text-white/40 block uppercase tracking-wider font-bold mb-1">Entity</span>
                <span className="text-white font-semibold">VtagU Prime Time Pvt Ltd</span>
              </div>
              <div>
                <span className="text-white/40 block uppercase tracking-wider font-bold mb-1">Jurisdiction</span>
                <span className="text-white font-semibold">India (DPDP Act 2023)</span>
              </div>
              <div>
                <span className="text-white/40 block uppercase tracking-wider font-bold mb-1">Target App</span>
                <span className="text-white font-semibold">Google Play & Web</span>
              </div>
              <div>
                <span className="text-white/40 block uppercase tracking-wider font-bold mb-1">Grievance SLA</span>
                <span className="text-emerald-400 font-semibold">24h Ack / 15d Resolve</span>
              </div>
            </div>
          </div>

          {/* Quick Search & Mobile TOC button */}
          <div className="print:hidden lg:hidden mb-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
              <input
                type="text"
                placeholder="Search privacy topics (e.g. DPDP, payment, cookies)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#161224] border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-primary/50 text-white placeholder:text-white/40"
              />
            </div>
            <button
              onClick={() => setTocOpen(!tocOpen)}
              className="flex items-center justify-between gap-2 px-5 py-3 rounded-2xl bg-[#161224] border border-white/10 text-white font-bold text-sm"
            >
              <span className="flex items-center gap-2"><BookOpen size={16} className="text-primary" /> Table of Contents</span>
              <ChevronRight size={16} className={`transition-transform ${tocOpen ? 'rotate-90' : ''}`} />
            </button>
          </div>

          {/* Mobile TOC Drawer */}
          {tocOpen && (
            <div className="print:hidden lg:hidden bg-[#161224] border border-white/10 rounded-2xl p-4 mb-8 space-y-1">
              {sections.map((sec) => {
                const IconComponent = sec.icon;
                return (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between text-sm transition-all ${
                      activeSection === sec.id
                        ? 'bg-primary/20 text-white font-bold border border-primary/30'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <IconComponent size={16} className={activeSection === sec.id ? 'text-primary' : 'text-white/40'} />
                      <span>{sec.number}. {sec.title}</span>
                    </span>
                    <ChevronRight size={14} className="opacity-50" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Main Content Layout: Sidebar + Document Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Desktop Floating Sticky Sidebar Navigation */}
            <aside className="print:hidden hidden lg:block lg:col-span-4 self-start sticky top-[135px] z-30 transition-all duration-300">
              <div className="bg-[#130F22]/95 backdrop-blur-2xl border border-white/15 rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] max-h-[calc(100vh-165px)] flex flex-col">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3.5 shrink-0">
                  <h3 className="text-xs font-black uppercase tracking-widest text-white/60 flex items-center gap-2">
                    <BookOpen size={15} className="text-primary" /> Table of Contents
                  </h3>
                  <span className="text-[10px] font-extrabold bg-primary/20 text-primary px-2.5 py-0.5 rounded-full border border-primary/30">
                    8 Clauses
                  </span>
                </div>

                {/* Filter Search */}
                <div className="relative mb-3 shrink-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={13} />
                  <input
                    type="text"
                    placeholder="Search clause..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-2 pl-8 pr-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                {/* Scrollable Clauses List */}
                <nav className="space-y-1 flex-1 overflow-y-auto pr-1.5 custom-scrollbar min-h-0">
                  {sections
                    .filter((sec) => sec.title.toLowerCase().includes(searchQuery.toLowerCase()) || sec.number.includes(searchQuery))
                    .map((sec) => {
                      const IconComponent = sec.icon;
                      const isActive = activeSection === sec.id;
                      return (
                        <button
                          key={sec.id}
                          onClick={() => scrollToSection(sec.id)}
                          className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between text-xs transition-all duration-300 group ${
                            isActive
                              ? 'bg-gradient-to-r from-primary/25 via-primary/15 to-purple-600/15 border border-primary/50 text-white font-bold shadow-md shadow-primary/10'
                              : 'text-white/60 hover:bg-white/[0.05] hover:text-white border border-transparent'
                          }`}
                        >
                          <span className="flex items-center gap-2.5 pr-2">
                            <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] shrink-0 transition-all ${
                              isActive ? 'bg-primary text-black shadow-md shadow-primary/40' : 'bg-white/5 text-white/50 group-hover:bg-white/10 group-hover:text-white'
                            }`}>
                              {sec.number}
                            </span>
                            <span className="line-clamp-1 text-[11px]">{sec.title}</span>
                          </span>
                          <ChevronRight size={13} className={`shrink-0 transition-transform ${isActive ? 'translate-x-0.5 text-primary' : 'opacity-0 group-hover:opacity-100'}`} />
                        </button>
                      );
                    })}
                </nav>

                {/* Footer CTA */}
                <div className="mt-3.5 pt-3 border-t border-white/10 text-center space-y-2 shrink-0">
                  <div className="text-[10px] text-white/40">Need privacy assistance?</div>
                  <a
                    href="mailto:vtagutech@gmail.com"
                    className="block w-full py-2 px-3 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-xs font-bold transition-all text-center shadow-lg shadow-primary/5"
                  >
                    Contact Grievance Officer
                  </a>
                </div>
              </div>
            </aside>

            {/* Document Content Column */}
            <div className="lg:col-span-8 space-y-8">

              {/* SECTION 1 */}
              <section id="section-1" className="scroll-mt-36 bg-[#130F22]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 transition-all hover:border-white/20 shadow-xl relative overflow-hidden">
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-black text-xl shrink-0">
                    1
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                      Information We Collect
                    </h2>
                    <p className="text-white/50 text-xs font-medium">Data collection practices across App and Service</p>
                  </div>
                </div>

                <p className="text-white/80 text-sm leading-relaxed mb-6">
                  We collect information to provide and improve our streaming and interactive services.
                </p>

                {/* Sub-sections cards */}
                <div className="space-y-6">
                  
                  {/* 1.A */}
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-primary/30 transition-all">
                    <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      A. Information You Provide to Us
                    </h3>
                    <ul className="space-y-3 text-sm text-white/70">
                      <li className="flex items-start gap-3">
                        <strong className="text-white shrink-0 min-w-[140px] font-semibold">Account Registration:</strong>
                        <span>When you create an account, we collect your name, email address, phone number, and password.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <strong className="text-white shrink-0 min-w-[140px] font-semibold">Payment Information:</strong>
                        <span>
                          If you subscribe to a premium plan (e.g., Pulse, Interactive Start), we collect payment details.
                          <div className="mt-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex items-start gap-2">
                            <CreditCard size={16} className="shrink-0 mt-0.5 text-amber-400" />
                            <span><strong>Important Security Note:</strong> VtagU does not store full credit card numbers or UPI PINs. This data is securely processed by our authorized payment gateways (e.g., Razorpay, Cashfree).</span>
                          </div>
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <strong className="text-white shrink-0 min-w-[140px] font-semibold">Communications:</strong>
                        <span>Information you provide when contacting customer support or our Grievance Officer.</span>
                      </li>
                    </ul>
                  </div>

                  {/* 1.B */}
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-primary/30 transition-all">
                    <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-accent" />
                      B. Information Collected Automatically (Device & Usage Data)
                    </h3>
                    <p className="text-xs text-white/50 mb-3">When you use the App, we automatically collect:</p>
                    <ul className="space-y-3 text-sm text-white/70">
                      <li className="flex items-start gap-3">
                        <strong className="text-white shrink-0 min-w-[140px] font-semibold">Device Information:</strong>
                        <span>Hardware model, operating system version, unique device identifiers (e.g., Android ID, Advertising ID), and mobile network information.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <strong className="text-white shrink-0 min-w-[140px] font-semibold">Log Data:</strong>
                        <span>IP address, browser type, app version, pages visited, time and date of access.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <strong className="text-white shrink-0 min-w-[140px] font-semibold">Usage & Interactive Data:</strong>
                        <span>We track your viewing history, search queries, and crucially, your interactive choices and branching paths during interactive movies (e.g., <em>Journey of Ashwin</em>). This data is essential for delivering the personalized narrative experience.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <strong className="text-white shrink-0 min-w-[140px] font-semibold">Location Information:</strong>
                        <span>We collect approximate location data (e.g., via IP address) to enforce regional licensing agreements (geo-blocking) and provide localized content (Tamil/Telugu).</span>
                      </li>
                    </ul>
                  </div>

                  {/* 1.C */}
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-primary/30 transition-all">
                    <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      C. Cookies and Tracking Technologies
                    </h3>
                    <p className="text-sm text-white/70 leading-relaxed">
                      We use cookies, web beacons, and similar tracking technologies to track activity on our Service and store certain information to enhance your user experience.
                    </p>
                  </div>

                </div>
              </section>

              {/* SECTION 2 */}
              <section id="section-2" className="scroll-mt-36 bg-[#130F22]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 transition-all hover:border-white/20 shadow-xl relative overflow-hidden">
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-black text-xl shrink-0">
                    2
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                      How We Use Your Information
                    </h2>
                    <p className="text-white/50 text-xs font-medium">Purposes for processing collected personal data</p>
                  </div>
                </div>

                <p className="text-white/80 text-sm leading-relaxed mb-6">
                  We use the collected data for the following legitimate business purposes:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] transition-all">
                    <div className="flex items-center gap-2 text-primary font-bold text-sm mb-1.5">
                      <Tv size={16} /> To Provide the Service
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed">
                      To create your account, process payments, and stream content seamlessly to your device.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] transition-all">
                    <div className="flex items-center gap-2 text-accent font-bold text-sm mb-1.5">
                      <Sparkles size={16} /> To Power Interactive Features
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed">
                      To process your real-time narrative choices and deliver the correct video branches without buffering.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] transition-all">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm mb-1.5">
                      <Globe size={16} /> To Personalize Content
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed">
                      To recommend K-Dramas, micro-dramas, or interactive movies based on your viewing history.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] transition-all">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-1.5">
                      <Mail size={16} /> To Communicate
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed">
                      To send administrative notices, subscription renewal reminders, security alerts, and promotional messages (you can opt-out of promotional emails).
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] transition-all">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-1.5">
                      <RefreshCw size={16} /> To Improve the App
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed">
                      To analyze usage trends, monitor app performance, fix bugs, and develop new features (e.g., Neural Dubbing enhancements).
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] transition-all">
                    <div className="flex items-center gap-2 text-rose-400 font-bold text-sm mb-1.5">
                      <ShieldCheck size={16} /> To Enforce Legal Terms
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed">
                      To prevent fraud, enforce our Terms of Service, and comply with legal obligations.
                    </p>
                  </div>

                </div>
              </section>

              {/* SECTION 3 */}
              <section id="section-3" className="scroll-mt-36 bg-[#130F22]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 transition-all hover:border-white/20 shadow-xl relative overflow-hidden">
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black text-xl shrink-0">
                    3
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                      How We Share Your Information
                    </h2>
                    <p className="text-white/50 text-xs font-medium">Data sharing protocols & zero data sales pledge</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-bold text-sm mb-6 flex items-center gap-3">
                  <ShieldCheck className="shrink-0 text-emerald-400" size={20} />
                  <span>We do NOT sell your personal data under any circumstances.</span>
                </div>

                <p className="text-white/80 text-sm leading-relaxed mb-4">
                  We may share your information in the following specific situations:
                </p>

                <ul className="space-y-4 text-sm text-white/70">
                  <li className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                    <strong className="text-white block font-semibold mb-1 text-base">Service Providers:</strong>
                    We share data with trusted third-party vendors who assist us in operating our platform, such as cloud hosting providers (e.g., BunnyCDN, AWS), payment processors, and analytics services. These parties are bound by strict confidentiality agreements and security protocols.
                  </li>

                  <li className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                    <strong className="text-white block font-semibold mb-1 text-base">Legal & Regulatory Compliance:</strong>
                    We may disclose your information if required to do so by law, court order, or government request (e.g., to the Ministry of Information and Broadcasting or law enforcement agencies in India).
                  </li>

                  <li className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                    <strong className="text-white block font-semibold mb-1 text-base">Business Transfers:</strong>
                    If VtagU is involved in a merger, acquisition, or sale of assets, your data may be transferred as part of that transaction with notice provided.
                  </li>
                </ul>
              </section>

              {/* SECTION 4 */}
              <section id="section-4" className="scroll-mt-36 bg-[#130F22]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 transition-all hover:border-white/20 shadow-xl relative overflow-hidden">
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black text-xl shrink-0">
                    4
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                      Data Security
                    </h2>
                    <p className="text-white/50 text-xs font-medium">Encryption standards and server protection</p>
                  </div>
                </div>

                <div className="space-y-4 text-sm text-white/80 leading-relaxed">
                  <p>
                    The security of your data is critical to us. We employ industry-standard security measures, including encryption (<strong className="text-white">SSL/TLS</strong>) for data transmission and secure servers, to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
                  </p>

                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                    <Lock className="text-primary shrink-0 mt-0.5" size={18} />
                    <p className="text-xs text-white/60">
                      While we employ state-of-the-art cryptographic safeguards, please note that no method of transmission over the Internet or electronic storage is 100% secure. We continuously upgrade our defenses to maintain robust protection.
                    </p>
                  </div>
                </div>
              </section>

              {/* SECTION 5 */}
              <section id="section-5" className="scroll-mt-36 bg-[#130F22]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 transition-all hover:border-white/20 shadow-xl relative overflow-hidden">
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-xl shrink-0">
                    5
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                      Your Data Rights <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">DPDP Act, 2023</span>
                    </h2>
                    <p className="text-white/50 text-xs font-medium">Statutory rights for Indian residents</p>
                  </div>
                </div>

                <p className="text-white/80 text-sm leading-relaxed mb-6">
                  If you are a resident of India, under the <strong className="text-white">Digital Personal Data Protection (DPDP) Act, 2023</strong>, you hold explicit rights regarding your personal data:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-emerald-500/30 transition-all">
                    <h3 className="font-bold text-white text-sm mb-1.5 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Right to Access
                    </h3>
                    <p className="text-xs text-white/70">You can request a summary of the personal data we hold about you.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-emerald-500/30 transition-all">
                    <h3 className="font-bold text-white text-sm mb-1.5 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Right to Correction
                    </h3>
                    <p className="text-xs text-white/70">You can request that we update or correct inaccurate data.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-emerald-500/30 transition-all">
                    <h3 className="font-bold text-white text-sm mb-1.5 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Right to Erasure (Right to be Forgotten)
                    </h3>
                    <p className="text-xs text-white/70">You can request the deletion of your personal data, subject to legal exceptions (e.g., tax compliance).</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-emerald-500/30 transition-all">
                    <h3 className="font-bold text-white text-sm mb-1.5 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Right to Grievance Redressal
                    </h3>
                    <p className="text-xs text-white/70">You have the right to register a complaint regarding data processing.</p>
                  </div>

                </div>

                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-xs text-white/80 flex items-center justify-between flex-wrap gap-3">
                  <span>To exercise any of these statutory rights, please reach out to our Grievance Officer.</span>
                  <a href="#section-8" onClick={(e) => { e.preventDefault(); scrollToSection('section-8'); }} className="px-3.5 py-1.5 rounded-xl bg-primary text-black font-bold hover:bg-primary/90 transition-colors">
                    Exercise Data Rights →
                  </a>
                </div>
              </section>

              {/* SECTION 6 */}
              <section id="section-6" className="scroll-mt-36 bg-[#130F22]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 transition-all hover:border-white/20 shadow-xl relative overflow-hidden">
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-black text-xl shrink-0">
                    6
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                      Children&apos;s Privacy & Parental Controls
                    </h2>
                    <p className="text-white/50 text-xs font-medium">Age ratings, minor protection & PIN features</p>
                  </div>
                </div>

                <div className="space-y-4 text-sm text-white/80 leading-relaxed">
                  <p>
                    VtagU Prime Time offers content with various age ratings (<strong className="text-white">U, U/A 7+, U/A 13+, U/A 16+, A</strong>). The Service is not directed to children under the age of 18 without parental consent.
                  </p>

                  <p>
                    We do not knowingly collect personal identifiable information from children. If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us immediately.
                  </p>

                  <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/30 text-white space-y-2">
                    <div className="flex items-center gap-2 font-bold text-purple-300 text-sm">
                      <Baby size={18} /> Recommended Feature for Parents
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed">
                      We strongly encourage parents and guardians to utilize the <strong className="text-white">Parental Control PIN</strong> feature within the App settings to restrict access to mature content and manage viewing safety.
                    </p>
                  </div>
                </div>
              </section>

              {/* SECTION 7 */}
              <section id="section-7" className="scroll-mt-36 bg-[#130F22]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 transition-all hover:border-white/20 shadow-xl relative overflow-hidden">
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-black text-xl shrink-0">
                    7
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                      Changes to This Privacy Policy
                    </h2>
                    <p className="text-white/50 text-xs font-medium">Policy updates & notification procedure</p>
                  </div>
                </div>

                <p className="text-sm text-white/80 leading-relaxed">
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;<strong className="text-white">Effective Date</strong>&quot; at the top. You are advised to review this Privacy Policy periodically for any changes.
                </p>
              </section>

              {/* SECTION 8 */}
              <section id="section-8" className="scroll-mt-36 bg-gradient-to-b from-[#1E1736] to-[#140F26] border border-primary/30 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[90px] pointer-events-none" />

                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-black text-xl shrink-0">
                    8
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                      Contact Us & Grievance Redressal
                    </h2>
                    <p className="text-white/60 text-xs font-medium">Official Grievance Officer details under IT Rules 2021</p>
                  </div>
                </div>

                <p className="text-white/80 text-sm leading-relaxed mb-6">
                  In compliance with the <strong className="text-white">Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021</strong>, we have appointed a dedicated Grievance Officer. If you have any questions about this Privacy Policy, wish to exercise your data rights, or have a complaint regarding content on our platform, please contact:
                </p>

                {/* Grievance Officer Details Card */}
                <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.04] border border-white/15 space-y-5 mb-6 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold">
                      <Shield size={20} />
                    </div>
                    <div>
                      <span className="text-xs uppercase font-extrabold tracking-wider text-primary block">Designated Officer</span>
                      <h3 className="text-lg font-black text-white">Maheshwaran P.</h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-sm">
                    <div className="flex items-start gap-3">
                      <Mail className="text-primary shrink-0 mt-1" size={18} />
                      <div>
                        <span className="text-xs text-white/50 block font-semibold">Email Address</span>
                        <a href="mailto:vtagutech@gmail.com" className="text-white font-bold hover:text-primary transition-colors underline">
                          vtagutech@gmail.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="text-primary shrink-0 mt-1" size={18} />
                      <div>
                        <span className="text-xs text-white/50 block font-semibold">Official Postal Address</span>
                        <address className="text-white/90 font-medium not-italic leading-relaxed">
                          49/2 Varatharajan Mudali Street, T. Nagar, Chennai, Tamil Nadu - 600017, India
                        </address>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SLA Banner */}
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-semibold flex items-center gap-3">
                  <Clock size={20} className="shrink-0 text-emerald-400" />
                  <span>
                    <strong>Resolution Commitment:</strong> We will acknowledge your complaint within <strong className="text-white">24 hours</strong> and strive to resolve it within <strong className="text-white">15 days</strong>.
                  </span>
                </div>

              </section>

              {/* Bottom Play Store Approval Guarantee Note */}
              <div className="print:hidden p-6 rounded-3xl bg-white/[0.02] border border-white/10 text-center space-y-3">
                <p className="text-xs text-white/40">
                  This page serves as the official Privacy Policy URL for <strong className="text-white/60">VtagU Prime Time</strong> registered on Google Play Console and the official website www.vtagu.in.
                </p>
                <div className="flex justify-center gap-4 text-xs font-semibold text-white/60">
                  <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
                  <span>•</span>
                  <Link href="/faqs" className="hover:text-primary transition-colors">Help Center / FAQs</Link>
                  <span>•</span>
                  <a href="mailto:vtagutech@gmail.com" className="hover:text-primary transition-colors">Support Email</a>
                </div>
              </div>

            </div>

          </div>

        </main>
      </div>
    </>
  );
}
