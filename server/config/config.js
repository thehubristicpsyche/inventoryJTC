/**
 * Server Configuration
 * Centralized configuration management
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Validate required environment variables
 * @param {Array<string>} requiredVars - Array of required variable names
 */
export const validateEnvVars = (requiredVars) => {
  const missing = requiredVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    console.error('Error: Missing required environment variables:');
    missing.forEach((varName) => console.error(`  - ${varName}`));
    console.error('\nPlease create a .env file based on .env.example and fill in the required values.');
    process.exit(1);
  }
};

/**
 * Server configuration object
 */
export const config = {
  // Server settings
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  mongodb: {
    uri: process.env.MONGODB_URI,
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE || '7d',
  },

  // CORS
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  },

  // External services
  pythonService: {
    url: process.env.PYTHON_SERVICE_URL || 'http://localhost:5002',
  },

  // API settings
  api: {
    timeout: parseInt(process.env.API_TIMEOUT || '30000', 10),
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10), // 100 requests per window
    },
  },
};

/**
 * Validate required configuration on startup
 */
export const validateConfig = () => {
  const requiredVars = ['MONGODB_URI', 'JWT_SECRET'];
  validateEnvVars(requiredVars);
};

export default config;

