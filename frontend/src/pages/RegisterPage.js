// frontend/src/pages/RegisterPage.js
import React, { useState } from 'react';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('attendee');

  const submitHandler = async (e) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    alert('Passwords do not match');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
        role,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    alert('Registration successful! ✅');
    console.log('🟢 Response:', data);

    // Optionally: redirect to login page
    // navigate('/login');

  } catch (err) {
    alert(`Registration failed ❌: ${err.message}`);
    console.error('🔴 Error:', err);
  }
};


  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Register</h1>
        <form onSubmit={submitHandler} className="auth-form">
          <div className="auth-form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="auth-form-group">
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

          <div className="auth-form-group">
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

          <div className="auth-form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="role">Register as:</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="attendee">Attendee</option>
              <option value="organizer">Organizer</option>
            </select>
          </div>

          <button type="submit" className="auth-btn">Register</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
