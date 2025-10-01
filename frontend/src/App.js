// frontend/src/App.js
import './app.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreateEventPage from './pages/CreateEventPage';
import EventDetailPage from './pages/EventDetailPage';
import OrganizerDashboardPage from './pages/OrganizerDashboardPage';
import MyTicketsPage from './pages/MyTicketsPage';
import UpdateEventPage from './pages/UpdateEventPage';

function App() {
  return (
    <Router>
      <Navbar />
      <main style={{ padding: '2rem' }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Dynamic Route */}
          <Route path="/event/:id" element={<EventDetailPage />} />

          {/* Protected Routes */}
          <Route path="/organizer-dashboard" element={<OrganizerDashboardPage />} />
          <Route path="/my-tickets" element={<MyTicketsPage />} />
          <Route path="/create-event" element={<CreateEventPage />} />
          <Route path="/update-event/:id" element={<UpdateEventPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
