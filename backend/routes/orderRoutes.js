const express = require('express');
const router = express.Router();
const {
  createPaymentIntent,
  getMyTickets,
} = require('../controllers/orderController');

const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/orders/create-payment-intent
// @desc    Simulate payment (mock only)
// @access  Private
router.post('/create-payment-intent', protect, createPaymentIntent);

// @route   GET /api/orders/my-tickets
// @desc    Get tickets purchased by logged-in attendee
// @access  Private
router.get('/my-tickets', protect, getMyTickets);

module.exports = router;
