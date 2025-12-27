/**
 * Product Controller
 */

import { Request, Response } from 'express';
import Product from '../models/Product';
import { CacheService, CacheKeys, CacheTTL } from '../infrastructure/cache';

/**
 * Get all products with pagination, search, and filters
 * GET /api/products
 */
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const category = req.query.category as string;
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;
    const sortBy = (req.query.sortBy as string) || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;

    // Try to get from cache
    const cacheKey = CacheKeys.products(page, limit);
    const cached = await CacheService.get(cacheKey);
    if (cached && !search && !category && !minPrice && !maxPrice) {
      res.status(200).json({
        success: true,
        data: cached,
        fromCache: true,
      });
      return;
    }

    // Build query
    const query: any = { isActive: true };

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = minPrice;
      if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }

    // Execute query
    const [products, total] = await Promise.all([
      Product.find(query)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ]);

    const result = {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };

    // Cache the result
    if (!search && !category && !minPrice && !maxPrice) {
      await CacheService.set(cacheKey, result, CacheTTL.PRODUCTS);
    }

    res.status(200).json({
      success: true,
      data: result,
      fromCache: false,
    });
  } catch (error: any) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get products',
      error: error.message,
    });
  }
};

/**
 * Get single product by ID
 * GET /api/products/:id
 */
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    // Try to get from cache
    const cacheKey = CacheKeys.product(req.params.id);
    const cached = await CacheService.get(cacheKey);
    if (cached) {
      res.status(200).json({
        success: true,
        data: cached,
        fromCache: true,
      });
      return;
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
      return;
    }

    // Cache the product
    await CacheService.set(cacheKey, product, CacheTTL.PRODUCT_DETAIL);

    res.status(200).json({
      success: true,
      data: product,
      fromCache: false,
    });
  } catch (error: any) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get product',
      error: error.message,
    });
  }
};

/**
 * Create new product
 * POST /api/products
 */
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = new Product(req.body);
    await product.save();

    // Invalidate product list cache
    await CacheService.deletePattern('products:*');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product },
    });
  } catch (error: any) {
    console.error('Create product error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to create product',
      error: error.message,
    });
  }
};

/**
 * Update product
 * PUT /api/products/:id
 */
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
      return;
    }

    // Invalidate cache
    await CacheService.delete(CacheKeys.product(req.params.id));
    await CacheService.deletePattern('products:*');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: { product },
    });
  } catch (error: any) {
    console.error('Update product error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to update product',
      error: error.message,
    });
  }
};

/**
 * Delete product (soft delete)
 * DELETE /api/products/:id
 */
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message,
    });
  }
};

/**
 * Get products by seller
 * GET /api/products/seller/:sellerId
 */
export const getProductsBySeller = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find({
      sellerId: req.params.sellerId,
      isActive: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { products, count: products.length },
    });
  } catch (error: any) {
    console.error('Get seller products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get seller products',
      error: error.message,
    });
  }
};

/**
 * Get product categories
 * GET /api/products/categories
 */
export const getCategories = async (_: Request, res: Response): Promise<void> => {
  try {
    const categories = await Product.distinct('category', { isActive: true });

    res.status(200).json({
      success: true,
      data: { categories },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to get categories',
      error: error.message,
    });
  }
};
