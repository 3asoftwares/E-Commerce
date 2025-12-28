import React from 'react';
import { forwardRef } from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      size = 'md',
      fullWidth = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'text-sm px-3 py-1.5',
      md: 'text-base px-4 py-2',
      lg: 'text-lg px-5 py-3',
    };

    const widthClass = fullWidth ? 'w-full' : '';
    const errorClasses = error
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500';
    const disabledClasses = disabled ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'bg-white text-gray-900';
    const iconPaddingLeft = leftIcon ? 'pl-10' : '';
    const iconPaddingRight = rightIcon ? 'pr-10' : '';

    return (
      <div className={`${widthClass} ${className}`}>
        {label && (
          <label className="block text-[16px] font-semibold text-gray-900 mb-1.5">{label}</label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            className={`
              block rounded-lg border-2 focus:ring-2 focus:ring-offset-1 transition-all duration-150
              dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:focus:border-blue-400
              ${sizeClasses[size]}
              ${widthClass}
              ${errorClasses}
              ${disabledClasses}
              ${iconPaddingLeft}
              ${iconPaddingRight}
            `}
            disabled={disabled}
            {...props}
          />

          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>

        {error && <p className="mt-2 text-sm font-semibold text-red-700 dark:text-red-400">{error}</p>}

        {helperText && !error && <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
