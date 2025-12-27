import React, { useState } from 'react';
import { useSellerProducts, useUpdateStock } from '../api/queries';

export const Inventory: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useSellerProducts(page, 10);
  const updateStock = useUpdateStock();

  if (isLoading) return <div className="flex justify-center p-8">Loading...</div>;
  if (error) return <div className="alert alert-error">Error loading inventory</div>;

  const products = data?.sellerProducts?.products || [];

  const handleStockUpdate = async (productId: string, newStock: number) => {
    await updateStock.mutateAsync({ productId, stock: newStock });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold dark:text-white">Inventory Management</h1>
        <button className="btn btn-primary">Bulk Update</button>
      </div>

      <div className="card bg-white dark:bg-neutral-800 shadow overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: any) => (
              <tr key={product.id}>
                <td className="font-medium">{product.name}</td>
                <td>{product.category}</td>
                <td className="font-bold">${product.price}</td>
                <td>
                  <input
                    type="number"
                    className="input input-sm input-bordered w-20"
                    defaultValue={product.stock}
                    onBlur={(e) => handleStockUpdate(product.id, parseInt(e.target.value))}
                  />
                </td>
                <td>
                  <span
                    className={`badge ${
                      product.stock === 0
                        ? 'badge-error'
                        : product.stock < 10
                        ? 'badge-warning'
                        : 'badge-success'
                    }`}
                  >
                    {product.stock === 0
                      ? 'Out of Stock'
                      : product.stock < 10
                      ? 'Low Stock'
                      : 'In Stock'}
                  </span>
                </td>
                <td className="space-x-2">
                  <button className="btn btn-sm btn-ghost">Edit</button>
                  <button className="btn btn-sm btn-error">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
