import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../contexts/usercontext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Addexpense() {
  const { data } = useContext(UserContext);
  const [premium, setPremium] = useState(false);
  const [expense, setExpense] = useState({
    userId: "",
    amount: "",
    description: "",
    category: "",
  });

  useEffect(() => {
    if (data?._id) {
      setExpense((prev) => ({ ...prev, userId: data._id }));
    }
  }, [data]);

  const SubmitHandler = async (e) => {
    e.preventDefault();
    let res = await axios.post(
      "http://localhost:9000/users/add-expense",
      expense
    );
    if (res.data.expense) {
      toast.success("Expense Added Successfully!!");
      setExpense({
        userId: data._id,
        amount: "",
        description: "",
        category: "",
      });
    }
  };

  const Handler = (e) => {
    const { name, value } = e.target;
    setExpense((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayment = async () => {
    const order = await axios.post("http://localhost:9000/users/create-order", {
      order: "order created successfylly!!",
      userId: data._id,
    });
    const options = {
      key: "rzp_test_38zoBditpk2MI9",
      name: "Expense Tracker",
      order_id: order.data.order_id,
      handler: function (response) {
        toast.success("Payment Succeed!!");
      },
      prefill: {
        contact: order.data.contact,
        name: order.data.name,
        email: order.data.email,
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", function (response) {
      alert("Payment Failed");
      setTimeout(() => {
        window.location.href = "/users/add-expense";
      }, 2000);
    });
    rzp1.open();
  };

  const Token = localStorage.getItem("Expense Tracker Token");
  useEffect(() => {
    const fetchPremium = async () => {
      const res = await axios.get("http://localhost:9000/users/get-order", {
        headers: { Authorization: `Bearer ${Token}` },
      });
      console.log(res.data.order);
    };
    fetchPremium();
  }, []);

  useEffect(() => {
    const fetchPremium = async () => {
      const res = await axios.get("http://localhost:9000/users/premium-user", {
        headers: { Authorization: `Bearer ${Token}` },
      });
      if (res.data.premium === true) {
        setPremium(true);
      }
    };
    fetchPremium();
  }, []);

  return (
    <>
      <div id="expense-tracker-form">
        <form onSubmit={SubmitHandler}>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              value={expense.amount}
              onChange={Handler}
              required
              className="form-control"
              id="exampleInputamount1"
              aria-describedby="amountHelp"
              placeholder="Enter your amount"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Category
            </label>
            <select
              required
              name="category"
              value={expense.category}
              onChange={Handler}
              className="form-select"
              aria-label="Default select example"
            >
              <option>Choose an option.....</option>
              <option value="School">School</option>
              <option value="Picnic">Picnic</option>
              <option value="Food">Food</option>
              <option value="Donation">Donation</option>
              <option value="Market">Market</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={expense.description}
              onChange={Handler}
              required
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Enter description"
            />
          </div>
          <div id="btn">
            <button id="btn1" type="submit" className="btn btn-primary">
              Add Expense
            </button>
            {premium ? (
              <button
                title="You have already Subscribed!!"
                disabled
                type="button"
                onClick={handlePayment}
                id="btn2"
              >
                Buy Premium
              </button>
            ) : (
              <button type="button" onClick={handlePayment} id="btn2">
                Buy Premium
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}

export default Addexpense;
