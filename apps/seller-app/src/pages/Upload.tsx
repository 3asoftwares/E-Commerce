import React, { useState } from 'react';
import { useCreateProduct } from '../api/queries';
import { useAppDispatch } from '../store/store';
import { setDraft, clearDraft } from '../store/productDraftSlice';

export const Upload: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
  });

  const createProduct = useCreateProduct();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProduct.mutateAsync(formData);
      dispatch(clearDraft());
      setFormData({ name: '', description: '', price: 0, stock: 0, category: '' });
      alert('Product created successfully!');
    } catch (error) {
      alert('Error creating product');
    }
  };

  const handleSaveDraft = () => {
    dispatch(setDraft({ ...formData, images: [] }));
    alert('Draft saved!');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Upload New Product</h1>

      <div className="card bg-white dark:bg-neutral-800 shadow max-w-2xl">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Product Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                className="textarea textarea-bordered"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Price ($)</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Stock</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Category</span>
              </label>
              <select
                className="select select-bordered"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <option value="">Select a category</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="home">Home & Garden</option>
                <option value="sports">Sports</option>
              </select>
            </div>

            <div className="flex justify-between mt-6">
              <button type="button" className="btn btn-ghost" onClick={handleSaveDraft}>
                Save Draft
              </button>
              <button type="submit" className="btn btn-primary">
                {createProduct.isPending ? 'Creating...' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
