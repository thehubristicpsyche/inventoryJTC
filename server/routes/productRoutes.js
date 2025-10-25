import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  adjustQuantity,
  getProductStats
} from '../controllers/productController.js';
import {
  createProductValidator,
  updateProductValidator,
  productIdValidator,
  adjustQuantityValidator
} from '../validators/productValidator.js';
import { validate } from '../middleware/validator.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All product routes require authentication
router.use(authenticate);

// Product CRUD routes
router.post('/', createProductValidator, validate, createProduct);
router.get('/stats', getProductStats); // Stats endpoint - must come before /:id
router.get('/', getAllProducts);
router.get('/:id', productIdValidator, validate, getProductById);
router.put('/:id', updateProductValidator, validate, updateProduct);
router.delete('/:id', productIdValidator, validate, deleteProduct);

// Special operations
router.patch('/:id/quantity', adjustQuantityValidator, validate, adjustQuantity);

export default router;

