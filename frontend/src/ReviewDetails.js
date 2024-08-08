import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import './Review.css';

function ReviewDetails() {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const history = useHistory();

  useEffect(() => {
    async function fetchReview() {
      try {
        const res = await axios.get(`/api/reviews/${id}`);
        setReview(res.data.review);
      } catch (err) {
        setError('Error fetching review details');
      } finally {
        setLoading(false);
      }
    }
    fetchReview();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  if (!review) return <p>No review found</p>;

  return (
    <div className="review-details-container">
      <button onClick={() => history.goBack()} className="back-button"> Back </button>
      <div className="review-details">
        <h1>{review.productName}</h1>
        <p><strong>Category:</strong> {review.categoryName}</p>
        <p><strong>Brand:</strong> {review.brand}</p>
        <p><strong>Comment:</strong> {review.comment}</p>
        {review.image && (
          <img src={review.image} alt={review.productName} className="review-image"/>
        )}
        <p><strong>Date:</strong> {new Date(review.date).toLocaleDateString()}</p>
      </div>
    </div>
  );
}

export default ReviewDetails;
