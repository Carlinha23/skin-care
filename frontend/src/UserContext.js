import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import SkinApi from './SkinApi';


export const UserContext = createContext(); 

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    async function fetchUser() {
      if (token) {
        try {
          const { username } = jwtDecode(token);
          SkinApi.token = token;
          const user = await SkinApi.getUserProfile(username);
          setCurrentUser(user);
        } catch (err) {
          console.error("Failed to fetch user", err);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    }

    fetchUser();
  }, [token]);

  const login = async (data) => {
    try {
      const token = await SkinApi.login(data);
      SkinApi.token = token;
      setToken(token);
      localStorage.setItem('token', token);
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  const signup = async (data) => {
    try {
      const token = await SkinApi.register(data);
      SkinApi.token = token;
      setToken(token);
      localStorage.setItem('token', token);
    } catch (err) {
      console.error("Signup failed", err);
    }
  };

  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    SkinApi.token = null;
    localStorage.removeItem('token');
  };

  return (
    <UserContext.Provider value={{  currentUser, setUser: setCurrentUser, login, signup, logout  }}>
      {children}
    </UserContext.Provider>
  );
}
