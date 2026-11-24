'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Package,
  Building,
  Image as ImageIcon,
  ChevronRight,
  Calendar,
  Sparkles,
  MessageSquare,
  FileCheck,
  X
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { apiClient, API_ENDPOINTS } from '@/lib/api';

export interface CustomerOrder {
  _id: string;
  orderNumber: string;
  items?: Array<{
    title: string;
    price: number;
    quantity: number;
    imageUrl?: string;
    category?: string;
  }>;
  customRequirements?: string;
  referenceImages?: string[];
  assignedVendorName?: string;
  orderStage:
    | 'pending_admin_review'
    | 'assigned_to_vendor'
    | 'vendor_preparing'
    | 'ready_for_inspection'
    | 'under_inspection'
    | 'quality_failed'
    | 'quality_approved'
    | 'completed';
  inspectionReport?: {
    status?: string;
    inspectorName?: string;
    defectNotes?: string;
  };
  totalAmount: number;
  createdAt: string;
}

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (_) {}
      }
    }

    const fetchMyOrders = async () => {
      setIsLoading(true);
      try {
        const res = await apiClient.get(API_ENDPOINTS.ORDERS.LIST, {
          headers: { 'x-user-role': 'customer' }
        });
        if (res.data?.data) {
          setOrders(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching customer orders:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyOrders();
  }, []);

  // Visual Pipeline Stages
  const getPipelineProgress = (stage: CustomerOrder['orderStage']) => {
    switch (stage) {
      case 'pending_admin_review':
        return 1;
      case 'assigned_to_vendor':
        return 2;
      case 'vendor_preparing':
        return 3;
      case 'ready_for_inspection':
      case 'under_inspection':
      case 'quality_failed':
        return 4;
      case 'quality_approved':
      case 'completed':
        return 5;
      default:
        return 1;
    }
  };

  const PIPELINE_STEPS = [
    { step: 1, title: 'Order Placed', desc: 'Submitted to Super Admin' },
    { step: 2, title: 'Vendor Assigned', desc: 'Assigned to Master Artisan' },
    { step: 3, title: 'In Production', desc: 'Handcrafting & Preparation' },
    { step: 4, title: 'Quality Inspection', desc: 'Product Checker Verification' },
    { step: 5, title: 'Quality Approved', desc: 'Certified & Order Ready' }
  ];

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
              <Link href="/" className="hover:text-blue-900 transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-semibold text-stone-900">My Bulk Orders & Order Tracking</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
              Order Tracking & Production Status
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Follow each phase of your artisanal order: vendor allocation, crafting, and Product Checker quality inspection.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <ShoppingBag className="w-4 h-4" /> Browse More Collections
          </Link>
        </div>

        {/* Orders Listing */}
        {isLoading ? (
          <div className="py-20 text-center text-stone-400 text-sm">
            Loading your orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-xs space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-900 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-serif font-bold text-stone-900">No Orders Placed Yet</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Explore our handloom sarees, artisanal shawls, and bespoke jewelry, and place your bulk order inquiry with custom design specifications.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-900 hover:bg-blue-950 text-white font-semibold text-xs shadow-md shadow-blue-900/20 transition-all"
            >
              Explore Collections <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => {
              const item = order.items?.[0];
              const currentStep = getPipelineProgress(order.orderStage);
              const isFailed = order.orderStage === 'quality_failed';
              const isApproved = order.orderStage === 'quality_approved' || order.orderStage === 'completed';

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6 overflow-hidden"
                >
                  {/* Order Top Meta */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-sm text-stone-900">
                          {order.orderNumber}
                        </span>
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-900 border border-blue-200">
                          B2B Bulk Order
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 mt-1 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        Submitted on{' '}
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-xs text-stone-400 block uppercase font-semibold">Total Order Value</span>
                      <span className="text-xl font-bold text-stone-900">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* VISUAL MULTI-STAGE TRACKING PIPELINE */}
                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block">
                      Production & Inspection Pipeline
                    </span>

                    <div className="relative">
                      {/* Connecting Line */}
                      <div className="hidden sm:block absolute top-5 left-10 right-10 h-1 bg-stone-200 -z-0">
                        <div
                          className="h-full bg-emerald-600 transition-all duration-500"
                          style={{
                            width: `${Math.min(100, Math.max(0, ((currentStep - 1) / 4) * 100))}%`
                          }}
                        />
                      </div>

                      {/* Step Bubbles */}
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 relative z-10">
                        {PIPELINE_STEPS.map(s => {
                          const isDone = currentStep >= s.step;
                          const isCurrent = currentStep === s.step;

                          return (
                            <div key={s.step} className="flex flex-col sm:items-center text-left sm:text-center space-y-1.5">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-xs ${
                                  isDone
                                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-50'
                                    : 'bg-white border-2 border-stone-300 text-stone-400'
                                }`}
                              >
                                {isDone ? <CheckCircle2 className="w-5 h-5" /> : s.step}
                              </div>
                              <span
                                className={`text-xs font-bold block ${
                                  isCurrent ? 'text-blue-900' : isDone ? 'text-stone-900' : 'text-stone-400'
                                }`}
                              >
                                {s.title}
                              </span>
                              <span className="text-[10px] text-stone-500 leading-tight block">
                                {s.desc}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Product & Order Details Card */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-stone-100">
                    {/* Item info */}
                    <div className="md:col-span-2 flex items-start gap-4">
                      {item?.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt="Product"
                          className="w-20 h-20 rounded-2xl object-cover border border-stone-200 shrink-0"
                        />
                      )}
                      <div className="space-y-1">
                        <h4 className="font-serif font-bold text-base text-stone-900">{item?.title || 'Handcrafted Order'}</h4>
                        <p className="text-xs text-stone-600">
                          Bulk Quantity: <strong className="text-stone-900">{item?.quantity || 1} units</strong> @ ₹{item?.price || order.totalAmount} per piece
                        </p>
                        {order.assignedVendorName && (
                          <p className="text-xs text-emerald-800 font-medium flex items-center gap-1.5 pt-1">
                            <Building className="w-3.5 h-3.5 text-emerald-600" />
                            Crafted by: <span className="font-bold">{order.assignedVendorName}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Status Summary Banner */}
                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col justify-between text-xs space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Current Phase</span>
                      {isApproved ? (
                        <div className="text-emerald-800 font-bold flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" /> Quality Verified & Certified
                        </div>
                      ) : isFailed ? (
                        <div className="text-rose-800 font-semibold flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-rose-600" /> Artisan Fine-Tuning Quality
                        </div>
                      ) : (
                        <div className="text-stone-800 font-semibold flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-blue-800" /> {order.orderStage.replace(/_/g, ' ').toUpperCase()}
                        </div>
                      )}
                      <p className="text-[11px] text-stone-500">
                        {isApproved
                          ? 'Your products have passed all inspections and specifications tests.'
                          : 'Our platform coordinates directly with master artisans to ensure zero-defect quality.'}
                      </p>
                    </div>
                  </div>

                  {/* Customer Custom Specifications & Reference Photos */}
                  {(order.customRequirements || (order.referenceImages && order.referenceImages.length > 0)) && (
                    <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-2 text-xs">
                      <strong className="text-[10px] font-bold text-blue-900 uppercase tracking-wider block">
                        Your Custom Order Specifications
                      </strong>
                      {order.customRequirements && (
                        <p className="text-stone-800 italic">&ldquo;{order.customRequirements}&rdquo;</p>
                      )}
                      {order.referenceImages && order.referenceImages.length > 0 && (
                        <div className="space-y-1.5 pt-2">
                          <span className="text-[11px] font-semibold text-stone-700 flex items-center gap-1">
                            <ImageIcon className="w-3.5 h-3.5 text-purple-700" /> Your Uploaded Reference Design Images (Click to enlarge):
                          </span>
                          <div className="flex gap-2">
                            {order.referenceImages.map((img, i) => (
                              <div
                                key={i}
                                onClick={() => setPreviewImage(img)}
                                className="w-14 h-14 rounded-xl overflow-hidden border border-stone-300 cursor-pointer hover:scale-105 transition-transform"
                              >
                                <img src={img} alt="Ref Sample" className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Product Checker Inspection Report */}
                  {order.inspectionReport?.inspectorName && (
                    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-stone-800 space-y-1">
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-emerald-700" />
                        <strong className="font-bold text-emerald-950">Official Quality Inspection Report</strong>
                      </div>
                      <p className="text-stone-600">
                        Certified by Product Checker: <strong className="text-stone-900">{order.inspectionReport.inspectorName}</strong>
                      </p>
                      {order.inspectionReport.defectNotes && (
                        <p className="text-stone-600 italic mt-1">
                          Notes: {order.inspectionReport.defectNotes}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />

      {/* FULLSIZE IMAGE LIGHTBOX PREVIEW */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs cursor-pointer"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh] bg-white rounded-2xl overflow-hidden p-2">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={previewImage} alt="Reference Full View" className="max-w-full max-h-[80vh] object-contain rounded-xl" />
          </div>
        </div>
      )}
    </div>
  );
}

