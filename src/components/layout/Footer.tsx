import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, RotateCcw, Award, Globe, HelpCircle, FileText, CheckCircle2 } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-stone-900 text-zinc-400 border-t border-zinc-800 text-xs">
      {/* 1. Alibaba Global Trust Strip */}
      <div className="border-b border-zinc-800 py-6 bg-stone-950">
        <div className="w-full px-4 sm:px-8 lg:px-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-zinc-300">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-blue-400 shrink-0" />
            <div>
              <p className="font-bold text-white text-xs">Amba Trade Assurance</p>
              <p className="text-[11px] text-zinc-400">Escrow payment & quality protection</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-blue-400 shrink-0" />
            <div>
              <p className="font-bold text-white text-xs">Verified Artisan Looms</p>
              <p className="text-[11px] text-zinc-400">100% Craftmark & Handloom certified</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Truck className="w-6 h-6 text-blue-400 shrink-0" />
            <div>
              <p className="font-bold text-white text-xs">Insured Express Logistics</p>
              <p className="text-[11px] text-zinc-400">Doorstep Pan-India air tracking</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <RotateCcw className="w-6 h-6 text-blue-400 shrink-0" />
            <div>
              <p className="font-bold text-white text-xs">7-Day Return Guarantee</p>
              <p className="text-[11px] text-zinc-400">Hassle-free replacement & refund</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Alibaba Multi-column Footer */}
      <div className="w-full px-4 sm:px-8 lg:px-12 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Col 1: Brand & Slogan */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-900 text-white flex items-center justify-center font-serif font-black text-lg">
              A
            </div>
            <span className="font-serif text-xl font-black tracking-tight text-white uppercase">
              AMBA<span className="text-blue-400">.COM</span>
            </span>
          </div>
          <p className="text-zinc-400 text-xs leading-relaxed">
            India's leading artisanal B2B and retail marketplace. Connecting conscious global patrons directly with authentic master craftspeople and weavers.
          </p>
          <div className="text-[11px] text-zinc-500">
            Certified by Handloom Board & Craftmark India.
          </div>
        </div>

        {/* Col 2: Sourcing on Amba */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3.5">
            Sourcing on Amba
          </h4>
          <ul className="space-y-2 text-xs">
            <li><a href="/#categories" className="hover:text-blue-300 transition-colors">All Craft Categories</a></li>
            <li><a href="/#rfq" className="hover:text-blue-300 transition-colors">Request for Quotation (RFQ)</a></li>
            <li><a href="/#ready-to-ship" className="hover:text-blue-300 transition-colors">Ready to Ship Inventory</a></li>
            <li><a href="/#customized" className="hover:text-blue-300 transition-colors">Customized Artisan OEM/ODM</a></li>
            <li><a href="/#pavilions" className="hover:text-blue-300 transition-colors">Regional Craft Pavilions</a></li>
          </ul>
        </div>

        {/* Col 3: Trade & Protection */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3.5">
            Trade & Security
          </h4>
          <ul className="space-y-2 text-xs">
            <li><a href="/#trade-assurance" className="hover:text-blue-300 transition-colors">Trade Assurance Guarantee</a></li>
            <li><Link href="/product/preview" className="hover:text-blue-300 transition-colors">Escrow Payment Protection</Link></li>
            <li><a href="/#trade-assurance" className="hover:text-blue-300 transition-colors">Pre-shipment Inspection</a></li>
            <li><a href="/#trade-assurance" className="hover:text-blue-300 transition-colors">Logistics & Tracking</a></li>
            <li><a href="/#trade-assurance" className="hover:text-blue-300 transition-colors">Dispute & Refund Policy</a></li>
          </ul>
        </div>

        {/* Col 4: Sell with Us (Vendor Partner) */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3.5">
            Sell on Amba
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <a
                href="http://localhost:3002"
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:text-blue-300 font-bold"
              >
                Artisan Vendor Portal &rarr;
              </a>
            </li>
            <li><Link href="/add-product" className="hover:text-blue-300 transition-colors">Submit Product for Review</Link></li>
            <li><a href="http://localhost:3002" target="_blank" rel="noreferrer" className="hover:text-blue-300 transition-colors">Verified Supplier Accreditations</a></li>
            <li><a href="http://localhost:3002" target="_blank" rel="noreferrer" className="hover:text-blue-300 transition-colors">Direct Payouts & Banking</a></li>
          </ul>
        </div>

        {/* Col 5: Customer Care & App */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3.5">
            Buyer Care & Concierge
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/contact" className="text-blue-400 hover:text-blue-300 font-bold">Contact Us & Concierge Desk &rarr;</Link></li>
            <li><Link href="/login" className="hover:text-blue-300 transition-colors">Buyer Account Sign In</Link></li>
            <li><Link href="/register" className="hover:text-blue-300 transition-colors">Join as Registered Buyer</Link></li>
            <li><span className="text-zinc-500">Concierge Desk: contact@ambalifestyle.com</span></li>
            <li><span className="text-zinc-500">Toll Free: 1800-AMBA-INDIA</span></li>
            <li className="pt-2 text-blue-400 font-bold">Fast Pan-India Delivery via Blue Dart Air</li>
          </ul>
        </div>
      </div>

      {/* 3. Bottom Legal & Copyright Bar */}
      <div className="border-t border-zinc-800 py-6 text-center text-zinc-500 text-[11px]">
        <div className="w-full px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>&copy; 2026 Amba Lifestyle Marketplace Private Limited. Alibaba-inspired Architecture. All rights reserved.</p>
          <div className="flex items-center gap-4 text-zinc-400">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span>&bull;</span>
            <span className="hover:text-white cursor-pointer">Terms of Sourcing</span>
            <span>&bull;</span>
            <span className="hover:text-white cursor-pointer">Intellectual Property Rights</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
