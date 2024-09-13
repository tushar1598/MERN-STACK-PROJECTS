import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Editexpense() {
  const nevigate = useNavigate();
  const { id } = useParams();
  const [expense, setExpense] = useState({
    amount: "",
    description: "",
    category: "",
  });

  useEffect(() => {
    axios
      .get(`http://localhost:9000/users/get-expense-update/${id}`)
      .then((res) => {
        setExpense(res.data.expense);
      })
      .catch((err) => console.log(err));
  }, []);

  const SubmitHandler = async (e) => {
    e.preventDefault();
    let res = await axios.post(
      "http://localhost:9000/users/update-expense",
      expense,
      {
        withCredentials: true,
      }
    );
    if (res.data.expenseupdated) {
      toast.success("expense updated successfully!!");
      nevigate("/users/profile");
    }
  };

  const Handler = (e) => {
    const { name, value } = e.target;
    setExpense((prev) => ({ ...prev, [name]: value }));
  };

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
              class="form-select"
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
          <button type="submit" className="btn btn-primary">
            Update Expense
          </button>
        </form>
      </div>
    </>
  );
}
export default Editexpense;
