import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateEventPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    image: '',
    ticketTypes: [
      { name: '', price: '', quantity: '' } // start with one ticket type
    ],
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleTicketChange = (index, field, value) => {
    const updatedTickets = [...formData.ticketTypes];
    updatedTickets[index][field] = value;
    setFormData((prev) => ({ ...prev, ticketTypes: updatedTickets }));
  };

  const addTicketType = () => {
    setFormData((prev) => ({
      ...prev,
      ticketTypes: [...prev.ticketTypes, { name: '', price: '', quantity: '' }],
    }));
  };

  const removeTicketType = (index) => {
    const updatedTickets = formData.ticketTypes.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, ticketTypes: updatedTickets }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;

      // Prepare payload
      const payload = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        location: formData.location,
        image: formData.image,
        ticketTypes: formData.ticketTypes.map((t) => ({
          name: t.name,
          price: parseFloat(t.price),
          quantity: parseInt(t.quantity, 10),
        })),
      };

      await axios.post('http://localhost:5000/api/events', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Event created successfully!');
      navigate('/organizer-dashboard');
    } catch (error) {
      console.error('Error creating event:', error?.response?.data || error);
      alert('Error creating event. Check console for details.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <h2>Create New Event</h2>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input name="title" value={formData.title} onChange={handleChange} required />

        <label>Description:</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required />

        <label>Date:</label>
        <input type="date" name="date" value={formData.date} onChange={handleChange} required />

        <label>Location:</label>
        <input name="location" value={formData.location} onChange={handleChange} required />

        <label>Image URL:</label>
        <input name="image" value={formData.image} onChange={handleChange} required />

        <h4>Ticket Types</h4>
                {formData.ticketTypes.map((ticket, index) => (
          <div key={index} className="ticket-type-container">
            <div>
              <label>Ticket Name:</label>
              <input
                value={ticket.name}
                onChange={(e) => handleTicketChange(index, 'name', e.target.value)}
                required
              />
            </div>

            <div>
              <label>Ticket Price:</label>
              <input
                type="number"
                value={ticket.price}
                onChange={(e) => handleTicketChange(index, 'price', e.target.value)}
                required
              />
            </div>

            <div>
              <label>Ticket Quantity:</label>
              <input
                type="number"
                value={ticket.quantity}
                onChange={(e) => handleTicketChange(index, 'quantity', e.target.value)}
                required
              />
            </div>

            {formData.ticketTypes.length > 1 && (
              <button
                type="button"
                className="remove-button"
                onClick={() => removeTicketType(index)}
              >
                Remove
              </button>
            )}
          </div>
        ))}


        <button type="button" onClick={addTicketType} style={{ marginBottom: '20px' }}>
          + Add Another Ticket Type
        </button>

        <br />
        <button type="submit" style={{ marginTop: '10px' }}>Create Event</button>
      </form>
    </div>
  );
};

export default CreateEventPage;
