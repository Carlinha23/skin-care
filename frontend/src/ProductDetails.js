import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import './ProductDetails.css';

const BASE_URL = process.env.REACT_APP_BASE_URL || "https://skin-care-backend.onrender.com";

function ProductDetails() {
  const { productName } = useParams(); // Get the product name from URL params
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const history = useHistory();

  useEffect(() => {
    async function fetchReviews() {
      try {
        console.log("Fetching reviews for product:", productName); // Debugging line
        const res = await axios.get(`${BASE_URL}/api/reviews`, {
          params: { productname: productName }
        });
        console.log("Fetched reviews:", res.data.reviews); // Debugging line
        setReviews(res.data.reviews);
      } catch (err) {
        setError('Error fetching reviews for this product');
        console.error("Error fetching reviews:", err); // Debugging line
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, [productName]); // Ensure this runs when productName changes

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="product-details-container">
      <button onClick={() => history.goBack()} className="back-button">Back</button>
      <h1>Reviews for {productName}</h1>
      {reviews.length === 0 ? (
        <p>No reviews found for this product.</p>
      ) : (
        reviews.map(review => (
          <div key={review.id} className="review-item">
            <h2>{review.productname}</h2> {/* Display Product Name */}
            <div className="review-details">
              <span className="review-label">Brand:</span>
              <span className="review-value">{review.brand}</span>
              <span className="review-label">Comment:</span>
              <span className="review-value">{review.comment}</span>
              {review.image && <img src={review.image} alt={review.productname} />}
              <span className="review-date">{new Date(review.date).toLocaleDateString()}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ProductDetails;
