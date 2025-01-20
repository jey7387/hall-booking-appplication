const pool = require('../db');

// Create a new booking
const createBooking = async (userId, userName, hall, date, slots, purpose) => {
  console.log('Creating Booking:', { userId, userName, hall, date, slots, purpose }); // Debug log
  const bookingDate = date; // Store the date exactly as received (NO conversion)

  console.log('date:',bookingDate )
  const query = `
    INSERT INTO bookings (user_id, user_name, hall, date, slots, purpose)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
  `;
  const values = [userId, userName, hall,  bookingDate, slots, purpose];
  const result = await pool.query(query, values);
  console.log('Database Result:', result.rows[0]); // Debug log
  return result.rows[0];
};

// Get all bookings for a user
// Function to get all bookings
const getAllBookings = async () => {
  const query = 'SELECT * FROM bookings;'; // Get all bookings
  const result = await pool.query(query);
  return result.rows;
};

// Delete a booking (only by the creator)
const deleteBooking = async (bookingId, userId) => {
  const query = 'DELETE FROM bookings WHERE id = $1 AND user_id = $2 RETURNING *;';
  const result = await pool.query(query, [bookingId, userId]);
  return result.rowCount > 0 ? result.rows[0] : null;
};


module.exports = {
  createBooking,
  getAllBookings ,
  deleteBooking,
};
