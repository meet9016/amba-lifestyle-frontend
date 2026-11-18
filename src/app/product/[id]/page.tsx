import React, { Suspense } from 'react';
import ProductDetailClient from './ProductDetailClient';
import { PRODUCTS_DATA } from '@/data/products';

export function generateStaticParams() {
  const ids = Object.keys(PRODUCTS_DATA);
  return ids.length > 0 ? ids.map((id) => ({ id })) : [{ id: 'preview' }];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SingleProductPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-600"></div>
        </div>
      }
    >
      <ProductDetailClient productId={id} />
    </Suspense>
  );
}
