import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../contexts/usercontext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

function Address() {
  const { data } = useContext(UserContext);
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    userId: data.id,
  });

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const res = await axios.get(
          `http://localhost:9000/users/fetch-addresses/${data.id}`
        );
        setAddresses(res.data.addresses);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAddress();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress({
      ...address,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:9000/users/add-address",
        address
      );
      setAddress(res.data.address);
      alert("Address Added Successfully");
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
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
      <h3 style={{ textAlign: "center", margin: "10px" }}>
        Choose a delivery address
      </h3>
      <div id="address-parent">
        {addresses.map((e, i) => (
          <Link
            className="address-bar"
            style={{ color: "black", textDecoration: "none" }}
            to={`/users/place-order/${e.id}`}
            key={i}
          >
            <div key={i}>
              <p style={{ marginTop: "30px" }}>
                {e.street}, {e.city}, {e.state}, {e.pincode}
              </p>
              <h5>{e.name}</h5>
              <h6>{e.phone}</h6>
            </div>
          </Link>
        ))}
        <button
          id="add-address"
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/128/4821/4821951.png"
            alt=""
          />
          <span>Add New Address</span>
        </button>
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="address-container">
                  <form className="address-form" onSubmit={handleSubmit}>
                    <h2>New Address</h2>
                    <div className="form-group">
                      <label htmlFor="name">Name:</label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={address.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number:</label>
                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        value={address.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="street">Street Address:</label>
                      <input
                        type="text"
                        name="street"
                        id="street"
                        value={address.street}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="city">City:</label>
                      <input
                        type="text"
                        name="city"
                        id="city"
                        value={address.city}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="state">State:</label>
                      <input
                        type="text"
                        name="state"
                        id="state"
                        value={address.state}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="pincode">Pincode:</label>
                      <input
                        type="text"
                        name="pincode"
                        id="pincode"
                        value={address.pincode}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <button type="submit" className="submit-btn">
                      Save Address
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Address;
