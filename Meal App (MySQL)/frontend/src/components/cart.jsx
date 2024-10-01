import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../contexts/usercontext";
import CartContext from "../contexts/cartcontext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

function Cart() {
  const { data } = useContext(UserContext);
  const { cartItems, updateCart } = useContext(CartContext);
  const [Item, setItems] = useState([]);
  const [isItemLoading, setItemLoading] = useState(true);
  const totalPrice = Math.ceil(
    Item.reduce((total, item) => Number(total) + Number(item.total), 0)
  );

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

  const HandlePayment = () => {};

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
        Checkout Your Cart
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
          <div id="cart-checkout">
            <h4>
              Subtotal ({Item.length} items): <span>Rs. {totalPrice}</span>
            </h4>
            <Link to="/users/address">
              <button>Place Your Order</button>
            </Link>
          </div>
        </>
      )}
    </>
  );
}

export default Cart;
