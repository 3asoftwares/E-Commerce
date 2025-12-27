/**
 * Order Routes
 */

import express from 'express';
import { body } from 'express-validator';
import * as orderController from '../controllers/orderController';
import { validate } from '../middleware/validator';

const router = express.Router();

// Validation rules
const orderValidation = [
  body('customerId').notEmpty().withMessage('Customer ID is required'),
  body('customerEmail').isEmail().withMessage('Valid email is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('paymentMethod').notEmpty().withMessage('Payment method is required'),
  body('shippingAddress.street').notEmpty().withMessage('Street address is required'),
  body('shippingAddress.city').notEmpty().withMessage('City is required'),
  body('shippingAddress.state').notEmpty().withMessage('State is required'),
  body('shippingAddress.zip').notEmpty().withMessage('ZIP code is required'),
  body('shippingAddress.country').notEmpty().withMessage('Country is required'),
];

/**
 * @route   GET /api/orders/customer/:customerId
 * @desc    Get orders by customer
 */
router.get('/customer/:customerId', orderController.getOrdersByCustomer);

/**
 * @route   GET /api/orders
 * @desc    Get all orders with pagination
 */
router.get('/', orderController.getAllOrders);

/**
 * @route   GET /api/orders/:id
 * @desc    Get single order
 */
router.get('/:id', orderController.getOrderById);

/**
 * @route   POST /api/orders
 * @desc    Create new order
 */
router.post('/', orderValidation, validate, orderController.createOrder);

/**
 * @route   PATCH /api/orders/:id/status
 * @desc    Update order status
 */
router.patch('/:id/status', orderController.updateOrderStatus);

/**
 * @route   PATCH /api/orders/:id/payment
 * @desc    Update payment status
 */
router.patch('/:id/payment', orderController.updatePaymentStatus);

/**
 * @route   POST /api/orders/:id/cancel
 * @desc    Cancel order
 */
router.post('/:id/cancel', orderController.cancelOrder);

export default router;
