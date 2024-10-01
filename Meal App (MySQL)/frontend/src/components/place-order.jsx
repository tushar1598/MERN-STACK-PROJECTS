import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../contexts/usercontext";
import CartContext from "../contexts/cartcontext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

function Place_Order() {
  const { id } = useParams();
  const [address, setAddress] = useState({});
  const { data } = useContext(UserContext);
  const { cartItems, updateCart } = useContext(CartContext);
  const [Item, setItems] = useState([]);
  const [isItemLoading, setItemLoading] = useState(true);
  const totalPrice = Math.ceil(
    Item.reduce((total, item) => Number(total) + Number(item.total), 0)
  );

  useEffect(() => {
    const fetchAddress = async () => {
      const res = await axios.get(
        `http://localhost:9000/users/fetch-order-address/${id}`
      );
      setAddress(res.data.address);
    };
    fetchAddress();
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get(
          `http://localhost:9000/cart/cart-items?userId=${data.id}`
        );
        setItems(res.data.cartItems);
      } catch (err) {
        console.log(err);
      } finally {
        setItemLoading(false);
      }
    };
    fetchCart();
  }, [data.id]);

  const Increase = async (index) => {
    const Data = {
      id: Item[index].itemId,
      price: Item[index].price,
      quantity: Item[index].quantity,
    };
    const res = await axios.post(
      `http://localhost:9000/cart/increase-items`,
      Data
    );
    // Update the specific item
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, total: res.data.total, quantity: res.data.quantity }
          : item
      )
    );
  };
  const Decrease = async (index) => {
    const Data = {
      id: Item[index].itemId,
      price: Item[index].price,
      quantity: Item[index].quantity,
    };
    const res = await axios.post(
      `http://localhost:9000/cart/decrease-items`,
      Data
    );
    // Update the specific item
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, total: res.data.total, quantity: res.data.quantity }
          : item
      )
    );
  };

  const RemoveCart = async (i) => {
    const res = await axios.delete(
      `http://localhost:9000/cart/remove-item?itemId=${Item[i].itemId}&userId=${data.id}`
    );
    if (res.data.removed) {
      toast.success("Item removed from the cart");
      // Update `Items` state by removing the item in real-time
      setItems((prevItems) => prevItems.filter((item, index) => index !== i));
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
      userId: data.id,
      Orders: Item,
      amount: totalPrice,
      address: address,
    });
    const options = {
      key: "rzp_test_jNIDVWtV2SMWlJ",
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
      <div
        style={{ margin: "50px auto" }}
        className="d-flex justify-content-center"
      >
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only"></span>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 style={{ textAlign: "center", margin: "40px auto" }}>
        Place Your Order
      </h1>
      {Item.length === 0 ? (
        <div style={{ textAlign: "center" }}>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSK27I-DNNAbfxqwbHQLbmTOB5M57QHiydP2Q&s"
            alt=""
          />
        </div>
      ) : (
        <>
          {Item.map((e, i) => (
            <React.Fragment key={i}>
              <div className="item-details">
                <div className="image-quanity-bar">
                  <img src={e.image} alt="" />
                  <nav aria-label="Page navigation example">
                    <ul className="pagination">
                      <li className="page-item">
                        <button
                          className="page-link"
                          onClick={() => Decrease(i)}
                        >
                          -
                        </button>
                      </li>
                      <li className="page-item">
                        <span className="page-link">{e.quantity}</span>
                      </li>
                      <li className="page-item">
                        <button
                          className="page-link"
                          onClick={() => Increase(i)}
                        >
                          +
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
                <div className="item-info">
                  <Link
                    style={{ textDecoration: "none" }}
                    to={`/items/item-details/${e.itemId}`}
                  >
                    <h6>{e.name}</h6>
                  </Link>
                  <p>
                    <i>{e.description}</i>
                  </p>
                  <p style={{ color: "green", fontWeight: "700" }}>
                    {e.category}
                  </p>
                  <p style={{ fontWeight: "700" }}>
                    Rs. {e.price} × {e.quantity} = {e.total}
                  </p>
                  <div className="buttons">
                    <button
                      className="item-added"
                      onClick={() => RemoveCart(i)}
                    >
                      Remove Item
                    </button>
                  </div>
                </div>
              </div>
              <br />
            </React.Fragment>
          ))}
          <div
            className="address-bar-2"
            style={{ color: "black", textDecoration: "none" }}
            to={`/users/place-order/${address.id}`}
          >
            <div>
              <img
                style={{ width: "50px", height: "50px", marginTop: "15px" }}
                src="https://cdn-icons-png.flaticon.com/128/4821/4821951.png"
                alt=""
              />
              <p style={{ marginTop: "20px" }}>
                {address.street}, {address.city}, {address.state},{" "}
                {address.pincode}
              </p>
              <h5>{address.name}</h5>
              <h6>{address.phone}</h6>
            </div>
          </div>
          <div id="cart-checkout">
            <h4>
              Subtotal ({Item.length} items): <span>Rs. {totalPrice}</span>
            </h4>
            <button onClick={HandlePayment}>Pay Now</button>
          </div>
        </>
      )}
    </>
  );
}

export default Place_Order;
