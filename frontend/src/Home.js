import React, { useContext } from 'react';
import { UserContext } from './UserContext';
//import './Home.css';

function Home() {
  const { currentUser } = useContext(UserContext);

  return (
    <div className="home-container">
      {currentUser ? (
        <h1 className="welcome-message">Welcome back, {currentUser.firstName}!</h1>
      ) : (
        <h1 className="welcome-message">Welcome to Skin-Care Review! Please login or signup.</h1>
      )}
    </div>
  );
}

export default Home;
