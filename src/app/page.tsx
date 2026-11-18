'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/ecommerce/ProductCard';
import { Button } from '@/components/ui/Button';
import { apiClient, API_ENDPOINTS } from '@/lib/api';
import { Sparkles, ArrowRight, ShieldCheck, Truck, RotateCcw, Award, RefreshCw } from 'lucide-react';

interface StoreProduct {
  id: string;
  title: string;
  category: string;
  price: number;
  discountPrice?: number;
  imageUrl: string;
  rating?: number;
  isNew?: boolean;
}

export default function Home() {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch only approved products from Backend API
  const fetchApprovedProducts = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get(API_ENDPOINTS.PRODUCTS.APPROVED);
      if (res.data?.data) {
        const mapped: StoreProduct[] = res.data.data.map((item: any) => ({
          id: String(item._id),
          title: item.title,
          category: item.category,
          price: item.price,
          discountPrice: item.discountPrice,
          imageUrl: item.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
          rating: item.rating || 4.8,
          isNew: true
        }));
        setProducts(mapped);
        setIsLoading(false);
        return;
      }
    } catch (_) {
      // Backend offline
    }
    setProducts([]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchApprovedProducts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-zinc-900">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/70 via-stone-50/40 to-white py-20 lg:py-28 border-b border-zinc-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Handcrafted with Heritage & Love
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-tight text-zinc-900">
                  Authentic Indian Lifestyle, Reimagined.
                </h1>
                <p className="text-base sm:text-lg text-zinc-600 max-w-lg leading-relaxed">
                  Explore ethical fashion, artisan-woven textiles, and sustainable home décor sourced directly from verified master craftspeople across India.
                </p>
                <div className="flex items-center gap-4 pt-2">
                  <Button size="lg" className="gap-2">
                    Shop New Arrivals <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="lg">
                    Discover Artisans
                  </Button>
                </div>
              </div>

              {/* Hero Image Showcase */}
              <div className="relative">
                <div className="aspect-4/3 rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=80"
                    alt="Amba Lifestyle Collection"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Value Props */}
        <section className="border-b border-zinc-200 py-10 bg-zinc-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <Truck className="w-6 h-6 text-amber-600 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-zinc-900">Fast Pan-India Shipping</h4>
                <p className="text-xs text-zinc-500">Delivered within 3-5 days</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-amber-600 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-zinc-900">100% Certified Authentic</h4>
                <p className="text-xs text-zinc-500">Admin-verified artisan sourcing</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="w-6 h-6 text-amber-600 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-zinc-900">Hassle-Free Returns</h4>
                <p className="text-xs text-zinc-500">7-day easy exchange</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-amber-600 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-zinc-900">Empowering Artisans</h4>
                <p className="text-xs text-zinc-500">Direct artisan fair trade</p>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Verified Products Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-600">
                  Verified & Approved Catalog
                </p>
              </div>
              <h2 className="text-3xl font-serif font-bold mt-1 text-zinc-900">
                Trending Handcrafted Collections ({products.length})
              </h2>
            </div>
            <button
              onClick={fetchApprovedProducts}
              className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 flex items-center gap-1.5 p-2 rounded-lg hover:bg-zinc-100 transition-colors"
              title="Refresh live catalog"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-600' : ''}`} />
              <span>Refresh Store</span>
            </button>
          </div>

          {products.length === 0 ? (
            <div className="py-16 text-center text-zinc-500 bg-stone-50/50 rounded-2xl border border-dashed border-zinc-200">
              <p className="text-sm font-semibold text-zinc-700">No products currently published</p>
              <p className="text-xs text-zinc-400 mt-1">
                Vendor products will appear here once approved by Admin.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((prod) => (
                <ProductCard
                  key={prod.id}
                  id={prod.id}
                  title={prod.title}
                  category={prod.category}
                  price={prod.price}
                  discountPrice={prod.discountPrice}
                  imageUrl={prod.imageUrl}
                  rating={prod.rating}
                  isNew={prod.isNew}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
