// backend/controllers/eventController.js

// This utility wraps our async functions, catching any errors and passing them to our error-handling middleware.
const asyncHandler = require('express-async-handler');

// We need our Event model to interact with the events collection in the database.
const Event = require('../models/eventModel.js');

// --- Placeholder Functions ---

const createEvent = asyncHandler(async (req, res) => {
   console.log('🔍 Incoming event creation request...');
  console.log('🧾 Request body:', req.body);
  console.log('👤 Logged in user:', req.user);
  // 1. Destructure the event data from the request body.
  const { title, description, date, location, image, ticketTypes } = req.body;

  // 2. Perform basic validation to ensure all required fields are present.
  if (!title || !description || !date || !location || !image || !ticketTypes) {
    res.status(400); // Bad Request
    throw new Error('Please include all event fields');
  }

  const event = await Event.create({
    organizer: req.user._id, // The ID of the logged-in organizer
    title,
    description,
    date,
    location,
    image,
    ticketTypes,
  });

  res.status(201).json(event);
});

const getEvents = asyncHandler(async (req, res) => {

  const events = await Event.find({}).sort({ date: 1 });
  // 3. Send the array of events back to the client as a JSON response.
  // A 200 OK status is the standard for a successful GET request.
  res.status(200).json(events);
  // highlight-end
});


const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  // 2. Check if an event was actually found.
  if (event) {
    // If the event exists, send it back with a 200 OK status.
    res.status(200).json(event);
  } else {
    // 3. If event is null (not found), we should set a specific error status.
    // 404 Not Found is the standard code for a missing resource.
    res.status(404);
    // Throw an error to be caught by our error handling middleware.
    throw new Error('Event not found');
  }
});

const getOrganizerEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ organizer: req.user._id });

  // 2. Send the resulting array of events back to the client.
  // If the organizer has not created any events, this will correctly return an empty array [].
  res.status(200).json(events);
  // highlight-end
});

//   // 5. Save the updated event document back to the database.
//   const updatedEvent = await event.save();

//   // 6. Send the updated event back as a response.
//   res.status(200).json(updatedEvent);
//   // highlight-end
// });
// PUT /api/events/:id
const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // ✅ Ensure req.user exists
  // if (!req.user || !req.user._id) {
  //   res.status(401);
  //   throw new Error('User not authenticated');
  // }

  // ✅ Match string values
  if (event.organizer.toString() !== req.user._id.toString()){
    res.status(401);
    throw new Error('Not authorized to update this event');
  }

  const {
    title,
    description,
    date,
    location,
    image,
    ticketTypes
  } = req.body;

  // ✅ Validate ticketTypes if present
  if (!Array.isArray(ticketTypes) || ticketTypes.length === 0) {
    res.status(400);
    throw new Error('ticketTypes must be a non-empty array');
  }

  // ✅ Update only if fields are present
  if (title) event.title = title;
  if (description) event.description = description;
  if (date) event.date = date;
  if (location) event.location = location;
  if (image) event.image = image;
  if (ticketTypes) event.ticketTypes = ticketTypes;

  const updatedEvent = await event.save();
  res.status(200).json(updatedEvent);

  console.log("👉 Authenticated User:", req.user);
console.log("👉 Request Body:", req.body);
console.log("👉 Event Organizer:", event.organizer.toString());
console.log("👉 Request User:", req.user._id.toString());

});



// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Organizer
// @desc    Delete a specific event
// @route   DELETE /api/events/:id
// @access  Private (Organizer only)
const deleteEvent = async (req, res) => {
  try {
    // 1. Fetch the event by ID from the database
    const event = await Event.findById(req.params.id);

    // 2. If the event doesn't exist, return a 404 error
    if (!event) {
      res.status(404);
      throw new Error('Event not found');
    }

    // 3. Check if the current user is the organizer of the event
    if (event.organizer.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized to delete this event');
    }

    // 4. Delete the event from the database
    await event.deleteOne();

    // 5. Return success response
    res.status(200).json({ message: 'Event removed' });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: error.message || 'Server error while deleting event',
    });
  }
};


// We export all the functions so they can be imported and used in our event routes file.
module.exports = {
  createEvent,
  getEvents,
  getEventById,
  getOrganizerEvents,
  updateEvent,
  deleteEvent,
};