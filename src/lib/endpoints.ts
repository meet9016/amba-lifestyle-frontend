/**
 * Centralized API Configuration & Endpoints for Amba Lifestyle
 * All API routes and backend services must be referenced from this file.
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api/v1';

export const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,

  // Authentication & Session
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    PROFILE: `${API_BASE_URL}/auth/profile`,
  },

  // Products
  PRODUCTS: {
    LIST: `${API_BASE_URL}/products`,
    CREATE: `${API_BASE_URL}/products`,
    BY_ID: (id: string) => `${API_BASE_URL}/products/${id}`,
    APPROVED: `${API_BASE_URL}/products?approvalStatus=approved`,
  },

  // Categories & Subcategories
  CATEGORIES: {
    LIST: `${API_BASE_URL}/categories`,
    BY_ID: (id: string) => `${API_BASE_URL}/categories/${id}`,
  },
  SUBCATEGORIES: {
    LIST: `${API_BASE_URL}/subcategories`,
    BY_CATEGORY: (categoryId: string) => `${API_BASE_URL}/subcategories?categoryId=${categoryId}`,
  },

  // Health
  HEALTH: `${API_BASE_URL}/health`,
} as const;

export default API_ENDPOINTS;

