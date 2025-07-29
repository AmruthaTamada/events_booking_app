// frontend/src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

// 1. Create the context
// This will be the object that components can import to access the context.
const AuthContext = createContext();

// 2. Create the AuthProvider component
// This component will wrap our application and manage the authentication state.
export const AuthProvider = ({ children }) => {
  // We use useState to hold the user object.
  // We initialize it by trying to get the user from localStorage.
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    try {
      // Parse the stored JSON. If it's invalid, it will throw an error.
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      return null;
    }
  });

  // useEffect to handle side effects. Here, it syncs the user state with localStorage.
  useEffect(() => {
    if (user) {
      // When the user state changes, we store the new user object in localStorage.
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      // If the user logs out (user becomes null), we remove the item from localStorage.
      localStorage.removeItem('user');
    }
  }, [user]); // This effect runs whenever the 'user' state changes.

  // --- API Functions ---

  // Function to handle user registration
  const register = async (name, email, password, role) => {
    // We use a try/catch block to handle potential errors from the API call.
    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/register`, {
        name,
        email,
        password,
        role,
      });
      // If registration is successful, the backend returns the user data and token.
      if (response.data) {
        // We update our user state with the response data.
        setUser(response.data);
      }
    } catch (error) {
      // If there's an error, we'll log it and re-throw it so the component can handle it (e.g., show an error message).
      console.error('Registration failed:', error.response.data.message);
      throw error;
    }
  };

  // Function to handle user login
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/login`, {
        email,
        password,
      });      
      if (response.data) {
        // On successful login, update the user state.
        setUser(response.data);
      }
    } catch (error) {
      console.error('Login failed:', error.response.data.message);
      throw error;
    }
  };

  // Function to handle user logout
  const logout = () => {
    // Logging out is as simple as setting the user state to null.
    // The useEffect hook will automatically handle clearing localStorage.
    setUser(null);
  };

  // 3. Return the Provider
  // The 'value' prop is where we make our state and functions available to the rest of the app.
  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. Export the context itself for components to use.
export default AuthContext;