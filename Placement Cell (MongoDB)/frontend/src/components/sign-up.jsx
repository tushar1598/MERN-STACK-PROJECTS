import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SignUp() {
  const nevigate = useNavigate();
  let data = {
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  };
  const [user, setUser] = useState(data);

  const SubmitHandler = async (e) => {
    e.preventDefault();
    if (user.password !== user.confirm_password) {
      toast.error("password does't match");
      setUser(data);
    } else {
      let res = await axios.post(
        "http://localhost:9000/users/create-user",
        user
      );
      if (res.data.user) {
        toast.success("user created successfully");
        // setUser(data);
        nevigate("/users/sign-in");
      } else {
        toast.error("user already founded!!");
        setUser(data);
      }
    }
  };

  const ChangeHandler = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div id="sign-up-form">
        <form onSubmit={SubmitHandler}>
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
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={user.password}
              id="exampleInputPassword4"
              onChange={ChangeHandler}
              required
              placeholder="Enter password"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              className="form-control"
              name="confirm_password"
              value={user.confirm_password}
              id="exampleInputPassword5"
              onChange={ChangeHandler}
              required
              placeholder="Enter confirm password"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Sign-up
          </button>
        </form>
      </div>
    </>
  );
}

export default SignUp;
