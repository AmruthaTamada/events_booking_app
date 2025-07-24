const asyncHandler = require('express-async-handler');
const Event = require('../models/eventModel');
const Ticket = require('../models/ticketModel'); // ✅ Import your Ticket model
const crypto = require('crypto'); // for generating unique codes

// @desc    Simulate a successful payment and generate tickets
// @route   POST /api/orders/create-payment-intent
// @access  Private
const createPaymentIntent = asyncHandler(async (req, res) => {
  const { eventId, tickets: itemsToPurchase } = req.body;

  if (!eventId || !itemsToPurchase || itemsToPurchase.length === 0) {
    res.status(400);
    throw new Error('Missing eventId or ticket information.');
  }

  // Fetch event
  const event = await Event.findById(eventId);
  if (!event) {
    res.status(404);
    throw new Error('Event not found.');
  }

  // Calculate total and validate quantities
  let totalAmount = 0;
  for (const item of itemsToPurchase) {
    const ticketType = event.ticketTypes.id(item.ticketTypeId);
    if (!ticketType) {
      res.status(400);
      throw new Error(`Ticket type with id ${item.ticketTypeId} not found.`);
    }
    // (Optional) Validate stock: if (item.quantity > ticketType.quantity) throw new Error('Not enough tickets');
    totalAmount += ticketType.price * item.quantity;
  }

  // ✅ Create Ticket documents for each purchased item
  const createdTickets = [];
  for (const item of itemsToPurchase) {
    const ticketType = event.ticketTypes.id(item.ticketTypeId);

    for (let i = 0; i < item.quantity; i++) {
      const uniqueCode = crypto.randomBytes(16).toString('hex'); // 32-char unique code
      const newTicket = await Ticket.create({
        order: null, // if you implement orders later, set order ID here
        event: event._id,
        user: req.user.id,
        ticketType: ticketType.name, // store the name directly for easier display
        uniqueCode,
      });
      createdTickets.push(newTicket);
    }

    // (Optional) Reduce ticketType.quantity in event if you want to manage stock:
    // ticketType.quantity -= item.quantity;
  }

  // If you reduced stock, save event:
  // await event.save();

  // Simulate payment
  const fakeClientSecret = `fake_client_secret_${Date.now()}`;

  res.status(201).json({
    clientSecret: fakeClientSecret,
    message: 'Payment simulated successfully',
    totalAmount,
    tickets: createdTickets, // return tickets info
  });
});

// @desc    Get tickets purchased by logged-in attendee
// @route   GET /api/orders/my-tickets
// @access  Private
const getMyTickets = asyncHandler(async (req, res) => {
  const tickets = await Ticket.find({ user: req.user.id })
    .populate({
      path: 'event',
      select: 'title date location image',
    })
    .sort({ createdAt: -1 });

  if (!tickets || tickets.length === 0) {
    res.status(404);
    throw new Error('No tickets found for this user.');
  }

  res.status(200).json(tickets);
});

module.exports = {
  createPaymentIntent,
  getMyTickets,
};
