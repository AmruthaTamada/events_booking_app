// backend/models/orderModel.js

const mongoose = require('mongoose');

// This small schema will define the structure for each ticket detail object
// stored within an order's 'tickets' array.
// It's a record of what was purchased in this specific order.
const purchasedTicketSchema = new mongoose.Schema({
  // The name of the ticket tier, e.g., 'General Admission'.
  // We store this directly to maintain a historical record of the ticket name.
  ticketType: {
    type: String,
    required: true,
  },
  // We store the price of the ticket AT THE TIME OF PURCHASE.
  // This is a crucial business rule. Even if the event organizer later changes
  // the price of 'General Admission' tickets, this order's record will remain unchanged.
  price: {
    type: Number,
    required: true,
  },
  // The number of tickets of this specific type bought in this order.
  quantity: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    // A reference to the Event for which the tickets were purchased.
    // This creates a direct link to the 'Event' collection.
    event: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Event',
    },
    // A reference to the User who made the purchase.
    // This creates a direct link to the 'User' collection.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // The total cost of the entire order.
    totalAmount: {
      type: Number,
      required: [true, 'Order must have a total amount.'],
    },
    // An array containing the details of the tickets purchased in this order.
    // Each object in this array will conform to the 'purchasedTicketSchema'.
    tickets: [purchasedTicketSchema],
  },
  {
    // 'timestamps: true' adds 'createdAt' and 'updatedAt' fields.
    // For orders, 'createdAt' is especially useful as it represents the purchase date.
    timestamps: true,
  }
);

// Compile the schema into a model named 'Order'.
// Mongoose will create a collection named 'orders' in MongoDB.
module.exports = mongoose.model('Order', orderSchema);