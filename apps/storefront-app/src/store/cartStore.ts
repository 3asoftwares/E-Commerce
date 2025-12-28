import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  productId: string;
  sellerId?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  addresses: Address[];
  defaultAddressId?: string;
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault?: boolean;
}

export interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  image?: string;
  addedAt: number;
}

export interface CartStore {
  items: CartItem[];
  wishlist: WishlistItem[];
  userProfile: UserProfile | null;
  
  // Cart actions
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  
  // Wishlist actions
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  
  // User profile actions
  setUserProfile: (profile: UserProfile) => void;
  addAddress: (address: Address) => void;
  removeAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      wishlist: [],
      userProfile: null,

      // Cart methods
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity > 0
              ? state.items.map((item) => (item.id === id ? { ...item, quantity } : item))
              : state.items.filter((item) => item.id !== id),
        })),

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      // Wishlist methods
      addToWishlist: (item) =>
        set((state) => {
          const exists = state.wishlist.find((w) => w.productId === item.productId);
          if (exists) return state;
          return {
            wishlist: [...state.wishlist, { ...item, addedAt: Date.now() }],
          };
        }),

      removeFromWishlist: (productId) =>
        set((state) => ({
          wishlist: state.wishlist.filter((w) => w.productId !== productId),
        })),

      isInWishlist: (productId) => {
        return get().wishlist.some((w) => w.productId === productId);
      },

      // User profile methods
      setUserProfile: (profile) => set({ userProfile: profile }),

      addAddress: (address) =>
        set((state) => {
          if (!state.userProfile) return state;
          const newAddresses = [...(state.userProfile.addresses || []), address];
          return {
            userProfile: {
              ...state.userProfile,
              addresses: newAddresses,
              defaultAddressId: address.isDefault ? address.id : state.userProfile.defaultAddressId,
            },
          };
        }),

      removeAddress: (addressId) =>
        set((state) => {
          if (!state.userProfile) return state;
          return {
            userProfile: {
              ...state.userProfile,
              addresses: state.userProfile.addresses.filter((a) => a.id !== addressId),
              defaultAddressId:
                state.userProfile.defaultAddressId === addressId
                  ? state.userProfile.addresses[0]?.id
                  : state.userProfile.defaultAddressId,
            },
          };
        }),

      setDefaultAddress: (addressId) =>
        set((state) => {
          if (!state.userProfile) return state;
          return {
            userProfile: {
              ...state.userProfile,
              defaultAddressId: addressId,
            },
          };
        }),
    }),
    {
      name: 'cart-storage',
    }
  )
);
