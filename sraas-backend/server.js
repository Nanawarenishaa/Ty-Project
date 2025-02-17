const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Initialize Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Example hardcoded users (you would use a database in real applications)
const users = [
  {
    username: 'user1',
    password: '$2a$10$A1cDLz9.xQld1wA2nDbIX.qGRj/FleSP/2ndZL6W7Q1r.DuJHeIZO', // Hashed "password123"
  },
];

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if the user exists
  const user = users.find((user) => user.username === username);
  if (!user) {
    return res.status(400).json({ status: 'error', message: 'User not found' });
  }

  // Log user data for debugging
  console.log('User found:', user);

  // Check if the password matches
  bcrypt.compare(password, user.password, (err, isMatch) => {
    if (err) {
      return res.status(500).json({ status: 'error', message: 'Server error' });
    }

    if (!isMatch) {
      return res.status(400).json({ status: 'error', message: 'Invalid password' });
    }

    // Create JWT token
    const token = jwt.sign({ userId: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ status: 'success', token });
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
