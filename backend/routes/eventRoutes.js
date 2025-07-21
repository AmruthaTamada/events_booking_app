const express = require('express');
const router = express.Router();

const {
  createEvent,
  getEvents,
  getEventById,
  getOrganizerEvents,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');

const { protect, organizer } = require('../middleware/authMiddleware');

// Public Routes
router.get('/', getEvents);
router.get('/myevents', protect, getOrganizerEvents);
router.get('/:id', getEventById);

// Private (Organizer-only) Routes
router.post('/', [protect, organizer], createEvent);

router
  .route('/:id')
  .put([protect, organizer], updateEvent)
  .delete([protect, organizer], deleteEvent); // ✅ PROTECTED properly

module.exports = router;
