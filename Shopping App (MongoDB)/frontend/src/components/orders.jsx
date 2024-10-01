import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../contexts/usercontext";

function Orders() {
  const { data } = useContext(UserContext);
  const [Orders, setOrders] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `http://localhost:9000/users/orders/?userId=${data._id}`
        );
        if (res.data.orders) {
          setOrders(res.data.orders);
        } else {
          isLoading(false);
        }
      } catch (err) {
        console.log(err);
        isLoading(false);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await axios.get(
        `http://localhost:9000/users/get-orders-action/?userId=${data._id}`
      );
      console.log(res.data);
    };
    fetchOrders();
  }, []);

  return (
    <>
      <h1 style={{ textAlign: "center", margin: "30px" }}>My Orders</h1>

      {Orders.map((e, i) => (
        <React.Fragment key={i}>
          <div className="outer-order">
            <div className="accordion" id="accordionPanelsStayOpenExample">
              <div className="accordion-item">
                <h2 className="accordion-header" id={`heading${e._id}`}>
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse${e._id}`}
                    aria-expanded="false"
                    aria-controls={`collapse${e._id}`}
                  >
                    <span>
                      <b>Order Id:-</b> {e.orderId}
                    </span>
                    <span>
                      <b>Payment Id:-</b> {e.paymentId}
                    </span>
                    {e.status === "SUCCESS" ? (
                      <span>
                        <b>Order Status:-</b>{" "}
                        <strong style={{ color: "green" }}>{e.status}</strong>
                      </span>
                    ) : (
                      <span>
                        <b>Order Status:-</b>{" "}
                        <strong style={{ color: "red" }}>{e.status}</strong>
                      </span>
                    )}
                    <span>
                      <b>Grand Total:- Rs.</b> {e.total}
                    </span>
                  </button>
                </h2>
                <div
                  id={`collapse${e._id}`}
                  className="accordion-collapse collapse"
                >
                  <div className="accordion-body">
                    {e.orders.map((item, j) => (
                      <React.Fragment key={j}>
                        <div className="order-item-details">
                          <img src={item.image} alt="" />
                          <h5>
                            Item {j + 1}: {item.name}
                          </h5>
                          <p>{item.description}</p>
                          <p>Price: {item.price}</p>
                          {e.status === "SUCCESS" ? (
                            <p>
                              <strong>Estimated Delivery:</strong> Order will be
                              delivered within <strong>5-7 days</strong>
                            </p>
                          ) : (
                            <>
                              <p>Order Id:- {e.orderId}</p>
                              <p>Order Status:- {e.status}</p>
                            </>
                          )}
                        </div>
                        <br />
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <br />
        </React.Fragment>
      ))}
    </>
  );
}

export default Orders;
