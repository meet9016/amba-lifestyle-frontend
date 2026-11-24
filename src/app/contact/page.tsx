'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  Phone,
  MessageCircle,
  UserCheck,
  Sparkles,
  Send,
  CheckCircle2,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'Bulk Sourcing & B2B Inquiry',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate inquiry submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col font-sans">
      {/* 1. TOP BRAND NAVIGATION BAR (MATCHES PAGE.TSX) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-blue-200/60 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-blue-900 flex items-center justify-center text-white font-serif font-black text-xl shadow-md shadow-blue-900/20">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-black tracking-tight text-zinc-900 group-hover:text-blue-900 transition-colors">
                  AMBA LIFESTYLE
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full border border-blue-200">
                  Customer Portal
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 font-medium">Custom Craft & Manufacturing Requirements</p>
            </div>
          </Link>

          {/* Quick navigation links (Commented out redirect buttons) */}
          {/*
          <div className="flex items-center gap-2 sm:gap-4 text-xs font-bold">
            <Link
              href="/"
              className="hidden sm:inline-flex px-3.5 py-1.5 rounded-xl text-zinc-700 hover:text-blue-900 hover:bg-blue-50 transition-colors"
            >
              Artisan Catalog
            </Link>
            <Link
              href="/orders"
              className="px-3.5 py-1.5 rounded-xl text-zinc-700 hover:text-blue-900 hover:bg-blue-50 transition-colors"
            >
              Track Inquiries
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 rounded-full bg-blue-900 hover:bg-blue-950 text-white font-bold shadow-xs transition-all active:scale-95"
            >
              Sign In
            </Link>
          </div>
          */}
        </div>
      </header>

      {/* 2. MAIN CONTACT SECTIONS CONTAINER */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-12 space-y-8 sm:space-y-10">
        {/* ======================================================== */}
        {/* SECTION 1: HERO HEADER                                    */}
        {/* ======================================================== */}
        <section className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-900 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-900" />
            <span>Talk to the Amba Lifestyle Team</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-zinc-900 tracking-tight font-serif">
            We&apos;d love to hear from you
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-2xl mx-auto pt-1">
            Let&apos;s talk. Book a live craft demo, ask about custom bulk pricing, or get help with your artisan inquiry or account. Pick whichever way suits you best.
          </p>
        </section>

        {/* ======================================================== */}
        {/* SECTION 2: 4 CONTACT OPTION CARDS (DARK BLUE & WHITE)     */}
        {/* ======================================================== */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CARD 1: EMAIL */}
          <div className="bg-white rounded-3xl p-7 border border-zinc-200/80 shadow-md shadow-zinc-200/40 flex flex-col justify-between space-y-5 hover:border-blue-900 transition-all group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-900 border border-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900">Email us</h3>
                <a
                  href="mailto:contact@ambalifestyle.com"
                  className="text-sm font-semibold text-blue-900 hover:underline block mt-0.5"
                >
                  contact@ambalifestyle.com
                </a>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                For support, billing, custom artisan requirements, bulk sourcing and vendor partnerships.
              </p>
            </div>
            <div>
              <a
                href="mailto:contact@ambalifestyle.com"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold transition-all shadow-xs"
              >
                <span>Write an email</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* CARD 2: WHATSAPP */}
          <div className="bg-white rounded-3xl p-7 border border-zinc-200/80 shadow-md shadow-zinc-200/40 flex flex-col justify-between space-y-5 hover:border-blue-900 transition-all group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-900 border border-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900">Chat on WhatsApp</h3>
                <a
                  href="https://wa.me/919727155011"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-blue-900 hover:underline block mt-0.5"
                >
                  +91 97271 55011
                </a>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Message us for a quick answer, fabric swatch photos, or to check real-time order status.
              </p>
            </div>
            <div>
              <a
                href="https://wa.me/919727155011"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold transition-all shadow-xs"
              >
                <span>Open WhatsApp</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* CARD 3: EXISTING USER SUPPORT & TICKETS */}
          <div className="bg-white rounded-3xl p-7 border border-zinc-200/80 shadow-md shadow-zinc-200/40 flex flex-col justify-between space-y-5 hover:border-blue-900 transition-all group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-900 border border-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900">Already on Amba lifestyle?</h3>
                <span className="text-sm font-semibold text-zinc-700 block mt-0.5">
                  Raise a support ticket &amp; track inquiries
                </span>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Log in and track requirements, view artisan quotes, or raise a ticket for custom orders. Our concierge team will review it and get back to you.
              </p>
            </div>
            {/* Redirect buttons commented out as requested */}
            {/*
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold transition-all shadow-xs"
              >
                <span>Log in to Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/orders"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-50 text-xs font-bold transition-colors"
              >
                <span>Track Inquiries</span>
              </Link>
            </div>
            */}
          </div>

          {/* CARD 4: LIVE ARTISAN DEMO */}
          <div className="bg-white rounded-3xl p-7 border border-zinc-200/80 shadow-md shadow-zinc-200/40 flex flex-col justify-between space-y-5 hover:border-blue-900 transition-all group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-900 border border-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900">Want a demo?</h3>
                <a
                  href="https://wa.me/917573937757"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-blue-900 hover:underline block mt-0.5"
                >
                  +91 75739 37757
                </a>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                If you want a demo or a live artisan loom walkthrough, WhatsApp us on the number below and we will set it up for you.
              </p>
            </div>
            <div>
              <a
                href="https://wa.me/917573937757"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold transition-all shadow-xs"
              >
                <span>WhatsApp us for a demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 3: DIRECT INQUIRY & CONTACT FORM                  */}
        {/* ======================================================== */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-zinc-200/80 shadow-xl shadow-zinc-200/50">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="border-b border-zinc-100 pb-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-900 mb-1">
                <Send className="w-3.5 h-3.5 text-blue-900" />
                <span>Online Inquiry Desk</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-zinc-900">
                Send us a direct message
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Have a bulk order request, custom artisanal requirement, or platform query? Fill in the details below and we&apos;ll get back to you within 24 hours.
              </p>
            </div>

            {isSubmitted ? (
              <div className="p-8 bg-blue-50 border border-blue-200 rounded-2xl text-center space-y-3 animate-fadeIn">
                <div className="w-14 h-14 bg-blue-900 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900">Message Received!</h3>
                <p className="text-xs text-zinc-600 max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out to Amba Lifestyle. Our artisanal concierge team will review your inquiry and contact you at <strong className="text-blue-900 font-semibold">{formData.email}</strong> shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', category: 'Bulk Sourcing & B2B Inquiry', message: '' });
                  }}
                  className="mt-3 px-5 py-2 bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-1.5">
                      Your Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Patel"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm bg-white border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900 font-medium text-zinc-900 placeholder:text-zinc-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-1.5">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. ramesh@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm bg-white border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900 font-medium text-zinc-900 placeholder:text-zinc-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-1.5">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm bg-white border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900 font-medium text-zinc-900 placeholder:text-zinc-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-1.5">
                      Inquiry Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm bg-white border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900 font-medium text-zinc-900 cursor-pointer"
                    >
                      <option value="Bulk Sourcing & B2B Inquiry">Bulk Sourcing &amp; B2B Inquiry</option>
                      <option value="Custom Handcrafted Requirement">Custom Handcrafted Requirement</option>
                      <option value="Artisan Guild & Vendor Onboarding">Artisan Guild &amp; Vendor Onboarding</option>
                      <option value="Order Tracking & Support">Order Tracking &amp; Support</option>
                      <option value="Platform Demo Request">Platform Demo Request</option>
                      <option value="Other Inquiries">Other Inquiries</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-1.5">
                    Your Message / Requirements <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about the products, quantities, craft techniques, or questions you have..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-3 text-sm bg-white border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900 font-medium text-zinc-900 placeholder:text-zinc-400"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                    <ShieldCheck className="w-4 h-4 text-blue-900 shrink-0" />
                    <span>100% verified &amp; secure artisanal communication</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-7 py-3 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Inquiry</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 4: QUICK ANSWERS BANNER                           */}
        {/* ======================================================== */}
        <section className="bg-blue-50/70 border border-blue-200/80 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-base font-bold text-zinc-900 flex items-center justify-center md:justify-start gap-2">
              <HelpCircle className="w-5 h-5 text-blue-900" />
              <span>Looking for a quick answer?</span>
            </h4>
            <p className="text-xs text-zinc-600 max-w-xl leading-relaxed">
              Most questions about artisan verification, custom orders, bulk quotes, and pan-India insured shipping are already answered.
            </p>
          </div>
          {/* Quick links commented out as requested */}
          {/*
          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              href="/"
              className="px-4 py-2 rounded-xl bg-white border border-zinc-200 hover:border-blue-900 text-blue-900 text-xs font-bold shadow-2xs hover:shadow-xs transition-all"
            >
              Artisan Catalog &rarr;
            </Link>
            <Link
              href="/orders"
              className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold shadow-xs transition-all"
            >
              Track Inquiries &rarr;
            </Link>
          </div>
          */}
        </section>
      </main>

      {/* 4. FOOTER (EXACTLY MATCHES PAGE.TSX) */}
      <footer className="mt-auto bg-stone-900 text-zinc-400 py-8 border-t border-zinc-800 text-xs text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          <p className="font-serif font-bold text-white text-sm tracking-wider uppercase">
            AMBA LIFESTYLE PLATFORM
          </p>
          <p className="text-zinc-500 text-[11px]">
            Master Craftsmen & Custom Artisan Production • Protected by OTP Email Verification
          </p>
          <div className="flex items-center justify-center pt-2 text-xs">
            <Link href="/contact" className="text-white hover:underline font-bold transition-colors">Contact Us</Link>
          </div>
          <p className="text-zinc-600 text-[10px] pt-2">
            © 2026 Amba Lifestyle. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
