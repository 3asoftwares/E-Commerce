/**
 * Cart Item Component
 * Used in cart page and cart drawer
 */

import React from 'react';
import { CartItem as CartItemType } from '@e-commerce/types';

export interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity?: (itemId: string, quantity: number) => void;
  onRemove?: (itemId: string) => void;
  readonly?: boolean;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
  readonly = false,
}) => {
  const handleQuantityChange = (delta: number) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity > 0 && newQuantity <= item.maxQuantity) {
      onUpdateQuantity?.(item.id, newQuantity);
    }
  };

  return (
    <div className="flex gap-4 p-4 bg-white rounded border">
      {/* Product Image */}
      <img
        src={item.productImage}
        alt={item.productName}
        className="w-24 h-24 object-cover rounded"
      />

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 truncate">{item.productName}</h3>
        <p className="text-sm text-gray-500 mt-1">
          Sold by: <span className="text-primary-600">{item.sellerName}</span>
        </p>

        {/* Variant Options */}
        {item.variantOptions && Object.keys(item.variantOptions).length > 0 && (
          <div className="flex gap-2 mt-1">
            {Object.entries(item.variantOptions).map(([key, value]) => (
              <span key={key} className="text-sm text-gray-600">
                {key}: <span className="font-medium">{value}</span>
              </span>
            ))}
          </div>
        )}

        {/* Availability */}
        {!item.isAvailable && <p className="text-sm text-red-600 mt-1">Currently unavailable</p>}

        {/* Price and Quantity */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-4">
            <p className="text-lg font-bold text-gray-900">${item.price.toFixed(2)}</p>

            {/* Quantity Controls */}
            {!readonly && (
              <div className="flex items-center border rounded">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-1 border-x">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                  disabled={item.quantity >= item.maxQuantity}
                >
                  +
                </button>
              </div>
            )}

            {readonly && <span className="text-gray-600">Qty: {item.quantity}</span>}
          </div>

          {/* Subtotal */}
          <div className="text-right">
            <p className="text-lg font-bold text-primary-600">${item.total.toFixed(2)}</p>
            {!readonly && (
              <button
                onClick={() => onRemove?.(item.id)}
                className="text-sm text-red-600 hover:text-red-700 mt-1"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
