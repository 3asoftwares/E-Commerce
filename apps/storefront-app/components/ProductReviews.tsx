'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpful: number;
}

interface ProductReviewsProps {
  productId: string;
  averageRating: number;
  totalReviews: number;
}

export default function ProductReviews({ productId, averageRating, totalReviews }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Implement review submission API call
    console.log('Submitting review:', { productId, ...newReview });
    
    // Reset form
    setNewReview({ rating: 5, comment: '' });
    setShowReviewForm(false);
    
    alert('Review submitted successfully! It will appear after moderation.');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Reviews Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Reviews</h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <div className="flex text-yellow-400 text-xl mr-2">
                {[...Array(5)].map((_, i) => (
                  <FontAwesomeIcon 
                    key={i} 
                    icon={faStar} 
                    className={i < Math.floor(averageRating) ? 'text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold text-gray-900">{averageRating.toFixed(1)}</span>
            </div>
            <span className="text-gray-600">({totalReviews} reviews)</span>
          </div>
        </div>
        <button onClick={() => setShowReviewForm(!showReviewForm)}>
          Write a Review
        </button>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <form onSubmit={handleSubmitReview} className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Write Your Review</h3>
          
          {/* Rating Stars */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                  className={`text-3xl ${
                    star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'
                  } hover:text-yellow-400 transition-colors`}
                >
                  <FontAwesomeIcon icon={faStar} />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review
            </label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Share your experience with this product..."
              required
              minLength={10}
            />
          </div>

          <div className="flex gap-3">
            <button type="submit">Submit Review</button>
            <button
              type="button"
              onClick={() => setShowReviewForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">No reviews yet</p>
            <p className="text-sm">Be the first to review this product!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold text-gray-900">{review.userName}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <FontAwesomeIcon 
                          key={i} 
                          icon={faStar} 
                          className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 mb-3">{review.comment}</p>
              <button className="text-sm text-gray-600 hover:text-blue-600">
                Helpful ({review.helpful})
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
