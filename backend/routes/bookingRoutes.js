const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const { createBooking, getAllBookings, deleteBooking } = require('../models/bookingModel');

const router = express.Router();

// Middleware to authenticate JWT
const authenticateJWT = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  console.log('Authorization Header:', authHeader); // Debug log

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No token provided or invalid format'); // Debug log
    return res.status(403).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1]; // Extract the token
  const JWT_SECRET = process.env.JWT_SECRET;

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Verify token
    console.log('Decoded Token:', decoded); // Debug log

    // Fetch user's actual name from the database
    const userData = await pool.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [decoded.id]
    );

    if (userData.rows.length === 0) {
      console.log('User not found in database'); // Debug log
      return res.status(404).json({ error: "User not found" });
    }console.log('User Data:', userData.rows[0]);
    req.user = userData.rows[0]; // ✅ Now req.user includes name, email, and id
    next();
  } catch (error) {
    console.log('JWT verification failed:', error.message); // Debug log
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

// Create a booking
router.post('/bookings', authenticateJWT, async (req, res) => {
  console.log('Request Body:', req.body); // Debug log
  console.log('Authenticated User:', req.user); // Debug log

  // Extract correct user data
  const userId = req.user?.id;
  const userName = req.user?.name;
  const { hall, date, slots, purpose } = req.body; // ✅ FIX: Extract hall properly

// Check if userId is missing
if (!userId || !userName) {
  return res.status(400).json({ error: 'User authentication failed' });
}
  try {
    const booking = await createBooking(userId, userName, hall, date, slots, purpose);
    console.log('Booking Created:', booking); // Debug log
    res.status(201).json(booking);
  } catch (error) {
    console.error('Error Creating Booking:', error.message); // Debug log
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Get all bookings for the authenticated user
router.get('/all-bookings', authenticateJWT, async (req, res) => {
  try {
    const bookings = await getAllBookings(); // Fetch all bookings
    res.json(bookings);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});


// Delete a booking (only by the creator)
router.delete('/bookings/:id', authenticateJWT, async (req, res) => {
  const userId = req.user?.id;
  const { id } = req.params;
  console.log("Delete Request Received:", { id, userId }); // Debugging
  try {
    const deletedBooking = await deleteBooking(id, userId);
    if (deletedBooking) {
      console.warn(`Unauthorized delete attempt by user ${userId} for booking ${id}`);
      res.status(200).json({ message: "Booking deleted successfully", deletedBooking });
    } else {
      res.status(403).json({ error: 'You cannot delete this booking' });
    }
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

module.exports = router;
