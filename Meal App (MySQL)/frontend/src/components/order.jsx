import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/usercontext";
import jsPDF from "jspdf";
import "jspdf-autotable";

function Order() {
  const { data } = useContext(UserContext);
  const [order, setOrder] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `http://localhost:9000/users/fetch-orders/${data.id}`
        );
        setOrder(res.data.orders);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await axios.get(
        `http://localhost:9000/users/get-orders-action?userId=${data.id}`
      );
      console.log(res.data);
    };
    fetchOrders();
  }, []);

  const Download = (i) => {
    const doc = new jsPDF();
    // Set up the title
    doc.setFontSize(22);
    doc.text("Your Meal Order", 14, 16);
    // Set up the order date
    const createdAt = new Date(order[i].createdAt);
    // Left side: Order Details
    doc.setFontSize(16);
    doc.text("Order Details:", 14, 30);
    doc.setFontSize(12);
    doc.text(`Order ID: ${order[i].orderId}`, 14, 40);
    doc.text(`Payment ID: ${order[i].paymentId}`, 14, 50);
    doc.text(`Date: ${createdAt.toLocaleDateString()}`, 14, 60);
    doc.text(`Order Total: Rs.${order[i].total}`, 14, 70);
    // Add some space
    doc.text(" ", 14, 80);
    // Right side: Billing Address
    const pageWidth = doc.internal.pageSize.width;
    doc.setFontSize(16);
    doc.text(`Billing Address:`, pageWidth - 100, 30);
    doc.setFontSize(12);
    doc.text(`${order[i].address.name}`, pageWidth - 100, 40);
    doc.text(`${order[i].address.street}`, pageWidth - 100, 50);
    doc.text(
      `${order[i].address.city}, ${order[i].address.state}, ${order[i].address.pincode}`,
      pageWidth - 100,
      60
    );
    doc.text(`Phone: ${order[i].address.phone}`, pageWidth - 100, 70);
    // Add some space
    doc.text(" ", 14, 70);
    // Define table columns
    const tableColumn = ["Item Name", "Quantity", "Price"];
    // Add rows from the order data
    const tableRows = order[i].orders.map((item) => [
      item.name,
      item.quantity,
      `Rs.${item.total}`, // Formatting price
    ]);
    // Add total row
    tableRows.push([
      {
        content: "Total",
        colSpan: 2,
        styles: { halign: "right", fontStyle: "bold" },
      },
      `Rs.${order[i].total}`, // Formatting total
    ]);
    // Set table styles
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 90, // Start the table after the address block
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      }, // Header styles
      styles: { halign: "center" }, // Center align table content
      margin: { top: 10 }, // Space above the table
    });
    // Save the PDF with dynamic filename
    doc.save(`meal-order-${order[i].orderId}.pdf`);
  };

  if (isLoading) {
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
      <h1 style={{ textAlign: "center", margin: "30px" }}>My Orders</h1>
      {order.length ? (
        order.map((e, i) => (
          <React.Fragment key={i}>
            <div className="outer-order">
              <div className="accordion" id="accordionPanelsStayOpenExample">
                <div className="accordion-item">
                  <h2 className="accordion-header" id={`heading${e.id}`}>
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapse${e.id}`}
                      aria-expanded="false"
                      aria-controls={`collapse${e.id}`}
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
                    id={`collapse${e.id}`}
                    className="accordion-collapse collapse"
                  >
                    <div className="accordion-body">
                      {e.orders.map((item, j) => (
                        <React.Fragment key={j}>
                          <div className="order-item-details">
                            <img src={item.image} alt="" />
                            <h5 style={{ color: "green" }}>
                              Item {j + 1}: {item.name}
                            </h5>
                            <p style={{ color: "grey" }}>{item.description}</p>
                            <b>
                              <p>Price: {item.price}</p>
                            </b>
                            {e.status === "SUCCESS" ? (
                              <>
                                <b>
                                  <p>Quantity: {item.quantity}</p>
                                </b>
                                <p>
                                  <strong>Estimated Delivery:</strong> Order
                                  will be delivered within{" "}
                                  <strong>5-7 days</strong>
                                </p>
                              </>
                            ) : (
                              <>
                                <b>
                                  <p>Quantity:- {item.quantity}</p>
                                </b>
                                <b>
                                  <p>Total:- {item.total}</p>
                                </b>
                              </>
                            )}
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                    {e.status === "SUCCESS" ? (
                      <React.Fragment>
                        <div id="address-bill">
                          <h4 style={{ marginTop: "20px", color: "green" }}>
                            Order Will be Delivered to this address
                          </h4>

                          <div>
                            <img
                              style={{
                                width: "50px",
                                height: "50px",
                                marginTop: "10px",
                              }}
                              src="https://cdn-icons-png.flaticon.com/128/4821/4821951.png"
                              alt=""
                            />
                            <p style={{ marginTop: "10px" }}>
                              {e.address.street}, {e.address.city},{" "}
                              {e.address.state}, {e.address.pincode}
                            </p>
                            <h5>{e.address.name}</h5>
                            <h6>{e.address.phone}</h6>
                          </div>
                        </div>
                        <br />
                        <div
                          style={{
                            width: "70px",
                            margin: "auto",
                            textAlign: "center",
                            color: "red",
                          }}
                        >
                          <img
                            style={{
                              width: "100%",
                              height: "100%",
                              cursor: "pointer",
                            }}
                            src="https://cdn-icons-png.flaticon.com/128/4725/4725510.png"
                            alt=""
                            onClick={() => Download(i)}
                          />
                          <b>Your Bill</b>
                        </div>
                        <br />
                      </React.Fragment>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            <br />
          </React.Fragment>
        ))
      ) : (
        <div style={{ textAlign: "center" }}>
          <img
            src="https://cdn-icons-png.flaticon.com/128/14005/14005507.png"
            alt=""
          />
        </div>
      )}
    </>
  );
}

export default Order;
