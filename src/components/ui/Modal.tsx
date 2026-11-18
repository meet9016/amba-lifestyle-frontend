'use client';

import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl z-10 border border-zinc-200 text-zinc-900">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          {title && <h3 className="text-base font-bold text-zinc-900">{title}</h3>}
          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="pt-4">{children}</div>
      </div>
    </div>
  );
};
