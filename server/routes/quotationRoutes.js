import express from 'express';
import {
  createQuotation,
  getAllQuotations,
  getQuotationStats,
  getQuotationById,
  updateQuotation,
  updateQuotationStatus,
  deleteQuotation,
  duplicateQuotation,
  addLineItem,
  updateLineItem,
  deleteLineItem
} from '../controllers/quotationController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All quotation routes require authentication
router.use(authenticate);

// Quotation CRUD routes
router.post('/', createQuotation);
router.get('/stats', getQuotationStats);
router.get('/', getAllQuotations);
router.get('/:id', getQuotationById);
router.put('/:id', updateQuotation);
router.delete('/:id', deleteQuotation);

// Special operations
router.patch('/:id/status', updateQuotationStatus);
router.post('/:id/duplicate', duplicateQuotation);

// Line item operations
router.post('/:id/line-items', addLineItem);
router.put('/:id/line-items/:lineItemId', updateLineItem);
router.delete('/:id/line-items/:lineItemId', deleteLineItem);

export default router;






