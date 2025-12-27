/**
 * Order Service Entry Point with WebSocket Support
 */

import express, { Application, Request, Response } from 'express';
import { createServer } from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDatabase } from './config/database';
import orderRoutes from './routes/orderRoutes';
import { initializeWebSocket } from './websocket/orderSocket';

dotenv.config({ path: __dirname + '/../.env' });

const app: Application = express();
const PORT = process.env.PORT || 3012;

// Create HTTP server for WebSocket
const httpServer = createServer(app);

// Initialize WebSocket
initializeWebSocket(httpServer);

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Order service is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/orders', orderRoutes);

// 404 handler
app.use((_: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: '',
  });
});

// Error handler
app.use((err: any, _: Request, res: Response, __: any) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start server
const startServer = async () => {
  try {
    await connectDatabase();

    httpServer.listen(PORT, () => {
      console.log(
        `HTTP Port: ${PORT.toString().padEnd(30)}`,
        `Database: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce-orders'}`
      );
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
