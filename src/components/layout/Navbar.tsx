'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, User, Menu, X, Heart, Plus, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch (_) {}
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    window.location.reload();
  };

  const categories = [
    { name: 'Women', href: '/category/women' },
    { name: 'Men', href: '/category/men' },
    { name: 'Home & Living', href: '/category/home-living' },
    { name: 'Ethnic Crafts', href: '/category/ethnic' },
    { name: 'Sale', href: '/sale' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200">
      {/* Top Banner */}
      <div className="bg-zinc-900 text-white text-center text-xs py-2 px-4 font-medium tracking-wide">
        🌟 Complimentary shipping on all lifestyle orders over ₹2,499. Use code <span className="font-bold underline">AMBAFIRST</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-2xl font-black tracking-widest text-zinc-900 uppercase">
              AMBA
            </span>
            <span className="text-xs tracking-widest font-sans font-light text-amber-600 uppercase">
              LIFESTYLE
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Search bar */}
          <div className="relative hidden lg:block w-56">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search handcrafted..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-zinc-100 border border-transparent rounded-full focus:outline-none focus:border-zinc-400 text-zinc-900"
            />
          </div>

          <button className="p-2 text-zinc-700 hover:bg-zinc-100 rounded-full transition-colors">
            <Heart className="w-5 h-5" />
          </button>

          <button className="relative p-2 text-zinc-700 hover:bg-zinc-100 rounded-full transition-colors">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-amber-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
              2
            </span>
          </button>

          <Link href="/add-product">
            <Button size="sm" className="hidden sm:inline-flex gap-1.5 bg-amber-700 hover:bg-amber-800 text-white shadow-xs text-xs">
              <Plus className="w-3.5 h-3.5" /> Submit Craft
            </Button>
          </Link>

          {currentUser ? (
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-zinc-200">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center border border-amber-300">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-semibold text-zinc-800 max-w-24 truncate">
                  {currentUser.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link href="/login">
              <Button size="sm" variant="outline" className="hidden sm:inline-flex gap-2">
                <User className="w-4 h-4" /> Sign In
              </Button>
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-700"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 bg-white px-4 py-4 space-y-3">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-zinc-800 py-2"
            >
              {cat.name}
            </Link>
          ))}
          <div className="pt-2 border-t border-zinc-200">
            <Link href="/login">
              <Button size="sm" className="w-full">Sign In / Register</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
