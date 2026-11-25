'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check, Search, AlertCircle } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface DropdownProps {
  label?: string;
  options: Array<DropdownOption | string>;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  required?: boolean;
  icon?: React.ReactNode;
  searchable?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  error,
  helperText,
  className = '',
  required = false,
  icon,
  searchable = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number; width: number }>({
    top: 0,
    left: 0,
    width: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Normalize options into uniform { value, label, disabled, icon } objects
  const normalizedOptions: DropdownOption[] = useMemo(() => {
    return options.map((opt) =>
      typeof opt === 'string'
        ? { value: opt, label: opt }
        : { value: String(opt.value), label: opt.label || String(opt.value), disabled: opt.disabled, icon: opt.icon }
    );
  }, [options]);

  // Find currently selected option
  const selectedOption = normalizedOptions.find(
    (opt) => String(opt.value) === String(value)
  );

  const displayLabel = selectedOption?.label || (placeholder || 'Select...');
  const isSelected = !!selectedOption && selectedOption.value !== '';

  const updatePosition = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        containerRef.current && !containerRef.current.contains(target) &&
        menuRef.current && !menuRef.current.contains(target)
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Keep position synced with trigger button while open
  useEffect(() => {
    if (isOpen) {
      updatePosition();

      const handleScrollOrResize = () => {
        updatePosition();
      };

      window.addEventListener('resize', handleScrollOrResize);
      window.addEventListener('scroll', handleScrollOrResize, true);

      if (searchable && normalizedOptions.length > 5) {
        const timer = setTimeout(() => {
          searchInputRef.current?.focus();
        }, 50);
        return () => {
          clearTimeout(timer);
          window.removeEventListener('resize', handleScrollOrResize);
          window.removeEventListener('scroll', handleScrollOrResize, true);
        };
      }

      return () => {
        window.removeEventListener('resize', handleScrollOrResize);
        window.removeEventListener('scroll', handleScrollOrResize, true);
      };
    }
  }, [isOpen, updatePosition, searchable, normalizedOptions.length]);

  // Handle escape key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    } else if (e.key === 'Enter' || e.key === ' ') {
      if (!isOpen) {
        e.preventDefault();
        updatePosition();
        setIsOpen(true);
      }
    }
  };

  const handleSelectOption = (opt: DropdownOption) => {
    if (disabled || opt.disabled) return;
    setIsOpen(false);
    setSearchTerm('');
    onChange(opt.value);
  };

  const filteredOptions = normalizedOptions.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`w-full space-y-1.5 ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-bold text-zinc-700 mb-1 select-none">
          {label}
          {required && <span className="text-rose-500 font-bold ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            if (!disabled) {
              if (!isOpen) updatePosition();
              setIsOpen((prev) => !prev);
            }
          }}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={`w-full flex items-center justify-between text-left rounded-xl bg-white border transition-all duration-200 outline-none select-none px-3 py-2.5 text-xs font-semibold ${
            icon ? 'pl-9' : ''
          } ${
            disabled
              ? 'cursor-not-allowed bg-zinc-100 border-zinc-200 text-zinc-400'
              : error
              ? 'cursor-pointer border-rose-400 text-rose-950 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
              : isOpen
              ? 'cursor-pointer border-blue-900 ring-2 ring-blue-900/20 text-zinc-900 shadow-xs'
              : 'cursor-pointer border-zinc-300 hover:border-zinc-400 text-zinc-800'
          }`}
        >
          {icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
              {icon}
            </div>
          )}

          <div className="flex items-center gap-2 truncate">
            {selectedOption?.icon && (
              <span className="shrink-0">{selectedOption.icon}</span>
            )}
            <span
              className={`block truncate ${
                !isSelected ? 'text-zinc-400 font-normal' : 'text-zinc-900 font-semibold'
              }`}
            >
              {displayLabel}
            </span>
          </div>

          <div
            className={`w-4 h-4 flex items-center justify-center shrink-0 ml-2 transition-transform duration-200 text-zinc-400 ${
              isOpen ? 'rotate-180 text-blue-900' : ''
            }`}
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </button>

        {isOpen && !disabled && mounted && typeof document !== 'undefined' && createPortal(
          <div
            ref={menuRef}
            role="listbox"
            style={{
              position: 'fixed',
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              width: `${coords.width}px`,
              zIndex: 99999,
            }}
            className="max-h-60 overflow-hidden rounded-xl bg-white border border-zinc-200 shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-100"
          >
            {searchable && normalizedOptions.length > 5 && (
              <div className="p-2 border-b border-zinc-100 bg-zinc-50/80 shrink-0">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search options..."
                    className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-zinc-800 placeholder:text-zinc-400"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            )}

            <div className="overflow-y-auto max-h-48 p-1.5 space-y-0.5">
              {filteredOptions.length === 0 ? (
                <div className="py-3 text-center text-xs text-zinc-400">
                  No options found
                </div>
              ) : (
                filteredOptions.map((opt, idx) => {
                  const isCurrent = String(opt.value) === String(value);
                  const isOptDisabled = !!opt.disabled;

                  return (
                    <button
                      key={idx}
                      type="button"
                      role="option"
                      aria-selected={isCurrent}
                      disabled={isOptDisabled}
                      onClick={() => handleSelectOption(opt)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-all duration-150 text-left ${
                        isOptDisabled
                          ? 'opacity-40 cursor-not-allowed text-zinc-400 bg-zinc-50'
                          : isCurrent
                          ? 'bg-blue-50 text-blue-950 font-bold cursor-pointer'
                          : 'text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 cursor-pointer font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                        <span className="truncate">{opt.label}</span>
                      </div>
                      {isCurrent && (
                        <Check className="w-3.5 h-3.5 text-blue-900 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>,
          document.body
        )}
      </div>

      {error && (
        <p className="text-xs text-rose-500 font-medium flex items-center gap-1 mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}

      {!error && helperText && (
        <p className="text-[11px] text-zinc-500 mt-1">{helperText}</p>
      )}
    </div>
  );
};
export default Dropdown;
