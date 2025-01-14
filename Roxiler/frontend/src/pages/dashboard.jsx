import React, { useState } from "react";
import TransactionsTable from "../components/TransactionsTable";
import StatisticsBox from "../components/StatisticsBox";
import BarChart from "../components/BarChart";
import PieChart from "../components/PieChart";
import CombinedAPI from "../components/CombinedAPI";

const Dashboard = () => {
  const [month, setMonth] = useState("03"); // Default to March
  return (
    <>
      <h1>Transaction Dashboard</h1>
      <div className="month-selector">
        <label>Select Month: </label>
        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          {[
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
            "08",
            "09",
            "10",
            "11",
            "12",
          ].map((m, index) => (
            <option key={m} value={m}>
              {new Date(2022, index).toLocaleString("default", {
                month: "long",
              })}
            </option>
          ))}
        </select>
      </div>

      <StatisticsBox month={month} />
      <TransactionsTable month={month} />
      <BarChart month={month} />
      <PieChart month={month} />
      <CombinedAPI month={month} />
    </>
  );
};

export default Dashboard;
