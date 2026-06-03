import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], // { id, name, price_per_base_unit, base_unit, quantity, seller_id, seller_name }

      addItem: (product, quantity) => {
        const { items } = get();
        const existingItemIndex = items.findIndex((item) => item.id === product.id);

        if (existingItemIndex > -1) {
          // Update quantity if already in cart
          const newItems = [...items];
          newItems[existingItemIndex].quantity += quantity;
          set({ items: newItems });
        } else {
          // Add new item
          set({ items: [...items, { ...product, quantity }] });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.id !== productId) });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) return get().removeItem(productId);
        const { items } = get();
        const newItems = items.map(item => 
          item.id === productId ? { ...item, quantity } : item
        );
        set({ items: newItems });
      },

      clearCart: () => set({ items: [] }),

      getTotalCost: () => {
        return get().items.reduce((total, item) => total + (item.price_per_base_unit * item.quantity), 0);
      }
    }),
    {
      name: 'cart-storage', // unique name for localStorage key
    }
  )
);

export default useCartStore;
