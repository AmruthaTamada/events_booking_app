// frontend/src/components/CheckoutForm.js

import React, { useState } from 'react';

const CheckoutForm = ({ eventId }) => {
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);

    // Simulate payment success after 2 seconds
    setTimeout(() => {
      setProcessing(false);
      setSucceeded(true);
      alert(`✅ Payment simulated!\n\n🎟️ Tickets booked successfully for Event ID: ${eventId}`);
    }, 2000);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} style={{ marginTop: '20px', color: '#333' }}>
      <h3>Simulated Payment</h3>
      <p>This is a mock payment form. No real card data is processed.</p>

      <button
        disabled={processing || succeeded}
        style={{
          marginTop: '20px',
          width: '100%',
          padding: '12px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: succeeded ? '#2ecc71' : '#3498db',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
        }}
      >
        {processing ? 'Processing...' : succeeded ? 'Payment Complete' : 'Simulate Payment'}
      </button>

      {error && (
        <p style={{ color: '#e74c3c', marginTop: '10px' }}>{error}</p>
      )}

      {succeeded && (
        <p style={{ color: '#2ecc71', marginTop: '10px' }}>✅ Payment Simulated Successfully!</p>
      )}
    </form>
  );
};

export default CheckoutForm;
