import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../contexts/usercontext";
import { CartContext } from "../contexts/cartcontext";

function Itemdetails() {
  const { data } = useContext(UserContext);
  const { cartItems, updateCart } = useContext(CartContext);
  const { id } = useParams();
  const [isAddedToCart, setAddedToCart] = useState(false);
  const [Item, setItem] = useState({});
  const [isItemLoading, setItemLoading] = useState(true);
  const [isCartLoading, setCartLoading] = useState(true);

  useEffect(() => {
    const checkCart = async () => {
      try {
        const res = await axios.get(
          `http://localhost:9000/items/check-item-cart?itemId=${id}&userId=${data.id}`
        );
        if (res.data.item === "already") {
          setAddedToCart(true);
        }
      } catch (error) {
        console.error("Error checking cart:", error);
      } finally {
        setCartLoading(false); // Mark cart check as complete
      }
    };
    checkCart();
  }, [id]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(
          `http://localhost:9000/items/fetch-items-details/${id}`
        );
        setItem(res.data.item);
      } catch (error) {
        console.error("Error fetching items:", error);
        toast.error("Something Went Wrong!!");
      } finally {
        setItemLoading(false); // Mark item fetch as complete
      }
    };
    fetchItems();
  }, [id]);

  const AddToCart = async (e) => {
    const res = await axios.post("http://localhost:9000/items/add-to-cart", {
      itemId: id,
      userId: data.id,
    });
    if (res.data.cartItem) {
      toast.success("Item Added into the cart");
      setAddedToCart(true);
      // Update the cart count in real-time
      const updatedCart = await axios.get(
        `http://localhost:9000/cart/cart-items?userId=${data.id}`
      );
      updateCart(updatedCart.data.cartItems); // Update CartContext
    }
  };

  const RemoveCart = async (e) => {
    const res = await axios.delete(
      `http://localhost:9000/items/remove-from-cart?itemId=${Item.id}&userId=${data.id}`
    );
    if (res.data.removed) {
      toast.success("Item removed from the cart");
      setAddedToCart(false);
      // Update the cart count in real-time
      const updatedCart = await axios.get(
        `http://localhost:9000/cart/cart-items?userId=${data.id}`
      );
      updateCart(updatedCart.data.cartItems); // Update CartContext
    } else {
      toast.error("Something Went Wrong!!");
    }
  };

  if (isItemLoading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only"></span>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 style={{ textAlign: "center", margin: "50px" }}>Item Details</h1>
      <div className="item-details">
        <img src={Item.image} alt="" />
        <div className="item-info">
          <h6>{Item.name}</h6>
          <p>
            <i>{Item.description}</i>
          </p>
          <p style={{ color: "green", fontWeight: "700" }}>{Item.category}</p>
          <p style={{ fontWeight: "700" }}>Rs. {Item.price}</p>
          <div className="buttons">
            {isAddedToCart ? (
              <button className="item-added" onClick={RemoveCart}>
                Remove Item
              </button>
            ) : (
              <button className="add-to-cart" onClick={AddToCart}>
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export default Itemdetails;
