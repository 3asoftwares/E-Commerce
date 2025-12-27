/**
 * User Entity Types
 */

import { UserRole } from '../enums/userRole';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  addresses: Address[];
  preferences: UserPreferences;
  wishlist: string[]; // Product IDs
  orders: string[]; // Order IDs
}

export interface Address {
  id: string;
  userId: string;
  type: 'shipping' | 'billing' | 'both';
  isDefault: boolean;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  landmark?: string;
}

export interface UserPreferences {
  userId: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    orderUpdates: boolean;
    promotions: boolean;
    newsletter: boolean;
  };
  language: string;
  currency: string;
}

export interface Wishlist {
  id: string;
  userId: string;
  productId: string;
  addedAt: Date;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  images?: string[];
  helpful: number;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
