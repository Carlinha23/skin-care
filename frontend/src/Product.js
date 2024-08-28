import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
//import './Products.css'; // Create a CSS file for custom styling if needed

const BASE_URL = process.env.REACT_APP_BASE_URL || "https://skin-care-backend.onrender.com";

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(10);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await axios.get(`${BASE_URL}/api/products`);
        setProducts(res.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
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

    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product => {
      return (
        (selectedCategory === '' || product.categoryId === selectedCategory) &&
        product.productname.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, products]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLoadMore = () => {
    setVisibleProducts(prevVisibleProducts => prevVisibleProducts + 10);
  };

  return (
    <div className="products-container">
      <h1>All Products</h1>
      <div className="filter-controls">
        <input 
          type="text" 
          placeholder="Search by product name..." 
          value={searchQuery} 
          onChange={handleSearchChange} 
        />
        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </div>
      <div className="product-list">
        {filteredProducts.slice(0, visibleProducts).map(product => (
          <div key={product.id} className="product-item">
            <Link to={`/products/${product.id}`}>
              <h3>{product.productname || 'No product name'}</h3>
            </Link>
          </div>
        ))}
      </div>
      {filteredProducts.length > visibleProducts && (
        <button className="load-more-button" onClick={handleLoadMore}>Load More</button>
      )}
    </div>
  );
}

export default Products;
