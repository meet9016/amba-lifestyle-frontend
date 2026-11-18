export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  stock: number;
  images: string[];
  rating: number;
  numReviews: number;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'vendor' | 'admin';
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

