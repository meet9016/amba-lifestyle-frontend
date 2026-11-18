import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  id,
  style,
  ...props
}) => {
  const inputId = id || props.name;

  return (
    <div className="w-full space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-zinc-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        style={{
          backgroundColor: '#ffffff',
          color: '#18181b',
          colorScheme: 'light',
          ...style
        }}
        className={`w-full px-4 py-2.5 text-sm !bg-white !text-zinc-900 border rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 disabled:opacity-50 disabled:!bg-zinc-100 placeholder:text-zinc-400 ${
          error
            ? 'border-rose-400 !text-rose-900 focus:border-rose-500 focus:ring-rose-500/10'
            : 'border-zinc-200 hover:border-zinc-300'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
    </div>
  );
};
