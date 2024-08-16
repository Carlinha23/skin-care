import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from './UserContext';
import './Login.css';

function Login() {
  const { login } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const history = useHistory();


  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      await login({ username, password });
      setMessage(`Welcome, ${username}! You have successfully logged in.`);
      setTimeout(() => {
        history.push('/reviews'); // Redirect to the reviews page
      }, 2000); // Delay in milliseconds before redirection
    } catch (error) {
      console.error("Error during login:", error);
    }
  }

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      {message && <div className="login-message">{message}</div>}
    </div>
  );
}

export default Login;