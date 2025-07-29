import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const OrganizerDashboardPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token;

        const res = await axios.get(`${BASE_URL}/api/events/myevents`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setEvents(res.data);
      } catch (error) {
        console.error('Error fetching organizer events', error.response?.data || error.message);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1>Organizer Dashboard</h1>
      <p>Welcome to your central hub for managing your events, viewing sales data, and tracking attendees.</p>

      <div
        style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#606060',
          border: '1px solid #ddd',
          borderRadius: '8px',
          color: '#fff',
        }}
      >
        <h2>Dashboard Content Area</h2>
        <p>In the upcoming tasks, this area will be populated with:</p>
        <ul>
          <li>A list of your created events.</li>
          <li>Charts showing your sales revenue.</li>
          <li>A table of attendees for each event.</li>
        </ul>
      </div>

      <div style={{ marginTop: '40px' }}>
        <h2 style={{ marginBottom: '10px' }}>My Events</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
          }}
        >
          {events.length === 0 ? (
            <p style={{ color: '#333' }}>No events created yet.</p>
          ) : (
            events.map((event) => (
              <div
                key={event._id}
                style={{
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '12px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  padding: '16px',
                  transition: 'transform 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <img
                  src={event.image}
                  alt={event.title}
                  style={{
                    width: '100%',
                    height: '180px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginBottom: '12px',
                  }}
                />
                <h3 style={{ margin: '8px 0', color: '#333', fontSize: '1.2rem' }}>{event.title}</h3>
                <p style={{ color: '#555', fontSize: '0.9rem' }}>
                  <strong>Date:</strong> {new Date(event.date).toLocaleString()}
                </p>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                  {event.description.length > 100
                    ? event.description.slice(0, 100) + '...'
                    : event.description}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboardPage;
