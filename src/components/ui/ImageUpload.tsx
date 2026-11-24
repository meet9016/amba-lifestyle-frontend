'use client';

import React, { useRef, useState } from 'react';
import { UploadCloud, X, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  label?: string;
  value?: string;
  onChange: (base64Url: string) => void;
  error?: string;
  required?: boolean;
}

const renderLabel = (label: string, required?: boolean) => {
  if (!label) return null;
  if (label.includes('*')) {
    const parts = label.split('*');
    return (
      <>
        {parts[0]}
        <span className="text-rose-500 font-bold ml-0.5">*</span>
        {parts.slice(1).join('*')}
      </>
    );
  }
  return (
    <>
      {label}
      {required && <span className="text-rose-500 font-bold ml-0.5">*</span>}
    </>
  );
};

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label = 'Product Image',
  value,
  onChange,
  error,
  required = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const processFile = (file: File) => {
    setUploadError(null);

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WEBP)');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setUploadError('Image size must be less than 8MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onChange(result);
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read the image file');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const activeError = error || uploadError;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold text-zinc-700">
          {renderLabel(label, required)}
        </label>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {value ? (
        <div className="relative group border border-stone-200 rounded-2xl p-2 bg-stone-50 flex items-center gap-4">
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-white border border-stone-200 shrink-0">
            <img
              src={value}
              alt="Craft preview"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-zinc-900 truncate">Image uploaded successfully</p>
            <p className="text-[11px] text-zinc-400 mt-0.5">Click replace to upload another angle</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 text-xs font-semibold text-blue-900 hover:text-blue-950 underline cursor-pointer"
            >
              Replace Photo
            </button>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-1.5 rounded-full text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors mr-1"
            title="Remove Photo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
            isDragging
              ? 'border-blue-900 bg-blue-50/50'
              : activeError
              ? 'border-rose-300 bg-rose-50/30'
              : 'border-stone-300 hover:border-blue-900 bg-stone-50/60 hover:bg-blue-50/20'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-800">
              <span className="text-blue-900 hover:underline">Click to upload</span> or drag and drop
            </p>
            <p className="text-[10px] text-zinc-400 mt-0.5">PNG, JPG, WEBP up to 8MB</p>
          </div>
        </div>
      )}

      {activeError && (
        <div className="flex items-center gap-1.5 text-rose-600 text-xs mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{activeError}</span>
        </div>
      )}
    </div>
  );
};

