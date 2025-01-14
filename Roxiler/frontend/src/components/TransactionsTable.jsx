import React, { useState, useEffect } from "react";
import axios from "axios";

const TransactionsTable = ({ month }) => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchData = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_API_TRANSACTION, {
        params: {
          month,
          search,
          page,
          perPage: 10,
        },
      });
      setTransactions(response.data.transactions);
      setTotal(response.data.total);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [month, search, page]);

  return (
    <div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search transactions"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Date of Sale</th>
            <th>Sold</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td>{transaction.title}</td>
              <td>{transaction.description}</td>
              <td>{transaction.price}</td>
              <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
              <td>{transaction.sold ? "Yes" : "No"} </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={() =>
            setPage((prev) => (page * 10 < total ? prev + 1 : prev))
          }
          disabled={page * 10 >= total}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionsTable;
