import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Home.css';

const BASE_URL = process.env.REACT_APP_BASE_URL || "https://skin-care-backend.onrender.com";

function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [reviews, setReviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(5); // Number of reviews to display initially
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await axios.get(`${BASE_URL}/api/reviews`);
        setReviews(res.data.reviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    }
    
    async function fetchCategories() {
      try {
        const res = await axios.get(`${BASE_URL}/api/categories`);
        setCategories(res.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    fetchReviews();
    fetchCategories();
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

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log("Searching for:", searchQuery, "Category:", selectedCategory);
  };

  const handleAddReviewClick = () => {
    // Make sure you have the proper import for history
    window.location.href = '/reviews'; 
  };

  // Create a list of unique product names based on the filtered reviews
  const filteredReviews = reviews
    .filter(review => {
      const matchesQuery = review.productname && review.productname.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || review.categoryid === parseInt(selectedCategory, 10);
      return matchesQuery && matchesCategory;
    });

  // Create a list of unique product names with their category names
  const uniqueProducts = [...new Map(filteredReviews.map(review => [
    review.productname,
    {
      productName: review.productname,
      categoryName: categories.find(cat => cat.id === review.categoryid)?.name || 'Unknown'
    }
  ])).values()];

  const handleLoadMore = () => {
    setVisibleProducts(prevVisibleProducts => prevVisibleProducts + 5); // Increase the number of reviews to show
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="home-container">
      <div className="welcome-info">
        <div className="info-text">
          <p>Become a skincare expert in our community! Share your insights, tips, and experiences with others who are passionate about skincare. Your review can make a difference!</p>
        </div>
      </div>
      <form onSubmit={handleSearchSubmit} className="search-form">
        {/* Input field for product search */}
        <input 
          type="text"
          value={searchQuery}
          onChange={handleSearchQueryChange}
          placeholder="Search by product name"
          className="product-search-input"
        />
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
        {uniqueProducts.length === 0 ? (
          <p className="no-reviews-message">
            It looks like there are no reviews for this category yet. Click the 'Add Review' button and be the first to share your thoughts!
          </p>
        ) : (
          uniqueProducts.slice(0, visibleProducts).map((product, index) => (
            <div key={index} className="product-item">
              <Link to={`/productdetails/${encodeURIComponent(product.productName)}`} className="product-link">
                <h3>{product.productName}</h3>
              </Link>
            </div>
          ))
        )}
        {uniqueProducts.length > visibleProducts && (
          <button onClick={handleLoadMore} className="load-more-button">Load More</button>
        )}
      </div>
      {showScrollToTop && (
        <button onClick={handleScrollToTop} className="scroll-to-top-button">↑</button>
      )}
    </div>
  );
}

export default Home;

          


