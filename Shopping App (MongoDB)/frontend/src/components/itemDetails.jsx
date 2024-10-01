import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../contexts/usercontext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CartContext from "../contexts/cartcontext";

export function Itemdetails() {
  const { data } = useContext(UserContext);
  const { id } = useParams();
  const { cartItems, updateCart } = useContext(CartContext);
  const [isAddedToCart, setAddedToCart] = useState(false);
  const [Items, setItems] = useState({});
  const [isCartLoading, setCartLoading] = useState(true); // Track cart loading state
  const [isItemLoading, setItemLoading] = useState(true); //

  useEffect(() => {
    const checkCart = async () => {
      try {
        const res = await axios.get(
          `http://localhost:9000/items/check-item-cart?id=${id}&userId=${data._id}`
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
        setItems(res.data.item);
      } catch (error) {
        console.error("Error fetching items:", error);
        toast.error("Something Went Wrong!!");
      } finally {
        setItemLoading(false); // Mark item fetch as complete
      }
    };
    fetchItems();
  }, [id]);

  const AddToCart = async () => {
    const res = await axios.post("http://localhost:9000/items/add-to-cart", {
      Items,
      data,
    });
    if (res.data.data) {
      toast.success("Item Added into the cart");
      setAddedToCart(true);
      // Update the cart count in real-time
      const updatedCart = await axios.get(
        `http://localhost:9000/cart/items/${data._id}`
      );
      updateCart(updatedCart.data.items); // Update CartContext
    }
  };

  const RemoveCart = async () => {
    const res = await axios.delete(
      `http://localhost:9000/items/remove-from-cart?id=${Items._id}&userId=${data._id}`
    );
    if (res.data.removed) {
      toast.success("Item removed from the cart");
      setAddedToCart(false);

      // Update the cart count in real-time
      const updatedCart = await axios.get(
        `http://localhost:9000/cart/items/${data._id}`
      );
      updateCart(updatedCart.data.items); // Update CartContext
    } else {
      toast.error("Something Went Wrong!!");
    }
  };

  const HandlePayment = async () => {
    const order = await axios.post("http://localhost:9000/cart/create-order", {
      userId: data._id,
      Orders: [Items],
      amount: Math.ceil(Items.price),
    });
    const options = {
      key: "rzp_test_oVyGixjX9GOiBm",
      name: "E-Commerce",
      order_id: order.data.order_id,
      handler: function (response) {
        toast.success("Payment Succeed!!");
      },
      prefill: {
        contact: order.data.contact,
        name: order.data.name,
        email: order.data.email,
      },
      theme: {
        color: "#3399cc",
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", function (response) {
      alert("Payment Failed");
      setTimeout(() => {
        window.location.href = "/users/profile";
      }, 2000);
    });
    rzp1.open();
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
        <img src={Items.image} alt="" />
        <div className="item-info">
          <h6>{Items.name}</h6>
          <p>{Items.description}</p>
          <p>Rs. {Items.price}</p>
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
            <button className="buy-now" onClick={HandlePayment}>
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
