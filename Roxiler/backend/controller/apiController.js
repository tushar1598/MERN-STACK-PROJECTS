const axios = require("axios");
const dotenv = require("dotenv").config();

module.exports.combinedAPI = async (req, res) => {
  let { month } = req.query;
  try {
    const pieChartAPI = `${process.env.pieChart}${month}`;
    const barChartAPI = `${process.env.barChart}${month}`;
    const statisticsAPI = `${process.env.statistics}${month}`;

    const [pieChartResponse, barChartResponse, statisticsResponse] =
      await Promise.all([
        axios.get(pieChartAPI),
        axios.get(barChartAPI),
        axios.get(statisticsAPI),
      ]);

    const combinedData = {
      pieChart: pieChartResponse.data,
      barChart: barChartResponse.data,
      statistics: statisticsResponse.data,
    };
    res.status(200).json(combinedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
