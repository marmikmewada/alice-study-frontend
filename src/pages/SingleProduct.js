import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/store';

// Star rating component
const StarRating = ({ rating, onRatingChange }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div>
      {stars.map((star) => (
        <span
          key={star}
          className={`cursor-pointer text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          onClick={() => onRatingChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const SingleProduct = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0); // Initialize rating state
  const [reviews, setReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [notification, setNotification] = useState(null); // State for notification
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userData = useAuthStore((state) => state.user);
  const addItemToCart = useAuthStore((state) => state.addItemToCart);
  const createReview = useAuthStore((state) => state.createReview);
  const getAllReviewsForProduct = useAuthStore((state) => state.getAllReviewsForProduct);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/products/${productId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const productData = await response.json();
        setProduct(productData);
        // Set the main image to the first image in the product's image array
        setMainImage(productData.images[0]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const fetchedReviews = await getAllReviewsForProduct(productId);
        setReviews(fetchedReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchProduct();
    fetchReviews();
  }, [productId, getAllReviewsForProduct]);

  const handleAddToCart = async () => {
    try {
      if (!isAuthenticated) {
        navigate('/signin');
        return;
      }
      if (!userData || !userData._id) {
        console.error('User data not available.');
        return;
      }
      if (!product || !product._id) {
        console.error('Product data not available.');
        return;
      }

      const quantity = 1;
      await addItemToCart(userData._id, product._id, quantity);
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  const handleImageClick = (image) => {
    if (image !== mainImage) {
      setMainImage(image); // Set the clicked image as the main image only if it's different
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      // Existing code...
  
      const review = await createReview(userData._id, productId, reviewRating, reviewText);
      console.log('Review created successfully:', review);
  
      // Add the new review to the list
      setReviews([review, ...reviews]);
  
      // Reset review text and rating after submission
      setReviewText('');
      setReviewRating(0);
  
      // Show success notification
      setNotification({ type: 'success', message: 'Review submitted successfully!' });
  
      // Logging statement to indicate successful review submission
      console.log('Review submitted successfully:', review);
    } catch (error) {
      // Handle error
      console.error('Error creating review:', error);
  
      // Show error notification
      setNotification({ type: 'error', message: 'Product purchase not verified.' });
  
      // Logging statement to indicate failed review submission
      console.error('Failed to submit review:', error);
    }
  };
  
  
  

  const handleLoadMoreReviews = () => {
    setShowAllReviews(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link to="/" className="text-blue-500 hover:text-blue-700">
          &larr; Back to Home
        </Link>
      </div>
      {/* Notification */}
      {notification && (
        <div
          className={`p-4 mb-4 rounded-md ${
            notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
          }`}
        >
          {notification.message}
        </div>
      )}
      {loading ? (
        <p>Loading...</p>
      ) : product ? (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:flex-shrink-0">
                <img src={mainImage} alt={product.name} className="h-64 w-full object-cover md:w-64" />
              </div>
              <div className="p-8 flex flex-col justify-between">
                <div>
                  <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                    {product.category}
                  </div>
                  <h2 className="text-3xl text-gray-800 font-semibold">{product.name}</h2>
                  <p className="mt-2 text-gray-600">{product.description}</p>
                  <div className="mt-4 flex">
                    {product.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={product.name}
                        className="h-16 w-16 object-cover mr-2 cursor-pointer"
                        onClick={() => handleImageClick(image)}
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-gray-900 mr-2 font-semibold">${product.price}</span>
                  <button
                    onClick={handleAddToCart}
                    className="px-6 py-3 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Product not found.</p>
      )}

      {/* Review Form */}
      {isAuthenticated && (
        <div className="mt-8">
          <form onSubmit={handleReviewSubmit}>
            {/* Star Rating */}
            <div className="flex items-center mb-4">
              <span className="mr-2 font-semibold">Your Rating:</span>
              <StarRating rating={reviewRating} onRatingChange={setReviewRating} />
            </div>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review here..."
              className="w-full border border-gray-300 rounded-md p-2 mb-4"
              rows="4"
            ></textarea>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              Submit Review
            </button>
          </form>
        </div>
      )}

      {/* Display Reviews */}
      {reviews.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Reviews</h2>
          {showAllReviews ? (
            reviews.map((review) => (
              <div key={review._id} className="border border-gray-300 rounded-md p-4 mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{review.user}</span>
                  <span>{review.rating} stars</span>
                </div>
                <p>{review.comment}</p>
              </div>
            ))
          ) : (
            reviews.slice(0, 5).map((review) => (
              <div key={review._id} className="border border-gray-300 rounded-md p-4 mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{review.user}</span>
                  <span>{review.rating} stars</span>
                </div>
                <p>{review.comment}</p>
              </div>
            ))
          )}
          {/* Load More Reviews Button */}
          {!showAllReviews && reviews.length > 5 && (
            <button
              onClick={handleLoadMoreReviews}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              Load More Reviews
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SingleProduct;
