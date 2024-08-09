import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import './ReviewDetails.css';

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
      <button onClick={() => history.goBack()} className="back-button">Back</button>
      <div className="review-details">
        <h1>{review.productname}</h1>
        <span className="review-label">Product:</span>
        <span className="review-value">{review.productname}</span>
        <span className="review-label">Brand:</span>
        <span className="review-value">{review.brand}</span>
        <span className="review-label">Comment:</span>
        <span className="review-value">{review.comment}</span>
        {review.image && (
          <img src={review.image} alt={review.productname} className="review-image"/>
        )}
        <span className="review-label">Date:</span>
        <span className="review-value">{new Date(review.date).toLocaleDateString()}</span>
      </div>
    </div>
  );
}

export default ReviewDetails;