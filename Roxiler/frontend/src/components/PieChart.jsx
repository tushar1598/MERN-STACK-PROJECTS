import React, { useEffect } from "react";
import axios from "axios";

const PieChart = ({ month }) => {
  useEffect(() => {
    const PieChartHandler = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_API_PIECHART, {
          params: { month },
        });
        console.log("Pie Chart Data::", response.data);
      } catch (err) {
        console.log(err);
        return;
      }
    };
    PieChartHandler();
  }, [month]);
};

export default PieChart;
