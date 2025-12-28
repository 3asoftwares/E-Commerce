'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useCartStore } from '@/store/cartStore';
import { apiService } from '@/lib/api/service';
import { Button } from '@e-commerce/ui-library';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image?: string;
  images?: string[];
  category: string;
  stock: number;
  rating: number;
  reviews: number;
  sellerId: string;
  sku: string;
  specifications?: Record<string, string>;
}

interface ProductDetailProps {
  params: {
    id: string;
  };
}

export default function ProductDetailPage({ params }: ProductDetailProps) {
  const { id } = params;
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem, isInWishlist, addToWishlist, removeFromWishlist } = useCartStore();

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: () => apiService.getProductById(id),
  });

  // Fetch related products
  const { data: relatedProducts } = useQuery({
    queryKey: ['related-products', product?.category],
    queryFn: () =>
      product?.category ? apiService.getProductsByCategory(product.category, 1, 4) : null,
    enabled: !!product?.category,
  });

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

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: (product.images || [product.image])?.[0] || '/placeholder.png',
      productId: product.id,
      sellerId: product.sellerId,
    });

    // Optional: Show toast notification
    alert(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = '/cart';
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: (product.images || [product.image])?.[0] || '/placeholder.png',
        addedAt: Date.now(),
      });
    }
  };

  const images = product.images || [product.image || '/placeholder.png'];

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
        <span>{product.category}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-lg shadow-lg p-8">
          {/* Image Gallery */}
          <div>
            <div className="mb-4">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg bg-gray-200"
              />
              {discountPercent > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  -{discountPercent}%
                </div>
              )}
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
                  <span key={i}>{i < Math.floor(product.rating || 0) ? '★' : '☆'}</span>
                ))}
              </div>
              <span className="text-gray-600 ml-2">
                {product.rating.toFixed(1)} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
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
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="border-t mt-6 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-sm text-gray-600">{key}</p>
                      <p className="font-medium text-gray-900">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SKU */}
            <div className="border-t mt-6 pt-6 text-sm text-gray-600">
              SKU: {product.sku}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.products?.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.products.map((prod: Product) => (
                <a
                  key={prod.id}
                  href={`/products/${prod.id}`}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden group"
                >
                  <div className="relative overflow-hidden bg-gray-200 h-48">
                    <img
                      src={prod.image || '/placeholder.png'}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                      {prod.name}
                    </h3>
                    <p className="text-lg font-bold text-gray-900">
                      ${prod.price.toFixed(2)}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
