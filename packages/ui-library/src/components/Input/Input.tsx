import { forwardRef } from 'react';
import '../../styles/globals.css';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Input label
   */
  label?: string;
  /**
   * Error message
   */
  error?: string;
  /**
   * Helper text
   */
  helperText?: string;
  /**
   * Input size
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Full width input
   */
  fullWidth?: boolean;
  /**
   * Input icon (left)
   */
  leftIcon?: React.ReactNode;
  /**
   * Input icon (right)
   */
  rightIcon?: React.ReactNode;
}

/**
 * Input component for form fields
 */
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
      ? 'border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:ring-primary';
    const disabledClasses = disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white';
    const iconPaddingLeft = leftIcon ? 'pl-10' : '';
    const iconPaddingRight = rightIcon ? 'pr-10' : '';

    return (
      <div className={`${widthClass} ${className}`}>
        {label && (
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            className={`
              block rounded-lg border focus:ring-2 focus:border-transparent transition-all duration-150
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
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>

        {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}

        {helperText && !error && <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
