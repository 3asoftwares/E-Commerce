import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

export const redisClient = new Redis(REDIS_URL, {
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
});

redisClient.on('connect', () => {
  console.log('✅ Redis connected');
});

redisClient.on('error', () => {
  // console.error('❌ Redis error:', err);
});

export class CacheService {
  static async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redisClient.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  static async set(key: string, value: any, ttl: number = 3600): Promise<boolean> {
    try {
      await redisClient.setex(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  // Delete cached data
  static async delete(key: string): Promise<boolean> {
    try {
      await redisClient.del(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  // Delete multiple keys by pattern
  static async deletePattern(pattern: string): Promise<number> {
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length === 0) return 0;
      return await redisClient.del(...keys);
    } catch (error) {
      console.error('Cache delete pattern error:', error);
      return 0;
    }
  }

  // Check if key exists
  static async exists(key: string): Promise<boolean> {
    try {
      const result = await redisClient.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  // Get TTL of a key
  static async ttl(key: string): Promise<number> {
    try {
      return await redisClient.ttl(key);
    } catch (error) {
      console.error('Cache TTL error:', error);
      return -1;
    }
  }

  // Increment a value
  static async increment(key: string, amount: number = 1): Promise<number> {
    try {
      return await redisClient.incrby(key, amount);
    } catch (error) {
      console.error('Cache increment error:', error);
      return 0;
    }
  }
}

// Cache key builders
export const CacheKeys = {
  product: (id: string) => `product:${id}`,
  products: (page: number, limit: number) => `products:${page}:${limit}`,
  productsByCategory: (category: string) => `products:category:${category}`,
  order: (id: string) => `order:${id}`,
  orders: (page: number, limit: number) => `orders:${page}:${limit}`,
  user: (id: string) => `user:${id}`,
  users: (page: number, limit: number) => `users:${page}:${limit}`,
  session: (userId: string) => `session:${userId}`,
  cart: (userId: string) => `cart:${userId}`,
  dashboardStats: () => 'dashboard:stats',
  sellerStats: (sellerId: string) => `seller:${sellerId}:stats`,
};

// TTL constants (in seconds)
export const CacheTTL = {
  PRODUCTS: 3600, // 1 hour
  PRODUCT_DETAIL: 1800, // 30 minutes
  ORDERS: 300, // 5 minutes
  USERS: 1800, // 30 minutes
  SESSION: 86400, // 24 hours
  CART: 604800, // 7 days
  STATS: 300, // 5 minutes
};
