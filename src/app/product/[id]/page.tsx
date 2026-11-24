import React, { Suspense } from 'react';
import ProductDetailClient from './ProductDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function ProductContent({ params }: PageProps) {
  const { id } = await params;
  return <ProductDetailClient productId={id} />;
}

export default function SingleProductPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-900"></div>
        </div>
      }
    >
      <ProductContent params={params} />
    </Suspense>
  );
}
