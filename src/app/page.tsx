'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { apiClient, API_ENDPOINTS } from '@/lib/api';
import {
  Camera,
  Star,
  ChevronRight,
  ArrowUp,
  Sparkles,
  ShieldCheck,
  Flame,
  ShoppingBag,
  ExternalLink,
  Layers,
  Heart,
  Package,
  Store,
  RefreshCw
} from 'lucide-react';

interface AlibabaProduct {
  id: string;
  title: string;
  category: string;
  subCategory?: string;
  price: string;
  minOrder: string;
  imageUrl: string;
  rating?: number;
  ordersCount?: string;
  verified?: boolean;
}

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

export default function Home() {
  const [liveProducts, setLiveProducts] = useState<AlibabaProduct[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeSubcategory, setActiveSubcategory] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch approved live products, categories and subcategories from backend MongoDB
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const catParam = params.get('category');
        const subParam = params.get('subcategory');
        const qParam = params.get('search');
        if (catParam) setActiveCategory(catParam);
        if (subParam) setActiveSubcategory(subParam);
        if (qParam) setSearchFilter(qParam);
      }

      const [prodRes, catsRes, subsRes] = await Promise.all([
        apiClient.get(API_ENDPOINTS.PRODUCTS.APPROVED),
        apiClient.get(API_ENDPOINTS.CATEGORIES.LIST),
        apiClient.get(API_ENDPOINTS.SUBCATEGORIES.LIST)
      ]);

      if (prodRes.data?.data && Array.isArray(prodRes.data.data)) {
        const mapped: AlibabaProduct[] = prodRes.data.data.map((item: any) => ({
          id: String(item._id),
          title: item.title,
          category: item.category || 'Handcrafted',
          subCategory: item.subCategory || '',
          price: `₹${Number(item.price).toLocaleString('en-IN')}.00`,
          minOrder: 'Min. order: 1 piece',
          imageUrl:
            item.images?.[0] ||
            'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=500&q=80',
          rating: item.rating || 5.0,
          ordersCount: item.vendorName || 'Artisan Verified',
          verified: true
        }));
        setLiveProducts(mapped);
      } else {
        setLiveProducts([]);
      }

      if (catsRes.data?.data && Array.isArray(catsRes.data.data)) {
        setCategories(catsRes.data.data);
      }
      if (subsRes.data?.data && Array.isArray(subsRes.data.data)) {
        setSubcategories(subsRes.data.data);
      }
    } catch (_) {
      setLiveProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Filter products by selected Category, Subcategory, or Search
  const displayedFeed = liveProducts.filter((p) => {
    const matchCat =
      activeCategory === 'All' ||
      p.category.toLowerCase().includes(activeCategory.toLowerCase());
    const matchSub =
      activeSubcategory === 'All' ||
      (p.subCategory && p.subCategory.toLowerCase().includes(activeSubcategory.toLowerCase()));
    const matchSearch =
      !searchFilter ||
      p.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.category.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (p.subCategory && p.subCategory.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchCat && matchSub && matchSearch;
  });

  // Dynamic promo subcategories
  const promoSubcategories = subcategories.slice(0, 3);

  // Dynamic top picks from subcategories or products
  const topPicks = subcategories.slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f4f4] text-zinc-900 font-sans">
      <Navbar />

      <main className="w-full px-3 sm:px-6 lg:px-10 py-3 sm:py-4 space-y-3 sm:space-y-4 flex-1">
        {/* ========================================================= */}
        {/* 1. HERO FEATURE ROW                                       */}
        {/* ========================================================= */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
          
          {/* Card 1: Left Categories Menu (Dynamic from Database) */}
          <div className="md:col-span-3 bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-2xs flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center justify-between pb-1 border-b border-zinc-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Live Categories
                </span>
                {activeCategory !== 'All' && (
                  <button
                    onClick={() => {
                      setActiveCategory('All');
                      setActiveSubcategory('All');
                    }}
                    className="text-[10px] text-[#ff6a00] font-bold hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>

              <div className="pt-1 space-y-0.5">
                {categories.length > 0 ? (
                  categories.map((c) => {
                    const isSelected = activeCategory.toLowerCase() === c.name.toLowerCase();
                    return (
                      <button
                        key={c._id}
                        onClick={() => {
                          setActiveCategory(isSelected ? 'All' : c.name);
                          setActiveSubcategory('All');
                        }}
                        className={`w-full flex items-center justify-between py-2 px-2.5 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-orange-50 text-[#ff6a00] font-bold shadow-xs'
                            : 'text-zinc-700 hover:bg-zinc-50 font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span>{getCategoryIcon(c.name)}</span>
                          <span className="truncate">{c.name}</span>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 text-zinc-400 shrink-0 ${isSelected ? 'text-[#ff6a00]' : ''}`} />
                      </button>
                    );
                  })
                ) : (
                  <div className="py-4 text-center text-xs text-zinc-400">
                    No categories in database
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-100 text-[11px] text-zinc-500 flex items-center justify-between">
              <span>{categories.length} Verified Categories</span>
              <a href="#feed" className="text-[#ff6a00] font-bold hover:underline">
                View All &rarr;
              </a>
            </div>
          </div>

          {/* Card 2, 3, 4: Middle 3 Dynamic Promo Squares */}
          <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {promoSubcategories.length > 0 ? (
              promoSubcategories.map((sub, idx) => (
                <div
                  key={sub._id || idx}
                  onClick={() => {
                    if (sub.categoryName) setActiveCategory(sub.categoryName);
                    setActiveSubcategory(sub.name);
                  }}
                  className="bg-white rounded-2xl p-3.5 border border-zinc-200/80 shadow-2xs flex flex-col justify-between hover:shadow-md transition-shadow group cursor-pointer"
                >
                  <div>
                    <p className="text-xs font-bold text-zinc-900 leading-snug group-hover:text-[#ff6a00] transition-colors truncate">
                      {sub.name}
                    </p>
                    <p className="text-[10px] text-zinc-400 mt-0.5 truncate">{sub.categoryName || 'Artisan Collection'}</p>
                  </div>
                  <div className="aspect-square rounded-xl overflow-hidden bg-zinc-50 mt-2">
                    <img
                      src={getSubcategoryImage(sub)}
                      alt={sub.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="sm:col-span-3 bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-2xs flex flex-col items-center justify-center text-center">
                <Package className="w-8 h-8 text-zinc-300 mb-2" />
                <p className="text-xs font-bold text-zinc-700">Subcategories Live Sync</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">Admin can manage categories and subcategories in Super Admin</p>
              </div>
            )}
          </div>

          {/* Card 5: Right Vibrant Orange Promo Box */}
          <div className="md:col-span-3 bg-gradient-to-br from-[#ff6a00] via-[#ff5500] to-[#e64000] text-white rounded-2xl p-4 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full inline-block">
                B2B Sourcing
              </span>
              <h3 className="text-lg font-black tracking-tight mt-1.5 leading-tight">
                AUTHENTIC INDIAN ARTISAN GUILD
              </h3>
              <p className="text-xs text-orange-100 mt-1">
                Direct wholesale manufacturing, sample reference custom production, and 3-tier inspection.
              </p>
            </div>

            <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-white/10 my-2">
              <img
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80"
                alt="Artisan Craft"
                className="w-full h-full object-cover"
              />
            </div>

            <Link
              href="/register"
              className="w-full py-2 bg-white hover:bg-orange-50 text-[#ff6a00] font-black text-xs text-center rounded-xl shadow-xs transition-colors"
            >
              REGISTER BUYER ACCOUNT
            </Link>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 2. HORIZONTAL ORANGE BANNER ("FOR BUYERS // TOP PICKS")   */}
        {/* ========================================================= */}
        {topPicks.length > 0 && (
          <section className="bg-gradient-to-r from-[#ff5500] to-[#ff7700] rounded-2xl p-3 sm:p-4 text-white shadow-xs">
            <div className="flex flex-col lg:flex-row items-center gap-4">
              {/* Left title & button */}
              <div className="flex items-center justify-between lg:flex-col lg:items-start gap-3 shrink-0 lg:w-48 w-full">
                <div>
                  <p className="text-[11px] font-mono font-bold tracking-widest text-orange-200 uppercase">
                    FOR BUYERS //
                  </p>
                  <h3 className="text-base sm:text-lg font-black leading-tight">FEATURED CRAFTS</h3>
                </div>
                <a
                  href="#feed"
                  className="px-4 py-1.5 bg-white text-[#ff5500] font-bold text-xs rounded-full hover:bg-orange-50 transition-colors shadow-xs"
                >
                  Explore now
                </a>
              </div>

              {/* Right: Dynamic Subcategory Cards */}
              <div className="flex-1 grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-2.5 w-full">
                {topPicks.map((item, idx) => (
                  <div
                    key={item._id || idx}
                    onClick={() => {
                      if (item.categoryName) setActiveCategory(item.categoryName);
                      setActiveSubcategory(item.name);
                    }}
                    className="bg-white rounded-xl p-2 text-zinc-900 text-center shadow-2xs hover:shadow-md transition-shadow cursor-pointer group"
                  >
                    <div className="aspect-square rounded-lg overflow-hidden bg-zinc-100 mb-1.5">
                      <img
                        src={getSubcategoryImage(item)}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <p className="text-xs font-bold text-zinc-900 truncate">{item.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* 3. DYNAMIC PRODUCT GRID (From MongoDB Database)            */}
        {/* ========================================================= */}
        <section id="feed" className="space-y-3">
          {/* Active Filter Pill Bar if filtered */}
          {(activeCategory !== 'All' || activeSubcategory !== 'All' || searchFilter) && (
            <div className="bg-white px-4 py-2.5 rounded-xl border border-zinc-200 text-xs flex flex-wrap items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="text-zinc-500">Active Filter:</span>
                {activeCategory !== 'All' && (
                  <span className="px-2.5 py-1 rounded-full bg-orange-100 text-[#ff6a00] font-bold">
                    Category: {activeCategory}
                  </span>
                )}
                {activeSubcategory !== 'All' && (
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold">
                    Subcategory: {activeSubcategory}
                  </span>
                )}
                {searchFilter && (
                  <span className="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-800 font-bold">
                    Search: "{searchFilter}"
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  setActiveCategory('All');
                  setActiveSubcategory('All');
                  setSearchFilter('');
                }}
                className="text-[#ff6a00] font-bold hover:underline cursor-pointer"
              >
                Clear all filters &times;
              </button>
            </div>
          )}

          {/* PRODUCT GRID OR EMPTY STATE */}
          {isLoading ? (
            <div className="py-20 text-center flex flex-col items-center justify-center">
              <div className="w-8 h-8 rounded-full border-2 border-[#ff6a00] border-t-transparent animate-spin mb-3"></div>
              <p className="text-xs text-zinc-500 font-medium">Loading live artisan products from database...</p>
            </div>
          ) : displayedFeed.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3">
              {displayedFeed.map((prod) => (
                <div
                  key={prod.id}
                  className="group bg-white rounded-xl p-2.5 border border-zinc-200/70 hover:border-[#ff6a00]/50 hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  {/* Image Stage */}
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-zinc-100 mb-2">
                    <Link href={`/product/${prod.id}`} className="block w-full h-full">
                      <img
                        src={prod.imageUrl}
                        alt={prod.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </Link>

                    <div className="absolute bottom-1.5 right-1.5 p-1 rounded-md bg-black/40 backdrop-blur-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-3.5 h-3.5" />
                    </div>

                    {prod.verified && (
                      <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-bold">
                        Verified
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-1 flex-1 flex flex-col justify-between">
                    <Link href={`/product/${prod.id}`}>
                      <h4 className="text-xs text-zinc-800 line-clamp-2 leading-snug group-hover:text-[#ff6a00] transition-colors font-medium">
                        {prod.title}
                      </h4>
                    </Link>

                    <div className="pt-1">
                      <p className="text-xs sm:text-sm font-black text-zinc-950 leading-tight">
                        {prod.price}
                      </p>
                      <p className="text-[11px] text-zinc-400 font-normal mt-0.5">
                        {prod.minOrder}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-0.5">
                        <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>{prod.rating || 5.0}</span>
                        </div>
                        <span className="truncate max-w-[90px]">{prod.ordersCount || 'Artisan Direct'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Clean Empty State */
            <div className="bg-white rounded-3xl p-10 sm:p-14 border border-zinc-200/90 text-center flex flex-col items-center justify-center space-y-4 shadow-2xs">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200/60 flex items-center justify-center text-[#ff6a00]">
                <Package className="w-8 h-8" />
              </div>
              <div className="max-w-md space-y-1.5">
                <h3 className="text-base sm:text-lg font-bold text-zinc-900">
                  {activeCategory !== 'All' || activeSubcategory !== 'All'
                    ? `No approved products found in "${activeSubcategory !== 'All' ? activeSubcategory : activeCategory}"`
                    : 'Catalog is currently ready for live listings'}
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Registered vendors upload handcrafted collections through the Vendor Portal. Once reviewed and approved by the Super Admin, they will immediately appear live here.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setActiveCategory('All');
                    setActiveSubcategory('All');
                    setSearchFilter('');
                    fetchAllData();
                  }}
                  className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-xs font-bold text-zinc-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh Products</span>
                </button>
                <a
                  href="http://localhost:3002/register"
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2 rounded-xl bg-[#ff6a00] hover:bg-[#e65a00] text-xs font-bold text-white flex items-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Register as Vendor & Upload Products</span>
                </a>
              </div>
            </div>
          )}
        </section>

        {/* Scroll to Top */}
        <div className="fixed bottom-6 right-6 z-30 flex flex-col gap-2">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-10 h-10 rounded-full bg-white text-zinc-700 hover:text-[#ff6a00] shadow-lg border border-zinc-200 flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
            title="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
