import { Request, Response } from 'express';
import Order from '../models/Order';

/**
 * Get all orders with pagination
 * GET /api/orders
 */
export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const customerId = req.query.customerId as string;
    const skip = (page - 1) * limit;

    // Build query filter
    const query: any = {};
    if (customerId) {
      query.customerId = customerId;
    }

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error: any) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get orders',
      error: error.message,
    });
  }
};

/**
 * Get orders by customer ID
 * GET /api/orders/customer/:customerId
 */
export const getOrdersByCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find({ customerId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments({ customerId }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error: any) {
    console.error('Get orders by customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get customer orders',
      error: error.message,
    });
  }
};

/**
 * Get single order by ID
 * GET /api/orders/:id
 */
export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id).lean();

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { order },
    });
  } catch (error: any) {
    console.error('Get order by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get order',
      error: error.message,
    });
  }
};

/**
 * Create new order
 * POST /api/orders
 */
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      customerId,
      customerEmail,
      items,
      subtotal,
      tax,
      shipping,
      total,
      paymentMethod,
      shippingAddress,
      notes,
    } = req.body;

    // Generate order number
    const orderCount = await Order.countDocuments();
    const orderNumber = `ORD-${Date.now()}-${orderCount + 1}`;

    // Create order
    const order = new Order({
      orderNumber,
      customerId,
      customerEmail,
      items,
      subtotal,
      tax: tax || 0,
      shipping: shipping || 0,
      total,
      orderStatus: 'pending',
      paymentStatus: 'pending',
      paymentMethod,
      shippingAddress,
      notes,
    });

    await order.save();

    res.status(201).json({
      success: true,
      data: { order },
      message: 'Order created successfully',
    });
  } catch (error: any) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message,
    });
  }
};

/**
 * Cancel order
 * PUT /api/orders/:id/cancel
 */
export const cancelOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found',
      });
      return;
    }

    if (order.orderStatus === 'cancelled') {
      res.status(400).json({
        success: false,
        message: 'Order is already cancelled',
      });
      return;
    }

    order.orderStatus = 'cancelled' as any;
    order.updatedAt = new Date();
    await order.save();

    res.status(200).json({
      success: true,
      data: { order },
      message: 'Order cancelled successfully',
    });
  } catch (error: any) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message,
    });
  }
};

export const validateCart = (_: Request, res: Response) => {
  res.status(200).json({ message: 'validateCart stub' });
};

export const getSellerOrders = (_: Request, res: Response) => {
  res.status(200).json({ message: 'getSellerOrders stub' });
};

/**
 * Update order status
 * PUT /api/orders/:id/status
 */
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderStatus } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { order },
      message: 'Order status updated successfully',
    });
  } catch (error: any) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message,
    });
  }
};

export const addTracking = (_: Request, res: Response) => {
  res.status(200).json({ message: 'addTracking stub' });
};

export const markAsShipped = (_: Request, res: Response) => {
  res.status(200).json({ message: 'markAsShipped stub' });
};

export const getAdminOrders = (_: Request, res: Response) => {
  res.status(200).json({ message: 'getAdminOrders stub' });
};

export const processRefund = (_: Request, res: Response) => {
  res.status(200).json({ message: 'processRefund stub' });
};

/**
 * Update payment status
 * PUT /api/orders/:id/payment-status
 */
export const updatePaymentStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { paymentStatus } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { order },
      message: 'Payment status updated successfully',
    });
  } catch (error: any) {
    console.error('Update payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update payment status',
      error: error.message,
    });
  }
};
