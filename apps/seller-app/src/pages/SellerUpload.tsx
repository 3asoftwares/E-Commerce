import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button, Input } from '@e-commerce/ui-library';
import { ProductCategory } from '@ecommerce/types';

export const SellerUpload: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    compareAtPrice: '',
    sku: '',
    categoryId: '',
    inventory: '',
    lowStockThreshold: '10',
    weight: '',
    tags: '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      return response.json();
    },
  });

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: async (productData: FormData) => {
      const response = await fetch('/api/seller/products', {
        method: 'POST',
        body: productData,
      });
      return response.json();
    },
    onSuccess: () => {
      alert('Product uploaded successfully! It will be reviewed by admin.');
      // Reset form
      setFormData({
        name: '',
        description: '',
        shortDescription: '',
        price: '',
        compareAtPrice: '',
        sku: '',
        categoryId: '',
        inventory: '',
        lowStockThreshold: '10',
        weight: '',
        tags: '',
      });
      setImages([]);
      setImagePreviews([]);
    },
    onError: (error) => {
      alert('Failed to upload product. Please try again.');
      console.error(error);
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files);

    // Generate previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.categoryId || images.length === 0) {
      alert('Please fill in all required fields and upload at least one image');
      return;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
    images.forEach((image) => {
      formDataToSend.append('images', image);
    });

    createProductMutation.mutate(formDataToSend);
  };

  const categories: ProductCategory[] = categoriesData?.categories || [];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Upload New Product</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Images */}
          <div>
            <label className="block text-sm font-semibold mb-2">Product Images *</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            />
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {imagePreviews.map((preview, index) => (
                  <img
                    key={index}
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-sm font-semibold mb-2">Product Name *</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter product name"
              required
            />
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-sm font-semibold mb-2">Short Description</label>
            <Input
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleInputChange}
              placeholder="Brief product description"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2">Full Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Detailed product description"
              rows={6}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold mb-2">Category *</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price & Compare Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Price *</label>
              <Input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Compare at Price</label>
              <Input
                type="number"
                name="compareAtPrice"
                value={formData.compareAtPrice}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
              />
            </div>
          </div>

          {/* SKU */}
          <div>
            <label className="block text-sm font-semibold mb-2">SKU *</label>
            <Input
              name="sku"
              value={formData.sku}
              onChange={handleInputChange}
              placeholder="Product SKU"
              required
            />
          </div>

          {/* Inventory */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Inventory *</label>
              <Input
                type="number"
                name="inventory"
                value={formData.inventory}
                onChange={handleInputChange}
                placeholder="Stock quantity"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Low Stock Threshold</label>
              <Input
                type="number"
                name="lowStockThreshold"
                value={formData.lowStockThreshold}
                onChange={handleInputChange}
                placeholder="10"
              />
            </div>
          </div>

          {/* Weight */}
          <div>
            <label className="block text-sm font-semibold mb-2">Weight (kg)</label>
            <Input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              placeholder="Product weight"
              step="0.01"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold mb-2">Tags (comma separated)</label>
            <Input
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="tag1, tag2, tag3"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6">
            <Button type="submit" disabled={createProductMutation.isPending} className="flex-1">
              {createProductMutation.isPending ? 'Uploading...' : 'Upload Product'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => (window.location.href = '/seller/products')}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>

          <p className="text-sm text-gray-600 text-center">
            * Your product will be reviewed by admin before going live
          </p>
        </form>
      </div>
    </div>
  );
};
