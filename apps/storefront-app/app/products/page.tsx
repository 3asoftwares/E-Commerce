'use client';

import { useState, useEffect, useRef } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useProducts } from '@/lib/hooks';
import { Button } from '@e-commerce/ui-library';
import type { ProductGraphQL } from '@e-commerce/types';
import { useToast } from '@/lib/hooks/useToast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faFilter, faTag, faRedo } from '@fortawesome/free-solid-svg-icons';
import { useSearchParams } from 'next/navigation';
import { formatPrice } from '@/lib/utils/currency';

type Product = ProductGraphQL;

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
  const searchParams = useSearchParams();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const { addItem, isInWishlist, addToWishlist, removeFromWishlist } = useCartStore();
  const { showToast } = useToast();
  const observerTarget = useRef<HTMLDivElement>(null);

  // Read search query from URL parameters
  useEffect(() => {
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setSearch(searchQuery);
    }
  }, [searchParams]);

  // Fetch products with filters using GraphQL
  const filters = {
    ...(search && { search }),
    ...(category !== 'All' && { category }),
    ...(priceRange.min > 0 && { minPrice: priceRange.min }),
    ...(priceRange.max < 1000 && { maxPrice: priceRange.max }),
  };

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
        return sorted.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
      case 'newest':
      default:
        return sorted;
    }
  };

  const { data, isLoading, error } = useProducts(page, 12, filters);

  // Update products when new data arrives
  useEffect(() => {
    if (data?.products) {
      if (page === 1) {
        setAllProducts(data.products);
      } else {
        setAllProducts(prev => [...prev, ...data.products]);
      }
      setHasMore(page < (data.pagination.pages || 1));
    }
  }, [data, page]);

  // Reset when filters change
  useEffect(() => {
    setPage(1);
    setAllProducts([]);
    setHasMore(true);
  }, [search, category, priceRange.min, priceRange.max]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoading]);

  const sortedProducts = sortProducts(allProducts, sortBy);

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.imageUrl || '/placeholder.png',
      productId: product.id,
      sellerId: product.sellerId,
    });
    showToast(`${product.name} added to cart!`, 'success');
  };

  const handleWishlistToggle = (product: any) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600">Discover Products</h1>
            <div className="px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full text-sm font-bold text-indigo-700">
              {data?.pagination.total || 0} Products
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-32 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FontAwesomeIcon icon={faFilter} className="text-indigo-600" />
                Filters
              </h2>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faTag} className="text-gray-500" />
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e: any) => {
                    setCategory(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 font-medium transition-all"
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
                <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faDollarSign} className="text-gray-500" />
                  Price Range
                </label>
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
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold hover:from-red-600 hover:to-pink-600"
              >
                <FontAwesomeIcon icon={faRedo} className="mr-2" />
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
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
                  {sortedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl border border-gray-200 hover:border-indigo-300 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-2"
                    >
                      {/* Product Image */}
                      <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 h-56">
                        <img
                          src={product.imageUrl || '/placeholder.png'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent && !parent.querySelector('.fallback-icon')) {
                              const fallback = document.createElement('div');
                              fallback.className = 'fallback-icon absolute inset-0 flex items-center justify-center text-gray-400';
                              const icon = document.createElement('i');
                              icon.className = 'fas fa-box fa-3x';
                              fallback.appendChild(icon);
                              parent.appendChild(fallback);
                            }
                          }}
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
                            ({product.reviewCount || 0})
                          </span>
                        </div>

                        {/* Price */}
                        <div className="text-2xl font-bold text-gray-900 mb-4">
                          {formatPrice(product.price)}
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

                {/* Infinite Scroll Trigger */}
                <div ref={observerTarget} className="py-8 text-center">
                  {isLoading && (
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                      <span className="ml-3 text-gray-600">Loading more products...</span>
                    </div>
                  )}
                  {!hasMore && allProducts.length > 0 && (
                    <p className="text-gray-500 font-medium">
                      You've reached the end! ({allProducts.length} products shown)
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
