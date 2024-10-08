import { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../contexts/usercontext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SignIn() {
  const { setData } = useContext(UserContext);
  const nevigate = useNavigate();
  const [user, setUser] = useState({ email: "", password: "" });

  const SubmitHandler = async (e) => {
    e.preventDefault();
    let res = await axios.post(
      "http://localhost:5500/users/create-session",
      user
    );
    const response = await axios.get("http://localhost:5500/users/protected", {
      headers: { Authorization: `Bearer ${res.data.Token}` },
    });

    setData(response.data.user);

    if (res.data.user === null) {
      toast.error("user does't exists");
      setUser({ email: "", password: "" });
    } else if (res.data.Password === false) {
      toast.error("Password is invalid");
      setUser({ email: "", password: "" });
    } else {
      toast.success("user logged-in successfully!!");
      localStorage.setItem("Chat App Token", res.data.Token);
      nevigate("/users/profile");
    }
  };

  const Handler = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <>
      <div id="sign-in-form">
        <form onSubmit={SubmitHandler}>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email address
            </label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={Handler}
              required
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Enter your username"
            />
            <div id="emailHelp" className="form-text">
              We'll never share your email with anyone else.
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={Handler}
              required
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Enter password"
            />
          </div>
          <div>
            <Link
              id="forgot-password"
              style={{ textDecoration: "none" }}
              to="/users/reset-password-link"
            >
              Forgot Password
            </Link>
          </div>
          <button type="submit" className="btn btn-primary">
            Sign-in
          </button>
        </form>
      </div>
    </>
  );
}
export default SignIn;
