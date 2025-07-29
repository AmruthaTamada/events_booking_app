import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      {/* Left section */}
      <div className="navbar-left">
        <Link to="/">Home</Link>
        {user?.role === 'organizer' && <Link to="/create-event">Create Event</Link>}
        {user?.role === 'organizer' && <Link to="/organizer-dashboard">Dashboard</Link>}
        {user?.role === 'attendee' && <Link to="/my-tickets">My Tickets</Link>}
      </div>

      {/* Center section - App name */}
      <div className="navbar-center">
        Evendo
      </div>

      {/* Right section */}
      <div className="navbar-right">
        {user ? (
          <>
            <span>Welcome, {user.name}! ({user.role})</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
