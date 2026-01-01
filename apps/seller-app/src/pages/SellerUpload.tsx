import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Spinner } from '@e-commerce/ui-library';
import { productApi, handleApiError } from '../api/client';
import { ImageUpload } from '../components/ImageUpload';
import { useSellerAuthStore } from '../store/authStore';

export const SellerUpload: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSellerAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        sellerId: user?.id || '',
      };

      await productApi.create(productData);
      navigate('/products');
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Add New Product</h1>
        <p className="text-gray-600">Create and manage your product listings</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
        <div>
          <Input
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product description"
            rows={4}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            minLength={10}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Input
            label="Price"
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            placeholder="0.00"
            required
            disabled={loading}
          />

          <Input
            label="Stock"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
            placeholder="0"
            required
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select a category</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Books">Books</option>
              <option value="Home">Home & Garden</option>
              <option value="Sports">Sports & Outdoors</option>
            </select>
          </div>
        </div>

        <ImageUpload
          currentImage={formData.image}
          onImageUpload={(imageUrl) => setFormData((prev) => ({ ...prev, image: imageUrl }))}
          onRemove={() => setFormData((prev) => ({ ...prev, image: '' }))}
        />

        <div className="flex gap-4 pt-6">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? <Spinner /> : '✅ Create Product'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/products')} disabled={loading} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
