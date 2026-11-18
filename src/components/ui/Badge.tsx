import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'sale' | 'new' | 'popular';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = ''
}) => {
  const variants = {
    default: 'bg-zinc-100 text-zinc-800 border border-zinc-200/60',
    sale: 'bg-rose-500 text-white font-semibold',
    new: 'bg-emerald-600 text-white font-semibold',
    popular: 'bg-amber-600 text-white font-semibold'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] uppercase tracking-wider ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
