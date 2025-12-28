'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useCartStore } from '@/store/cartStore';
import { apiService } from '@/lib/api/service';
import { Button, Input } from '@e-commerce/ui-library';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  stock: number;
  rating: number;
  reviews: number;
  sellerId: string;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  pages: number;
}

const CATEGORIES = [
  'All',
  'Electronics',
  'Clothing',
  'Home',
  'Books',
  'Food',
  'Sports',
  'Toys',
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popular', label: 'Most Popular' },
];

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const { addItem, isInWishlist, addToWishlist, removeFromWishlist } = useCartStore();

  // Fetch products with filters
  const { data, isLoading, error } = useQuery<ProductsResponse>({
    queryKey: ['products', category, priceRange, search, sortBy, page],
    queryFn: async () => {
      const filters = {
        ...(search && { search }),
        ...(category !== 'All' && { category }),
        ...(priceRange.min > 0 && { minPrice: priceRange.min }),
        ...(priceRange.max < 1000 && { maxPrice: priceRange.max }),
      };

      const response = await apiService.getProducts(page, 20, filters);
      
      // Apply sorting on client side as well for consistency
      const products = Array.isArray(response.products) ? response.products : [];
      const sorted = sortProducts(products, sortBy);
      
      return { ...response, products: sorted };
    },
  });

  const products = data?.products || [];

  const sortProducts = (items: Product[], sort: string): Product[] => {
    const sorted = [...items];
    switch (sort) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'popular':
        return sorted.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
      case 'newest':
      default:
        return sorted;
    }
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image || '/placeholder.png',
      productId: product.id,
      sellerId: product.sellerId,
    });
  };

  const handleWishlistToggle = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image || '/placeholder.png',
        addedAt: Date.now(),
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Products</h1>

          {/* Search Bar */}
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e: any) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e: any) => {
                    setCategory(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={priceRange.min}
                    onChange={(e: any) => {
                      setPriceRange({
                        ...priceRange,
                        min: parseInt(e.target.value),
                      });
                      setPage(1);
                    }}
                    placeholder="Min"
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={priceRange.max}
                    onChange={(e: any) => {
                      setPriceRange({
                        ...priceRange,
                        max: parseInt(e.target.value),
                      });
                      setPage(1);
                    }}
                    placeholder="Max"
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                </div>
                <div className="text-xs text-gray-600">
                  ${priceRange.min} - ${priceRange.max}
                </div>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select value={sortBy} onChange={(e: any) => setSortBy(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reset Filters */}
              <Button
                onClick={() => {
                  setSearch('');
                  setCategory('All');
                  setPriceRange({ min: 0, max: 1000 });
                  setSortBy('newest');
                  setPage(1);
                }}
                className="w-full"
                variant="outline"
              >
                Reset Filters
              </Button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                Error loading products. Please try again.
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden group"
                    >
                      {/* Product Image */}
                      <div className="relative overflow-hidden bg-gray-200 h-48">
                        <img
                          src={product.image || '/placeholder.png'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        {product.stock === 0 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white font-semibold">Out of Stock</span>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <a
                          href={`/products/${product.id}`}
                          className="text-lg font-semibold text-gray-900 hover:text-blue-600 line-clamp-2"
                        >
                          {product.name}
                        </a>

                        {/* Rating */}
                        <div className="flex items-center mt-2 mb-2">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <span key={i}>{i < Math.floor(product.rating || 0) ? '★' : '☆'}</span>
                            ))}
                          </div>
                          <span className="text-sm text-gray-600 ml-2">
                            ({product.reviews || 0})
                          </span>
                        </div>

                        {/* Price */}
                        <div className="text-2xl font-bold text-gray-900 mb-4">
                          ${product.price.toFixed(2)}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock === 0}
                            className="flex-1"
                          >
                            Add to Cart
                          </Button>
                          <button
                            onClick={() => handleWishlistToggle(product)}
                            className={`px-3 py-2 rounded border transition-colors ${
                              isInWishlist(product.id)
                                ? 'bg-red-100 text-red-600 border-red-300'
                                : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                            }`}
                          >
                            {isInWishlist(product.id) ? '♥' : '♡'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {data && data.pages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <Button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      variant="outline"
                    >
                      Previous
                    </Button>
                    {[...Array(data.pages)].map((_, i) => (
                      <Button
                        key={i + 1}
                        onClick={() => setPage(i + 1)}
                        variant={page === i + 1 ? 'primary' : 'outline'}
                      >
                        {i + 1}
                      </Button>
                    ))}
                    <Button
                      onClick={() => setPage(Math.min(data.pages, page + 1))}
                      disabled={page === data.pages}
                      variant="outline"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
