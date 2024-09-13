import { useEffect, useContext } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/usercontext";

function SignOut() {
  let { setData } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.removeItem("Placement Cell Token");
    setData(null);
    toast.success("user signed-out successfully!!");
    navigate("/users/sign-in");
  });
}
export default SignOut;
