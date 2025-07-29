// frontend/src/pages/LoginPage.js

// highlight-start
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
// highlight-end

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // highlight-start
  const [error, setError] = useState(null);

  // Get the login function from our context
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  // highlight-end

  const submitHandler = async (e) => { // highlight-line
    e.preventDefault();
    setError(null);

    // highlight-start
    try {
      // Call the login function from the context
      await login(email, password);
      // On success, redirect to the home page
      navigate('/');
    } catch (err) {
      // On failure, display the error message from the backend
      setError(err.response.data.message || 'Login failed. Please check your credentials.');
    }
    // highlight-end
  };

  return (
    <div>
      <h1>Login</h1>
      {/* // highlight-start */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {/* // highlight-end */}
      <form onSubmit={submitHandler}>
        {/* ... form inputs remain the same ... */}
        <div>
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;