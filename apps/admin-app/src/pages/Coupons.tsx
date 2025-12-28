import React, { useState } from 'react';
import { Button, Input, Modal, Table, Badge } from '@e-commerce/ui-library';
import type { CouponGraphQL as Coupon, CreateCouponInput } from '@e-commerce/types';

export const Coupons: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [coupons] = useState<Coupon[]>([]);

  const [formData, setFormData] = useState<CreateCouponInput>({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: 0,
    minOrderValue: undefined,
    maxDiscount: undefined,
    validFrom: new Date().toISOString().split('T')[0],
    validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    usageLimit: undefined,
  });

  const handleOpenModal = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderValue: coupon.minOrderValue,
        maxDiscount: coupon.maxDiscount,
        validFrom: coupon.validFrom.split('T')[0],
        validTo: coupon.validTo.split('T')[0],
        usageLimit: coupon.usageLimit,
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: 0,
        minOrderValue: undefined,
        maxDiscount: undefined,
        validFrom: new Date().toISOString().split('T')[0],
        validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        usageLimit: undefined,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating coupon:', formData);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this coupon?')) {
      console.log('Deleting coupon:', id);
    }
  };

  const handleToggleActive = async (coupon: Coupon) => {
    console.log('Toggling coupon status:', coupon.id);
  };

  const columns = [
    {
      key: 'code',
      header: 'Coupon Code',
      render: (coupon: Coupon) => (
        <span className="font-mono font-bold text-gray-900 dark:text-white">{coupon.code}</span>
      ),
    },
    { key: 'description', header: 'Description' },
    {
      key: 'discount',
      header: 'Discount',
      render: (coupon: Coupon) => (
        <span className="font-semibold text-green-600 dark:text-green-400">
          {coupon.discountType === 'percentage'
            ? `${coupon.discountValue}%`
            : `$${coupon.discountValue}`}
        </span>
      ),
    },
    {
      key: 'validFrom',
      header: 'Valid Period',
      render: (coupon: Coupon) => (
        <div className="text-sm">
          <p>{new Date(coupon.validFrom).toLocaleDateString()}</p>
          <p className="text-gray-500 dark:text-gray-400">
            to {new Date(coupon.validTo).toLocaleDateString()}
          </p>
        </div>
      ),
    },
    {
      key: 'usage',
      header: 'Usage',
      render: (coupon: Coupon) => (
        <span className="text-sm">
          {coupon.usageCount} / {coupon.usageLimit || '∞'}
        </span>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (coupon: Coupon) => (
        <Badge variant={coupon.isActive ? 'success' : 'error'}>
          {coupon.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (coupon: Coupon) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => handleOpenModal(coupon)}>
            Edit
          </Button>
          <Button
            size="sm"
            variant={coupon.isActive ? 'secondary' : 'primary'}
            onClick={() => handleToggleActive(coupon)}
          >
            {coupon.isActive ? 'Deactivate' : 'Activate'}
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleDelete(coupon.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Offers & Coupons Management
        </h1>
        <Button onClick={() => handleOpenModal()}>Create Coupon</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Total Coupons
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{coupons.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Active Coupons
          </h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {coupons.filter((c) => c.isActive).length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Total Redemptions
          </h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {coupons.reduce((sum, c) => sum + c.usageCount, 0)}
          </p>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {coupons.length > 0 ? (
          <Table data={coupons} columns={columns} />
        ) : (
          <div className="p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No coupons created yet</p>
            <Button onClick={() => handleOpenModal()}>Create Your First Coupon</Button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Coupon Code"
              value={formData.code}
              onChange={(e:any) =>
                setFormData({ ...formData, code: e.target.value.toUpperCase() })
              }
              placeholder="e.g., SUMMER2024"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e:any) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                rows={2}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Discount Type
                </label>
                <select
                  value={formData.discountType}
                  onChange={(e:any) =>
                    setFormData({
                      ...formData,
                      discountType: e.target.value as 'percentage' | 'fixed',
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
              <Input
                label="Discount Value"
                type="number"
                step="0.01"
                value={formData.discountValue}
                onChange={(e:any) =>
                  setFormData({ ...formData, discountValue: parseFloat(e.target.value) })
                }
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Min Order Value"
                type="number"
                step="0.01"
                value={formData.minOrderValue || ''}
                onChange={(e:any) =>
                  setFormData({
                    ...formData,
                    minOrderValue: e.target.value ? parseFloat(e.target.value) : undefined,
                  })
                }
                placeholder="Optional"
              />
              <Input
                label="Max Discount"
                type="number"
                step="0.01"
                value={formData.maxDiscount || ''}
                onChange={(e:any) =>
                  setFormData({
                    ...formData,
                    maxDiscount: e.target.value ? parseFloat(e.target.value) : undefined,
                  })
                }
                placeholder="Optional"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Valid From"
                type="date"
                value={formData.validFrom}
                onChange={(e:any) => setFormData({ ...formData, validFrom: e.target.value })}
                required
              />
              <Input
                label="Valid To"
                type="date"
                value={formData.validTo}
                onChange={(e:any) => setFormData({ ...formData, validTo: e.target.value })}
                required
              />
            </div>
            <Input
              label="Usage Limit"
              type="number"
              value={formData.usageLimit || ''}
              onChange={(e:any) =>
                setFormData({
                  ...formData,
                  usageLimit: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              placeholder="Unlimited if empty"
            />
            <div className="flex justify-end gap-3 mt-6">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingCoupon ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};
