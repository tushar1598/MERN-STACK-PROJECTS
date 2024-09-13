import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import "jspdf-autotable";

function Profile() {
  const [expense, setExpense] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [premium, setPremium] = useState(false);
  const [premiumLoading, setPremiumLoading] = useState(true); // Loading state for premium check

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Number of items per page

  useEffect(() => {
    const Token = localStorage.getItem("Expense Tracker Token");
    const fetchData = async () => {
      try {
        // Fetch expenses
        const expenseRes = await axios.get(
          "http://localhost:9000/users/get-expenses",
          {
            headers: { Authorization: `Bearer ${Token}` },
          }
        );
        setExpense(expenseRes.data.expenses);

        // Fetch premium status
        const premiumRes = await axios.get(
          "http://localhost:9000/users/premium-user",
          {
            headers: { Authorization: `Bearer ${Token}` },
          }
        );
        if (premiumRes.data.premium === true) {
          setPremium(true);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
        setPremiumLoading(false); // Set premium loading to false after data is fetched
      }
    };
    fetchData();
  }, []);

  const Delete = async (id) => {
    let res = await axios.delete(
      `http://localhost:9000/users/expense-delete/${id}`
    );
    if (res.data.deleted) {
      toast.success("Expense Deleted Successfully!!");
      setExpense(expense.filter((expense) => expense._id !== id));
    }
  };

  const Download = () => {
    const doc = new jsPDF();
    doc.text("Expense Report", 14, 16);
    const tableColumn = ["Amount", "Description", "Category"];
    const tableRows = expense.map((exp) => [
      exp.amount,
      exp.description,
      exp.category,
    ]);
    doc.autoTable(tableColumn, tableRows, { startY: 30 });
    doc.save("expense-report.pdf");
  };

  // Calculate paginated data
  const indexOfLastExpense = currentPage * itemsPerPage;
  const indexOfFirstExpense = indexOfLastExpense - itemsPerPage;
  const currentExpenses = expense.slice(
    indexOfFirstExpense,
    indexOfLastExpense
  );
  const totalPages = Math.ceil(expense.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      {premiumLoading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading premium status...</span>
          </div>
        </div>
      ) : premium ? (
        <h2 style={{ color: "green" }} className="premium">
          ---------------Congratulations....Now You Are a Premium
          User!!---------------
        </h2>
      ) : (
        <h2 style={{ color: "red" }} className="premium">
          You Are Not a Premium User
        </h2>
      )}

      <table id="expense-table">
        <thead>
          <tr>
            <th>Amount</th>
            <th>Description</th>
            <th>Category</th>
            <th>Delete</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {loading
            ? // <div className="d-flex justify-content-center">
              //   <div className="spinner-border" role="status">
              //     <span className="visually-hidden">Loading...</span>
              //   </div>
              // </div>
              null
            : currentExpenses.length > 0
            ? currentExpenses.map((e, i) => (
                <tr key={i}>
                  <td>{e.amount}</td>
                  <td>{e.description}</td>
                  <td>{e.category}</td>
                  <td id="expense-delete">
                    <button onClick={() => Delete(e._id)}>Delete</button>
                  </td>
                  <td id="expense-edit">
                    <Link to={`/users/update-expense/${e._id}`}>
                      <button>Edit</button>
                    </Link>
                  </td>
                </tr>
              ))
            : null}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <h5 style={{ textAlign: "center" }}>
        {premiumLoading ? null : premium ? (
          <button onClick={Download} id="download-report">
            Download Report
          </button>
        ) : null}
      </h5>
    </>
  );
}
export default Profile;
