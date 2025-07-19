
import { toast } from 'sonner';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CartItem = {
  id: number;
  title: string;
  price: number;
  quantity: number;
};

type CartState = {
  count: number;
  cart: CartItem[];
  addCart: (item: CartItem) => void;
  removeCart: (id: number) => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      count: 0,
      cart: [],
      addCart: (item) =>
        set((state) => {
          const existingItem = state.cart.find(
            (cartItem) => cartItem.id === item.id
          );
          
          if (existingItem) {
            toast.success('count changed')
            return {
              count: state.count + 1,
              cart: state.cart.map((cartItem) =>
                cartItem.id === item.id
                  ? { ...cartItem, quantity: cartItem.quantity + 1 }
                  : cartItem
              ),
            };
            
          }else{
            toast.success('added to cart');
            return {
            count: state.count + 1,
            cart: [...state.cart, { ...item, quantity: 1 }],
          };
          }
          
        }),
      removeCart: (id) =>
        set((state) => {
          const existingItem = state.cart.find((item) => item.id === id);
          if (existingItem && existingItem.quantity > 1) {
            return {
              count: state.count - 1,
              cart: state.cart.map((cartItem) =>
                cartItem.id === id
                  ? { ...cartItem, quantity: cartItem.quantity - 1 }
                  : cartItem
              ),
            };
          }
          return {
            count: state.count - 1,
            cart: state.cart.filter((item) => item.id !== id),
          };
        }),
    }),
    { name: 'cart-storage' }
  )
);
