import { verifyToken } from '../utils/jwt.js';
import { errorResponse } from '../utils/response.js';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 401, 'Access denied. No token provided.');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return errorResponse(res, 401, 'Invalid or expired token.');
    }

    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return errorResponse(res, 401, 'User not found.');
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return errorResponse(res, 401, 'Authentication failed.');
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 401, 'User not authenticated.');
    }

    if (!roles.includes(req.user.role)) {
      return errorResponse(res, 403, 'Access denied. Insufficient permissions.');
    }

    next();
  };
};






