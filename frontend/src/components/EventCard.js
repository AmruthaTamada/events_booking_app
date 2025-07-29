import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const imageUrl = event.image?.startsWith('http')
  ? event.image
  : `${API_BASE_URL}${event.image}`;

  return (
    <Link to={`/event/${event._id}`} className="event-card" style={cardStyle}>
      <img src={imageUrl} alt={event.title} style={imageStyle} />
      <div style={contentStyle}>
        <h3 style={titleStyle}>{event.title}</h3>
        <p style={dateStyle}>{formattedDate}</p>
        <p style={descStyle}>
          {event.description.substring(0, 100)}...
        </p>
      </div>
    </Link>
  );
};

// Optional inline styles
const cardStyle = {
  display: 'block',
  border: '1px solid #ddd',
  borderRadius: '8px',
  margin: '15px',
  overflow: 'hidden',
  textDecoration: 'none',
  color: 'inherit',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  transition: 'transform 0.2s ease-in-out',
};

const imageStyle = {
  width: '100%',
  height: '200px',
  objectFit: 'cover',
};

const contentStyle = {
  padding: '15px',
};

const titleStyle = {
  margin: '0 0 10px 0',
};

const dateStyle = {
  margin: '0 0 10px 0',
  color: '#666',
};

const descStyle = {
  margin: 0,
};

export default EventCard;
