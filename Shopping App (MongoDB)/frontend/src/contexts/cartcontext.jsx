import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "./usercontext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { data } = useContext(UserContext);
  const [cartLoading, setCartLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (data?._id) {
          const res = await axios.get(
            `http://localhost:9000/cart/items/${data._id}`
          );
          setCartItems(res.data.items || []); // Set cart items
          setCartLoading(false);
        }
      } catch (err) {
        console.error("Error fetching cart data:", error);
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
