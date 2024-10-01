import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../contexts/usercontext";

function Update() {
  const { data, setData } = useContext(UserContext);
  const nevigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const [user, setUser] = useState({
    id: userId,
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await axios.get(
        `http://localhost:9000/users/get-profile?userId=${userId}`
      );
      setUser(res.data.data);
    };
    fetchProfile();
  }, []);

  const SubmitHandler = async (e) => {
    e.preventDefault();
    const res = await axios.post(
      "http://localhost:9000/users/update-profile",
      user
    );
    if (res.data.updated) {
      setData(user);
      toast.success("user updated successfully");
      nevigate("/users/profile");
    }
  };

  const ChangeHandler = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div id="sign-up-update-form">
        <div style={{ margin: "60px" }}></div>
        <form onSubmit={SubmitHandler} encType="multipart/form-data">
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={user.name}
              id="exampleInputPassword1"
              onChange={ChangeHandler}
              required
              placeholder="Enter name"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail2"
              name="email"
              value={user.email}
              aria-describedby="emailHelp"
              onChange={ChangeHandler}
              required
              placeholder="Enter email"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Phone
            </label>
            <input
              type="number"
              className="form-control"
              name="phone"
              value={user.phone}
              id="exampleInputPassword3"
              onChange={ChangeHandler}
              required
              placeholder="Enter phone"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Edit Profile
          </button>
        </form>
      </div>
    </>
  );
}

export default Update;
