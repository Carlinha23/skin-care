import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from './UserContext';
import axios from 'axios';
import './Home.css'; 

function Home() {
  const { currentUser } = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [reviews, setReviews] = useState([]);
  const [categories, setCategories] = useState([]);
  
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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log("Searching for:", searchQuery, "Category:", selectedCategory);
  };

  const filteredReviews = reviews
    .filter(review => {
      const matchesQuery = review.productname && review.productname.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || review.categoryid === parseInt(selectedCategory, 10);
      return matchesQuery && matchesCategory;
    });

  return (
    <div className="home-container">
      {currentUser ? (
        <h1 className="welcome-message">Welcome back, {currentUser.firstName}!</h1>
      ) : (
        <h1 className="welcome-message">Welcome to Skin-Care Review! Please login or signup.</h1>
      )}
      <div className="info-text">
        <p>Become a skincare expert in our community! Share your insights, tips, and experiences with others who are passionate about skincare. Your review can make a difference!</p>
      </div>
      <form onSubmit={handleSearchSubmit} className="search-form">
        <select value={selectedCategory} onChange={handleCategoryChange} className="category-select">
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <button type="submit" className="search-button">Search</button>
      </form>
      <div className="reviews-list">
        {filteredReviews.map(review => (
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

export default Home;

