import React, { useState } from 'react';
import { useProducts } from '../api/queries';

export const Products: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useProducts(page, 10);

  if (isLoading) return <div className="flex justify-center p-8">Loading...</div>;
  if (error) return <div className="alert alert-error">Error loading products</div>;

  const products = data?.products?.products || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold dark:text-white">Products</h1>
        <button className="btn btn-primary">Add Product</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: any) => (
          <div key={product.id} className="card bg-white dark:bg-neutral-800 shadow">
            <div className="card-body">
              <h3 className="card-title dark:text-white">{product.name}</h3>
              <p className="text-neutral-500 dark:text-neutral-400">{product.category}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  ${product.price}
                </span>
                <span className={`badge ${product.stock > 0 ? 'badge-success' : 'badge-error'}`}>
                  Stock: {product.stock}
                </span>
              </div>
              <div className="card-actions justify-end mt-4">
                <button className="btn btn-sm btn-ghost">Edit</button>
                <button className="btn btn-sm btn-error">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <div className="btn-group">
          <button
            className="btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            «
          </button>
          <button className="btn">Page {page}</button>
          <button
            className="btn"
            onClick={() => setPage((p) => p + 1)}
            disabled={products.length < 10}
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
};
