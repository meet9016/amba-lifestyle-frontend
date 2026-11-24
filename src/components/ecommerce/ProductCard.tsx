'use client';

import React from 'react';
import Link from 'next/link';
import { Star, ShoppingBag, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface ProductCardProps {
  id: string;
  title: string;
  category: string;
  price: number;
  discountPrice?: number;
  imageUrl: string;
  rating?: number;
  isNew?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  category,
  price,
  discountPrice,
  imageUrl,
  rating = 4.8,
  isNew
}) => {
  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-zinc-200 transition-all duration-300 hover:shadow-xl hover:border-blue-900 flex flex-col h-full">
      {/* Image container */}
      <div className="relative aspect-4/5 bg-zinc-100 overflow-hidden">
        <Link href={`/product/${id}`} className="block w-full h-full">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          {isNew && <Badge variant="new">New</Badge>}
          {discountPrice && <Badge variant="sale">Sale</Badge>}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-zinc-700 hover:text-rose-500 hover:bg-white shadow-xs transition-colors"
          title="Add to Wishlist"
        >
          <Heart className="w-4 h-4" />
        </button>

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
          <Link href={`/product/${id}`}>
            <Button size="sm" className="w-full shadow-lg gap-2 bg-zinc-900 text-white hover:bg-zinc-800">
              <ShoppingBag className="w-4 h-4" /> View Details
            </Button>
          </Link>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-1 justify-between space-y-2">
        <div className="space-y-1">
          <p className="text-[11px] text-blue-900 font-semibold uppercase tracking-wider">{category}</p>
          <Link href={`/product/${id}`}>
            <h4 className="text-sm font-semibold text-zinc-900 line-clamp-2 hover:text-blue-900 transition-colors">
              {title}
            </h4>
          </Link>
        </div>

        <div>
          <div className="flex items-center gap-1.5 text-blue-900 text-xs font-medium">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-500" />
            </div>
            <span>{rating}</span>
            <span className="text-zinc-400">&bull; Verified Artisan</span>
          </div>

          <div className="flex items-baseline gap-2 pt-1.5">
            <span className="text-base font-bold text-zinc-900">₹{price.toLocaleString()}</span>
            {discountPrice && (
              <span className="text-xs text-zinc-400 line-through">₹{discountPrice.toLocaleString()}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
