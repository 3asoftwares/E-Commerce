/**
 * Notification Entity Types
 */

export interface Notification {
  id: string;
  userId: string;
  type: 'order' | 'product' | 'system' | 'promotion';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  link?: string;
  createdAt: Date;
}

export interface NotificationSettings {
  userId: string;
  email: boolean;
  sms: boolean;
  push: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  newsletter: boolean;
}
