import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './Review.css';

function Review() {
  const [reviews, setReviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newReview, setNewReview] = useState({
    categoryId: '',
    productName: '',
    brand: '',
    comment: '',
    image: '',
    date: ''
  });
  const history = useHistory();

  useEffect(() => {
    async function fetchReviews() {
      const res = await axios.get('/api/reviews/all');
      setReviews(res.data.reviews);
    }
    fetchReviews();
  }, []);

  useEffect(() => {
    async function fetchCategories() {
      const res = await axios.get('/api/categories');
      setCategories(res.data.categories);
    }
    fetchCategories();
  }, []);

  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      await axios.post('/api/reviews', newReview);
      setNewReview({
        categoryId: '',
        productName: '',
        brand: '',
        comment: '',
        image: '',
        date: ''
      });
      history.push('/reviews');
    } catch (err) {
      console.error("Error during review submission:", err);
    }
  }

  function handleChange(evt) {
    const { name, value } = evt.target;
    setNewReview(prevReview => ({
      ...prevReview,
      [name]: value
    }));
  }

  function handleCategoryChange(evt) {
    setSelectedCategory(evt.target.value);
  }

  return (
    <div className="review-container">
      <h1>Reviews</h1>
      <div className="category-bar">
        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </div>
      <form onSubmit={handleSubmit} className="review-form">
        <label>Category</label>
        <select
          name="categoryId"
          value={newReview.categoryId}
          onChange={handleChange}
        >
          <option value="">Select a Category</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
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
        <label>Date</label>
        <input
          type="text"
          name="date"
          value={newReview.date}
          onChange={handleChange}
        />
        <button type="submit">Add Review</button>
      </form>
      <div className="reviews-list">
        {reviews
          .filter(review => !selectedCategory || review.categoryId === parseInt(selectedCategory))
          .map(review => (
            <div key={review.id} className="review-item">
              <h3>{review.productName}</h3>
              <p>Brand: {review.brand}</p>
              <p>Comment: {review.comment}</p>
              <img src={review.image} alt={review.productName} />
              <p>Date: {review.date}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Review;
