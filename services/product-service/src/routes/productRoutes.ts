/**
 * Product Routes
 */

import express from 'express';
import { body } from 'express-validator';
import * as productController from '../controllers/ProductController';
import { validate } from '../middleware/validator';

const router = express.Router();

// Validation rules
const productValidation = [
  body('name').trim().isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').notEmpty().withMessage('Category is required'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('sellerId').notEmpty().withMessage('Seller ID is required'),
];

/**
 * @route   GET /api/products/categories
 * @desc    Get all product categories
 * @access  Public
 */
router.get('/categories', productController.getCategories);

/**
 * @route   GET /api/products/seller/:sellerId
 * @desc    Get products by seller
 * @access  Public
 */
router.get('/seller/:sellerId', productController.getProductsBySeller);

/**
 * @route   GET /api/products
 * @desc    Get all products with pagination and filters
 * @access  Public
 */
router.get('/', productController.getAllProducts);

/**
 * @route   GET /api/products/:id
 * @desc    Get single product by ID
 * @access  Public
 */
router.get('/:id', productController.getProductById);

/**
 * @route   POST /api/products
 * @desc    Create new product
 * @access  Public (should be protected with auth middleware)
 */
router.post('/', productValidation, validate, productController.createProduct);

/**
 * @route   PUT /api/products/:id
 * @desc    Update product
 * @access  Public (should be protected with auth middleware)
 */
router.put('/:id', productController.updateProduct);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product (soft delete)
 * @access  Public (should be protected with auth middleware)
 */
router.delete('/:id', productController.deleteProduct);

export default router;
