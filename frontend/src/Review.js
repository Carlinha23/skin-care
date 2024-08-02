import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './Review.css';

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
  const history = useHistory();

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await axios.get('/api/reviews');
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
        const res = await axios.get('/api/categories');
        setCategories(res.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    // Check if user is authenticated by checking the token
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
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

      await axios.post('/api/reviews', reviewData, {
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
      const res = await axios.get('/api/reviews');
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

  return (
    <div className="review-container">
      <h1>Reviews</h1>
      {!isAuthenticated && (
        <p className="login-prompt">Please log in or sign up to add a review.</p>
      )}
      {isAuthenticated && (
        <form onSubmit={handleSubmit} className="review-form">
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
          <label>Product Name</label>
          <input
            type="text"
            name="productName"
            value={newReview.productName}
            onChange={handleChange}
          />
          <label>Brand</label>
          <input
            type="text"
            name="brand"
            value={newReview.brand}
            onChange={handleChange}
          />
          <label>Comment</label>
          <input
            type="text"
            name="comment"
            value={newReview.comment}
            onChange={handleChange}
          />
          <label>Image URL</label>
          <input
            type="text"
            name="image"
            value={newReview.image}
            onChange={handleChange}
          />
          <button type="submit">Add Review</button>
        </form>
      )}
      <div className="reviews-list">
        {reviews
          .filter(review => !selectedCategory || review.categoryId === parseInt(selectedCategory))
          .map(review => (
            <div key={review.id} className="review-item">
              <h3>{review.productname || 'No product name'}</h3>
              <p>Brand: {review.brand}</p>
              <p>Comment: {review.comment}</p>
              <img src={review.image} alt={review.productname || 'Image'} />
              <p>Date: {review.date}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Review;
