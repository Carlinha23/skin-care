import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './Home.css'; 
//import logo from './images/logo.png';

function Home() {
  const [searchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [reviews, setReviews] = useState([]);
  const [categories, setCategories] = useState([]);
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
    
    async function fetchCategories() {
      try {
        const res = await axios.get('/api/categories');
        setCategories(res.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    fetchReviews();
    fetchCategories();
  }, []);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log("Searching for:", searchQuery, "Category:", selectedCategory);
  };

  const handleAddReviewClick = () => {
    history.push('/reviews'); 
  };

  const filteredReviews = reviews
    .filter(review => {
      const matchesQuery = review.productname && review.productname.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || review.categoryid === parseInt(selectedCategory, 10);
      return matchesQuery && matchesCategory;
    });

  

  return (
    <div className="home-container">
      <div className="welcome-info">
        <div className="info-text">
          <p>Become a skincare expert in our community! Share your insights, tips, and experiences with others who are passionate about skincare. Your review can make a difference!</p>
        </div>
      </div>
      <form onSubmit={handleSearchSubmit} className="search-form">
        <select value={selectedCategory} onChange={handleCategoryChange} className="category-select">
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <button type="submit" className="search-button">Search</button>
        <button onClick={handleAddReviewClick} className="add-review-button">Add Review</button>
      </form>
      <div className="reviews-list">
        {filteredReviews.length === 0 ? (
          <p className="no-reviews-message">
            It looks like there are no reviews for this category yet. Click the 'Add Review' button and be the first to share your thoughts!
          </p>
        ) : (
          filteredReviews.map(review => (
            <div key={review.id} className="review-item">
              <h3>{review.productname || 'No product name'}</h3>
              <div className="review-details">
                <div>
                  <span className="review-label">Brand:</span>
                  <span className="review-value">{review.brand}</span>
                </div>
                <div>
                  <span className="review-label">Comment:</span>
                  <span className="review-value">{review.comment}</span>
                </div>
                <div>
                  <span className="review-label">Date:</span>
                  <span className="review-date">{new Date(review.date).toLocaleDateString()}</span>
                </div>
              </div>
              {review.image && <img src={review.image} alt={review.productname || 'Image'} />}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;

