import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const MyTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token;
        if (!token) {
          setError('You must be logged in to view your tickets.');
          setLoading(false);
          return;
        }

        // 👉 Replace this endpoint with your backend route for attendee tickets
        const response = await axios.get(`${BASE_URL}/api/tickets/my-tickets`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTickets(response.data); // Assuming your backend sends an array of tickets
      } catch (err) {
        console.error('Error fetching tickets:', err);
        setError(err.response?.data?.message || 'Failed to load tickets.');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading your tickets...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <h2 style={{ marginBottom: '30px', textAlign: 'center' }}>My Tickets</h2>

      {tickets.length === 0 ? (
        <p style={{ textAlign: 'center' }}>You haven’t purchased any tickets yet.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '30px',
          }}
        >
          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                backgroundColor: '#fff',
              }}
            >
              <img
                src={
                  ticket.event.image?.startsWith('http')
                    ? ticket.event.image
                    : `${BASE_URL}${ticket.event.image}`
                }
                alt={ticket.event.title}
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
              <div style={{ padding: '20px' }}>
                <h3 style={{ marginBottom: '10px' }}>{ticket.event.title}</h3>
                <p>
                  <strong>Date:</strong>{' '}
                  {new Date(ticket.event.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Location:</strong> {ticket.event.location}
                </p>
                <p>
                  <strong>Quantity:</strong> {ticket.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTicketsPage;
