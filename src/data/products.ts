export interface TierPrice {
  minQty: number;
  maxQty?: number;
  price: number;
}

export interface ProductDetail {
  id: string;
  title: string;
  category: string;
  subCategory: string;
  price: number;
  discountPrice?: number;
  rating: number;
  reviewsCount: number;
  ordersCount: string;
  inStock: number;
  minOrderQuantity: number;
  tierPricing: TierPrice[];
  images: string[];
  colors: Array<{ name: string; hex: string; image: string }>;
  sizes: string[];
  customizations: Array<{ title: string; minQty: number }>;
  supplier: {
    name: string;
    badge: string;
    years: number;
    location: string;
    responseRate: string;
    responseTime: string;
    onTimeDelivery: string;
    storeRating: number;
    transactions: string;
    certifications: string[];
  };
  specifications: Record<string, string>;
  leadTime: Array<{ qty: string; days: string }>;
  overview: string;
  features: string[];
}

// Dummy data removed - All products are dynamically loaded from live database
export const PRODUCTS_DATA: Record<string, ProductDetail> = {};
