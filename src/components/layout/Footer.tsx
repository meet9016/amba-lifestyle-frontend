import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-zinc-50 text-zinc-600 border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold tracking-widest text-zinc-900 uppercase">AMBA</span>
            <span className="text-xs tracking-widest font-sans font-semibold text-amber-600 uppercase">LIFESTYLE</span>
          </div>
          <p className="text-sm text-zinc-500">
            Curated handcrafted lifestyle, ethnic apparel, artisanal home décor, and organic living essentials.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900 mb-4">Shop Collections</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/category/women" className="hover:text-zinc-900 transition-colors">Women's Ethnic & Fusion</Link></li>
            <li><Link href="/category/men" className="hover:text-zinc-900 transition-colors">Men's Handloom Kurtas</Link></li>
            <li><Link href="/category/home-living" className="hover:text-zinc-900 transition-colors">Artisanal Home & Living</Link></li>
            <li><Link href="/category/crafts" className="hover:text-zinc-900 transition-colors">Indian Handcrafts</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900 mb-4">Customer Care</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/orders" className="hover:text-zinc-900 transition-colors">Track Your Order</Link></li>
            <li><Link href="/shipping" className="hover:text-zinc-900 transition-colors">Shipping & Delivery</Link></li>
            <li><Link href="/returns" className="hover:text-zinc-900 transition-colors">Returns & Exchange</Link></li>
            <li><Link href="/contact" className="hover:text-zinc-900 transition-colors">Contact Support</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900 mb-4">Become a Vendor</h4>
          <p className="text-sm text-zinc-500 mb-3">
            Are you an artisan or designer? Partner with Amba Lifestyle and showcase your crafts to thousands of patrons.
          </p>
          <a
            href="http://localhost:3002"
            target="_blank"
            rel="noreferrer"
            className="inline-block text-xs font-semibold text-amber-600 hover:text-amber-700 underline"
          >
            Visit Vendor Portal &rarr;
          </a>
        </div>
      </div>

      <div className="border-t border-zinc-200 py-6 text-center text-xs text-zinc-500">
        &copy; 2026 Amba Lifestyle Private Limited. All rights reserved.
      </div>
    </footer>
  );
};
