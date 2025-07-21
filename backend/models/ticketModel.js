// backend/models/ticketModel.js

const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    // A reference to the Order document that this ticket is a part of.
    // This provides traceability, allowing us to see which purchase
    // generated this specific ticket.
    order: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Order',
    },
    // A direct reference to the Event. While this information can be found
    // by populating the 'order' and then its 'event', creating a direct link
    // here is a form of denormalization that greatly simplifies queries,
    // such as "find all tickets for this event".
    event: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Event',
    },
    // A direct reference to the User who owns the ticket.
    // Similar to the 'event' field, this simplifies fetching all tickets
    // for a specific user without having to go through their orders first.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // The specific type of the ticket, e.g., 'VIP', 'General Admission'.
    // This is stored directly on the ticket for easy display and identification.
    ticketType: {
      type: String,
      required: true,
    },
    // This is the most critical field for verification.
    // It will hold a randomly generated, unique string.
    // This code will be converted into a QR code on the frontend.
    // The 'unique: true' constraint ensures that no two tickets can ever
    // have the same code, which is essential for security.
    uniqueCode: {
      type: String,
      required: true,
      unique: true,
    },
    // We can add a field to track if the ticket has been used.
    // This would be updated at the event gate during check-in.
    isCheckedIn: {
      type: Boolean,
      default: false,
    },
  },
  {
    // Timestamps are useful for tracking when the ticket was generated.
    timestamps: true,
  }
);

// Compile the schema into a model named 'Ticket'.
// Mongoose will create a collection named 'tickets' in MongoDB.
module.exports = mongoose.model('Ticket', ticketSchema);