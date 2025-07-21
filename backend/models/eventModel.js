// backend/models/eventModel.js

const mongoose = require('mongoose');

// We are defining a schema for the ticket types that will be embedded within the Event schema.
// This is not a separate model, but a structure for the objects in the ticketTypes array.
const ticketTypeSchema = new mongoose.Schema({
  // The name of the ticket tier, e.g., 'General Admission', 'VIP'.
  name: {
    type: String,
    required: [true, 'Ticket type must have a name'],
  },
  // The price of this ticket type.
  price: {
    type: Number,
    required: [true, 'Ticket type must have a price'],
    min: [0, 'Price cannot be negative'], // A validator to ensure the price is not negative.
  },
  // The total number of tickets available for this tier.
  quantity: {
    type: Number,
    required: [true, 'Ticket type must have a quantity'],
    min: [0, 'Quantity cannot be negative'],
  },
});

const eventSchema = new mongoose.Schema(
  {
    // This establishes the relationship between an Event and its User (Organizer).
    organizer: {
      // The type is ObjectId, which is MongoDB's standard for unique IDs.
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      // 'ref' is the key. It tells Mongoose that the ObjectId stored here
      // refers to a document in the 'User' collection. This is essential for population.
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Please provide an event title'],
      trim: true, // Removes whitespace from both ends of a string.
    },
    description: {
      type: String,
      required: [true, 'Please provide an event description'],
    },
    // The 'Date' type is ideal for storing date and time information.
    date: {
      type: Date,
      required: [true, 'Please provide the event date'],
    },
    location: {
      type: String,
      required: [true, 'Please provide the event location'],
    },
    // This will store the URL of the event's banner image.
    // In a later step, we'll implement image uploads (e.g., to a service like Cloudinary)
    // and store the resulting URL here.
    image: {
      type: String,
      required: [true, 'Please provide an event image URL'],
    },
    // This is an array of sub-documents. Each document in the array
    // must conform to the structure defined in ticketTypeSchema.
    // This allows us to have multiple ticket tiers (e.g., VIP, Regular) for a single event.
    ticketTypes: [ticketTypeSchema],
  },
  {
    // As with the User model, timestamps add `createdAt` and `updatedAt` fields,
    // which are extremely useful for sorting and tracking events.
    timestamps: true,
  }
);

// We now compile our eventSchema into a Model. The model is named 'Event',
// and Mongoose will create a collection named 'events' in the MongoDB database.
module.exports = mongoose.model('Event', eventSchema);