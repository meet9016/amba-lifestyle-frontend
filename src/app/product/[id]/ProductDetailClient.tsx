'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/ecommerce/ProductCard';
import { PRODUCTS_DATA, ProductDetail } from '@/data/products';
import { apiClient, API_ENDPOINTS } from '@/lib/api';
import {
  Star,
  ShieldCheck,
  Truck,
  Heart,
  Share2,
  ChevronRight,
  MessageSquare,
  Building2,
  CheckCircle2,
  Clock,
  Plus,
  Minus,
  ShoppingBag,
  Zap,
  RotateCcw,
  Package,
  Award,
  Layers
} from 'lucide-react';

interface ProductDetailClientProps {
  productId: string;
}

export default function ProductDetailClient({ productId }: ProductDetailClientProps) {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch product from backend
  React.useEffect(() => {
    const fetchLiveProduct = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(API_ENDPOINTS.PRODUCTS.BY_ID(productId));
        if (res.data?.data) {
          const live = res.data.data;
          const imgList = live.images && live.images.length > 0
            ? live.images
            : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'];

          setProduct({
            id: String(live._id),
            title: live.title,
            price: live.price,
            discountPrice: live.discountPrice || Math.round(live.price * 1.25),
            category: live.category,
            subCategory: live.subCategory || 'Handcrafted Heritage',
            rating: live.rating || 4.9,
            reviewsCount: live.reviewsCount || 38,
            ordersCount: 'Artisan Verified',
            inStock: live.stock || 15,
            minOrderQuantity: 1,
            tierPricing: [
              { minQty: 1, maxQty: 4, price: live.price },
              { minQty: 5, price: Math.round(live.price * 0.9) }
            ],
            images: imgList,
            colors: [{ name: 'Natural Artisan', hex: '#b45309', image: imgList[0] }],
            sizes: ['Standard'],
            customizations: [{ title: 'Artisan Inscription / Custom Packaging', minQty: 1 }],
            supplier: {
              name: live.vendorName || 'Verified Artisan Partner',
              badge: 'Master Artisan',
              years: 8,
              location: 'Jaipur, Rajasthan',
              responseRate: '98%',
              responseTime: 'Under 2h',
              onTimeDelivery: '99%',
              storeRating: 4.9,
              transactions: '500+ Orders',
              certifications: ['Handloom Mark', 'Craftmark Verified']
            },
            specifications: {
              'Category': live.category,
              'Subcategory': live.subCategory || 'Handcrafted Goods',
              'Artisan Heritage': 'Authentic Handcrafted in India',
              'Material Technique': 'Traditional Heritage Handcraft',
              'Quality Check': '100% Quality Inspected'
            },
            leadTime: [{ qty: '1-10 Pcs', days: '3-5 business days' }],
            overview: live.description || live.title,
            features: [
              '100% Genuine Handcrafted Item by Local Artisans',
              'Direct Sourced with Fair Artisan Compensation',
              'Eco-friendly Sustainable Natural Materials',
              'Secure Nationwide Insured Delivery'
            ]
          });
        }
      } catch (_) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchLiveProduct();
  }, [productId]);

  // Interactive states
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('Standard');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'customization' | 'supplier' | 'reviews'>('specs');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [cartSuccessAlert, setCartSuccessAlert] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-600 mb-4"></div>
          <p className="text-xs font-semibold text-zinc-500">Loading authentic artisan product...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-zinc-900">Product Not Found</h1>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm">
            This handcrafted item may have been updated or is awaiting admin review.
          </p>
          <Link
            href="/"
            className="mt-5 px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold shadow-xs"
          >
            Explore Catalog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Dynamic Tiered Price Calculation (Alibaba Signature Feature)
  const calculateUnitPrice = (qty: number): number => {
    for (let i = product.tierPricing.length - 1; i >= 0; i--) {
      const tier = product.tierPricing[i];
      if (qty >= tier.minQty) {
        return tier.price;
      }
    }
    return product.price;
  };

  const currentUnitPrice = calculateUnitPrice(quantity);
  const totalPrice = currentUnitPrice * quantity;

  // Handle quantity changes
  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(product.inStock, prev + delta)));
  };

  const handleAddToCart = () => {
    setCartSuccessAlert(true);
    setTimeout(() => setCartSuccessAlert(false), 3500);
  };

  const relatedProducts: ProductDetail[] = [];

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 text-zinc-900">
      <Navbar />

      {/* Floating Cart Alert */}
      {cartSuccessAlert && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-700 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 transition-all animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <div>
            <p className="text-xs font-bold">Added to Cart successfully!</p>
            <p className="text-[11px] text-emerald-100">{quantity} × {product.title.substring(0, 32)}...</p>
          </div>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-zinc-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-zinc-500 overflow-x-auto">
            <Link href="/" className="hover:text-amber-700 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-zinc-400 shrink-0" />
            <Link href="/" className="hover:text-amber-700 transition-colors">{product.category}</Link>
            <ChevronRight className="w-3 h-3 text-zinc-400 shrink-0" />
            <span className="hover:text-amber-700 transition-colors">{product.subCategory}</span>
            <ChevronRight className="w-3 h-3 text-zinc-400 shrink-0" />
            <span className="text-zinc-900 font-semibold truncate max-w-xs">{product.title}</span>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-10">
        {/* ========================================================= */}
        {/* TOP SECTION: 3-Column Alibaba Layout                      */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUMN 1: Image Gallery & Badges (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Main Stage Image */}
            <div className="relative aspect-4/5 bg-white rounded-3xl overflow-hidden border border-zinc-200 shadow-sm group">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Alibaba-style Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-600 text-white text-[11px] font-bold rounded-full shadow-md uppercase tracking-wide">
                  <Award className="w-3 h-3" /> Ready to Ship
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-zinc-900/80 backdrop-blur-xs text-white text-[10px] font-medium rounded-full">
                  Stock: {product.inStock} pcs
                </span>
              </div>

              {/* Wishlist & Share float buttons */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-colors ${
                    isWishlisted ? 'bg-rose-500 text-white' : 'bg-white/90 text-zinc-700 hover:text-rose-500'
                  }`}
                  title="Save to Favorites"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      navigator.clipboard.writeText(window.location.href);
                    }
                  }}
                  className="w-10 h-10 rounded-full bg-white/90 text-zinc-700 hover:text-amber-700 flex items-center justify-center shadow-md transition-colors"
                  title="Copy link"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Thumbnails Row */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-24 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    activeImageIndex === idx
                      ? 'border-amber-600 shadow-md ring-2 ring-amber-100'
                      : 'border-zinc-200 hover:border-zinc-400 opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Quick Trust Strip below Image */}
            <div className="bg-white rounded-2xl p-4 border border-zinc-200 grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-zinc-700 font-medium">100% Authentic Handcraft</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="text-zinc-700 font-medium">7-Day Return Guarantee</span>
              </div>
            </div>
          </div>

          {/* COLUMN 2: Pricing, Variations, Quantity & Actions (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wide">
                  Direct Artisan Price
                </span>
                <span className="text-xs text-zinc-500">Item #{product.id}109</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-zinc-900 leading-snug">
                {product.title}
              </h1>

              {/* Ratings and Orders Sold Bar */}
              <div className="flex items-center gap-3 mt-3 pb-4 border-b border-zinc-200 text-xs">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <span>{product.rating}</span>
                </div>
                <a href="#reviews" className="text-indigo-600 hover:underline">
                  {product.reviewsCount} Reviews
                </a>
                <span className="text-zinc-300">|</span>
                <span className="font-semibold text-zinc-700">{product.ordersCount}</span>
              </div>
            </div>

            {/* ALIBABA STYLE TIERED / VOLUME PRICING BOX */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  Wholesale & Retail Tiered Pricing
                </span>
                <span className="text-[11px] font-semibold text-amber-700">MOQ: {product.minOrderQuantity} pc</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {product.tierPricing.map((tier, idx) => {
                  const isCurrentTier =
                    quantity >= tier.minQty && (tier.maxQty ? quantity <= tier.maxQty : true);

                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl text-center border transition-all ${
                        isCurrentTier
                          ? 'bg-white border-amber-600 shadow-sm ring-2 ring-amber-500/20'
                          : 'bg-white/60 border-amber-100'
                      }`}
                    >
                      <p className="text-[11px] font-medium text-zinc-500">
                        {tier.maxQty ? `${tier.minQty} - ${tier.maxQty} pcs` : `≥ ${tier.minQty} pcs`}
                      </p>
                      <p className="text-base font-extrabold text-amber-900 mt-0.5">
                        ₹{tier.price.toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* COLOR VARIATIONS */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-800">
                    Color: <span className="text-amber-800 font-bold">{selectedColor}</span>
                  </span>
                  <span className="text-zinc-400">{product.colors.length} choices available</span>
                </div>
                <div className="flex items-center gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                        selectedColor === color.name
                          ? 'border-zinc-900 bg-white ring-2 ring-zinc-900/10 font-bold shadow-xs'
                          : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/20"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span>{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SIZE / DIMENSIONS */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-800">Size / Specifications:</span>
                  <button className="text-indigo-600 hover:underline">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3.5 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                        selectedSize === sz
                          ? 'border-zinc-900 bg-zinc-900 text-white font-bold shadow-xs'
                          : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CUSTOMIZATION OPTIONS (Alibaba hallmark) */}
            <div className="bg-white rounded-2xl p-4 border border-zinc-200 space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-600" /> Available Customizations
              </span>
              <ul className="space-y-1.5 text-xs text-zinc-600">
                {product.customizations.map((c, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{c.title} (Min: {c.minQty} pcs)</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* QUANTITY STEPPER & TOTAL PRICE */}
            <div className="bg-white rounded-2xl p-4 border border-zinc-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-zinc-700">Quantity</span>
                  <p className="text-[11px] text-zinc-400">Available: {product.inStock} pcs</p>
                </div>

                {/* Counter buttons */}
                <div className="flex items-center border border-zinc-200 rounded-xl bg-zinc-50 overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-zinc-200 disabled:opacity-30 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-zinc-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.inStock}
                    className="p-2 hover:bg-zinc-200 disabled:opacity-30 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="pt-3 border-t border-zinc-100 flex items-baseline justify-between">
                <span className="text-xs font-semibold text-zinc-500">Calculated Subtotal:</span>
                <div className="text-right">
                  <span className="text-2xl font-black text-zinc-900">
                    ₹{totalPrice.toLocaleString()}
                  </span>
                  <p className="text-[10px] text-emerald-700 font-semibold">
                    (₹{currentUnitPrice.toLocaleString()} / piece)
                  </p>
                </div>
              </div>

              {/* ACTION BUTTONS (Start Order & Add to Cart) */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <Zap className="w-4 h-4" /> Start Order / Buy Now
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-2.5 px-3 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                  </button>
                  <button
                    onClick={() => alert(`Connecting with artisan supplier: ${product.supplier.name}`)}
                    className="w-full py-2.5 px-3 border border-zinc-300 hover:bg-zinc-100 text-zinc-800 font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-600" /> Chat with Artisan
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 3: Verified Supplier Card & Trade Assurance (3 cols) */}
          <div className="lg:col-span-3 space-y-5">
            {/* Alibaba Supplier Card */}
            <div className="bg-white rounded-3xl p-5 border border-zinc-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white tracking-wider uppercase">
                  {product.supplier.years} YRS
                </span>
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {product.supplier.badge}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-zinc-900 leading-tight">
                  {product.supplier.name}
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">{product.supplier.location}</p>
              </div>

              {/* Supplier Metrics Grid */}
              <div className="bg-zinc-50 rounded-2xl p-3 grid grid-cols-2 gap-2.5 text-center border border-zinc-100">
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase font-medium">Response Rate</p>
                  <p className="text-xs font-bold text-zinc-800">{product.supplier.responseRate}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase font-medium">Response Time</p>
                  <p className="text-xs font-bold text-zinc-800">{product.supplier.responseTime}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase font-medium">On-time Delivery</p>
                  <p className="text-xs font-bold text-emerald-700">{product.supplier.onTimeDelivery}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase font-medium">Store Rating</p>
                  <p className="text-xs font-bold text-zinc-800">{product.supplier.storeRating} / 5.0</p>
                </div>
              </div>

              {/* Transactions Volume */}
              <div className="text-xs flex items-center justify-between text-zinc-600 px-1">
                <span>Platform Volume:</span>
                <span className="font-bold text-zinc-900">{product.supplier.transactions}</span>
              </div>

              {/* Certifications Badges */}
              <div className="space-y-1.5 pt-2 border-t border-zinc-100">
                <p className="text-[11px] font-semibold text-zinc-500">Verified Certifications:</p>
                <div className="flex flex-wrap gap-1.5">
                  {product.supplier.certifications.map((cert, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-medium"
                    >
                      <Award className="w-3 h-3 text-emerald-600" /> {cert}
                    </span>
                  ))}
                </div>
              </div>

              {/* Supplier Actions */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={() => alert(`Visiting official storefront of: ${product.supplier.name}`)}
                  className="w-full py-2.5 px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Building2 className="w-3.5 h-3.5" /> Visit Supplier Store
                </button>
              </div>
            </div>

            {/* Amba Trade Assurance Box */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-3xl p-5 border border-amber-200/70 space-y-3.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-700" />
                <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                  Amba Trade Assurance
                </h4>
              </div>
              <p className="text-xs text-amber-900/80 leading-relaxed">
                Enjoy comprehensive protection from dispatch to doorstep delivery.
              </p>

              <div className="space-y-2 text-xs text-amber-950">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Safe Payments:</strong> Escrow payment held securely until delivery.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Authenticity Check:</strong> 100% genuine master artisan origin.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Damage Claim:</strong> Instant refund or exchange on damaged transit.</span>
                </div>
              </div>
            </div>

            {/* Shipping & Delivery Quick Info */}
            <div className="bg-white rounded-3xl p-5 border border-zinc-200 space-y-3 text-xs">
              <div className="flex items-center gap-2 font-bold text-zinc-900">
                <Truck className="w-4 h-4 text-amber-600" />
                <span>Shipping & Dispatch</span>
              </div>
              <div className="space-y-1.5 text-zinc-600">
                <p><strong>Dispatch Port:</strong> Jaipur / Central Hub, India</p>
                <p><strong>Estimated Transit:</strong> 3-5 Business Days across India</p>
                <p><strong>Carrier Partners:</strong> Blue Dart, Delhivery, DTDC Air</p>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* BOTTOM TABS: Specifications, Lead Time, Reviews           */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-xs">
          {/* Tab Navigation Buttons */}
          <div className="flex border-b border-zinc-200 bg-zinc-50/70 overflow-x-auto">
            <button
              onClick={() => setActiveTab('specs')}
              className={`px-6 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'specs'
                  ? 'border-amber-600 text-amber-800 bg-white'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              Product Specifications & Overview
            </button>
            <button
              onClick={() => setActiveTab('customization')}
              className={`px-6 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'customization'
                  ? 'border-amber-600 text-amber-800 bg-white'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              Packaging & Lead Time
            </button>
            <button
              onClick={() => setActiveTab('supplier')}
              className={`px-6 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'supplier'
                  ? 'border-amber-600 text-amber-800 bg-white'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              Artisan Profile & Certifications
            </button>
            <button
              id="reviews"
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'reviews'
                  ? 'border-amber-600 text-amber-800 bg-white'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              Customer Reviews ({product.reviewsCount})
            </button>
          </div>

          {/* Tab Contents */}
          <div className="p-8">
            {/* TAB 1: Specifications & Overview */}
            {activeTab === 'specs' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-base font-bold text-zinc-900 mb-2">Product Overview</h3>
                  <p className="text-sm text-zinc-600 leading-relaxed max-w-4xl">{product.overview}</p>
                </div>

                <div>
                  <h3 className="text-base font-bold text-zinc-900 mb-3">Key Features & Highlights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {product.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-zinc-50 border border-zinc-100 text-xs text-zinc-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Alibaba Style Attribute Table */}
                <div>
                  <h3 className="text-base font-bold text-zinc-900 mb-3">Technical Specifications Table</h3>
                  <div className="border border-zinc-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-xs text-left">
                      <tbody className="divide-y divide-zinc-200">
                        {Object.entries(product.specifications).map(([key, value], idx) => (
                          <tr key={key} className={idx % 2 === 0 ? 'bg-zinc-50/60' : 'bg-white'}>
                            <td className="w-1/3 py-3 px-5 font-semibold text-zinc-600 border-r border-zinc-200">{key}</td>
                            <td className="py-3 px-5 text-zinc-900 font-medium">{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Packaging & Lead Time */}
            {activeTab === 'customization' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-zinc-900 mb-2">Production Lead Time Schedule</h3>
                  <p className="text-xs text-zinc-500 mb-4">Lead time refers to the number of days needed from order confirmation to dispatch.</p>
                  <div className="border border-zinc-200 rounded-2xl overflow-hidden max-w-2xl">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-zinc-100 border-b border-zinc-200 font-bold text-zinc-700">
                        <tr>
                          <th className="py-3 px-5">Order Quantity</th>
                          <th className="py-3 px-5">Estimated Lead Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200">
                        {product.leadTime.map((item, idx) => (
                          <tr key={idx} className="bg-white">
                            <td className="py-3 px-5 font-semibold text-zinc-800">{item.qty}</td>
                            <td className="py-3 px-5 text-emerald-700 font-medium flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" /> {item.days}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-zinc-900 mb-2">Packaging Options & Quality Standards</h3>
                  <ul className="list-disc list-inside text-xs text-zinc-600 space-y-1.5">
                    <li>Individual polybag protective moisture-proof wrap</li>
                    <li>Reinforced 5-ply corrugated carton box for regional and national shipping</li>
                    <li>Artisanal authenticity certificate card enclosed with each shipment</li>
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 3: Supplier Profile & Certifications */}
            {activeTab === 'supplier' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-zinc-50 rounded-2xl border border-zinc-200">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                      {product.supplier.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-zinc-900">{product.supplier.name}</h4>
                      <p className="text-xs text-zinc-500">{product.supplier.location} &bull; {product.supplier.years} Years verified platform partnership</p>
                    </div>
                  </div>

                  <button
                    onClick={() => alert(`Contacting ${product.supplier.name}`)}
                    className="px-5 py-2.5 bg-zinc-900 text-white text-xs font-bold rounded-xl hover:bg-zinc-800 transition-colors"
                  >
                    Send Direct Inquiry
                  </button>
                </div>

                <div>
                  <h3 className="text-base font-bold text-zinc-900 mb-3">Verified Artisan Accreditations</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {product.supplier.certifications.map((c, idx) => (
                      <div key={idx} className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/40 space-y-1.5">
                        <Award className="w-5 h-5 text-emerald-700" />
                        <h5 className="text-xs font-bold text-zinc-900">{c}</h5>
                        <p className="text-[11px] text-zinc-500">Government of India / National Handloom Board inspected and compliant.</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Customer Reviews */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-zinc-200">
                  <div>
                    <h3 className="text-3xl font-extrabold text-zinc-900 flex items-center gap-2">
                      {product.rating}
                      <span className="text-amber-500 text-2xl font-normal">★★★★★</span>
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1">Based on {product.reviewsCount} verified customer and wholesale orders</p>
                  </div>
                  <button className="px-5 py-2.5 border border-zinc-300 rounded-xl text-xs font-bold hover:bg-zinc-100 transition-colors">
                    Write a Review
                  </button>
                </div>

                {/* Sample Verified Reviews */}
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl border border-zinc-200 space-y-2 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs">
                          PS
                        </div>
                        <div>
                          <p className="text-xs font-bold text-zinc-900">Pooja Sharma</p>
                          <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Verified Buyer (Mumbai)
                          </p>
                        </div>
                      </div>
                      <span className="text-amber-500 text-xs">★★★★★</span>
                    </div>
                    <p className="text-xs text-zinc-700 leading-relaxed">
                      "The fabric quality exceeded expectations! The zari work is exquisite and genuinely handwoven. Dispatched within 2 days with very secure packaging."
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl border border-zinc-200 space-y-2 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-900 flex items-center justify-center font-bold text-xs">
                          AK
                        </div>
                        <div>
                          <p className="text-xs font-bold text-zinc-900">Ananya Kapoor (Boutique Owner)</p>
                          <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Wholesale Bulk Order (15 pcs)
                          </p>
                        </div>
                      </div>
                      <span className="text-amber-500 text-xs">★★★★★</span>
                    </div>
                    <p className="text-xs text-zinc-700 leading-relaxed">
                      "Ordered 15 pieces under the wholesale tier pricing for our Delhi boutique. The price discount was applied automatically, and all pieces were consistent in weaving quality."
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* RECOMMENDATION SECTION: Similar Products                  */}
        {/* ========================================================= */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Artisanal Recommendations</p>
              <h2 className="text-2xl font-serif font-bold text-zinc-900 mt-0.5">Similar Handcrafted Collections</h2>
            </div>
            <Link href="/" className="text-xs font-bold text-amber-700 hover:underline">
              View Entire Catalog &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.slice(0, 3).map((prod) => (
              <ProductCard
                key={prod.id}
                id={prod.id}
                title={prod.title}
                category={prod.category}
                price={prod.price}
                discountPrice={prod.discountPrice}
                imageUrl={prod.images[0]}
                rating={prod.rating}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

