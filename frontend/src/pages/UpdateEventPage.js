import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
const UpdateEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    image: '',
    ticketTypes: [], // store tickets as array
  });

  const [loading, setLoading] = useState(true);

  // ✅ Fetch existing event and populate state
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/events/${id}`);
        const eventData = res.data;

        setFormData({
          title: eventData.title || '',
          description: eventData.description || '',
          location: eventData.location || '',
          date: eventData.date || '',
          image: eventData.image || '',
          ticketTypes: eventData.ticketTypes?.length
            ? eventData.ticketTypes.map((t) => ({
                name: t.name || '',
                price: t.price || 0,
                quantity: t.quantity || 0,
              }))
            : [],
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching event:', err);
      }
    };
    fetchEvent();
  }, [id]);

  // ✅ Handle normal fields
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ✅ Handle ticket fields
  const handleTicketChange = (index, field, value) => {
    const updatedTickets = [...formData.ticketTypes];
    updatedTickets[index][field] = value;
    setFormData((prev) => ({ ...prev, ticketTypes: updatedTickets }));
  };

  const addTicketType = () => {
    setFormData((prev) => ({
      ...prev,
      ticketTypes: [...prev.ticketTypes, { name: '', price: 0, quantity: 0 }],
    }));
  };

  const removeTicketType = (index) => {
    const updatedTickets = formData.ticketTypes.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, ticketTypes: updatedTickets }));
  };

  // ✅ Submit updated data
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;

      // prepare payload
      const payload = {
        ...formData,
        ticketTypes: formData.ticketTypes.map((t) => ({
          name: t.name,
          price: parseFloat(t.price),
          quantity: parseInt(t.quantity, 10),
        })),
      };

      await axios.put(`http://localhost:5000/api/events/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('✅ Event updated!');
      navigate('/organizer-dashboard');
    } catch (error) {
      console.error('Update failed:', error?.response?.data || error);
      alert(`Failed to update event: ${error?.response?.data?.message || error.message}`);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <h2>Update Event</h2>
      <form onSubmit={handleUpdate}>
        <label>Title</label>
        <input name="title" value={formData.title} onChange={handleChange} required />

        <label>Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required />

        <label>Date</label>
        <input
          type="datetime-local"
          name="date"
          value={formData.date.slice(0, 16)}
          onChange={handleChange}
          required
        />

        <label>Location</label>
        <input name="location" value={formData.location} onChange={handleChange} required />

        <label>Image URL</label>
        <input name="image" value={formData.image} onChange={handleChange} required />

        <h3>Ticket Types</h3>
        {formData.ticketTypes.map((ticket, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              marginBottom: '10px',
              borderRadius: '4px',
            }}
          >
            <label>Ticket Name:</label>
            <input
              value={ticket.name}
              onChange={(e) => handleTicketChange(index, 'name', e.target.value)}
              required
            />

            <label>Price:</label>
            <input
              type="number"
              value={ticket.price}
              onChange={(e) => handleTicketChange(index, 'price', e.target.value)}
              required
            />

            <label>Quantity:</label>
            <input
              type="number"
              value={ticket.quantity}
              onChange={(e) => handleTicketChange(index, 'quantity', e.target.value)}
              required
            />

            {formData.ticketTypes.length > 1 && (
              <button
                type="button"
                style={{ backgroundColor: 'red', color: 'white', marginTop: '8px' }}
                onClick={() => removeTicketType(index)}
              >
                Remove Ticket Type
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addTicketType}
          style={{ marginBottom: '20px', backgroundColor: '#3498db', color: '#fff' }}
        >
          + Add Another Ticket Type
        </button>

        <br />
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: '#fff' }}>
          Update Event
        </button>
      </form>
    </div>
  );
};

export default UpdateEventPage;
