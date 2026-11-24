'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { ProductCard } from '@/components/ecommerce/ProductCard';
import { apiClient, API_ENDPOINTS } from '@/lib/api';
import { productAddSchema } from '@/lib/validations/product';
import {
  Sparkles,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Package,
  Layers,
  Store,
  Eye,
  Info,
  ArrowLeft
} from 'lucide-react';

interface CategoryOption {
  _id: string;
  name: string;
  slug?: string;
}

interface SubcategoryOption {
  _id: string;
  name: string;
  categoryId?: string;
  categoryName?: string;
}

export default function AddProductPage() {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoryOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedProductTitle, setSubmittedProductTitle] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    subCategory: '',
    price: '',
    discountPrice: '',
    stock: '15',
    vendorName: 'Jaipur Heritage Weaves',
    description: '',
    imageUrl: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Fetch dynamic categories and subcategories
  useEffect(() => {
    const fetchTaxonomy = async () => {
      try {
        const [catsRes, subsRes] = await Promise.all([
          apiClient.get(API_ENDPOINTS.CATEGORIES.LIST),
          apiClient.get(API_ENDPOINTS.SUBCATEGORIES.LIST)
        ]);

        if (catsRes.data?.data && catsRes.data.data.length > 0) {
          setCategories(catsRes.data.data);
          const firstCat = catsRes.data.data[0].name;

          let firstSub = '';
          if (subsRes.data?.data && subsRes.data.data.length > 0) {
            setSubcategories(subsRes.data.data);
            const matching = subsRes.data.data.find(
              (s: any) =>
                s.categoryName?.toLowerCase() === firstCat.toLowerCase() ||
                String(s.categoryId) === String(catsRes.data.data[0]._id)
            );
            if (matching) firstSub = matching.name;
          }

          setFormData(prev => ({
            ...prev,
            category: prev.category || firstCat,
            subCategory: prev.subCategory || firstSub
          }));
        } else if (subsRes.data?.data) {
          setSubcategories(subsRes.data.data);
        }
      } catch (_) {}
    };

    fetchTaxonomy();
  }, []);

  // Compute available subcategories for currently selected category
  const selectedCatObj = categories.find(
    c => c.name.toLowerCase() === formData.category.toLowerCase() || String(c._id) === formData.category
  );
  const selectedCatId = selectedCatObj ? String(selectedCatObj._id) : '';

  const availableSubcategories = subcategories.filter(s => {
    return (
      (selectedCatId && String(s.categoryId) === selectedCatId) ||
      (s.categoryName && s.categoryName.toLowerCase() === formData.category.toLowerCase())
    );
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    const catObj = categories.find(
      c => c.name.toLowerCase() === newCategory.toLowerCase() || String(c._id) === newCategory
    );
    const catId = catObj ? String(catObj._id) : '';

    const matchingSubs = subcategories.filter(s =>
      (catId && String(s.categoryId) === catId) ||
      (s.categoryName && s.categoryName.toLowerCase() === newCategory.toLowerCase())
    );

    setFormData(prev => ({
      ...prev,
      category: newCategory,
      subCategory: matchingSubs[0]?.name || ''
    }));

    if (formErrors.category) {
      setFormErrors(prev => {
        const next = { ...prev };
        delete next.category;
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    // ZOD VALIDATION
    const validation = productAddSchema.safeParse({
      title: formData.title,
      category: formData.category,
      subCategory: formData.subCategory,
      price: formData.price,
      discountPrice: formData.discountPrice ? formData.discountPrice : undefined,
      stock: formData.stock,
      vendorName: formData.vendorName,
      description: formData.description,
      imageUrl: formData.imageUrl
    });

    if (!validation.success) {
      const errMap: Record<string, string> = {};
      for (const issue of validation.error.issues) {
        const key = issue.path[0] as string;
        if (!errMap[key]) errMap[key] = issue.message;
      }
      setFormErrors(errMap);
      setGeneralError('Please correct the highlighted form errors before submitting.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      title: formData.title.trim(),
      category: formData.category,
      subCategory: formData.subCategory || 'Handcrafted Heritage',
      price: Number(formData.price),
      discountPrice: formData.discountPrice ? Number(formData.discountPrice) : 0,
      stock: Number(formData.stock) || 10,
      vendorName: formData.vendorName.trim(),
      description: formData.description.trim(),
      images: [formData.imageUrl]
    };

    try {
      const res = await apiClient.post(API_ENDPOINTS.PRODUCTS.CREATE, payload, {
        headers: { 'x-user-role': 'vendor' }
      });
      if (res.data?.success) {
        setSubmittedProductTitle(payload.title);
        setIsSuccess(true);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to submit product. Please try again.';
      setGeneralError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSuccess(false);
    setSubmittedProductTitle('');
    setFormData({
      title: '',
      category: categories[0]?.name || '',
      subCategory: '',
      price: '',
      discountPrice: '',
      stock: '15',
      vendorName: 'Jaipur Heritage Weaves',
      description: '',
      imageUrl: ''
    });
    setFormErrors({});
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50/60 text-zinc-900">
      <Navbar />

      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-stone-200/80 py-3.5">
        <div className="w-full px-4 sm:px-8 lg:px-12">
          <nav className="flex items-center gap-2 text-xs text-zinc-500">
            <Link href="/" className="hover:text-blue-900 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-zinc-400" />
            <span className="text-zinc-500">Artisan Portal</span>
            <ChevronRight className="w-3 h-3 text-zinc-400" />
            <span className="text-zinc-900 font-semibold">List Handcrafted Product</span>
          </nav>
        </div>
      </div>

      <main className="w-full px-4 sm:px-8 lg:px-12 py-10 flex-1">
        {/* Page Hero Header */}
        <div className="w-full mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 text-blue-900 text-xs font-semibold uppercase tracking-wider mb-3 border border-blue-200/70">
            <Sparkles className="w-3.5 h-3.5 text-blue-900" />
            <span>Artisan Storefront Onboarding</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl font-serif">
            Submit Your Handcrafted Masterpiece
          </h1>
          <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
            Directly connect with patrons of authentic Indian craftsmanship. Every listing is reviewed by our curators to ensure genuine artisan heritage.
          </p>
        </div>

        {isSuccess ? (
          /* SUCCESS CONFIRMATION STATE */
          <div className="max-w-2xl mx-auto bg-white border border-stone-200 rounded-3xl p-8 sm:p-12 text-center shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-5 border border-emerald-100">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 font-serif">
              Submission Received for Verification!
            </h2>
            <p className="mt-3 text-sm text-zinc-600 leading-relaxed max-w-lg mx-auto">
              <strong className="text-zinc-900 font-semibold">{submittedProductTitle}</strong> has been submitted. Our Super Admin team will verify the artisan provenance, after which it will appear live on the Amba Lifestyle storefront.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                onClick={resetForm}
                className="w-full sm:w-auto bg-blue-900 hover:bg-blue-950 text-white rounded-xl px-6 py-2.5 text-xs font-semibold shadow-xs"
              >
                Submit Another Product
              </Button>
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-xl border border-stone-300 text-zinc-700 hover:bg-stone-50 text-xs font-semibold transition-colors"
              >
                Back to Catalog
              </Link>
            </div>
          </div>
        ) : (
          /* TWO-COLUMN LAYOUT: FORM (7 COLS) + LIVE PREVIEW (5 COLS) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT: SUBMISSION FORM */}
            <div className="lg:col-span-7 bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {generalError && (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{generalError}</span>
                  </div>
                )}

                {/* Section 1: Classification */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                    <Layers className="w-4 h-4 text-blue-900" />
                    <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                      1. Craft Classification
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                      label="Product Category *"
                      name="category"
                      value={formData.category}
                      onChange={handleCategoryChange}
                      options={
                        categories.length > 0
                          ? [
                              { value: '', label: '-- Select Master Category --' },
                              ...categories.map(c => ({ value: c.name, label: c.name }))
                            ]
                          : [{ value: '', label: 'Loading categories...' }]
                      }
                      focusRingColor="focus:ring-blue-900"
                      error={formErrors.category}
                    />

                    <Select
                      label="Subcategory"
                      name="subCategory"
                      value={formData.subCategory}
                      onChange={handleInputChange}
                      options={
                        !formData.category
                          ? [{ value: '', label: '-- Select Category First --' }]
                          : availableSubcategories.length > 0
                          ? [
                              { value: '', label: '-- Select Subcategory --' },
                              ...availableSubcategories.map(s => ({ value: s.name, label: s.name }))
                            ]
                          : [{ value: '', label: 'No Subcategories under this Category' }]
                      }
                      disabled={!formData.category || availableSubcategories.length === 0}
                      focusRingColor="focus:ring-blue-900"
                      error={formErrors.subCategory}
                    />
                  </div>
                </div>

                {/* Section 2: Product & Workshop Details */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                    <Store className="w-4 h-4 text-blue-900" />
                    <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                      2. Product & Artisan Details
                    </h2>
                  </div>

                  <Input
                    label="Product Title *"
                    name="title"
                    placeholder="e.g. Handloom Pure Chanderi Silk Saree with Zari Border"
                    value={formData.title}
                    onChange={handleInputChange}
                    error={formErrors.title}
                  />

                  <Input
                    label="Artisan / Guild Name *"
                    name="vendorName"
                    placeholder="e.g. Chanderi Heritage Weavers Guild"
                    value={formData.vendorName}
                    onChange={handleInputChange}
                    error={formErrors.vendorName}
                  />

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-zinc-700">
                      Craft Story & Description <span className="text-rose-500 font-bold ml-0.5">*</span>
                    </label>
                    <textarea
                      name="description"
                      rows={4}
                      placeholder="Detail the materials used (e.g. pure tussar silk, vegetable dyes), traditional weaving technique, and artisan origin..."
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 text-sm bg-white text-zinc-900 border border-stone-300 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 placeholder-zinc-400"
                    />
                    {formErrors.description && (
                      <p className="text-xs text-rose-500">{formErrors.description}</p>
                    )}
                  </div>
                </div>

                {/* Section 3: Pricing & Inventory */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                    <Package className="w-4 h-4 text-blue-900" />
                    <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                      3. Pricing & Inventory
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input
                      label="Selling Price (₹) *"
                      name="price"
                      type="number"
                      placeholder="e.g. 4499"
                      value={formData.price}
                      onChange={handleInputChange}
                      error={formErrors.price}
                    />

                    <Input
                      label="MRP / Strike Price (₹)"
                      name="discountPrice"
                      type="number"
                      placeholder="e.g. 5999"
                      value={formData.discountPrice}
                      onChange={handleInputChange}
                      error={formErrors.discountPrice}
                    />

                    <Input
                      label="Available Stock (Pcs) *"
                      name="stock"
                      type="number"
                      placeholder="e.g. 20"
                      value={formData.stock}
                      onChange={handleInputChange}
                      error={formErrors.stock}
                    />
                  </div>
                </div>

                {/* Section 4: Craft Photography */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                    <Eye className="w-4 h-4 text-blue-900" />
                    <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                      4. High-Resolution Craft Image
                    </h2>
                  </div>

                  <ImageUpload
                    label="Upload Craft Photography"
                    value={formData.imageUrl}
                    onChange={base64 => {
                      setFormData(prev => ({ ...prev, imageUrl: base64 }));
                      if (formErrors.imageUrl) {
                        setFormErrors(prev => {
                          const next = { ...prev };
                          delete next.imageUrl;
                          return next;
                        });
                      }
                    }}
                    error={formErrors.imageUrl}
                    required
                  />
                </div>

                {/* Submit Action Button */}
                <div className="pt-6 border-t border-stone-100 flex items-center justify-between gap-4">
                  <Link
                    href="/"
                    className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
                  >
                    Cancel
                  </Link>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-900 hover:bg-blue-950 text-white rounded-xl px-7 py-3 text-xs font-semibold shadow-sm transition-all"
                  >
                    {isSubmitting ? 'Verifying & Submitting...' : 'Submit Craft for Storefront Review'}
                  </Button>
                </div>
              </form>
            </div>

            {/* RIGHT: LIVE STOREFRONT PREVIEW */}
            <div className="lg:col-span-5 sticky top-24 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-900" />
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                    Live Storefront Preview
                  </span>
                </div>
                <span className="text-[11px] text-blue-900 font-medium bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60">
                  Real-time Simulation
                </span>
              </div>

              {/* The Live Product Card */}
              <div className="max-w-sm mx-auto w-full">
                <ProductCard
                  id="preview"
                  title={formData.title.trim() || 'Handloom Pure Tussar Silk Saree with Madhubani Motifs'}
                  category={formData.category || 'Ethnic Wear'}
                  price={Number(formData.price) || 4499}
                  discountPrice={formData.discountPrice ? Number(formData.discountPrice) : 5999}
                  imageUrl={
                    formData.imageUrl ||
                    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'
                  }
                  rating={4.9}
                  isNew={true}
                />
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/60 text-xs text-blue-900 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-blue-950">
                  <Info className="w-4 h-4 text-blue-900" />
                  <span>Curation Standard</span>
                </div>
                <p className="text-[11px] leading-relaxed text-blue-900/90">
                  Products listed on Amba Lifestyle must be handmade or artisan-crafted. Our review process takes under 24 hours. Once approved, your listing becomes instantly shoppable across India.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

