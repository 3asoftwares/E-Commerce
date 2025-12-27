'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useProducts } from '../../lib/api/queries';
import { useCartStore } from '../../store/cartStore';
import {
  searchQueryState,
  selectedCategoryState,
  sortByState,
  productsDataState,
  filteredProductsState,
  categoriesState,
} from '../../store/recoilState';

export default function ProductsPage() {
  const { data, isLoading } = useProducts(1, 50);
  const { addItem } = useCartStore();

  const [searchQuery, setSearchQuery] = useRecoilState(searchQueryState);
  const [selectedCategory, setSelectedCategory] = useRecoilState(selectedCategoryState);
  const [sortBy, setSortBy] = useRecoilState(sortByState);
  const setProductsData = useSetRecoilState(productsDataState);
  const filteredProducts = useRecoilValue(filteredProductsState);
  const categories = useRecoilValue(categoriesState);

  // Sync products data from TanStack Query to Recoil
  useEffect(() => {
    if (data?.products?.products) {
      setProductsData(data.products.products);
    }
  }, [data, setProductsData]);

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">All Products</h1>

        {/* Filters */}
        <div className="card bg-white dark:bg-neutral-800 shadow mb-8">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Search</span>
                </label>
                <input
                  type="text"
                  placeholder="Search products..."
                  className="input input-bordered"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Category */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Category</span>
                </label>
                <select
                  className="select select-bordered"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === 'all'
                        ? 'All Categories'
                        : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Sort By</span>
                </label>
                <select
                  className="select select-bordered"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <option value="newest">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>

              {/* Reset */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">&nbsp;</span>
                </label>
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSortBy('newest');
                  }}
                >
                  Reset Filters
                </button>
              </div>
            </div>

            <div className="text-sm text-neutral-600 dark:text-neutral-400 mt-4">
              Showing {filteredProducts.length} products
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card bg-white dark:bg-neutral-800 shadow">
                <div className="skeleton h-48 w-full"></div>
                <div className="card-body">
                  <div className="skeleton h-4 w-3/4"></div>
                  <div className="skeleton h-4 w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">No products found</h3>
            <p className="text-neutral-600 dark:text-neutral-400">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {filteredProducts.map((product: any) => (
              <div
                key={product.id}
                className="card bg-white dark:bg-neutral-800 shadow hover:shadow-lg transition"
              >
                <figure className="h-48 bg-neutral-200 dark:bg-neutral-700">
                  <div className="text-6xl pt-12">📦</div>
                </figure>
                <div className="card-body">
                  <h3 className="card-title text-base">{product.name}</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      ${product.price}
                    </span>
                    <span
                      className={`badge ${product.stock > 0 ? 'badge-success' : 'badge-error'}`}
                    >
                      {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                  <div className="card-actions justify-between items-center mt-4">
                    <Link href={`/products/${product.id}`} className="btn btn-sm btn-ghost">
                      View Details
                    </Link>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="btn btn-sm btn-primary"
                      disabled={product.stock === 0}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
