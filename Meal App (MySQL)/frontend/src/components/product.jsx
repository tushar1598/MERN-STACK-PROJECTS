import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "./productCard";

function Products() {
  let [Items, setItems] = useState([]);
  let [sortOrder, setSortOrder] = useState(""); // Sort order state

  // Sort Items based on selected sort order
  if (sortOrder === "lowToHigh") {
    Items = Items.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "highToLow") {
    Items = Items.sort((a, b) => b.price - a.price);
  }

  // Sort Items based on selected sort order
  if (sortOrder === "nameAsc") {
    Items = Items.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOrder === "nameDesc") {
    Items = Items.sort((a, b) => b.name.localeCompare(a.name));
  }

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get("http://localhost:9000/items/fetch-items");
        setItems(res.data.items);
      } catch (err) {
        console.log(err);
        return;
      }
    };
    fetchItems();
  }, []);

  return (
    <>
      <div id="sort-order">
        <div>
          <h5>Sort by Price</h5>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="">None</option>
            <option value="lowToHigh">Low to High</option>
            <option value="highToLow">High to Low</option>
          </select>
        </div>
        <h3 style={{ textAlign: "center" }}>Latest Products</h3>
        <div>
          <h5>Sort by Name</h5>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="">None</option>
            <option value="nameAsc">Name: A to Z</option>
            <option value="nameDesc">Name: Z to A</option>
          </select>
        </div>
      </div>
      <br />
      <div
        className="card-container"
        style={{ display: "flex", flexWrap: "wrap" }}
      >
        {Items.map((e, i) => (
          <React.Fragment key={i}>
            <Card item={e} index={i} />
          </React.Fragment>
        ))}
      </div>
    </>
  );
}
export default Products;
