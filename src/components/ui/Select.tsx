import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: Array<SelectOption | string>;
  focusRingColor?: string;
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

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  options,
  className = '',
  id,
  focusRingColor = 'focus:ring-blue-900',
  ...props
}) => {
  const selectId = id || props.name;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold text-zinc-700">
          {renderLabel(label, props.required)}
        </label>
      )}

      <div className="relative">
        <select
          id={selectId}
          className={`w-full appearance-none px-3.5 py-2.5 pr-10 text-sm bg-white text-zinc-900 border rounded-xl transition-all focus:outline-none focus:ring-2 ${focusRingColor} disabled:opacity-50 ${
            error ? 'border-rose-500' : 'border-zinc-300 hover:border-zinc-400'
          } ${className}`}
          {...props}
        >
          {options.map((opt, idx) => {
            const val = typeof opt === 'string' ? opt : opt.value;
            const text = typeof opt === 'string' ? opt : opt.label;
            return (
              <option key={idx} value={val} className="text-zinc-900 bg-white py-1">
                {text}
              </option>
            );
          })}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
      {!error && helperText && <p className="text-xs text-zinc-500">{helperText}</p>}
    </div>
  );
};

