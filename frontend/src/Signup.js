import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from './UserContext';
import './Signup.css';

function Signup() {
  const { signup } = useContext(UserContext);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: ''
  });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const history = useHistory();

  async function handleSubmit(evt) {
    evt.preventDefault();
    setError(null);

    for (let key in formData) {
      if (formData[key] === '') {
        setError(`The ${key} field is required.`);
        return;
      }
    }

    try {
      await signup(formData);
      setMessage(`Welcome, ${formData.username}! You have successfully signed up and are now logged in.`);
      setTimeout(() => {
        history.push('/reviews'); // Redirect to the reviews page
      }, 2000); // Delay in milliseconds before redirection
    } catch (err) {
      setError('An error occurred during signup. Please try again.');
      console.error("Error during signup:", err);
    }
  }

  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData(data => ({
      ...data,
      [name]: value
    }));
  }

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <label>First Name</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        />
        <label>Last Name</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <button type="submit">Signup</button>
        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}
      </form>
    </div>
  );
}

export default Signup;
