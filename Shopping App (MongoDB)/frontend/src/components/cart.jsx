import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/usercontext";
import axios from "axios";
import CartContext from "../contexts/cartcontext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

function Cart() {
  const { data } = useContext(UserContext);
  const { cartItems, updateCart } = useContext(CartContext);
  const [Items, setItem] = useState([]);
  const [isLoading, setLoading] = useState(true);

  let totalPrice = Math.ceil(
    Items.reduce((total, item) => total + item.price, 0)
  );

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get(
          `http://localhost:9000/cart/items/${data._id}`
        );
        if (res.data.items.length) {
          setItem(res.data.items);
        } else {
          setItem([]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setLoading(false);
      }
    };
    fetchCart();
  }, [data._id]);

  const RemoveCart = async (i) => {
    const res = await axios.delete(
      `http://localhost:9000/cart/remove-item?id=${Items[i].itemId}&userId=${data._id}`
    );
    if (res.data.removed) {
      toast.success("Item removed from the cart");
      // Update `Items` state by removing the item in real-time
      setItem((prevItems) => prevItems.filter((item, index) => index !== i));
      // Update CartContext with new data
      updateCart((prevCartItems) =>
        prevCartItems.filter((_, index) => index !== i)
      );
    } else {
      toast.error("Something Went Wrong!!");
    }
  };

  const HandlePayment = async () => {
    const order = await axios.post("http://localhost:9000/cart/create-order", {
      userId: data._id,
      Orders: Items,
      amount: totalPrice,
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

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", margin: "30px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only"></span>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 style={{ textAlign: "center", margin: "30px" }}>Check Your Cart</h1>
      {Items.length === 0 ? (
        <div style={{ textAlign: "center" }}>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSK27I-DNNAbfxqwbHQLbmTOB5M57QHiydP2Q&s"
            alt=""
          />
        </div>
      ) : (
        <>
          {Items.map((e, i) => (
            <React.Fragment key={i}>
              <div id="cart-item" className="item-details">
                <img src={e.image} alt="" />
                <div className="item-info">
                  <Link
                    style={{ textDecoration: "none" }}
                    to={`/items/item-details/${e.itemId}`}
                  >
                    <h6 className="item-cart-hover">{e.name}</h6>
                  </Link>
                  <p>{e.description}</p>
                  <p style={{ fontWeight: "650" }}>Rs. {e.price}</p>
                </div>
                <div className="cart-buttons">
                  <button
                    className="cart-item-added"
                    onClick={() => RemoveCart(i)}
                  >
                    Remove Item
                  </button>
                </div>
              </div>
              <br />
            </React.Fragment>
          ))}

          <div id="cart-checkout">
            <h4>
              Subtotal ({Items.length} items): <span>Rs. {totalPrice}</span>
            </h4>
            <button onClick={HandlePayment}>Proceed to Buy</button>
          </div>
        </>
      )}

      <br />
    </>
  );
}

export default Cart;
