import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "./usercontext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { data } = useContext(UserContext);
  const [cartLoading, setCartLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (data?.id) {
          const res = await axios.get(
            `http://localhost:9000/cart/cart-items?userId=${data.id}`
          );
          setCartItems(res.data.cartItems || []); // Set cart items
          setCartLoading(false);
        }
      } catch (err) {
        console.error("Error fetching cart data:", err);
        setCartLoading(false); // Error, but loading complete
      }
    };
    fetchCart();
  }, [data]); // Re-fetch when user changes

  // Function to update cart items
  const updateCart = async (newItems) => {
    setCartItems(newItems);
  };

  return (
    <CartContext.Provider value={{ cartItems, updateCart, cartLoading }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
