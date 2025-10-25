import { body, param } from 'express-validator';

export const createProductValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 2 })
    .withMessage('Product name must be at least 2 characters long'),
  
  body('description')
    .optional()
    .trim(),
  
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),
  
  body('sku')
    .trim()
    .notEmpty()
    .withMessage('SKU is required')
    .isLength({ min: 2 })
    .withMessage('SKU must be at least 2 characters long'),
  
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  
  body('unit')
    .trim()
    .notEmpty()
    .withMessage('Unit is required'),
  
  body('purchasePrice')
    .isFloat({ min: 0 })
    .withMessage('Purchase price must be a non-negative number'),
  
  body('sellingPrice')
    .isFloat({ min: 0 })
    .withMessage('Selling price must be a non-negative number'),
  
  body('supplier')
    .optional()
    .trim(),
  
  body('lowStockThreshold')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Low stock threshold must be a non-negative integer'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
];

export const updateProductValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid product ID'),
  
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Product name cannot be empty')
    .isLength({ min: 2 })
    .withMessage('Product name must be at least 2 characters long'),
  
  body('description')
    .optional()
    .trim(),
  
  body('category')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category cannot be empty'),
  
  body('sku')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('SKU cannot be empty')
    .isLength({ min: 2 })
    .withMessage('SKU must be at least 2 characters long'),
  
  body('quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  
  body('unit')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Unit cannot be empty'),
  
  body('purchasePrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Purchase price must be a non-negative number'),
  
  body('sellingPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Selling price must be a non-negative number'),
  
  body('supplier')
    .optional()
    .trim(),
  
  body('lowStockThreshold')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Low stock threshold must be a non-negative integer'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
];

export const productIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid product ID')
];

export const adjustQuantityValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid product ID'),
  
  body('adjustment')
    .isInt()
    .withMessage('Adjustment must be an integer'),
  
  body('reason')
    .optional()
    .trim()
];





