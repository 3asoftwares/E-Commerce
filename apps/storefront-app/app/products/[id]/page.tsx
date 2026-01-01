'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useProduct } from '@/lib/hooks';
import { Button } from '@e-commerce/ui-library';
import ProductReviews from '@/components/ProductReviews';
import { useToast } from '@/lib/hooks/useToast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faBox } from '@fortawesome/free-solid-svg-icons';
import { formatPrice } from '@/lib/utils/currency';

interface ProductDetailProps {
  params: {
    id: string;
  };
}

export default function ProductDetailPage({ params }: ProductDetailProps) {
  const { id } = params;
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem, isInWishlist, addToWishlist, removeFromWishlist, addRecentlyViewed } = useCartStore();
  const { showToast } = useToast();

  const { data: product, isLoading, error } = useProduct(id);
  
  // Track recently viewed products
  useEffect(() => {
    if (product) {
      addRecentlyViewed({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.imageUrl || '/placeholder.png',
        category: product.category,
        viewedAt: Date.now(),
      });
    }
  }, [product, addRecentlyViewed]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md">
          <h1 className="text-xl font-semibold text-red-800 mb-2">Product Not Found</h1>
          <p className="text-red-700 mb-4">The product you're looking for doesn't exist.</p>
          <Button onClick={() => (window.location.href = '/products')}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!product) return;
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.imageUrl || '/placeholder.png',
      productId: product.id,
      sellerId: product.sellerId,
    });

    showToast(`${product.name} added to cart!`, 'success');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = '/cart';
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      showToast('Removed from wishlist', 'info');
    } else {
      addToWishlist({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.imageUrl || '/placeholder.png',
        addedAt: Date.now(),
      });
      showToast('Added to wishlist', 'success');
    }
  };

  const images = [product?.imageUrl || '/placeholder.png'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex gap-2 text-sm text-gray-600">
        <a href="/" className="hover:text-blue-600">
          Home
        </a>
        <span>/</span>
        <a href="/products" className="hover:text-blue-600">
          Products
        </a>
        <span>/</span>
        <span>{product?.category || 'Product'}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-lg shadow-lg p-8">
          {/* Image Gallery */}
          <div>
            <div className="mb-4 relative">
              <img
                src={images[selectedImage]}
                alt={product?.name || 'Product'}
                className="w-full h-96 object-cover rounded-lg bg-gray-200"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent && !parent.querySelector('.fallback-icon')) {
                    const fallback = document.createElement('div');
                      fallback.className = 'fallback-icon absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-200 rounded-lg';
                      const icon = document.createElement('i');
                      icon.className = 'fas fa-box fa-5x';
                      fallback.appendChild(icon);
                    parent.appendChild(fallback);
                  }
                }}
              />
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-16 rounded border-2 overflow-hidden ${
                      selectedImage === idx ? 'border-blue-500' : 'border-gray-300'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400 text-lg">
                {[...Array(5)].map((_, i) => (
                  <FontAwesomeIcon 
                    key={i} 
                    icon={faStar} 
                    className={i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-gray-600 ml-2">
                {product.rating.toFixed(1)} ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
              </div>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <div className="text-green-600 font-semibold">
                  {product.stock > 10
                    ? 'In Stock'
                    : `Only ${product.stock} left in stock`}
                </div>
              ) : (
                <div className="text-red-600 font-semibold">Out of Stock</div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity === 1}
                  className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e:any) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max={product.stock}
                  className="w-16 px-3 py-2 border border-gray-300 rounded text-center"
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-8">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1"
                size="lg"
              >
                Add to Cart
              </Button>
              <Button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1"
                size="lg"
                variant="secondary"
              >
                Buy Now
              </Button>
              <button
                onClick={handleWishlistToggle}
                className={`px-6 py-3 rounded border-2 font-semibold transition-colors ${
                  isInWishlist(product.id)
                    ? 'bg-red-100 text-red-600 border-red-300'
                    : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                }`}
              >
                {isInWishlist(product.id) ? '♥' : '♡'}
              </button>
            </div>

            {/* Description */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 line-clamp-4">{product.description}</p>
            </div>

            {/* Specifications */}
            {/* Category & Seller Info */}
            <div className="border-t mt-6 pt-6 text-sm text-gray-600">
              <p>Category: <span className="text-gray-900 font-medium">{product.category}</span></p>
              <p className="mt-1">Seller ID: <span className="text-gray-900">{product.sellerId}</span></p>
            </div>
          </div>
        </div>

        {/* Product Reviews Section */}
        <div className="mt-12">
          <ProductReviews
            productId={product.id}
            averageRating={product.rating || 0}
            totalReviews={product.reviewCount || 0}
          />
        </div>
      </div>
    </div>
  );
}
