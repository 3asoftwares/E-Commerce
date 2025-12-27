/**
 * WebSocket Manager for Real-Time Order Updates
 */

import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

let io: SocketIOServer | null = null;

export const initializeWebSocket = (server: HTTPServer): SocketIOServer => {
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`✅ WebSocket client connected: ${socket.id}`);

    // Join room for specific user
    socket.on('join', (userId: string) => {
      socket.join(`user:${userId}`);
      console.log(`👤 User ${userId} joined their room`);
    });

    // Join admin room
    socket.on('joinAdmin', () => {
      socket.join('admin');
      console.log(`👨‍💼 Admin joined admin room`);
    });

    socket.on('disconnect', () => {
      console.log(`❌ WebSocket client disconnected: ${socket.id}`);
    });
  });

  console.log('🔌 WebSocket initialized');
  return io;
};

/**
 * Emit order status update to customer
 */
export const emitOrderUpdate = (customerId: string, order: any) => {
  if (io) {
    io.to(`user:${customerId}`).emit('orderUpdate', {
      orderId: order._id,
      orderNumber: order.orderNumber,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Emit new order alert to admins
 */
export const emitAdminAlert = (order: any) => {
  if (io) {
    io.to('admin').emit('newOrder', {
      orderId: order._id,
      orderNumber: order.orderNumber,
      customerId: order.customerId,
      customerEmail: order.customerEmail,
      total: order.total,
      timestamp: new Date().toISOString(),
    });
    console.log(`🔔 Admin alert sent for order ${order.orderNumber}`);
  }
};

export const getIO = (): SocketIOServer | null => io;
