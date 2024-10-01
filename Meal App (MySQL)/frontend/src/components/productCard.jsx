import React from "react";
import { Link } from "react-router-dom";
export function Card({ item, index }) {
  return (
    <>
      <div className="item-card">
        <img src={item.image} alt="pic" />
        <Link
          style={{ textDecoration: "none" }}
          to={`/items/item-details/${item.id}`}
        >
          <h6 style={{ fontSize: "22px" }}>{item.name}</h6>
        </Link>
        <p>
          <i>{item.description}</i>
        </p>
        <p style={{ color: "green", fontWeight: "700" }}>{item.category}</p>
        <p style={{ fontWeight: "700", fontSize: "15px" }}>Rs. {item.price}</p>
      </div>
    </>
  );
}
