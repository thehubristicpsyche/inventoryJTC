import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const register = async (req, res, next) => {
  try {
    const { email, password, fullName, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 409, 'Email already registered');
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      fullName,
      role: role || 'user'
    });

    // Generate token
    const token = generateToken(user._id, user.role);

    // Return user without password
    const userData = user.toJSON();

    return successResponse(res, 201, 'User registered successfully', {
      user: userData,
      token
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    // Return user without password
    const userData = user.toJSON();

    return successResponse(res, 200, 'Login successful', {
      user: userData,
      token
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    // User is already attached by auth middleware
    return successResponse(res, 200, 'User retrieved successfully', {
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};





