'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { apiClient, API_ENDPOINTS } from '@/lib/api';
import {
  Search,
  User,
  Menu,
  X,
  Globe,
  Camera,
  FileText,
  ShoppingBag,
  ExternalLink,
  Sparkles,
  LogOut,
  ChevronRight,
  Flame,
  Check
} from 'lucide-react';

interface CategoryItem {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  icon?: string;
  subcategoriesCount?: number;
}

interface SubcategoryItem {
  _id: string;
  name: string;
  slug?: string;
  categoryId?: string;
  categoryName?: string;
  image?: string;
  description?: string;
}

const getCategoryIcon = (name: string): string => {
  const lower = name.toLowerCase();
  if (lower.includes('jewel') || lower.includes('silver')) return '💎';
  if (lower.includes('ethnic') || lower.includes('wear') || lower.includes('apparel')) return '👗';
  if (lower.includes('men')) return '👕';
  if (lower.includes('pottery') || lower.includes('craft')) return '🏺';
  if (lower.includes('home') || lower.includes('decor')) return '🏠';
  if (lower.includes('living') || lower.includes('rug')) return '🛋️';
  if (lower.includes('electr')) return '💻';
  return '✨';
};

const getSubcategoryImage = (sub: SubcategoryItem): string => {
  if (sub.image && sub.image.startsWith('http')) return sub.image;
  const lower = (sub.name + ' ' + (sub.categoryName || '')).toLowerCase();
  if (lower.includes('saree') || lower.includes('handloom')) return 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80';
  if (lower.includes('kundan') || lower.includes('necklace') || lower.includes('jewel')) return 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80';
  if (lower.includes('bangle') || lower.includes('silver')) return 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=300&q=80';
  if (lower.includes('lehenga') || lower.includes('kurti')) return 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=300&q=80';
  if (lower.includes('kurta') || lower.includes('men')) return 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=300&q=80';
  if (lower.includes('pottery') || lower.includes('ceramic')) return 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=300&q=80';
  if (lower.includes('rug') || lower.includes('carpet')) return 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=300&q=80';
  if (lower.includes('metal') || lower.includes('brass')) return 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=300&q=80';
  return 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=300&q=80';
};

interface NavbarProps {
  onSearch?: (query: string, mode: string) => void;
  activeMode?: string;
  onModeChange?: (mode: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSearch,
  activeMode = 'Products',
  onModeChange
}) => {
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);
  const [selectedMode, setSelectedMode] = useState(activeMode);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mega-menu "All categories" state
  const [isAllCategoriesOpen, setIsAllCategoriesOpen] = useState(false);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState('all');
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoryItem[]>([]);

  // Hidden file inputs for "Image Search" and "Search with File"
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch (_) {}
  }, []);

  // Close mega menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target as Node)) {
        setIsAllCategoriesOpen(false);
      }
    };
    if (isAllCategoriesOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAllCategoriesOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    window.location.reload();
  };

  const handleModeClick = (mode: string) => {
    setSelectedMode(mode);
    if (onModeChange) onModeChange(mode);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery, selectedMode);
    } else {
      window.location.href = `/?search=${encodeURIComponent(searchQuery)}&mode=${selectedMode}`;
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      alert(`Image Search: Uploaded "${file.name}". Matching verified artisan suppliers...`);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      alert(`Search with File: Uploaded BOM / specification file "${file.name}". Analyzing requirements...`);
    }
  };

  // Fetch dynamic categories and subcategories from backend
  useEffect(() => {
    const fetchTaxonomy = async () => {
      try {
        const [catsRes, subsRes] = await Promise.all([
          apiClient.get(API_ENDPOINTS.CATEGORIES.LIST),
          apiClient.get(API_ENDPOINTS.SUBCATEGORIES.LIST)
        ]);
        if (catsRes.data?.data) {
          setCategories(catsRes.data.data);
        }
        if (subsRes.data?.data) {
          setSubcategories(subsRes.data.data);
        }
      } catch (_) {}
    };
    fetchTaxonomy();
  }, []);

  return (
    <header className="relative bg-white border-b border-zinc-200/80 shadow-2xs z-50">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={imageInputRef}
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      <div className="w-full px-4 sm:px-8 lg:px-12 pt-3 pb-5 space-y-3">
        {/* ========================================================= */}
        {/* ROW 1: Logo & Utility Icons (Deliver to, Language, Cart, Auth) */}
        {/* ========================================================= */}
        <div className="flex items-center justify-between gap-4">
          {/* Logo on Left */}
          <Link href="/" className="flex items-center gap-1.5 shrink-0 group">
            <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-serif font-black text-xl italic shadow-xs">
              a
            </div>
            <span className="font-serif text-2xl sm:text-3xl font-black tracking-tight text-blue-900 uppercase leading-none">
              amba<span className="font-sans text-xl sm:text-2xl font-bold text-zinc-900">.com</span>
            </span>
          </Link>

          {/* Right Utilities */}
          <div className="flex items-center gap-4 sm:gap-6 text-xs text-zinc-700">
            {/* Deliver to: IN */}
            <div className="hidden sm:flex flex-col text-left leading-tight cursor-pointer hover:text-blue-900">
              <span className="text-[10px] text-zinc-400">Deliver to:</span>
              <div className="flex items-center gap-1 font-bold text-zinc-900 text-xs">
                <span className="text-sm">🇮🇳</span>
                <span>IN</span>
              </div>
            </div>

            {/* Language & Currency */}
            <div className="hidden md:flex items-center gap-1.5 cursor-pointer hover:text-blue-900 font-medium">
              <Globe className="w-4 h-4 text-zinc-500" />
              <span>English-INR</span>
            </div>

            {/* My Orders / Track Orders */}
            <Link
              href="/orders"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-900 hover:bg-blue-100 font-bold text-xs transition-colors"
              title="My Orders & Tracking"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">My Orders</span>
            </Link>

            {/* User Auth */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-zinc-200">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-900 font-bold text-xs flex items-center justify-center border border-blue-200">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-bold text-zinc-900 hidden lg:inline max-w-28 truncate text-xs">
                  {currentUser.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="p-1 text-zinc-400 hover:text-rose-600 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="hidden sm:flex items-center gap-1.5 font-bold text-zinc-800 hover:text-blue-900 transition-colors"
                >
                  <User className="w-4 h-4 text-zinc-600" />
                  <span>Sign in</span>
                </Link>

                <Link
                  href="/register"
                  className="px-4 py-2 rounded-full bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
                >
                  Create account
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1 text-zinc-700 hover:bg-zinc-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* ROW 2: Sub-Nav Links (With Active "All categories" Trigger)*/}
        {/* ========================================================= */}
        <div className="hidden md:flex items-center justify-between text-xs text-zinc-600 pt-1 pb-2">
          {/* Left sub-links with Highlighted "All categories" Button */}
          <div
            className="relative flex items-center gap-5 font-medium"
            onMouseEnter={() => setIsAllCategoriesOpen(true)}
          >
            <button
              type="button"
              onClick={() => setIsAllCategoriesOpen(!isAllCategoriesOpen)}
              className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg border transition-all ${
                isAllCategoriesOpen
                  ? 'border-zinc-800 bg-zinc-100 text-zinc-900 font-bold shadow-xs'
                  : 'border-zinc-300 hover:border-zinc-800 text-zinc-900 font-bold hover:bg-zinc-50'
              }`}
            >
              <Menu className="w-3.5 h-3.5 text-zinc-900" />
              <span>All categories</span>
            </button>

            <a href="#feed" className="hover:text-blue-900 transition-colors">
              Verified manufacturers
            </a>
            <a href="#feed" className="hover:text-blue-900 transition-colors">
              Dropshipping
            </a>
          </div>

          {/* Right sub-links */}
          <div className="flex items-center gap-5">
            <a href="#feed" className="hover:text-blue-900 transition-colors">
              About Alibaba.com
            </a>
            <a href="#feed" className="hover:text-blue-900 transition-colors">
              Help Center
            </a>
            <a href="#feed" className="hover:text-blue-900 transition-colors">
              Accio Work
            </a>
            <a
              href="http://localhost:3002"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-900 transition-colors font-medium"
            >
              Sell on Alibaba.com
            </a>
          </div>
        </div>

        {/* ========================================================= */}
        {/* ROW 3: Centered Sourcing Mode Tabs                        */}
        {/* ========================================================= */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 pt-2 text-sm sm:text-base font-bold">
          <button
            type="button"
            onClick={() => handleModeClick('AI Mode')}
            className={`flex items-center gap-1 transition-colors ${
              selectedMode === 'AI Mode' ? 'text-blue-900' : 'text-zinc-900 hover:text-blue-900'
            }`}
          >
            <span>AI Mode</span>
            <span className="text-[10px] text-blue-900 font-black -mt-2">✨</span>
          </button>

          <span className="text-zinc-300 font-light">|</span>

          <button
            type="button"
            onClick={() => handleModeClick('Products')}
            className="relative transition-colors"
          >
            <span
              className={`text-base sm:text-lg font-black ${
                selectedMode === 'Products' ? 'text-blue-900' : 'text-zinc-900 hover:text-blue-900'
              }`}
            >
              Products
            </span>
            {selectedMode === 'Products' && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-900 rounded-full"></span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleModeClick('Manufacturers')}
            className={`transition-colors ${
              selectedMode === 'Manufacturers' ? 'text-blue-900' : 'text-zinc-900 hover:text-blue-900'
            }`}
          >
            Manufacturers
          </button>

          <button
            type="button"
            onClick={() => handleModeClick('Worldwide')}
            className={`transition-colors ${
              selectedMode === 'Worldwide' ? 'text-blue-900' : 'text-zinc-900 hover:text-blue-900'
            }`}
          >
            Worldwide
          </button>
        </div>

        {/* ========================================================= */}
        {/* ROW 4: MASSIVE ALIBABA SEARCH BOX                         */}
        {/* ========================================================= */}
        <div className="max-w-4xl mx-auto w-full pt-1">
          <form
            onSubmit={handleSearchSubmit}
            className="w-full border-2 border-blue-900 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 bg-white shadow-xs focus-within:shadow-md focus-within:ring-2 focus-within:ring-blue-100 transition-all flex flex-col justify-between min-h-[96px]"
          >
            <input
              type="text"
              placeholder="squishy toys"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-sm sm:text-base text-zinc-900 placeholder:text-zinc-400 focus:outline-none bg-transparent font-normal"
            />

            <div className="flex items-center justify-between pt-2.5">
              <div className="flex items-center gap-3 text-xs font-semibold text-zinc-700">
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="flex items-center gap-1.5 hover:text-blue-900 transition-colors"
                >
                  <Camera className="w-4 h-4 text-zinc-600" />
                  <span>Image Search</span>
                </button>

                <span className="text-zinc-300 font-light">|</span>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 hover:text-blue-900 transition-colors"
                >
                  <FileText className="w-4 h-4 text-zinc-600" />
                  <span>Search with File</span>
                </button>
              </div>

              <button
                type="submit"
                className="px-6 sm:px-8 py-2 rounded-full bg-blue-900 hover:bg-blue-950 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5. EXACT ALIBABA MEGA MENU FOR "ALL CATEGORIES"           */}
      {/* (Directly opens below navbar matching uploaded screenshot) */}
      {/* ========================================================= */}
      {isAllCategoriesOpen && (
        <div
          ref={megaMenuRef}
          onMouseLeave={() => setIsAllCategoriesOpen(false)}
          className="absolute top-full left-0 right-0 w-full bg-white border-t border-b border-zinc-200 shadow-2xl z-50 animate-in fade-in-50 duration-150"
        >
          <div className="w-full flex items-stretch h-[540px]">
            {/* LEFT SIDEBAR: Category Navigation List (~240px) */}
            <div className="w-60 sm:w-68 shrink-0 bg-white border-r border-zinc-200/90 py-3 overflow-y-auto">
              <div className="space-y-0.5 px-2">
                <button
                  onClick={() => setSelectedCategoryTab('all')}
                  className={`w-full flex items-center justify-between py-2 px-3 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                    selectedCategoryTab === 'all'
                      ? 'bg-zinc-100 font-bold text-zinc-950'
                      : 'text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-sm">⭐</span>
                    <span className="truncate">Categories for you</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 text-zinc-400 shrink-0 ${selectedCategoryTab === 'all' ? 'text-zinc-900' : ''}`} />
                </button>

                {categories.map((cat) => {
                  const isActive = selectedCategoryTab === cat._id;
                  return (
                    <button
                      key={cat._id}
                      onClick={() => setSelectedCategoryTab(cat._id)}
                      className={`w-full flex items-center justify-between py-2 px-3 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-zinc-100 font-bold text-zinc-950'
                          : 'text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="text-sm">{getCategoryIcon(cat.name)}</span>
                        <span className="truncate">{cat.name}</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 text-zinc-400 shrink-0 ${isActive ? 'text-zinc-900' : ''}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RIGHT MAIN AREA: Dynamic Subcategories Grid with Circular Avatars */}
            <div className="flex-1 bg-white p-6 sm:p-8 overflow-y-auto space-y-8">
              {selectedCategoryTab === 'all' ? (
                // Grouped by all categories
                categories.map((cat) => {
                  const catSubs = subcategories.filter(
                    (s) =>
                      String(s.categoryId) === String(cat._id) ||
                      (s.categoryName && s.categoryName.toLowerCase() === cat.name.toLowerCase())
                  );
                  if (catSubs.length === 0) return null;

                  return (
                    <div key={cat._id} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Link
                          href={`/?category=${encodeURIComponent(cat.name)}#feed`}
                          onClick={() => setIsAllCategoriesOpen(false)}
                          className="text-sm sm:text-base font-bold text-zinc-900 hover:text-blue-900 flex items-center gap-2"
                        >
                          <span>{getCategoryIcon(cat.name)}</span>
                          <span>{cat.name}</span>
                        </Link>
                        <Link
                          href={`/?category=${encodeURIComponent(cat.name)}#feed`}
                          onClick={() => setIsAllCategoriesOpen(false)}
                          className="text-xs text-zinc-500 hover:text-blue-900 hover:underline"
                        >
                          Browse all in {cat.name} &rarr;
                        </Link>
                      </div>

                      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-7 gap-4 sm:gap-6">
                        {catSubs.map((sub) => (
                          <Link
                            key={sub._id}
                            href={`/?category=${encodeURIComponent(cat.name)}&subcategory=${encodeURIComponent(sub.name)}#feed`}
                            onClick={() => setIsAllCategoriesOpen(false)}
                            className="group flex flex-col items-center text-center cursor-pointer"
                          >
                            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-zinc-100 border border-zinc-200/80 overflow-hidden flex items-center justify-center group-hover:scale-105 group-hover:border-blue-900 transition-all shadow-2xs">
                              <img
                                src={getSubcategoryImage(sub)}
                                alt={sub.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <p className="text-xs text-zinc-800 text-center font-medium mt-2 leading-tight group-hover:text-blue-900 transition-colors line-clamp-2 max-w-20">
                              {sub.name}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })
              ) : (
                // Specific category view
                (() => {
                  const activeCat = categories.find((c) => c._id === selectedCategoryTab);
                  if (!activeCat) return null;
                  const catSubs = subcategories.filter(
                    (s) =>
                      String(s.categoryId) === String(activeCat._id) ||
                      (s.categoryName && s.categoryName.toLowerCase() === activeCat.name.toLowerCase())
                  );

                  return (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-zinc-900 flex items-center gap-2">
                            <span>{getCategoryIcon(activeCat.name)}</span>
                            <span>{activeCat.name}</span>
                          </h3>
                          {activeCat.description && (
                            <p className="text-xs text-zinc-500 mt-0.5">{activeCat.description}</p>
                          )}
                        </div>
                        <Link
                          href={`/?category=${encodeURIComponent(activeCat.name)}#feed`}
                          onClick={() => setIsAllCategoriesOpen(false)}
                          className="text-xs text-blue-900 font-bold hover:underline"
                        >
                          View all {activeCat.name} products &rarr;
                        </Link>
                      </div>

                      {catSubs.length > 0 ? (
                        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-7 gap-4 sm:gap-6 pt-2">
                          {catSubs.map((sub) => (
                            <Link
                              key={sub._id}
                              href={`/?category=${encodeURIComponent(activeCat.name)}&subcategory=${encodeURIComponent(sub.name)}#feed`}
                              onClick={() => setIsAllCategoriesOpen(false)}
                              className="group flex flex-col items-center text-center cursor-pointer"
                            >
                              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-zinc-100 border border-zinc-200/80 overflow-hidden flex items-center justify-center group-hover:scale-105 group-hover:border-blue-900 transition-all shadow-2xs">
                                <img
                                  src={getSubcategoryImage(sub)}
                                  alt={sub.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <p className="text-xs text-zinc-800 text-center font-medium mt-2 leading-tight group-hover:text-blue-900 transition-colors line-clamp-2 max-w-20">
                                {sub.name}
                              </p>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center bg-zinc-50 rounded-2xl border border-zinc-200">
                          <p className="text-sm font-semibold text-zinc-700">Subcategories coming soon</p>
                          <p className="text-xs text-zinc-500 mt-1">Browse all catalog products under {activeCat.name}</p>
                          <Link
                            href={`/?category=${encodeURIComponent(activeCat.name)}#feed`}
                            onClick={() => setIsAllCategoriesOpen(false)}
                            className="inline-block mt-3 px-4 py-2 bg-blue-900 text-white rounded-xl text-xs font-bold"
                          >
                            Explore {activeCat.name}
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })()
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 bg-white p-4 space-y-3">
          <div className="space-y-2 text-sm text-zinc-800">
            <button
              onClick={() => {
                setIsAllCategoriesOpen(!isAllCategoriesOpen);
                setMobileMenuOpen(false);
              }}
              className="block py-1 hover:text-blue-900 font-bold text-left w-full"
            >
              All categories
            </button>
            <a href="#feed" className="block py-1 hover:text-blue-900">
              Verified manufacturers
            </a>
            <a href="#feed" className="block py-1 hover:text-blue-900">
              Dropshipping
            </a>
            <a href="#feed" className="block py-1 hover:text-blue-900">
              About Alibaba.com
            </a>
            <a href="#feed" className="block py-1 hover:text-blue-900">
              Help Center
            </a>
            <a
              href="http://localhost:3002"
              target="_blank"
              rel="noreferrer"
              className="block py-1 text-blue-900 font-bold"
            >
              Sell on Alibaba.com
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
