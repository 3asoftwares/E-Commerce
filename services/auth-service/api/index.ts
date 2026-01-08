import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDatabase } from '../src/config/database';
import app from '../src/index';

// Connect to database once (reused across invocations)
let isConnected = false;

const handler = async (req: VercelRequest, res: VercelResponse) => {
  // Ensure database connection
  if (!isConnected) {
    try {
      await connectDatabase();
      isConnected = true;
    } catch (error) {
      console.error('Database connection failed:', error);
      return res.status(500).json({
        success: false,
        message: 'Database connection failed',
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      });
    }
  }

  return app(req, res);
};

export default handler;
