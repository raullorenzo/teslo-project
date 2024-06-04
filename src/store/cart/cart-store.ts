import { CartProduct } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";


interface State {
  cart: CartProduct[];

  getTotalItems: () => number;

  getSummaryInformation: () => {
    itemsInCart: number;
    subtotal: number;
    tax: number;
    total: number;
  };

  // Add a product to the cart
  addProductToCart: (product: CartProduct) => void;
  // Update the quantity if the product is already in the cart
  updateProductQuantity: (product: CartProduct, quantity: number) => void;
  // Remove the product if the quantity is 0
  removeProduct: (product: CartProduct) => void;

  clearCart: () => void;
}

// zustand store

export const useCartStore = create<State>()(

  persist(
    (set, get) => ({
      cart: [],

      // Get the total number of items in the cart
      getTotalItems: () => {
        const { cart } = get();
        return cart.reduce((acc, item) => acc + item.quantity, 0);
      },

      getSummaryInformation: () => {
        const { cart, getTotalItems } = get();

        const subtotal = cart.reduce(
          (subtotal, item) => item.price * item.quantity + subtotal,
          0
        );
        const tax = subtotal * 0.15;
        const total = subtotal + tax;
        const itemsInCart = cart.reduce(
          (total, item) => total + item.quantity,
          0
        );

        return {
          subtotal,
          tax,
          total,
          itemsInCart,
        };
      },

      // Methods
      addProductToCart: (product: CartProduct) => {
        const { cart } = get();

        // Revisar si el producto ya está en el carrito
        const productInCart = cart.some(
          (item) => item.id === product.id && item.size === product.size
        );

        if (!productInCart) {
          set({ cart: [...cart, product] });
          return;
        }

        // Actualizar la cantidad del producto
        const updatedCartProducts = cart.map((item: any) => {
          if (item.id === product.id && item.size === product.size) {
            return { ...item, quantity: item.quantity + product.quantity };
          }
          return item;
        });

        set({ cart: updatedCartProducts });
      },
      updateProductQuantity: (product: CartProduct, quantity: number) => {
        const { cart } = get();

        // Actualizar la cantidad del producto
        const updatedCartProducts = cart.map((item: any) => {
          if (item.id === product.id && item.size === product.size) {
            return { ...item, quantity };
          }
          return item;
        });

        set({ cart: updatedCartProducts });
      },
      removeProduct: (product: CartProduct) => {
        const { cart } = get();

        // Eliminar el producto del carrito
        const updatedCartProducts = cart.filter(
          (item) => item.id !== product.id || item.size !== product.size
        );

        set({ cart: updatedCartProducts });
      },
      clearCart: () => {
        set({ cart: [] })
      },
    })
    ,
    {
      name: 'shopping-cart'
    }
  )
);
