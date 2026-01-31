// Database and Collection names
export const COLLECTIONS = {
  users: 'users',
  categories: 'categories',
  products: 'products',
  coupons: 'coupons',
  orders: 'orders',
  reviews: 'reviews',
  addresses: 'addresses',
  tickets: 'tickets',
};

export const USERNAME = '3asoftwares';
export const PASSWORD = 'Admin123';
export const DATABASE_NAME = 'e-storefront';

// MongoDB Atlas Connection String
export const MONGODB_URL = `mongodb+srv://${USERNAME}:${PASSWORD}@e-storefront.h3uijmk.mongodb.net/${DATABASE_NAME}?appName=e-storefront-app`;
