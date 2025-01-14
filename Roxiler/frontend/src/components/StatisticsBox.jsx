import React, { useEffect, useState } from "react";
import axios from "axios";

const StatisticsBox = ({ month }) => {
  const [stats, setStats] = useState({
    totalSaleAmount: 0,
    soldItems: 0,
    notSoldItems: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_API_STATISTICS, {
          params: { month },
        });
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };
    fetchStats();
  }, [month]);

  return (
    <div className="statistics-box">
      <div>Total Sale Amount: ₹{stats.totalSaleAmount}</div>
      <div>Sold Items: {stats.soldItems}</div>
      <div>Not Sold Items: {stats.notSoldItems}</div>
    </div>
  );
};

export default StatisticsBox;
