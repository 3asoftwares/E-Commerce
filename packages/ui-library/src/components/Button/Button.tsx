import React from 'react';
import '../../styles/globals.css';

export interface ButtonProps {
  /**
   * Button contents
   */
  children: React.ReactNode;
  /**
   * Button variant
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  /**
   * Button size
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Is button disabled?
   */
  disabled?: boolean;
  /**
   * Is button loading?
   */
  loading?: boolean;
  /**
   * Optional click handler
   */
  onClick?: (e: React.MouseEvent) => void;
  /**
   * Button type
   */
  type?: 'button' | 'submit' | 'reset';
  /**
   * Full width button
   */
  fullWidth?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Primary UI component for user interaction
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  fullWidth = false,
  className = '',
}) => {
  const baseClasses =
    'font-semibold rounded-lg transition-all duration-150 inline-flex items-center justify-center gap-2';

  const variantClasses = {
    primary: 'bg-primary hover:bg-primary-700 text-white shadow-sm hover:shadow-md',
    secondary:
      'bg-white hover:bg-gray-50 text-primary border border-gray-300 shadow-sm hover:shadow-md',
    outline: 'bg-transparent hover:bg-primary-50 text-primary border-2 border-primary',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
  };

  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClasses = disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && (
        <svg
          className="animate-spin h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};
