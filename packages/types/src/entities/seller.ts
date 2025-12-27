/**
 * Seller Entity Types
 *
 * This file defines all seller-related types for the 3A Softwares.
 */

export interface SellerAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface BankAccount {
  accountName: string;
  accountNumber: string;
  bankName: string;
  routingNumber?: string;
  swiftCode?: string;
}

export interface SellerDocument {
  id: string;
  sellerId: string;
  type: 'business_license' | 'tax_certificate' | 'id_proof' | 'other';
  url: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: Date;
  verifiedAt?: Date;
}

export interface SellerPayout {
  id: string;
  sellerId: string;
  amount: number;
  period: {
    start: Date;
    end: Date;
  };
  orders: string[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  transactionId?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface SellerStats {
  sellerId: string;
  period: 'today' | 'week' | 'month' | 'year' | 'all';
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  averageOrderValue: number;
  topProducts: {
    productId: string;
    productName: string;
    sales: number;
    revenue: number;
  }[];
}

export interface Seller {
  id: string;
  userId: string;
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: SellerAddress;
  taxId?: string;
  bankAccount?: BankAccount;
  status: 'pending' | 'approved' | 'suspended' | 'rejected';
  rating: number;
  totalSales: number;
  totalOrders: number;
  commission: number; // Percentage
  documents: SellerDocument[];
  createdAt: Date;
  updatedAt: Date;
  approvedAt?: Date;
  approvedBy?: string;
}
