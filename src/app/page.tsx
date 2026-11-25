'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FilePlus,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Upload,
  Image as ImageIcon,
  Mail,
  Phone,
  RefreshCw,
  Eye,
  X,
  Layers,
  ExternalLink,
  ChevronRight,
  Send,
  Lock,
  DollarSign,
  MessageSquare,
  Plus,
  Shirt,
  Gem,
  Home,
  Palette,
  ShoppingBag,
  ImageOff,
  User,
  MapPin,
  Building2
} from 'lucide-react';
import { apiClient, API_ENDPOINTS } from '@/lib/api';
import { Dropdown } from '@/components/ui/Dropdown';

type CategoryType = 'fashion' | 'jewelry' | 'home_decor' | 'other';

export interface InquiryMessage {
  _id?: string;
  sender: 'customer' | 'admin';
  senderName: string;
  message: string;
  attachments?: string[];
  createdAt: string;
}

interface CustomerInquiry {
  _id: string;
  inquiryNumber: string;
  email: string;
  name: string;
  fullName?: string;
  address?: string;
  pincode?: string;
  category?: CategoryType;
  size: string;
  specifications?: Record<string, any>;
  quantity: number;
  description?: string;
  phone?: string;
  images?: string[];
  status: 'pending' | 'in_review' | 'quoted' | 'approved' | 'rejected';
  quotedPrice?: number;
  adminNotes?: string;
  messages?: InquiryMessage[];
  timeline?: Array<{
    status: string;
    note: string;
    updatedAt: string;
  }>;
  createdAt: string;
}

const CATEGORY_CONFIG = [
  {
    id: 'fashion' as CategoryType,
    label: 'Fashion & Apparel',
    icon: Shirt,
    desc: 'Sarees, Kurtis, Lehengas, Ethnic Wear, Handloom Fabrics'
  },
  {
    id: 'jewelry' as CategoryType,
    label: 'Jewelry & Silverware',
    icon: Gem,
    desc: '92.5 Sterling Silver, Kundan, Polki, Bangles, Utensils'
  },
  {
    id: 'home_decor' as CategoryType,
    label: 'Home Decor & Crafts',
    icon: Home,
    desc: 'Brass Urli, Hand-carved Wood, Blue Pottery, Marble'
  },
  {
    id: 'other' as CategoryType,
    label: 'Other Custom Craft',
    icon: Palette,
    desc: 'Handmade paper, leather goods, specialized artisan gifts'
  }
];

export default function RequirementPortal() {
  const [activeTab, setActiveTab] = useState<'products' | 'submit' | 'track'>('products');

  // CATALOG PRODUCTS STATE (ADMIN-ADDED PRODUCTS)
  const [catalogProducts, setCatalogProducts] = useState<any[]>([]);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState<boolean>(true);
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<string>('All');
  const [selectedProductForInquiry, setSelectedProductForInquiry] = useState<any | null>(null);
  const [inquireCustomerName, setInquireCustomerName] = useState<string>('');
  const [inquireCustomerAddress, setInquireCustomerAddress] = useState<string>('');
  const [inquireCustomerPincode, setInquireCustomerPincode] = useState<string>('');
  const [inquireCustomerQuantity, setInquireCustomerQuantity] = useState<number>(1);
  const [inquireCustomerEmail, setInquireCustomerEmail] = useState<string>('');
  const [inquireCustomerPhone, setInquireCustomerPhone] = useState<string>('');
  const [inquireCustomerMessage, setInquireCustomerMessage] = useState<string>('');
  const [isSubmittingProductInquiry, setIsSubmittingProductInquiry] = useState<boolean>(false);
  const [inquireOtpSent, setInquireOtpSent] = useState<boolean>(false);
  const [inquireOtp, setInquireOtp] = useState<string>('');
  const [inquireDevOtp, setInquireDevOtp] = useState<string | null>(null);
  const [isSendingInquireOtp, setIsSendingInquireOtp] = useState<boolean>(false);

  // Dynamic distinct companies list and filtered products
  const availableCompanies = Array.from(
    new Set([
      ...catalogProducts.map(p => (p.companyName || p.vendorName || '').trim()).filter(Boolean)
    ])
  );

  const filteredCatalogProducts = catalogProducts.filter((p) => {
    if (selectedCompanyFilter === 'All') return true;
    const comp = (p.companyName || p.vendorName || '').trim().toLowerCase();
    return comp === selectedCompanyFilter.toLowerCase();
  });

  // SUBMIT FORM STATE - GENERAL
  const [category, setCategory] = useState<CategoryType>('fashion');
  const [productName, setProductName] = useState<string>('');
  const [userFullName, setUserFullName] = useState<string>('');
  const [userAddress, setUserAddress] = useState<string>('');
  const [userPincode, setUserPincode] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [description, setDescription] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userPhone, setUserPhone] = useState<string>('');

  // FASHION SPECIFIC FIELDS
  const [fashionGender, setFashionGender] = useState<string>("Women's Wear");
  const [fashionSize, setFashionSize] = useState<string>('M (38)');
  const [fashionFabric, setFashionFabric] = useState<string>('Pure Handloom Silk');
  const [fashionColorWork, setFashionColorWork] = useState<string>('');
  const [fashionCustomMeasurements, setFashionCustomMeasurements] = useState<string>('');

  // JEWELRY SPECIFIC FIELDS
  const [jewelryType, setJewelryType] = useState<string>('Necklace & Choker');
  const [metalPurity, setMetalPurity] = useState<string>('92.5 Sterling Silver');
  const [gemstoneType, setGemstoneType] = useState<string>('Kundan & Polki');
  const [jewelrySize, setJewelrySize] = useState<string>('Standard (16"-18")');
  const [estimatedWeight, setEstimatedWeight] = useState<string>('');

  // HOME DECOR SPECIFIC FIELDS
  const [craftMedium, setCraftMedium] = useState<string>('Solid Brass & Bronze');
  const [decorDimensions, setDecorDimensions] = useState<string>('');
  const [decorFinish, setDecorFinish] = useState<string>('Antique Polish with Lacquer');

  // OTHER CRAFT FIELDS
  const [otherSizeSpec, setOtherSizeSpec] = useState<string>('');

  // SUBMIT OTP FLOW
  const [submitOtpSent, setSubmitOtpSent] = useState<boolean>(false);
  const [submitOtp, setSubmitOtp] = useState<string>('');
  const [submitDevOtp, setSubmitDevOtp] = useState<string | null>(null);
  const [isSendingSubmitOtp, setIsSendingSubmitOtp] = useState<boolean>(false);
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState<boolean>(false);
  const [submittedInquiry, setSubmittedInquiry] = useState<CustomerInquiry | null>(null);

  // TRACK STATUS FLOW
  const [trackEmail, setTrackEmail] = useState<string>('');
  const [trackOtpSent, setTrackOtpSent] = useState<boolean>(false);
  const [trackOtp, setTrackOtp] = useState<string>('');
  const [trackDevOtp, setTrackDevOtp] = useState<string | null>(null);
  const [isSendingTrackOtp, setIsSendingTrackOtp] = useState<boolean>(false);
  const [isVerifyingTrack, setIsVerifyingTrack] = useState<boolean>(false);
  const [isTrackVerified, setIsTrackVerified] = useState<boolean>(false);
  const [myInquiries, setMyInquiries] = useState<CustomerInquiry[]>([]);

  // INQUIRY MESSAGING STATE
  const [messageInputs, setMessageInputs] = useState<Record<string, string>>({});
  const [sendingMessageIds, setSendingMessageIds] = useState<Record<string, boolean>>({});
  const [messageSuccessToast, setMessageSuccessToast] = useState<{ id: string; text: string } | null>(null);
  const [isRefreshingInquiries, setIsRefreshingInquiries] = useState<boolean>(false);

  // NOTIFICATION & IMAGE PREVIEW
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [previewImageModal, setPreviewImageModal] = useState<string | null>(null);

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 6000);
  };

  // Helper to compute effective primary size string based on chosen category
  const getComputedSizeString = (): string => {
    if (category === 'fashion') {
      const base = `${fashionGender} - ${fashionSize} (${fashionFabric})`;
      return fashionCustomMeasurements ? `${base} [${fashionCustomMeasurements}]` : base;
    }
    if (category === 'jewelry') {
      const wt = estimatedWeight ? `, ${estimatedWeight}` : '';
      return `${jewelryType} (${jewelrySize}) - ${metalPurity}${wt}`;
    }
    if (category === 'home_decor') {
      return `${decorDimensions} [${craftMedium}, ${decorFinish}]`;
    }
    return otherSizeSpec || 'Custom Specifications';
  };

  // Helper to compile structured specifications object
  const getComputedSpecifications = () => {
    if (category === 'fashion') {
      return {
        gender: fashionGender,
        apparelSize: fashionSize,
        fabric: fashionFabric,
        colorAndWork: fashionColorWork,
        customMeasurements: fashionCustomMeasurements
      };
    }
    if (category === 'jewelry') {
      return {
        jewelryType,
        metalPurity,
        gemstoneType,
        jewelrySize,
        estimatedWeight
      };
    }
    if (category === 'home_decor') {
      return {
        craftMedium,
        dimensions: decorDimensions,
        finish: decorFinish
      };
    }
    return {
      specifications: otherSizeSpec
    };
  };

  // Handle multiple local image files upload & convert to Base64
  const handleMultipleImageFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    let loadedCount = 0;
    const newImageUrls: string[] = [];

    fileList.forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        showToast('error', `"${file.name}" is too large. Max 10MB per image.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          newImageUrls.push(reader.result);
        }
        loadedCount++;
        if (loadedCount === fileList.length) {
          setImages((prev) => [...prev, ...newImageUrls]);
          showToast('success', `Added ${newImageUrls.length} photo(s) successfully!`);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // CLEAR / RESET SUBMISSION FORM INPUT DATA
  const resetSubmitForm = () => {
    setCategory('fashion');
    setProductName('');
    setUserFullName('');
    setUserAddress('');
    setUserPincode('');
    setQuantity(1);
    setDescription('');
    setImages([]);
    setUserEmail('');
    setUserPhone('');

    // Fashion
    setFashionGender("Women's Wear");
    setFashionSize('M (38)');
    setFashionFabric('Pure Handloom Silk');
    setFashionColorWork('');
    setFashionCustomMeasurements('');

    // Jewelry
    setJewelryType('Necklace & Choker');
    setMetalPurity('92.5 Sterling Silver');
    setGemstoneType('Kundan & Polki');
    setJewelrySize('Standard (16"-18")');
    setEstimatedWeight('');

    // Home Decor
    setCraftMedium('Solid Brass & Bronze');
    setDecorDimensions('');
    setDecorFinish('Antique Polish with Lacquer');

    // Other Craft
    setOtherSizeSpec('');

    // Submit OTP State
    setSubmitOtpSent(false);
    setSubmitOtp('');
    setSubmitDevOtp(null);
  };

  // SEND OTP FOR SUBMIT
  const handleSendSubmitOtp = async () => {
    if (!userFullName.trim()) {
      showToast('error', 'Please enter your Full Name');
      return;
    }

    if (!userEmail || !userEmail.includes('@')) {
      showToast('error', 'Please enter a valid email address');
      return;
    }

    if (!userAddress.trim()) {
      showToast('error', 'Please enter your Delivery Address');
      return;
    }

    if (!userPincode.trim() || userPincode.length < 6) {
      showToast('error', 'Please enter a valid 6-digit Pincode');
      return;
    }

    if (!productName.trim()) {
      showToast('error', 'Please enter the Requirement / Product Name first');
      return;
    }

    setIsSendingSubmitOtp(true);
    try {
      const res = await apiClient.post(API_ENDPOINTS.INQUIRIES.SEND_OTP, {
        email: userEmail.trim(),
        purpose: 'inquiry_submit'
      });

      setSubmitOtpSent(true);
      const code = res.data?.data?.devOtp;
      if (code) {
        setSubmitDevOtp(code);
        setSubmitOtp(code);
      }
      showToast('success', `Verification OTP sent to ${userEmail}!`);
    } catch (err: any) {
      showToast('error', err.response?.data?.message || 'Failed to send verification OTP');
    } finally {
      setIsSendingSubmitOtp(false);
    }
  };

  // SUBMIT INQUIRY WITH OTP
  const handleSubmitRequirement = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userFullName.trim()) {
      showToast('error', 'Please enter your Full Name');
      return;
    }

    if (!productName.trim() || !userEmail.trim()) {
      showToast('error', 'Product Name and Email are required');
      return;
    }

    if (!userAddress.trim()) {
      showToast('error', 'Please enter your Delivery Address');
      return;
    }

    if (!userPincode.trim() || userPincode.length < 6) {
      showToast('error', 'Please enter a valid 6-digit Pincode');
      return;
    }

    if (!submitOtp.trim()) {
      showToast('error', 'Please enter the 6-digit OTP sent to your email');
      return;
    }

    const computedSize = getComputedSizeString();
    const computedSpecs = getComputedSpecifications();

    setIsSubmittingInquiry(true);
    try {
      const payload = {
        name: productName.trim(),
        fullName: userFullName.trim(),
        address: userAddress.trim(),
        pincode: userPincode.trim(),
        quantity: Number(quantity) || 1,
        category,
        size: computedSize,
        specifications: computedSpecs,
        description: description.trim(),
        email: userEmail.trim().toLowerCase(),
        phone: userPhone.trim(),
        images: images,
        inquiryType: 'custom_requirement',
        isDirectProductInquiry: false,
        otp: submitOtp.trim()
      };

      const res = await apiClient.post(API_ENDPOINTS.INQUIRIES.CREATE, payload);
      const created = res.data?.data;
      setSubmittedInquiry(created);
      showToast('success', `Requirement submitted successfully! Reference: #${created.inquiryNumber}`);

      // Clear all input data after successful submission
      resetSubmitForm();
    } catch (err: any) {
      showToast('error', err.response?.data?.message || 'Submission failed. Please check OTP and try again.');
    } finally {
      setIsSubmittingInquiry(false);
    }
  };

  // SEND OTP FOR TRACKING
  const handleSendTrackOtp = async () => {
    if (!trackEmail || !trackEmail.includes('@')) {
      showToast('error', 'Please enter a valid email address');
      return;
    }

    setIsSendingTrackOtp(true);
    try {
      const res = await apiClient.post(API_ENDPOINTS.INQUIRIES.SEND_OTP, {
        email: trackEmail.trim(),
        purpose: 'inquiry_track'
      });

      setTrackOtpSent(true);
      const code = res.data?.data?.devOtp;
      if (code) {
        setTrackDevOtp(code);
        setTrackOtp(code);
      }
      showToast('success', `Verification OTP sent to ${trackEmail}!`);
    } catch (err: any) {
      showToast('error', err.response?.data?.message || 'Failed to send tracking OTP');
    } finally {
      setIsSendingTrackOtp(false);
    }
  };

  // FETCH MY INQUIRIES WITH OTP
  const handleVerifyAndFetchInquiries = async () => {
    if (!trackEmail.trim() || !trackOtp.trim()) {
      showToast('error', 'Please enter your email and the 6-digit OTP');
      return;
    }

    setIsVerifyingTrack(true);
    try {
      const res = await apiClient.post(API_ENDPOINTS.INQUIRIES.MY_INQUIRIES, {
        email: trackEmail.trim().toLowerCase(),
        otp: trackOtp.trim()
      });

      const list = res.data?.data || [];
      setMyInquiries(list);
      setIsTrackVerified(true);
      showToast('success', `Found ${list.length} inquiry record(s) for your email`);
    } catch (err: any) {
      showToast('error', err.response?.data?.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      setIsVerifyingTrack(false);
    }
  };

  // REFRESH INQUIRIES AND LIVE MESSAGES WITHOUT PAGE RELOAD
  const handleRefreshMyInquiries = async (silent = false) => {
    if (!trackEmail.trim()) return;
    if (!silent) setIsRefreshingInquiries(true);
    try {
      const res = await apiClient.post(API_ENDPOINTS.INQUIRIES.MY_INQUIRIES, {
        email: trackEmail.trim().toLowerCase(),
        otp: trackOtp.trim()
      });

      if (res.data?.data) {
        setMyInquiries(res.data.data);
        if (!silent) {
          showToast('success', 'Latest messages and inquiry updates loaded!');
        }
      }
    } catch (err: any) {
      if (!silent) {
        console.error('Failed to refresh inquiries:', err);
      }
    } finally {
      if (!silent) setIsRefreshingInquiries(false);
    }
  };

  // Auto-refresh when customer switches to Track tab
  useEffect(() => {
    if (activeTab === 'track' && isTrackVerified && trackEmail.trim()) {
      handleRefreshMyInquiries(true);
    }
  }, [activeTab]);

  // Auto-refresh when customer switches back to this browser window
  useEffect(() => {
    const handleFocus = () => {
      if (isTrackVerified && trackEmail.trim()) {
        handleRefreshMyInquiries(true);
      }
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [isTrackVerified, trackEmail, trackOtp]);

  // SEND CUSTOMER MESSAGE TO ADMIN FOR AN INQUIRY
  const handleSendMessage = async (inq: CustomerInquiry) => {
    const inqKey = inq.inquiryNumber || inq._id;
    const text = (messageInputs[inqKey] || '').trim();
    if (!text) return;

    setSendingMessageIds((prev) => ({ ...prev, [inqKey]: true }));
    try {
      const res = await apiClient.post(API_ENDPOINTS.INQUIRIES.ADD_MESSAGE(inqKey), {
        message: text,
        sender: 'customer',
        senderName: inq.name || trackEmail || 'Customer'
      });

      const newMsg: InquiryMessage = res.data?.data?.message || {
        _id: 'msg_' + Date.now(),
        sender: 'customer',
        senderName: inq.name || trackEmail || 'Customer',
        message: text,
        createdAt: new Date().toISOString()
      };

      setMyInquiries((prev) =>
        prev.map((item) => {
          if ((item.inquiryNumber && item.inquiryNumber === inq.inquiryNumber) || item._id === inq._id) {
            return {
              ...item,
              messages: [...(item.messages || []), newMsg]
            };
          }
          return item;
        })
      );

      setMessageInputs((prev) => ({ ...prev, [inqKey]: '' }));
      setMessageSuccessToast({ id: inqKey, text: 'Message delivered to Admin successfully!' });
      setTimeout(() => setMessageSuccessToast(null), 4000);
      handleRefreshMyInquiries(true);
    } catch (err: any) {
      console.error('Failed to send message:', err);
      showToast('error', err?.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setSendingMessageIds((prev) => ({ ...prev, [inqKey]: false }));
    }
  };

  // CATALOG PRODUCTS FETCHING & DIRECT PRODUCT INQUIRY (ACTIVE ONLY)
  const fetchCatalogProducts = async () => {
    setIsLoadingCatalog(true);
    try {
      const res = await apiClient.get(API_ENDPOINTS.PRODUCTS.LIST + '?limit=50&approvalStatus=approved');
      if (res.data?.data) {
        const activeOnly = res.data.data.filter((p: any) =>
          p.approvalStatus === 'approved' && p.status !== 'inactive'
        );
        setCatalogProducts(activeOnly);
      }
    } catch (_) { }
    finally {
      setIsLoadingCatalog(false);
    }
  };

  useEffect(() => {
    fetchCatalogProducts();
  }, []);

  const handleOpenProductInquiry = (product: any) => {
    setSelectedProductForInquiry(product);
    setInquireCustomerName('');
    setInquireCustomerAddress('');
    setInquireCustomerPincode('');
    setInquireCustomerQuantity(1);
    setInquireCustomerEmail('');
    setInquireCustomerPhone('');
    setInquireOtpSent(false);
    setInquireOtp('');
    setInquireDevOtp(null);
    setInquireCustomerMessage(`I am interested in ${product.title || product.name} (Price: ₹${product.price}). Please send further details.`);
  };

  const handleSendInquireOtp = async () => {
    if (!inquireCustomerName.trim()) {
      showToast('error', 'Please enter your Full Name');
      return;
    }
    if (!inquireCustomerEmail || !inquireCustomerEmail.includes('@')) {
      showToast('error', 'Please enter a valid email address');
      return;
    }
    if (!inquireCustomerAddress.trim()) {
      showToast('error', 'Please enter your Delivery Address');
      return;
    }
    if (!inquireCustomerPincode.trim() || inquireCustomerPincode.length < 6) {
      showToast('error', 'Please enter a valid 6-digit Pincode');
      return;
    }
    if (!inquireCustomerQuantity || inquireCustomerQuantity < 1) {
      showToast('error', 'Quantity must be at least 1');
      return;
    }

    setIsSendingInquireOtp(true);
    try {
      const res = await apiClient.post(API_ENDPOINTS.INQUIRIES.SEND_OTP, {
        email: inquireCustomerEmail.trim().toLowerCase(),
        purpose: 'inquiry_submit'
      });

      setInquireOtpSent(true);
      const code = res.data?.data?.devOtp;
      if (code) {
        setInquireDevOtp(code);
        setInquireOtp(code);
      }
      showToast('success', `Verification OTP sent to ${inquireCustomerEmail}!`);
    } catch (err: any) {
      showToast('error', err.response?.data?.message || 'Failed to send verification OTP');
    } finally {
      setIsSendingInquireOtp(false);
    }
  };

  const handleSubmitProductInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductForInquiry) return;
    if (!inquireCustomerName.trim()) {
      showToast('error', 'Please enter your Full Name');
      return;
    }
    if (!inquireCustomerEmail || !inquireCustomerEmail.includes('@')) {
      showToast('error', 'Please enter a valid email address');
      return;
    }
    if (!inquireCustomerAddress.trim()) {
      showToast('error', 'Please enter your Delivery Address');
      return;
    }
    if (!inquireCustomerPincode.trim() || inquireCustomerPincode.length < 6) {
      showToast('error', 'Please enter a valid 6-digit Pincode');
      return;
    }
    if (!inquireCustomerQuantity || inquireCustomerQuantity < 1) {
      showToast('error', 'Quantity must be at least 1');
      return;
    }
    if (!inquireOtp.trim()) {
      showToast('error', 'Please enter the 6-digit verification OTP');
      return;
    }

    setIsSubmittingProductInquiry(true);
    try {
      const pName = selectedProductForInquiry.title || selectedProductForInquiry.name;
      const pPrice = selectedProductForInquiry.price;
      const pImg = selectedProductForInquiry.images?.[0] || selectedProductForInquiry.imageUrl || '';
      const payload = {
        name: pName,
        fullName: inquireCustomerName.trim(),
        address: inquireCustomerAddress.trim(),
        pincode: inquireCustomerPincode.trim(),
        quantity: Number(inquireCustomerQuantity) || 1,
        category: selectedProductForInquiry.category || 'other',
        size: `Catalog Price: ₹${pPrice}`,
        description: inquireCustomerMessage.trim() || `Inquiry for ${pName} (₹${pPrice})`,
        email: inquireCustomerEmail.trim().toLowerCase(),
        phone: inquireCustomerPhone.trim(),
        images: pImg ? [pImg] : [],
        isDirectProductInquiry: true,
        inquiryType: 'artisan_product',
        price: pPrice,
        otp: inquireOtp.trim()
      };

      const res = await apiClient.post(API_ENDPOINTS.INQUIRIES.CREATE, payload);
      const created = res.data?.data;

      showToast('success', `Inquiry for "${pName}" (Qty: ${inquireCustomerQuantity}) submitted successfully!`);
      setSelectedProductForInquiry(null);

      // Immediately switch to track inquiries tab and display this product inquiry
      const cleanEmail = inquireCustomerEmail.trim().toLowerCase();
      setTrackEmail(cleanEmail);
      setIsTrackVerified(true);
      if (created) {
        setMyInquiries((prev) => [created, ...prev.filter(item => item.inquiryNumber !== created.inquiryNumber)]);
      }
      setActiveTab('track');
    } catch (err: any) {
      showToast('error', err?.response?.data?.message || 'Failed to submit inquiry');
    } finally {
      setIsSubmittingProductInquiry(false);
    }
  };

  const getStatusBadge = (status: CustomerInquiry['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200">
            <Clock className="w-3.5 h-3.5 text-blue-800" /> Pending Admin Review
          </span>
        );
      case 'in_review':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" /> In Feasibility Review
          </span>
        );
      case 'quoted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200">
            <DollarSign className="w-3.5 h-3.5 text-purple-600" /> Price Quoted
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Approved & In Production
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
            <X className="w-3.5 h-3.5 text-rose-600" /> Cannot Fulfill
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-zinc-100 text-zinc-800">
            {status}
          </span>
        );
    }
  };

  const getCategoryBadge = (cat?: CategoryType) => {
    switch (cat) {
      case 'fashion':
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded text-[11px] font-bold">👗 Fashion & Apparel</span>;
      case 'jewelry':
        return <span className="bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded text-[11px] font-bold">💎 Jewelry & Silverware</span>;
      case 'home_decor':
        return <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-bold">🏺 Home Decor & Crafts</span>;
      default:
        return <span className="bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded text-[11px] font-bold">✨ Custom Craft</span>;
    }
  };

  const currentCategoryConfig = CATEGORY_CONFIG.find((c) => c.id === category);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col font-sans">
      {/* 1. TOP BRAND NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-blue-200/60 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-900 flex items-center justify-center text-white font-serif font-black text-xl shadow-md shadow-blue-900/20">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-black tracking-tight text-zinc-900">
                  AMBA LIFESTYLE
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full border border-blue-200">
                  Customer Portal
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 font-medium">Custom Craft & Manufacturing Requirements</p>
            </div>
          </div>
        </div>
      </header>

      {/* TOAST ALERT */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 animate-slideIn">
          <div
            className={`px-4 py-3 rounded-xl shadow-xl border flex items-center gap-3 text-sm font-medium ${toast.type === 'success'
              ? 'bg-emerald-900 text-emerald-50 border-emerald-700 shadow-emerald-950/20'
              : toast.type === 'error'
                ? 'bg-rose-900 text-rose-50 border-rose-700 shadow-rose-950/20'
                : 'bg-zinc-900 text-zinc-50 border-zinc-700'
              }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-2 text-zinc-400 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. HERO HEADER & TAB SWITCHER */}
      <section className="pt-8 pb-6 px-4 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-blue-900 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-blue-800" />
          <span>Verified Artisan Sourcing & Direct Quotation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight font-serif">
          Custom Requirement & Inquiry Desk
        </h1>
        <p className="text-sm text-zinc-600 max-w-xl mx-auto mt-2 leading-relaxed">
          Select your category (Fashion, Jewelry, Home Decor), customize category-specific measurements, upload photos, and verify securely via Email OTP.
        </p>

        {/* HIGH-CONTRAST TABS */}
        <div className="mt-8 inline-flex p-1.5 bg-zinc-200/80 rounded-2xl shadow-inner border border-zinc-300/80 gap-1 flex-wrap justify-center">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${activeTab === 'products'
              ? 'bg-white text-zinc-900 shadow-md scale-[1.02]'
              : 'text-zinc-600 hover:text-zinc-900'
              }`}
          >
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
            <span>Art Products ({catalogProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('submit')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${activeTab === 'submit'
              ? 'bg-white text-zinc-900 shadow-md scale-[1.02]'
              : 'text-zinc-600 hover:text-zinc-900'
              }`}
          >
            <FilePlus className="w-4 h-4 text-blue-900" />
            <span>Submit Custom Requirement</span>
          </button>

          <button
            onClick={() => setActiveTab('track')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${activeTab === 'track'
              ? 'bg-white text-zinc-900 shadow-md scale-[1.02]'
              : 'text-zinc-600 hover:text-zinc-900'
              }`}
          >
            <Search className="w-4 h-4 text-blue-900" />
            <span>Track Inquiries & Messages</span>
          </button>
        </div>
      </section>

      {/* 3. MAIN WORKFLOW CONTAINER */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 pb-16">
        {/* ======================================================== */}
        {/* TAB 0: ARTISAN PRODUCTS CATALOG (ADMIN ADDED PRODUCTS)   */}
        {/* ======================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-xl shadow-zinc-200/50 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-emerald-600" />
                    <span>Art Products Catalog</span>
                  </h2>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Explore direct artisan products created by Amba Lifestyle. Click &quot;Inquire Now&quot; to send an inquiry directly to the Admin.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-500 bg-zinc-100 px-3 py-1 rounded-xl">
                    {filteredCatalogProducts.length} Product{filteredCatalogProducts.length !== 1 ? 's' : ''} Live
                  </span>
                  <button
                    onClick={fetchCatalogProducts}
                    className="p-1.5 text-zinc-400 hover:text-blue-900 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                    title="Refresh Products"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoadingCatalog ? 'animate-spin text-blue-900' : ''}`} />
                  </button>
                </div>
              </div>

              {/* DYNAMIC COMPANY FILTER (ALL + EACH COMPANY) */}
              {!isLoadingCatalog && catalogProducts.length > 0 && availableCompanies.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Company:</span>
                  </span>
                  <button
                    onClick={() => setSelectedCompanyFilter('All')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${selectedCompanyFilter === 'All'
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
                      }`}
                  >
                    <span>All</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${selectedCompanyFilter === 'All' ? 'bg-white/20 text-white font-bold' : 'bg-zinc-200 text-zinc-700 font-bold'
                      }`}>
                      {catalogProducts.length}
                    </span>
                  </button>

                  {availableCompanies.map((comp) => {
                    const count = catalogProducts.filter(
                      p => (p.companyName || p.vendorName || '').trim().toLowerCase() === comp.toLowerCase()
                    ).length;
                    const isSelected = selectedCompanyFilter.toLowerCase() === comp.toLowerCase();
                    return (
                      <button
                        key={comp}
                        onClick={() => setSelectedCompanyFilter(comp)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${isSelected
                          ? 'bg-blue-900 text-white shadow-xs'
                          : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
                          }`}
                      >
                        <Building2 className="w-3.5 h-3.5 shrink-0 opacity-70" />
                        <span>{comp}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${isSelected ? 'bg-white/20 text-white font-bold' : 'bg-zinc-200 text-zinc-700 font-bold'
                          }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {isLoadingCatalog ? (
                <div className="py-16 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 animate-spin text-blue-900 mx-auto" />
                  <p className="text-xs text-zinc-400 font-medium">Loading artisan catalog products...</p>
                </div>
              ) : catalogProducts.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-zinc-900">No Products in Catalog Yet</h3>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                    Products added by the admin will appear here instantly.
                  </p>
                  <button
                    onClick={() => setActiveTab('submit')}
                    className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <FilePlus className="w-4 h-4" />
                    <span>Submit a Custom Requirement</span>
                  </button>
                </div>
              ) : filteredCatalogProducts.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-800">No Products Found for &quot;{selectedCompanyFilter}&quot;</h3>
                  <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                    There are no products listed under this company currently.
                  </p>
                  <button
                    onClick={() => setSelectedCompanyFilter('All')}
                    className="px-3.5 py-1.5 bg-blue-900 text-white text-xs font-bold rounded-xl hover:bg-blue-950 transition-colors cursor-pointer"
                  >
                    View All Products
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredCatalogProducts.map((p) => {
                    const img = p.images?.[0] || p.imageUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80';
                    const title = p.title || p.name || 'Artisan Product';
                    const price = p.price || 0;
                    const cat = p.category || 'Handcrafted';
                    const compName = p.companyName || p.vendorName || '';

                    return (
                      <div
                        key={p._id || p.id}
                        className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                      >
                        <div>
                          {/* Image Thumbnail */}
                          <div className="relative aspect-square bg-zinc-100 overflow-hidden">
                            <img
                              src={img}
                              alt={title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <button
                              onClick={() => setPreviewImageModal(img)}
                              className="absolute top-2.5 right-2.5 p-1.5 bg-black/60 text-white rounded-lg hover:bg-black transition-colors cursor-pointer"
                              title="Enlarge Photo"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <span className="absolute bottom-2.5 left-2.5 text-[10px] font-bold bg-white/95 text-zinc-800 px-2.5 py-0.5 rounded-md shadow-xs">
                              {cat}
                            </span>
                          </div>

                          {/* Details */}
                          <div className="p-4 space-y-1.5">
                            {compName && (
                              <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-900 truncate bg-blue-50/80 px-2 py-0.5 rounded-md border border-blue-100 w-fit max-w-full">
                                <Building2 className="w-3 h-3 text-blue-800 shrink-0" />
                                <span className="truncate">{compName}</span>
                              </div>
                            )}
                            <h4 className="text-sm font-bold text-zinc-900 line-clamp-2 leading-snug">
                              {title}
                            </h4>
                            <p className="text-base font-black text-emerald-700">
                              ₹{price.toLocaleString()} <span className="text-[11px] font-normal text-zinc-500">INR</span>
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="p-4 pt-0 space-y-2">
                          <button
                            onClick={() => handleOpenProductInquiry(p)}
                            className="w-full py-2.5 bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>Inquire Now</span>
                          </button>
                          <button
                            onClick={() => {
                              setProductName(title);
                              if (p.images && p.images.length > 0) {
                                setImages([p.images[0]]);
                              } else if (p.imageUrl) {
                                setImages([p.imageUrl]);
                              } else {
                                setImages([]);
                              }
                              setDescription(`Customizing specs based on product: ${title} (Catalog Price: ₹${price})`);
                              setActiveTab('submit');
                              showToast('info', `Loaded "${title}" into Custom Requirement form`);
                            }}
                            className="w-full py-1.5 text-[11px] font-bold text-zinc-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer text-center"
                          >
                            Customize in Studio →
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 1: SUBMIT REQUIREMENT FORM */}
        {/* ======================================================== */}
        {activeTab === 'submit' && (
          <div className="space-y-6">
            {/* Success Card when just submitted */}
            {submittedInquiry && (
              <div className="p-6 bg-emerald-50 border-2 border-emerald-300 rounded-2xl shadow-lg text-emerald-950 animate-fadeIn">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-md">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-emerald-900">Requirement Submitted Successfully!</h3>
                      <span className="font-mono text-xs font-black bg-emerald-200 text-emerald-900 px-3 py-1 rounded-full border border-emerald-300">
                        {submittedInquiry.inquiryNumber}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-800 mt-1">
                      Our artisans and product team have received your requirement. You can track updates anytime with your email <strong>{submittedInquiry.email}</strong>.
                    </p>

                    <div className="mt-4 p-3.5 bg-white/80 rounded-xl border border-emerald-200 text-xs space-y-1.5">
                      <p><strong>Category:</strong> {getCategoryBadge(submittedInquiry.category)}</p>
                      {submittedInquiry.fullName && <p><strong>Full Name:</strong> {submittedInquiry.fullName}</p>}
                      <p><strong>Item Name:</strong> {submittedInquiry.name}</p>
                      <p><strong>Specifications / Size:</strong> {submittedInquiry.size}</p>
                      <p><strong>Quantity:</strong> {submittedInquiry.quantity} unit(s)</p>
                      {submittedInquiry.pincode && <p><strong>Pincode:</strong> {submittedInquiry.pincode}</p>}
                      {submittedInquiry.address && <p><strong>Delivery Address:</strong> {submittedInquiry.address}</p>}
                      <p><strong>Attached Photos:</strong> {submittedInquiry.images?.length || 0} photo(s)</p>
                      <p><strong>Status:</strong> <span className="text-blue-900 font-bold">Pending Review</span></p>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <button
                        onClick={() => {
                          setTrackEmail(submittedInquiry.email);
                          setActiveTab('track');
                          handleSendTrackOtp();
                        }}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>Track Status of This Inquiry</span>
                      </button>
                      <button
                        onClick={() => {
                          setSubmittedInquiry(null);
                          resetSubmitForm();
                        }}
                        className="px-4 py-2 bg-white text-emerald-800 border border-emerald-300 text-xs font-bold rounded-xl hover:bg-emerald-100 transition-all cursor-pointer"
                      >
                        Submit Another Requirement
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Main Submission Form */}
            <form onSubmit={handleSubmitRequirement} className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-xl shadow-zinc-200/50 space-y-7">
              {/* STEP 1: SELECT CATEGORY */}
              <div>
                <div className="border-b border-zinc-100 pb-3 mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-blue-900 text-white flex items-center justify-center text-xs font-black">1</span>
                      Select Product Category
                    </h2>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Choose what type of handcrafted artisan product you need. The specification fields will adapt automatically.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      resetSubmitForm();
                      showToast('info', 'Form inputs have been cleared.');
                    }}
                    className="text-xs font-semibold text-zinc-400 hover:text-red-500 hover:bg-red-50 px-2.5 py-1 rounded-lg border border-zinc-200 transition-colors cursor-pointer"
                    title="Clear all form inputs"
                  >
                    Clear Form
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {CATEGORY_CONFIG.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setCategory(cat.id);
                          showToast('info', `Switched to ${cat.label} requirements`);
                        }}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${isSelected
                          ? 'bg-blue-50/80 border-blue-900 ring-2 ring-blue-900/30 shadow-sm'
                          : 'bg-zinc-50/60 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-100/60'
                          }`}
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 ${isSelected ? 'bg-blue-900 text-white' : 'bg-zinc-200 text-zinc-600'
                          }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className={`text-xs font-bold ${isSelected ? 'text-blue-950 font-black' : 'text-zinc-800'}`}>
                            {cat.label}
                          </h4>
                          <p className="text-[10px] text-zinc-500 line-clamp-1 mt-0.5 leading-tight">
                            {cat.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STEP 2: CATEGORY-SPECIFIC DETAILS */}
              <div className="border-t border-zinc-100 pt-5 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-700 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-900" />
                    {currentCategoryConfig?.label} Specifications
                  </h3>
                  <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    Category: {currentCategoryConfig?.label}
                  </span>
                </div>

                {/* Common: Product Name */}
                <div>
                  <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-2">
                    Product / Requirement Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={
                      category === 'fashion'
                        ? 'e.g. Handloom Banarasi Silk Saree, Embroidered Kurta'
                        : category === 'jewelry'
                          ? 'e.g. Kundan Jadau Choker Set, 92.5 Silver Bangle'
                          : category === 'home_decor'
                            ? 'e.g. Solid Brass Peacock Urli, Carved Teakwood Frame'
                            : 'e.g. Custom Artisan Gift Box, Hand-tooled Leather Diary'
                    }
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-50/70 border border-zinc-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all"
                  />
                </div>

                {/* ======================================================== */}
                {/* 1. DYNAMIC FIELDS FOR FASHION & APPAREL */}
                {/* ======================================================== */}
                {category === 'fashion' && (
                  <div className="p-4 bg-rose-50/40 rounded-2xl border border-rose-100 space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Department / Gender */}
                      <div>
                        <Dropdown
                          label="Department / Gender"
                          value={fashionGender}
                          onChange={(val) => setFashionGender(val)}
                          options={["Women's Wear", "Men's Wear", "Kids Ethnic", "Unisex Fabric"]}
                        />
                      </div>

                      {/* Apparel Size */}
                      <div>
                        <Dropdown
                          label="Apparel Size"
                          value={fashionSize}
                          onChange={(val) => setFashionSize(val)}
                          options={[
                            "XS (34 Chest)",
                            "S (36 Chest)",
                            "M (38 Chest)",
                            "L (40 Chest)",
                            "XL (42 Chest)",
                            "XXL (44 Chest)",
                            "Free Size (Saree / Fabric)",
                            "Custom Measurement"
                          ]}
                        />
                      </div>

                      {/* Fabric / Material */}
                      <div>
                        <Dropdown
                          label="Fabric / Weave"
                          value={fashionFabric}
                          onChange={(val) => setFashionFabric(val)}
                          options={[
                            "Pure Handloom Silk",
                            "Banarasi Katan Silk",
                            "Chanderi Silk Cotton",
                            "Khadi Cotton Handspun",
                            "Raw Silk / Tussar",
                            "Georgette / Chiffon",
                            "Velvet",
                            "Linen Blend"
                          ]}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                          Color & Embroidery / Zari Work
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Royal Blue with Antique Gold Zari border"
                          value={fashionColorWork}
                          onChange={(e) => setFashionColorWork(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-900 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                          Custom Length / Bust / Waist (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Length 44 inch, Waist 34 inch"
                          value={fashionCustomMeasurements}
                          onChange={(e) => setFashionCustomMeasurements(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-900 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ======================================================== */}
                {/* 2. DYNAMIC FIELDS FOR JEWELRY & SILVERWARE */}
                {/* ======================================================== */}
                {category === 'jewelry' && (
                  <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-200/80 space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Jewelry Type */}
                      <div>
                        <Dropdown
                          label="Jewelry Piece Type"
                          value={jewelryType}
                          onChange={(val) => setJewelryType(val)}
                          options={[
                            "Necklace & Choker",
                            "Bangles & Kadas",
                            "Earrings & Jhumkas",
                            "Finger Ring",
                            "Silverware / Puja Utensil",
                            "Anklet / Payal",
                            "Complete Bridal Set"
                          ]}
                        />
                      </div>

                      {/* Metal & Purity */}
                      <div>
                        <Dropdown
                          label="Metal & Purity"
                          value={metalPurity}
                          onChange={(val) => setMetalPurity(val)}
                          options={[
                            "92.5 Sterling Silver",
                            "22K Gold Plated Brass",
                            "Oxidized Silver Finish",
                            "Pure Brass / Copper",
                            "Solid 18K/22K Gold"
                          ]}
                        />
                      </div>

                      {/* Gemstone / Inlay */}
                      <div>
                        <Dropdown
                          label="Stone / Inlay Style"
                          value={gemstoneType}
                          onChange={(val) => setGemstoneType(val)}
                          options={[
                            "Kundan & Polki",
                            "Natural Pearls",
                            "Semi-Precious Gemstones",
                            "Temple Art / Meenakari",
                            "Plain High-Polish Metal"
                          ]}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Dropdown
                          label="Size (Bangle size / Ring size / Length)"
                          value={jewelrySize}
                          onChange={(val) => setJewelrySize(val)}
                          options={[
                            'Standard (16"-18" Necklace)',
                            "Bangle 2.4 (Small)",
                            "Bangle 2.6 (Medium)",
                            "Bangle 2.8 (Large)",
                            "Ring Size 12-16",
                            "Custom Length / Openable"
                          ]}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                          Estimated Weight Target (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 50 grams, 120 grams"
                          value={estimatedWeight}
                          onChange={(e) => setEstimatedWeight(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-900 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ======================================================== */}
                {/* 3. DYNAMIC FIELDS FOR HOME DECOR & CRAFTS */}
                {/* ======================================================== */}
                {category === 'home_decor' && (
                  <div className="p-4 bg-emerald-50/40 rounded-2xl border border-emerald-100 space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Craft Medium */}
                      <div>
                        <Dropdown
                          label="Craft Material & Medium"
                          value={craftMedium}
                          onChange={(val) => setCraftMedium(val)}
                          options={[
                            "Solid Brass & Bronze",
                            "Hand-carved Teakwood / Sheesham",
                            "Jaipur Blue Pottery / Ceramic",
                            "Makrana Marble / Soapstone",
                            "Handloom Woolen / Jute Rug"
                          ]}
                        />
                      </div>

                      {/* Finish */}
                      <div>
                        <Dropdown
                          label="Finish & Coating"
                          value={decorFinish}
                          onChange={(val) => setDecorFinish(val)}
                          options={[
                            "Antique Polish with Lacquer",
                            "Glossy Mirror Finish",
                            "Distressed Vintage Rustic",
                            "Natural Wood Grain Wax",
                            "Hand-painted Glazed"
                          ]}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                        Dimensions & Weight (Diameter / Length x Width x Height)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 14 inch diameter, 3.5 kg weight or 24 x 18 x 6 inches"
                        value={decorDimensions}
                        onChange={(e) => setDecorDimensions(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-900 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* ======================================================== */}
                {/* 4. DYNAMIC FIELDS FOR OTHER CRAFT */}
                {/* ======================================================== */}
                {category === 'other' && (
                  <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-3 animate-fadeIn">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                        Specific Dimensions / Size & Craft Parameters
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. A5 Notebook (8.5 x 5.5 inches), 200 GSM handmade paper"
                        value={otherSizeSpec}
                        onChange={(e) => setOtherSizeSpec(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-900 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Common: Estimated Quantity */}
                <div>
                  <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-2">
                    Estimated Quantity (Units)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                    className="w-full sm:w-48 px-4 py-2.5 bg-zinc-50/70 border border-zinc-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all"
                  />
                </div>

                {/* Description / Special Instructions */}
                <div>
                  <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-2">
                    Customization Instructions & Details
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide any custom carving details, personalized engravings, lining preferences, packaging requirements, etc."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-50/70 border border-zinc-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all"
                  />
                </div>

                {/* MULTIPLE IMAGE UPLOAD */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
                      Reference Photos (Upload Multiple Photos)
                    </label>
                    {images.length > 0 && (
                      <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                        {images.length} photo(s) selected
                      </span>
                    )}
                  </div>

                  {images.length > 0 && (
                    <div className="mb-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {images.map((imgSrc, idx) => (
                          <div
                            key={idx}
                            className="relative aspect-square rounded-xl bg-zinc-100 border border-zinc-200 overflow-hidden group shadow-2xs"
                          >
                            <img
                              src={imgSrc}
                              alt={`Reference Photo ${idx + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                              <button
                                type="button"
                                onClick={() => setPreviewImageModal(imgSrc)}
                                className="p-1.5 bg-white/90 text-zinc-800 rounded-lg hover:bg-white transition-colors cursor-pointer"
                                title="Enlarge Photo"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                className="p-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors cursor-pointer"
                                title="Delete Photo"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                              Photo {idx + 1}
                            </span>
                          </div>
                        ))}

                        <label className="aspect-square rounded-xl border-2 border-dashed border-zinc-300 hover:border-blue-900 bg-white hover:bg-blue-50/30 flex flex-col items-center justify-center cursor-pointer transition-colors text-zinc-500 hover:text-blue-900">
                          <Plus className="w-6 h-6 mb-1 text-blue-900" />
                          <span className="text-[11px] font-bold">Add More</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleMultipleImageFilesChange}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-400">
                        <span>Hover over any photo to preview or remove.</span>
                        <button
                          type="button"
                          onClick={() => setImages([])}
                          className="text-rose-600 hover:text-rose-800 font-bold cursor-pointer"
                        >
                          Clear All Photos
                        </button>
                      </div>
                    </div>
                  )}

                  {images.length === 0 && (
                    <div className="space-y-3">
                      <label className="border-2 border-dashed border-zinc-300 hover:border-blue-900 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-zinc-50/50 hover:bg-blue-50/30">
                        <Upload className="w-8 h-8 text-blue-900 mb-2" />
                        <span className="text-xs font-bold text-zinc-700">
                          Click to select photos from your device
                        </span>
                        <span className="text-[11px] text-zinc-400 mt-1">
                          Upload front angle, side angle, or close-ups (PNG, JPG, WEBP up to 10MB each)
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleMultipleImageFilesChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* STEP 2: CONTACT INFORMATION & OTP VERIFICATION */}
              <div className="border-t border-zinc-100 pt-6 space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-blue-900 text-white flex items-center justify-center text-xs font-black">2</span>
                    Contact Information & OTP Verification
                  </h2>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Your details are required so our artisan team can review specifications, verify delivery, and send quotations.
                  </p>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-2">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Patel"
                      value={userFullName}
                      onChange={(e) => setUserFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-zinc-50/70 border border-zinc-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-2">
                      Your Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        placeholder="e.g. client@example.com"
                        value={userEmail}
                        onChange={(e) => {
                          setUserEmail(e.target.value);
                          if (submitOtpSent) setSubmitOtpSent(false);
                        }}
                        className="w-full pl-10 pr-4 py-3 bg-zinc-50/70 border border-zinc-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-2">
                      Phone Number (Optional)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        placeholder="e.g. +91 98765 43210"
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-zinc-50/70 border border-zinc-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Address & Pincode */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-2">
                      Delivery Address <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Street, Landmark, City, State..."
                      value={userAddress}
                      onChange={(e) => setUserAddress(e.target.value)}
                      className="w-full p-3 bg-zinc-50/70 border border-zinc-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-2">
                      Pincode <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        maxLength={6}
                        required
                        placeholder="6-digit pincode"
                        value={userPincode}
                        onChange={(e) => setUserPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="w-full pl-10 pr-4 py-3 bg-zinc-50/70 border border-zinc-200 rounded-xl text-sm font-mono font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {!submitOtpSent ? (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleSendSubmitOtp}
                      disabled={
                        isSendingSubmitOtp ||
                        !userFullName.trim() ||
                        !userEmail ||
                        !userEmail.includes('@') ||
                        !userAddress.trim() ||
                        !userPincode.trim() ||
                        userPincode.length < 6
                      }
                      className="w-full py-3.5 bg-blue-900 hover:bg-blue-950 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSendingSubmitOtp ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      <span>Send Verification OTP to Email</span>
                    </button>
                    <p className="text-[11px] text-zinc-400 text-center mt-2">
                      An OTP code will be sent to your email to verify before submitting.
                    </p>
                  </div>
                ) : (
                  <div className="p-5 bg-blue-50/80 border border-blue-200 rounded-2xl space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-900">
                        Enter 6-Digit OTP sent to {userEmail}
                      </span>
                      <button
                        type="button"
                        onClick={handleSendSubmitOtp}
                        className="text-xs font-bold text-blue-900 hover:text-blue-950 underline cursor-pointer"
                      >
                        Resend OTP
                      </button>
                    </div>

                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-digit OTP"
                      value={submitOtp}
                      onChange={(e) => setSubmitOtp(e.target.value)}
                      className="w-full py-3 px-4 text-center tracking-widest text-lg font-mono font-bold bg-white border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />

                    {submitDevOtp && (
                      <div className="p-2.5 bg-blue-100/80 border border-blue-300 rounded-xl text-center">
                        <span className="text-xs font-semibold text-blue-900">
                          Demo OTP Code: <strong className="font-mono text-sm tracking-wider bg-blue-200 px-2 py-0.5 rounded">{submitDevOtp}</strong> (Auto-filled)
                        </span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmittingInquiry || !submitOtp}
                      className="w-full py-3.5 bg-blue-900 hover:bg-blue-950 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmittingInquiry ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                      <span>Verify OTP & Submit Requirement</span>
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: TRACK INQUIRY STATUS */}
        {/* ======================================================== */}
        {activeTab === 'track' && (
          <div className="space-y-6">
            {!isTrackVerified ? (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-xl shadow-zinc-200/50 space-y-6">
                <div className="text-center max-w-md mx-auto">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center mx-auto mb-3">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-zinc-900">Track Your Requirement Status</h2>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                    Enter the email address you used when submitting your requirement. We'll send a 6-digit OTP for secure access.
                  </p>
                </div>

                <div className="space-y-4 max-w-md mx-auto">
                  <div>
                    <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-2">
                      Registered Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        placeholder="e.g. client@example.com"
                        value={trackEmail}
                        onChange={(e) => setTrackEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900"
                      />
                    </div>
                  </div>

                  {!trackOtpSent ? (
                    <button
                      type="button"
                      onClick={handleSendTrackOtp}
                      disabled={isSendingTrackOtp || !trackEmail}
                      className="w-full py-3.5 bg-blue-900 hover:bg-blue-950 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSendingTrackOtp ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      <span>Send Verification Code</span>
                    </button>
                  ) : (
                    <div className="space-y-3 p-4 bg-blue-50/70 border border-blue-200 rounded-2xl animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-900">Enter OTP Code</span>
                        <button
                          type="button"
                          onClick={handleSendTrackOtp}
                          className="text-xs font-bold text-blue-900 hover:text-blue-950 underline cursor-pointer"
                        >
                          Resend Code
                        </button>
                      </div>

                      <input
                        type="text"
                        maxLength={6}
                        placeholder="Enter 6-digit code"
                        value={trackOtp}
                        onChange={(e) => setTrackOtp(e.target.value)}
                        className="w-full py-3 px-4 text-center tracking-widest text-lg font-mono font-bold bg-white border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
                      />

                      {trackDevOtp && (
                        <div className="p-2.5 bg-blue-100/80 border border-blue-300 rounded-xl text-center">
                          <span className="text-xs font-semibold text-blue-900">
                            Demo Code: <strong className="font-mono text-sm tracking-wider bg-blue-200 px-2 py-0.5 rounded">{trackDevOtp}</strong> (Auto-filled)
                          </span>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={handleVerifyAndFetchInquiries}
                        disabled={isVerifyingTrack || !trackOtp}
                        className="w-full py-3.5 bg-blue-900 hover:bg-blue-950 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isVerifyingTrack ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                        <span>Verify & View Inquiries</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <h3 className="text-sm font-bold text-zinc-900">
                        Inquiries for <span className="text-blue-900">{trackEmail}</span>
                      </h3>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">Showing {myInquiries.length} submitted requirement(s)</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRefreshMyInquiries(false)}
                      disabled={isRefreshingInquiries}
                      className="px-3 py-1.5 text-xs font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                      title="Refresh messages and status"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingInquiries ? 'animate-spin text-blue-900' : ''}`} />
                      <span>Refresh Messages</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsTrackVerified(false);
                        setTrackOtpSent(false);
                        setTrackOtp('');
                      }}
                      className="text-xs font-bold text-zinc-500 hover:text-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-colors cursor-pointer"
                    >
                      Change Email
                    </button>
                  </div>
                </div>

                {myInquiries.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-zinc-200 shadow-sm">
                    <FilePlus className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-zinc-700">No Inquiries Found for this Email</h3>
                    <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                      You haven't submitted any custom requirements with this email yet.
                    </p>
                    <button
                      onClick={() => setActiveTab('submit')}
                      className="mt-4 px-5 py-2.5 bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold rounded-xl shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer"
                    >
                      <FilePlus className="w-4 h-4" />
                      <span>Submit Your First Requirement</span>
                    </button>
                  </div>
                ) : (
                  myInquiries.map((inq) => {
                    const hasImages = Boolean(Array.isArray(inq.images) && inq.images.length > 0 && inq.images[0]);
                    const primaryImage = hasImages ? inq.images![0] : '';
                    const allImages = hasImages ? inq.images! : [];

                    return (
                      <div
                        key={inq._id || inq.inquiryNumber}
                        className="bg-white rounded-3xl border border-zinc-200 shadow-lg shadow-zinc-200/40 overflow-hidden transition-all hover:border-zinc-300"
                      >
                        <div className="p-4 bg-zinc-50/80 border-b border-zinc-100 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-xs font-black text-blue-900 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                              #{inq.inquiryNumber}
                            </span>
                            {getCategoryBadge(inq.category)}
                            <span className="text-xs text-zinc-400">
                              Submitted {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString() : 'Recently'}
                            </span>
                          </div>

                          <div>{getStatusBadge(inq.status)}</div>
                        </div>

                        <div className="p-6 space-y-5">
                          <div className="flex flex-col sm:flex-row gap-5">
                            <div className="shrink-0 space-y-2">
                              {hasImages ? (
                                <div
                                  onClick={() => setPreviewImageModal(primaryImage)}
                                  className="w-28 h-28 rounded-2xl bg-zinc-100 border border-zinc-200 overflow-hidden cursor-pointer relative group shadow-sm"
                                >
                                  <img
                                    src={primaryImage}
                                    alt={inq.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <Eye className="w-5 h-5 text-white" />
                                  </div>
                                </div>
                              ) : (
                                <div className="w-28 h-28 rounded-2xl bg-zinc-50 border border-dashed border-zinc-300 flex flex-col items-center justify-center text-zinc-400 p-2 text-center">
                                  <ImageOff className="w-6 h-6 text-zinc-300 mb-1" />
                                  <span className="text-[10px] font-semibold text-zinc-400">No Photo</span>
                                </div>
                              )}

                              {allImages.length > 1 && (
                                <div className="flex items-center gap-1.5 max-w-[120px] overflow-x-auto pb-1">
                                  {allImages.map((extraImg, imgIdx) => (
                                    <div
                                      key={imgIdx}
                                      onClick={() => setPreviewImageModal(extraImg)}
                                      className="w-8 h-8 rounded-lg overflow-hidden border border-zinc-200 cursor-pointer shrink-0 hover:opacity-80"
                                      title={`View Photo ${imgIdx + 1}`}
                                    >
                                      <img
                                        src={extraImg}
                                        alt={`Thumbnail ${imgIdx + 1}`}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <h4 className="text-lg font-bold text-zinc-900">{inq.name}</h4>
                              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                                <span className="bg-blue-50 text-blue-900 font-semibold px-2.5 py-1 rounded-lg border border-blue-200">
                                  Specifications: {inq.size}
                                </span>
                                <span className="bg-zinc-100 text-zinc-700 font-semibold px-2.5 py-1 rounded-lg">
                                  Qty: {inq.quantity || 1} units
                                </span>
                                {(inq.fullName || inq.specifications?.fullName) && (
                                  <span className="bg-zinc-100 text-zinc-800 font-medium px-2.5 py-1 rounded-lg flex items-center gap-1">
                                    <User className="w-3 h-3 text-blue-900" />
                                    {inq.fullName || inq.specifications?.fullName}
                                  </span>
                                )}
                                {(inq.pincode || inq.specifications?.pincode) && (
                                  <span className="bg-zinc-100 text-zinc-800 font-medium px-2.5 py-1 rounded-lg flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-blue-900" />
                                    Pin: {inq.pincode || inq.specifications?.pincode}
                                  </span>
                                )}
                                {allImages.length > 1 && (
                                  <span className="bg-blue-50 text-blue-900 font-semibold px-2.5 py-1 rounded-lg border border-blue-200">
                                    {allImages.length} Photos Attached
                                  </span>
                                )}
                              </div>

                              {(inq.address || inq.specifications?.address) && (
                                <p className="text-[11px] text-zinc-600 mt-2.5 flex items-start gap-1 bg-zinc-50 px-3 py-2 rounded-xl border border-zinc-200">
                                  <MapPin className="w-3.5 h-3.5 text-blue-900 shrink-0 mt-0.5" />
                                  <span><strong className="font-semibold text-zinc-800">Delivery Address:</strong> {inq.address || inq.specifications?.address}</span>
                                </p>
                              )}

                              {inq.description && (
                                <p className="text-xs text-zinc-600 mt-3 leading-relaxed bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                                  "{inq.description}"
                                </p>
                              )}
                            </div>
                          </div>

                          {inq.quotedPrice && inq.quotedPrice > 0 ? (
                            <div className="p-4 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border-l-4 border-l-emerald-600 rounded-r-2xl border border-emerald-200">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                                    Official Quotation From Amba Lifestyle
                                  </p>
                                  <h4 className="text-2xl font-black text-emerald-700 mt-0.5">
                                    ₹{inq.quotedPrice.toLocaleString()}{' '}
                                    <span className="text-xs font-semibold text-emerald-600">INR</span>
                                  </h4>
                                </div>
                                <span className="text-xs bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-xl shadow-xs">
                                  Verified Quote
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl flex items-center gap-2 text-xs text-blue-900">
                              <Clock className="w-4 h-4 text-blue-800 shrink-0" />
                              <span>Quotation is being prepared by our master artisans and pricing team.</span>
                            </div>
                          )}

                          {inq.adminNotes && (
                            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 mb-1">
                                <MessageSquare className="w-3.5 h-3.5 text-blue-900" />
                                <span>Note from Amba Lifestyle Admin:</span>
                              </div>
                              <p className="text-xs text-zinc-700 leading-relaxed italic">
                                "{inq.adminNotes}"
                              </p>
                            </div>
                          )}

                          {/* DIRECT MESSAGE & INQUIRY CHAT THREAD WITH ADMIN */}
                          <div className="p-4 bg-zinc-50/90 border border-zinc-200 rounded-2xl space-y-3">
                            <div className="flex items-center justify-between border-b border-zinc-200/80 pb-2.5">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center">
                                  <MessageSquare className="w-4 h-4" />
                                </div>
                                <div>
                                  <h5 className="text-xs font-bold text-zinc-900">Send Message to Admin</h5>
                                  <p className="text-[10px] text-zinc-500">Your message will directly show on the Super Admin panel</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleRefreshMyInquiries(false)}
                                  disabled={isRefreshingInquiries}
                                  className="p-1 text-zinc-400 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                  title="Refresh live messages"
                                >
                                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingInquiries ? 'animate-spin text-blue-900' : ''}`} />
                                </button>
                                <span className="text-[10px] font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                                  {inq.messages && inq.messages.length > 0 ? `${inq.messages.length} Message${inq.messages.length > 1 ? 's' : ''}` : 'No messages yet'}
                                </span>
                              </div>
                            </div>

                            {/* Message History */}
                            {inq.messages && inq.messages.length > 0 ? (
                              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                                {inq.messages.map((msg, mIdx) => {
                                  const isCustomer = msg.sender === 'customer';
                                  return (
                                    <div
                                      key={msg._id || mIdx}
                                      className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'}`}
                                    >
                                      <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px]">
                                        <span className={`font-bold ${isCustomer ? 'text-blue-900' : 'text-emerald-700'}`}>
                                          {isCustomer ? 'You (Customer)' : 'Amba Lifestyle Support Admin'}
                                        </span>
                                        <span className="text-zinc-400">
                                          {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                        </span>
                                      </div>
                                      <div
                                        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs font-medium leading-relaxed shadow-2xs ${isCustomer
                                          ? 'bg-blue-900 text-white rounded-br-xs'
                                          : 'bg-white text-zinc-800 border border-zinc-200/90 rounded-bl-xs'
                                          }`}
                                      >
                                        <p className="whitespace-pre-wrap">{msg.message}</p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <p className="text-xs text-zinc-400 italic py-1">
                                No messages sent yet. Write your message below to send it directly to the Admin.
                              </p>
                            )}

                            {messageSuccessToast && messageSuccessToast.id === (inq.inquiryNumber || inq._id) && (
                              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-1.5 animate-fadeIn">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>Message delivered! It is now showing in the Admin Panel.</span>
                              </div>
                            )}

                            {/* Message Input Box */}
                            <div className="pt-2 flex items-center gap-2">
                              <input
                                type="text"
                                placeholder="Type your message for Admin here..."
                                value={messageInputs[inq.inquiryNumber || inq._id] || ''}
                                onChange={(e) =>
                                  setMessageInputs((prev) => ({
                                    ...prev,
                                    [inq.inquiryNumber || inq._id]: e.target.value
                                  }))
                                }
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleSendMessage(inq);
                                  }
                                }}
                                className="flex-1 px-3.5 py-2 text-xs bg-white border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900 font-medium text-zinc-800 placeholder:text-zinc-400"
                              />
                              <button
                                type="button"
                                onClick={() => handleSendMessage(inq)}
                                disabled={sendingMessageIds[inq.inquiryNumber || inq._id] || !(messageInputs[inq.inquiryNumber || inq._id] || '').trim()}
                                className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                              >
                                {sendingMessageIds[inq.inquiryNumber || inq._id] ? (
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Send className="w-3.5 h-3.5" />
                                )}
                                <span>Send Message</span>
                              </button>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-zinc-100">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                              Workflow Progress
                            </p>
                            <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                              <div className={`p-2 rounded-lg font-bold ${inq.status !== 'rejected' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-zinc-100 text-zinc-400'}`}>
                                1. Submitted
                              </div>
                              <div className={`p-2 rounded-lg font-bold ${['in_review', 'quoted', 'approved'].includes(inq.status) ? 'bg-sky-50 text-sky-800 border border-sky-200' : 'bg-zinc-100 text-zinc-400'}`}>
                                2. In Review
                              </div>
                              <div className={`p-2 rounded-lg font-bold ${['quoted', 'approved'].includes(inq.status) ? 'bg-purple-50 text-purple-800 border border-purple-200' : 'bg-zinc-100 text-zinc-400'}`}>
                                3. Quoted
                              </div>
                              <div className={`p-2 rounded-lg font-bold ${inq.status === 'approved' ? 'bg-emerald-500 text-white shadow-xs' : 'bg-zinc-100 text-zinc-400'}`}>
                                4. Approved
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* 4. FOOTER */}
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

      {/* MODAL: DIRECT PRODUCT INQUIRY DIALOG */}
      {selectedProductForInquiry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn"
          onClick={() => setSelectedProductForInquiry(null)}
        >
          <div
            className="relative max-w-lg w-full max-h-[92vh] overflow-y-auto bg-white rounded-3xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-900" />
                <span>Product Inquiry</span>
              </h3>
              <button
                onClick={() => setSelectedProductForInquiry(null)}
                className="p-1 text-zinc-400 hover:text-zinc-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selected Product Card Summary */}
            <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 flex items-center gap-3.5">
              <img
                src={selectedProductForInquiry.images?.[0] || selectedProductForInquiry.imageUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80'}
                alt={selectedProductForInquiry.title || selectedProductForInquiry.name}
                className="w-16 h-16 rounded-xl object-cover border border-zinc-200 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-zinc-900 truncate">
                  {selectedProductForInquiry.title || selectedProductForInquiry.name}
                </h4>
                <p className="text-sm font-black text-emerald-700 mt-0.5">
                  ₹{Number(selectedProductForInquiry.price).toLocaleString()} <span className="text-[10px] text-zinc-500 font-normal">INR</span>
                </p>
                <span className="text-[10px] font-semibold text-zinc-500">
                  Category: {selectedProductForInquiry.category || 'Handcrafted'}
                </span>
              </div>
            </div>

            {/* Inquire Form */}
            <form onSubmit={handleSubmitProductInquiry} className="space-y-3.5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Patel"
                    value={inquireCustomerName}
                    onChange={(e) => setInquireCustomerName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900 font-medium"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-1.5">
                    Your Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="client@example.com"
                      value={inquireCustomerEmail}
                      onChange={(e) => {
                        setInquireCustomerEmail(e.target.value);
                        if (inquireOtpSent) setInquireOtpSent(false);
                      }}
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-1.5">
                    Contact Phone (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={inquireCustomerPhone}
                      onChange={(e) => setInquireCustomerPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Quantity (Qty) & Pincode */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-1.5">
                    Quantity (Qty) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Layers className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      min={1}
                      required
                      placeholder="1"
                      value={inquireCustomerQuantity}
                      onChange={(e) => setInquireCustomerQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-1.5">
                    Pincode <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="6-digit pincode"
                      value={inquireCustomerPincode}
                      onChange={(e) => setInquireCustomerPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900 font-medium font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-1.5">
                  Delivery Address <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={inquireCustomerAddress}
                  onChange={(e) => setInquireCustomerAddress(e.target.value)}
                  placeholder="Street, Landmark, City, State..."
                  className="w-full p-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900 font-medium"
                />
              </div>

              {/* Inquiry Note / Custom Request */}
              <div>
                <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider mb-1.5">
                  Inquiry Note / Custom Request
                </label>
                <textarea
                  rows={2}
                  value={inquireCustomerMessage}
                  onChange={(e) => setInquireCustomerMessage(e.target.value)}
                  placeholder="Ask about availability, delivery time, or custom variations..."
                  className="w-full p-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900 font-medium"
                />
              </div>

              {/* OTP FLOW (MATCHES TRACK INQUIRIES) */}
              {!inquireOtpSent ? (
                <div className="pt-2 space-y-2">
                  <div className="flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setSelectedProductForInquiry(null)}
                      className="px-4 py-2.5 text-xs font-bold text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSendInquireOtp}
                      disabled={
                        isSendingInquireOtp ||
                        !inquireCustomerName.trim() ||
                        !inquireCustomerEmail ||
                        !inquireCustomerEmail.includes('@') ||
                        !inquireCustomerAddress.trim() ||
                        !inquireCustomerPincode.trim() ||
                        inquireCustomerPincode.length < 6 ||
                        !inquireCustomerQuantity ||
                        inquireCustomerQuantity < 1
                      }
                      className="px-5 py-2.5 bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSendingInquireOtp ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      <span>Send Verification Code</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-zinc-400 text-right">
                    A 6-digit OTP code will be sent to your email to verify before submitting.
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-2xl space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900">
                      Enter OTP Code sent to {inquireCustomerEmail}
                    </span>
                    <button
                      type="button"
                      onClick={handleSendInquireOtp}
                      className="text-xs font-bold text-blue-900 hover:text-blue-950 underline cursor-pointer"
                    >
                      Resend Code
                    </button>
                  </div>

                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit code"
                    value={inquireOtp}
                    onChange={(e) => setInquireOtp(e.target.value)}
                    className="w-full py-2.5 px-4 text-center tracking-widest text-base font-mono font-bold bg-white border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
                  />

                  {inquireDevOtp && (
                    <div className="p-2 bg-blue-100/80 border border-blue-300 rounded-xl text-center">
                      <span className="text-xs font-semibold text-blue-900">
                        Demo Code: <strong className="font-mono text-xs tracking-wider bg-blue-200 px-1.5 py-0.5 rounded">{inquireDevOtp}</strong> (Auto-filled)
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setSelectedProductForInquiry(null)}
                      className="px-4 py-2.5 text-xs font-bold text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingProductInquiry || !inquireOtp}
                      className="px-5 py-2.5 bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingProductInquiry ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                      <span>Verify & Submit Inquiry</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* MODAL: IMAGE PREVIEW */}
      {previewImageModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
          onClick={() => setPreviewImageModal(null)}
        >
          <div className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden p-2 shadow-2xl">
            <button
              onClick={() => setPreviewImageModal(null)}
              className="absolute top-4 right-4 p-2 bg-black/60 text-white rounded-full hover:bg-black transition-colors z-10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewImageModal}
              alt="Enlarged Reference"
              className="w-full max-h-[75vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
