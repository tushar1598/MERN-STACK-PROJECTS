import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ month }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchChart = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_API_BARCHART, {
          params: { month },
        });

        const values = response.data.map((range) => range.count);

        setChartData({
          labels: [
            "0-100",
            "101-200",
            "201-300",
            "301-400",
            "401-500",
            "501-600",
            "601-700",
            "701-800",
            "801-900",
            "901+",
          ],
          datasets: [
            {
              label: "Number of Items",
              data: values,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching bar chart data:", error);
      }
    };
    fetchChart();
  }, [month]);

  return (
    <div className="bar-chart">
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: {
              beginAtZero: true,
            },
            y: {
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  );
};

export default BarChart;
