import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventCard from '../components/EventCard';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setError(null);
        const response = await axios.get(`${API_BASE_URL}/api/events`);
        setEvents(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch events. Please try again later.');
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div>Loading events...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Upcoming Events</h1>
      {events.length === 0 ? (
        <p>No events found. Why not be the first to create one?</p>
      ) : (
        <div className="events-container">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
