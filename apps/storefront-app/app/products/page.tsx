'use client';

import { useState, useEffect, useRef } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useProducts } from '@/lib/hooks';
import type { ProductGraphQL } from '@e-commerce/types';
import { useToast } from '@/lib/hooks/useToast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faRedo } from '@fortawesome/free-solid-svg-icons';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components';
import { Button, Input, Select } from '@e-commerce/ui-library';

type Product = ProductGraphQL;

const CATEGORIES = [
  {value: 'All', label: 'All'},
  {value: 'Electronics', label: 'Electronics'},
  {value: 'Clothing', label: 'Clothing'},
  {value: 'Home', label: 'Home'},
  {value: 'Books', label: 'Books'},
  {value: 'Food', label: 'Food'},
  {value: 'Sports', label: 'Sports'},
  {value: 'Toys', label: 'Toys'},
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

  // Read search and category from URL parameters
  useEffect(() => {
    const searchQuery = searchParams.get('search');
    const categoryQuery = searchParams.get('category');
    
    if (searchQuery) {
      setSearch(searchQuery);
    }
    
    if (categoryQuery) {
      const formattedCategory = categoryQuery.charAt(0).toUpperCase() + categoryQuery.slice(1).toLowerCase();
      const category = CATEGORIES.find(cat => cat.value === formattedCategory);
      if (category) {
        setCategory(formattedCategory);
      }
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
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-600">
              Discover Products
            </h1>
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
                <FontAwesomeIcon icon={faFilter} className="text-gray-600" />
                Filters
              </h2>

              {/* Category Filter */}
              <Select
                value={category}
                label={'Category'}
                onChange={(e: any) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full"
                options={CATEGORIES}
              />

              {/* Price Range Filter */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  Price Range
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
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
                  />
                  <Input
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
                  />
                </div>
                <div className="text-xs text-gray-600">
                  ₹{priceRange.min} - ₹{priceRange.max}
                </div>
              </div>

              <Select
                value={sortBy}
                label={'Sort By'}
                onChange={(e: any) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="w-full"
                options={SORT_OPTIONS}
              />

              <Button
                size="sm"
                onClick={() => {
                  setSearch('');
                  setCategory('All');
                  setPriceRange({ min: 0, max: 1000 });
                  setSortBy('newest');
                  setPage(1);
                }}
                className="w-full"
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
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      onWishlistToggle={handleWishlistToggle}
                      isInWishlist={isInWishlist(product.id)}
                      showWishlistButton={true}
                    />
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
