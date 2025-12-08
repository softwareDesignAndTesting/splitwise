const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findDegreeOfConnection } = require('../utils/algo');
const { asyncHandler, AppError } = require('../middleware/errorHandler'); 

// @desc    Register user
// @route   POST /api/users/signup
// @access  Public
const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const userExists = await userRepository.findByEmail(email);
  if (userExists) {
    throw new AppError('User already exists', 400);
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user using repository
  const user = await userRepository.create({
    name,
    email,
    password: hashedPassword
  });

  res.status(201).json({
    userId: user._id,
    message: 'User registered successfully'
  });
});

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists using repository (include password for verification)
  const user = await userRepository.findByEmail(email, true);
  if (!user) {
    throw new AppError('Invalid credentials', 400);
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError('Invalid credentials', 400);
  }

  // Create JWT token
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );

  res.json({
    userId: user._id,
    token
  });
});

// @desc    Get current user
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await userRepository.findById(req.user._id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  res.json(user);
});

// Add to userController.js
const getDegreeOfConnection = asyncHandler(async (req, res) => {
  const { myUserId, targetId } = req.params;
  
  const findDegreeOfConnectionImpl = require('../controllers/userDegree');
  const degree = await findDegreeOfConnectionImpl(myUserId, targetId);
  
  res.json({ degree });
});

// Add to userController.js
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await userRepository.findAll();
  res.json(users);
});

// @desc    Get user info by ID
// @route   GET /api/users/:id
// @access  Public
const getUserById = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const user = await userRepository.findById(userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json(user);
});


module.exports = {
  signup,
  login,
  getMe,
  getAllUsers,
  getDegreeOfConnection,
  getUserById
}; 