import React, { useState, useContext, useEffect } from 'react';
import SkinApi from './SkinApi';
import { UserContext } from './UserContext';
//import './Profile.css';

function Profile() {
  const { currentUser, setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        password: ''
      });
    }
  }, [currentUser]);


  async function handleSubmit(evt) {
    evt.preventDefault();
    setError(null);
    setSuccessMessage('');

    try {
      // Log the form data before sending
      console.log('Form Data:', formData);

      // Remove password from formData if it is empty
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password;
      }

      const updatedUser = await SkinApi.updateUser(currentUser.username, updateData);
      setUser(updatedUser);
      setSuccessMessage('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Error updating profile');
    }
  }

  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData(data => ({
      ...data,
      [name]: value
    }));
  }

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <form onSubmit={handleSubmit} className="profile-form">
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
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <button>Update Profile</button>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </form>
    </div>
  );
}


export default Profile;

