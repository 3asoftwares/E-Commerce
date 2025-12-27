import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, Badge, Button, Modal, Spinner } from '@e-commerce/ui-library';
import { Product, ProductStatus } from '@ecommerce/types';

export const AdminProducts: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-products', filter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: '1',
        limit: '20',
        ...(filter !== 'all' && { status: filter }),
      });
      const response = await fetch(`/api/admin/products?${params}`);
      return response.json();
    },
  });

  const handleApprove = async (productId: string) => {
    try {
      await fetch(`/api/admin/products/${productId}/approve`, { method: 'POST' });
      refetch();
    } catch (error) {
      console.error('Failed to approve product:', error);
    }
  };

  const handleReject = async (productId: string) => {
    try {
      await fetch(`/api/admin/products/${productId}/reject`, { method: 'POST' });
      refetch();
    } catch (error) {
      console.error('Failed to reject product:', error);
    }
  };

  const handleDelete = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await fetch(`/api/admin/products/${productId}`, { method: 'DELETE' });
        refetch();
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  const columns = [
    {
      key: 'image',
      label: 'Image',
      render: (product: Product) => (
        <img
          src={product.images[0]?.url}
          alt={product.name}
          className="w-16 h-16 object-cover rounded"
        />
      ),
    },
    { key: 'name', label: 'Product Name' },
    { key: 'sellerName', label: 'Seller' },
    { key: 'category', label: 'Category', render: (product: Product) => product.category.name },
    { key: 'price', label: 'Price', render: (product: Product) => `$${product.price.toFixed(2)}` },
    { key: 'inventory', label: 'Stock' },
    {
      key: 'status',
      label: 'Status',
      render: (product: Product) => {
        const variants: Record<ProductStatus, any> = {
          [ProductStatus.DRAFT]: 'secondary',
          [ProductStatus.PENDING_APPROVAL]: 'warning',
          [ProductStatus.APPROVED]: 'success',
          [ProductStatus.REJECTED]: 'error',
          [ProductStatus.ARCHIVED]: 'secondary',
        };
        return <Badge variant={variants[product.status]}>{product.status}</Badge>;
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (product: Product) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedProduct(product);
              setShowModal(true);
            }}
          >
            View
          </Button>
          {product.status === ProductStatus.PENDING_APPROVAL && (
            <>
              <Button size="sm" onClick={() => handleApprove(product.id)}>
                Approve
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleReject(product.id)}>
                Reject
              </Button>
            </>
          )}
          <Button size="sm" variant="outline" onClick={() => handleDelete(product.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  const products = data?.products || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products Management</h1>
        <div className="flex gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">All Products</option>
            <option value="pending_approval">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="draft">Draft</option>
          </select>
          <Button onClick={() => (window.location.href = '/admin/products/new')}>
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">Total Products</div>
          <div className="text-3xl font-bold text-primary-600">{data?.total || 0}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">Pending Approval</div>
          <div className="text-3xl font-bold text-yellow-600">{data?.pendingCount || 0}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">Approved</div>
          <div className="text-3xl font-bold text-green-600">{data?.approvedCount || 0}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">Low Stock</div>
          <div className="text-3xl font-bold text-red-600">{data?.lowStockCount || 0}</div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow">
        <Table
          columns={columns}
          data={products}
          onRowClick={(product: any) => {
            setSelectedProduct(product);
            setShowModal(true);
          }}
        />
      </div>

      {/* Product Detail Modal */}
      {showModal && selectedProduct && (
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedProduct(null);
          }}
          title="Product Details"
        >
          <div className="space-y-4">
            <div>
              <img
                src={selectedProduct.images[0]?.url}
                alt={selectedProduct.name}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{selectedProduct.name}</h3>
              <p className="text-gray-600 mt-2">{selectedProduct.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Price</span>
                <div className="font-semibold">${selectedProduct.price.toFixed(2)}</div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Stock</span>
                <div className="font-semibold">{selectedProduct.inventory}</div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Seller</span>
                <div className="font-semibold">{selectedProduct.sellerName}</div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Category</span>
                <div className="font-semibold">{selectedProduct.category.name}</div>
              </div>
            </div>
            {selectedProduct.status === ProductStatus.PENDING_APPROVAL && (
              <div className="flex gap-4 pt-4">
                <Button
                  onClick={() => {
                    handleApprove(selectedProduct.id);
                    setShowModal(false);
                  }}
                  className="flex-1"
                >
                  Approve Product
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    handleReject(selectedProduct.id);
                    setShowModal(false);
                  }}
                  className="flex-1"
                >
                  Reject Product
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
