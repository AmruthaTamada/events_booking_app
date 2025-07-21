// backend/controllers/userController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const generateToken = (id) => {
  
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // The token will be valid for 30 days
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  // 1. Destructure the required fields from the request body
  console.log("📥 Register route hit:", req.body); // ✅ Log input

  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    res.status(400); // 400 Bad Request
    throw new Error('Please provide all required fields');
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User with this email already exists');
  }
  const user = await User.create({
    name,
    email,
    password, // We pass the plain-text password; the model handles hashing
    role, // If no role is provided, it will use the default 'attendee' from the schema
  });

  if (user) {
    
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id), // Generate a JWT for the new user
    });
  } else {
    // If for some reason the user creation fails, send an error.
    res.status(400);
    throw new Error('Invalid user data');
  }
});
const loginUser = asyncHandler(async (req, res) => {
  // 1. Get the email and password from the request body
  const { email, password } = req.body;

  // 2. Find the user in the database by their email
  // We use findOne since email addresses must be unique
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {

    res.status(401);
    throw new Error('Invalid credentials');
  }
});

module.exports = {
  registerUser,
  loginUser, // highlight-line

};