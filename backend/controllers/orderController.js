// backend/controllers/orderController.js

const asyncHandler = require('express-async-handler');
const Event = require('../models/eventModel');
const Order = require('../models/orderModel'); // ✅ FIX: Needed for getMyTickets

// @desc    Simulate a successful payment (no Stripe)
// @route   POST /api/orders/create-payment-intent
// @access  Private
const createPaymentIntent = asyncHandler(async (req, res) => {
  const { eventId, tickets: itemsToPurchase } = req.body;

  // 1. Validate the incoming data
  if (!eventId || !itemsToPurchase || itemsToPurchase.length === 0) {
    res.status(400);
    throw new Error('Missing eventId or ticket information.');
  }

  // 2. Fetch the event and validate
  const event = await Event.findById(eventId);
  if (!event) {
    res.status(404);
    throw new Error('Event not found.');
  }

  // 3. Calculate the total order amount
  let totalAmount = 0;
  for (const item of itemsToPurchase) {
    const ticketType = event.ticketTypes.id(item.ticketTypeId);
    if (!ticketType) {
      res.status(400);
      throw new Error(`Ticket type with id ${item.ticketTypeId} not found.`);
    }
    totalAmount += ticketType.price * item.quantity;
  }

  // ✅ 4. Simulate a "fake" clientSecret
  const fakeClientSecret = `fake_client_secret_${Date.now()}`;

  // 5. Respond with simulated clientSecret
  res.status(201).json({
    clientSecret: fakeClientSecret,
    message: 'Payment simulated successfully',
    totalAmount,
  });
});

// @desc    Get tickets purchased by the logged-in attendee
// @route   GET /api/orders/my-tickets
// @access  Private
const getMyTickets = asyncHandler(async (req, res) => {
  // 1. Find all tickets where the 'user' field matches the logged-in user's ID.
  // req.user.id is available because this route will be protected by our auth middleware.
  const tickets = await Ticket.find({ user: req.user.id })
    // 2. Use .populate() to fetch and embed related data.
    // This is incredibly powerful. It replaces the 'event' ID with the full Event document.
    .populate({
      path: 'event', // The field in the Ticket model we want to populate.
      select: 'title date location image', // Specify which fields from the Event model to include.
    })
    // 3. We can also populate the ticketType's name from the Event document.
    // Note: This is more advanced populate usage.
    .populate({
      path: 'ticketType', // Assumes 'ticketType' in your Ticket model is a ref to the subdocument ID
      select: 'name', // This might require a more complex populate setup if it's not a direct ref
                      // For now, let's keep it simple and get the Event details.
    })
    .sort({ createdAt: -1 }); // Sort by creation date, newest first.

  if (!tickets) {
    res.status(404);
    throw new Error('No tickets found for this user.');
  }

  res.status(200).json(tickets);
});

module.exports = {
  createPaymentIntent,
  getMyTickets,
  // createOrder,
};
