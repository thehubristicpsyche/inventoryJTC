import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/database.js';
import { config, validateConfig } from './config/config.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import quotationRoutes from './routes/quotationRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

/**
 * Server Entry Point
 * Initializes Express application with middleware and routes
 */

// Validate configuration on startup
validateConfig();

// Initialize Express app
const app = express();

// Connect to database
connectDB();

// Middleware stack
// 1. CORS configuration
app.use(cors(config.cors));

// 2. Disable caching for API responses
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// 3. Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. Request logging (only in development)
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/quotations', quotationRoutes);

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// Start server
const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server gracefully
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM (graceful shutdown)
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

export default app;

