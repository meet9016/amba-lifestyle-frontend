import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs transition-shadow hover:shadow-md ${className}`}>
      {children}
    </div>
  );
};
