const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

app.use(cors({
  origin: 'http://localhost:3000', // Allow requests only from frontend
  credentials: true // Allow cookies and authentication headers
}));

require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test database connection
pool.connect()
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err.message);
  });

const JWT_SECRET = process.env.JWT_SECRET;

const findNextId = async () => {
  const result = await pool.query(`
    SELECT MIN(t1.id + 1) AS next_id
    FROM users t1
    LEFT JOIN users t2 ON t1.id + 1 = t2.id
    WHERE t2.id IS NULL;
  `);

  return result.rows[0].next_id || 1; // Default to 1 if no rows exist
};


app.get("/api/hall-availability", async (req, res) => {
  const { hall, date } = req.query;
  console.log(req.query);

  try {
    // Fetch booked slots from the database
    const result = await pool.query(
      
      "SELECT slots FROM bookings WHERE hall = $1 AND date = $2",
      [hall, date]
    
    );
    console.log("Raw Query Result:", result.rows);

    let bookedSlots = [];
    if (result.rows.length > 0) {
      // PostgreSQL stores slots as an array, extract them properly
      bookedSlots = result.rows.flatMap(row => row.slots);
    }
    console.log("Extracted Booked Slots:", bookedSlots);
    // Define all available time slots
    const allSlots = [
      "8:30 - 9:00", "9:00 - 9:30", "9:30 - 10:00", "10:00 - 10:30",
      "10:30 - 11:00", "11:00 - 11:30", "11:30 - 12:00", "12:00 - 12:30",
      "1:00 - 1:30", "1:30 - 2:00", "2:00 - 2:30", "2:30 - 3:00",
      "3:00 - 3:30", "3:30 - 4:00", "4:00 - 4:30", "After 4:30"
    ];

    // Ensure bookedSlots is an array of strings
    bookedSlots = bookedSlots.map(slot => slot.trim());
    console.log("Cleaned Booked Slots:", bookedSlots);
    // Filter out booked slots
    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));
   // console.log("Final Available Slots:", availableSlots);
    res.json({ bookedSlots, availableSlots });
  } catch (error) {
    console.error("Error fetching availability:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// Signup endpoint
app.post('/signup', async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;
  console.log('Received request:', req.body);


  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (name, email, password, phone_number) VALUES ($1, $2, $3, $4)',
      [name, email, hashedPassword, phoneNumber]
    );
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error registering user' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({
      token,
      userId: user.id, // Extracted user ID
      userName: user.name, // Extracted user name
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error logging in user' });
  }
});


// Get all registered users
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email FROM users');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching users' });
  }
});





// DELETE route to delete a user by ID
app.delete('/users/:id', async (req, res) => {
  const userId = req.params.id; // Get the user ID from the request parameters

  try {
    // Query to delete the user
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);

    if (result.rowCount === 0) {
      // If no rows were deleted, send a 404 response
      return res.status(404).send('User not found.');
    }

    // Success response
    res.status(200).send('User deleted successfully.');
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).send('Error deleting user.');
  }
});

// Backend example (Node.js/Express)
app.post('/feedback', async (req, res) => {
  const { userId, name, message } = req.body;
  if (!userId || !name || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Save feedback to the database (e.g., in a 'feedback' table)
    await pool.query('INSERT INTO feedback (user_id, name, message) VALUES ($1, $2, $3)', [userId, name, message]);
    res.status(200).json({ message: 'Feedback saved successfully' });
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ error: 'Failed to save feedback' });
  }
});


app.get('/feedback', async (req, res) => { 
  console.log('Request received at /feedback'); // Log to confirm the route is being hit
  try {
    const result = await pool.query('SELECT * FROM feedback ORDER BY id DESC');
    console.log('Query result:', result.rows); // Log the result of the query
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching feedback from database:', error);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});






// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(express.json()); 

// Booking Routes
const bookingRoutes = require('./routes/bookingRoutes');
app.use('/api', bookingRoutes);

const listRoutes = require('express-list-routes');
//console.log(listRoutes(app)); // Will print all registered routes





// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
