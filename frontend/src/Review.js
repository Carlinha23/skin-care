import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';
import './Review.css';
const BASE_URL = process.env.REACT_APP_BASE_URL || "https://skin-care-backend.onrender.com";

function Review() {
  const [reviews, setReviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory] = useState('');
  const [newReview, setNewReview] = useState({
    categoryName: '',
    productName: '',
    brand: '',
    comment: '',
    image: ''
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState(5); // Initial number of reviews
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const history = useHistory();

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await axios.get(`${BASE_URL}/api/reviews`);
        console.log("Fetched reviews:", res.data.reviews);
        setReviews(res.data.reviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    }
    fetchReviews();
  }, []);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await axios.get(`${BASE_URL}/api/categories`);
        setCategories(res.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) { // Show button after scrolling down 300px
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  async function handleSubmit(evt) {
    evt.preventDefault();
    if (!isAuthenticated) {
      alert('Please log in or sign up to add a review.');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const reviewData = { ...newReview, image: newReview.image || '' };

      console.log("Sending data:", newReview);
      console.log("With headers:", { Authorization: `Bearer ${token}` });

      await axios.post(`${BASE_URL}/api/reviews`, reviewData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNewReview({
        categoryName: '',
        productName: '',
        brand: '',
        comment: '',
        image: ''
      });
      history.push('/reviews');
      const res = await axios.get(`${BASE_URL}/api/reviews`);
      setReviews(res.data.reviews);
    } catch (err) {
      console.error("Error during review submission:", err.response ? err.response.data : err.message);
    }
  }

  function handleChange(evt) {
    const { name, value } = evt.target;
    setNewReview(prevReview => ({
      ...prevReview,
      [name]: value
    }));
  }

  // const handleLoginClick = () => {
  //   history.push('/login');
  // };

  // const handleSignupClick = () => {
  //   history.push('/signup');
  // };

  const handleLoadMore = () => {
    setVisibleReviews(prevVisibleReviews => prevVisibleReviews + 5);
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredReviews = reviews.filter(review => !selectedCategory || review.categoryId === parseInt(selectedCategory));

  return (
    <div className="review-container">
      <h1>Share Your Skincare Experience!</h1>
  {!isAuthenticated && (
    <p className="login-prompt">Please log in or sign up to add a review and help others discover the best skincare products!</p>
  )}
  {isAuthenticated && (
    <div className="review-form-container">
      <p>We’d love to hear about your favorite products and experiences! Your review will help others in their skincare journey. Share your thoughts below:</p>
      <form onSubmit={handleSubmit} className="review-form">
        <div>
              <label>Category</label>
              <select
                name="categoryName"
                value={newReview.categoryName}
                onChange={handleChange}
              >
                <option value="">Select a Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>{category.name}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <div>
              <label>Product Name</label>
              <input
                type="text"
                name="productName"
                value={newReview.productName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Brand</label>
              <input
                type="text"
                name="brand"
                value={newReview.brand}
                onChange={handleChange}
              />
            </div>
            </div>
            <div>
              <label>Comment</label>
              <textarea
                name="comment"
                value={newReview.comment}
                onChange={handleChange}
              />
            </div>
            <div className="image-field">
              <label>Image URL</label>
              <input
                type="text"
                name="image"
                value={newReview.image}
                onChange={handleChange}
              />
            </div>
            <button type="submit">Add Review</button>
          </form>
        </div>
      )}
      <div className="reviews-list">
        {filteredReviews.slice(0, visibleReviews).map(review => (
          <div key={review.id} className="review-item">
            <Link to={`/reviews/${review.id}`} className="review-link">
              <h3>{review.productname || 'No product name'}</h3>
            </Link>
            <div className="review-details">


              <span className="review-label">Brand:</span>
              <span className="review-value">{review.brand}</span>
              
              <span className="review-label">Comment:</span>
              <span className="review-value">{review.comment}</span>
              
              <span className="review-label">Date:</span>
              <span className="review-date">{new Date(review.date).toLocaleDateString()}</span>
            
            {review.image && review.image.trim() !== '' && (
              <img src={review.image} alt={review.productname || 'Image'} />
            )}
          </div>
          </div>
        ))}
        {filteredReviews.length > visibleReviews && (
          <button onClick={handleLoadMore} className="load-more-button">Load More</button>
        )}
      </div>
      {showScrollToTop && (
        <button onClick={handleScrollToTop} className="scroll-to-top-button">↑</button>
      )}
      </div>
  );
}

export default Review;

