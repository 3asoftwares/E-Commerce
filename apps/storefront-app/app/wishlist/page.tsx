'use client';

import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';
import { useToast } from '@/lib/hooks/useToast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faHeart, faShoppingCart, faTrash } from '@fortawesome/free-solid-svg-icons';
import { PageHeader, EmptyState } from '@/components';
import { formatPrice } from '@/lib/utils/currency';

export const dynamic = 'force-dynamic';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addItem } = useCartStore();
  const { showToast } = useToast();

  const handleAddToCart = (item: any) => {
    addItem({
      productId: item.productId,
      id: item.productId,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
    });
    showToast('Added to cart!', 'success');
  };

  const handleRemove = (productId: string) => {
    removeFromWishlist(productId);
    showToast('Removed from wishlist', 'info');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        icon={faHeart}
        title="My Wishlist"
        badge={wishlist.length > 0 ? {
          count: wishlist.length,
          label: wishlist.length === 1 ? 'item' : 'items'
        } : undefined}
        iconGradient="from-gray-700 to-gray-900"
        titleGradient="from-gray-900 to-black"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {wishlist.length === 0 ? (
          <EmptyState
            icon={faHeart}
            title="Your Wishlist is Empty"
            description="Save items you love so you can find them easily later. Start adding your favorites!"
            actionText="Discover Products →"
            actionHref="/products"
            iconColor="text-pink-600"
            iconBgColor="from-pink-100 to-rose-100"
          />
        ) : (
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="flex justify-between items-center bg-white rounded-xl shadow-md p-4">
              <p className="text-gray-700 font-semibold">
                Showing {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
              </p>
              <Link
                href="/products"
                className="text-pink-600 hover:text-pink-700 font-semibold flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faShoppingCart} className="w-4 h-4" />
                Continue Shopping
              </Link>
            </div>

            {/* Wishlist Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((item) => (
                <div
                  key={item.productId}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-200 hover:border-pink-300"
                >
                  {/* Product Image */}
                  <Link href={`/products/${item.productId}`}>
                    <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <FontAwesomeIcon icon={faBox} className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="p-5">
                    <Link
                      href={`/products/${item.productId}`}
                      className="font-bold text-gray-900 hover:text-pink-600 line-clamp-2 block mb-3 text-lg transition-colors"
                    >
                      {item.name}
                    </Link>

                    <p className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-600 mb-4">
                      {formatPrice(item.price)}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-pink-500/50 transition-all flex items-center justify-center gap-2"
                      >
                        <FontAwesomeIcon icon={faShoppingCart} className="w-4 h-4" />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleRemove(item.productId)}
                        className="px-4 py-2.5 bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                        title="Remove from wishlist"
                      >
                        <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Added Date */}
                    <p className="text-xs text-gray-500 mt-3 text-center">
                      Added {new Date(item.addedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="bg-white rounded-xl shadow-md p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-center sm:text-left">
                <p className="text-gray-900 font-bold text-lg mb-1">
                  Love Everything? 🎉
                </p>
                <p className="text-gray-600 text-sm">
                  Add all items to your cart and checkout in seconds!
                </p>
              </div>
              <button
                onClick={() => {
                  if (wishlist.length === 0) return;
                  let addedCount = 0;
                  wishlist.forEach((item) => {
                    handleAddToCart(item);
                    addedCount++;
                  });
                  showToast(`Added ${addedCount} items to cart!`, 'success');
                }}
                disabled={wishlist.length === 0}
                className="px-8 py-3 bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-xl hover:shadow-rose-500/50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add All to Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
