import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CheckoutForm from '../components/CheckoutForm';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ticketQuantities, setTicketQuantities] = useState({});
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setError(null);
        const response = await axios.get(`${API_BASE_URL}/api/events/${id}`);
        setEvent(response.data);

        const initialQuantities = response.data.ticketTypes.reduce((acc, ticket) => {
          acc[ticket._id] = 0;
          return acc;
        }, {});
        setTicketQuantities(initialQuantities);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load event details.');
        console.error('Error fetching event details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEventDetails();
  }, [id]);

  const handleQuantityChange = (ticketTypeId, newQuantity) => {
    const quantity = Math.max(0, Number(newQuantity));
    setTicketQuantities(prev => ({
      ...prev,
      [ticketTypeId]: quantity,
    }));
  };

  const calculateTotal = () => {
    if (!event) return 0;
    return event.ticketTypes.reduce((total, ticket) => {
      const qty = ticketQuantities[ticket._id] || 0;
      return total + (ticket.price * qty);
    }, 0);
  };

  const totalAmount = calculateTotal();

  const handleCheckout = () => {
    if (totalAmount > 0) {
      setShowCheckout(true);
    }
  };

  const closeCheckout = () => setShowCheckout(false);

  // ✅ DELETE FUNCTION
  const handleDelete = async () => {
  try {
    const token = JSON.parse(localStorage.getItem('user'))?.token;
    console.log('Deleting event with token:', token);
    console.log('Event ID:', event._id);
    await axios.delete(`${API_BASE_URL}/api/events/${event._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert('Event deleted!');
    navigate('/organizer-dashboard'); // Or wherever you want to go after deletion
  } catch (error) {
    console.error('Delete error:', error.response?.data || error.message);
    alert('Failed to delete event.');
  }
};



  if (loading) return <div>Loading event details...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>{event.title}</h1>
      <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
      <p><strong>Location:</strong> {event.location}</p>

      <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginTop: '30px' }}>Tickets</h2>
      <div style={{ marginTop: '10px' }}>
        {event.ticketTypes.map((ticket) => (
          <div key={ticket._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', border: '1px solid #ddd', marginBottom: '10px', borderRadius: '4px' }}>
            <div>
              <strong>{ticket.name}</strong>
              <p style={{ margin: '5px 0' }}>Price: ${ticket.price.toFixed(2)}</p>
              <p style={{ margin: '5px 0', color: '#666' }}>{ticket.quantity} available</p>
            </div>
            <div>
              <label htmlFor={`quantity-${ticket._id}`} style={{ marginRight: '10px' }}>Quantity:</label>
              <input
                type="number"
                id={`quantity-${ticket._id}`}
                min="0"
                max={ticket.quantity}
                value={ticketQuantities[ticket._id] || 0}
                onChange={(e) => handleQuantityChange(ticket._id, e.target.value)}
                style={{ width: '60px', padding: '5px', textAlign: 'center' }}
              />
            </div>
          </div>
        ))}

        {totalAmount > 0 && (
          <div
            style={{
              marginTop: '20px',
              padding: '15px',
              backgroundColor: '#f4f4f4',
              borderRadius: '4px',
            }}
          >
            {/* Row for total and tax */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                marginBottom: '15px',
              }}
            >
              <h3 style={{ margin: 0, color: '#333' }}>
                Total: ${totalAmount.toFixed(2)} <span style={{ fontSize: '14px', color: '#666' }}>(0% Tax)</span>
              </h3>
            </div>

            {/* Centered button */}
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={handleCheckout}
                style={{
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  backgroundColor: '#3498db',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ✅ Modal */}
      {showCheckout && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#fff', padding: '30px', borderRadius: '8px',
            width: '400px', position: 'relative'
          }}>
            <button
              onClick={closeCheckout}
              style={{ position: 'absolute', top: 10, right: 15, border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer' }}
            >
              ×
            </button>
            <CheckoutForm
              eventTitle={event.title}
              totalAmount={totalAmount}
              ticketDetails={Object.entries(ticketQuantities)
                .filter(([_, qty]) => qty > 0)
                .map(([ticketId, qty]) => {
                  const ticket = event.ticketTypes.find(t => t._id === ticketId);
                  return `${qty} × ${ticket.name} ($${ticket.price})`;
                }).join('\n')}
              onClose={closeCheckout}
            />
          </div>
        </div>
      )}

      {/* ✅ Delete Button at Bottom Center */}
      {/* ✅ Update & Delete Buttons for Organizer */}
{(() => {
  const user = JSON.parse(localStorage.getItem('user'));
  const isOrganizer = user?.role === 'organizer';

  if (!isOrganizer) return null;

  return (
    <div style={{ textAlign: 'center', marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
      <button
        onClick={() => navigate(`/update-event/${event._id}`)}
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '6px',
          fontSize: '16px',
          cursor: 'pointer',
          border: 'none',
        }}
      >
        Update Event
      </button>

      <button
onClick={handleDelete}
        style={{
          backgroundColor: 'red',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '6px',
          fontSize: '16px',
          cursor: 'pointer',
          border: 'none',
        }}
      >
        Delete Event
      </button>
    </div>
  );
})()}

    </div>
  );
};

export default EventDetailPage;
