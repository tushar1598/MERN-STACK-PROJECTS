const axios = require("axios");
const Transaction = require("../models/transection");
const dotenv = require("dotenv").config();

module.exports.initializeDatabase = async (req, res) => {
  try {
    const response = await axios.get(process.env.roxiler_api);
    const transactions = response.data;

    await Transaction.deleteMany({});

    await Transaction.insertMany(transactions);

    res.status(200).json({ message: "Database initialized successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.listTransactions = async (req, res) => {
  const { search, page = 1, perPage = 10 } = req.query;

  const query = search
    ? {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
          { price: Number(search) },
        ],
      }
    : {};

  try {
    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(Number(perPage));

    const total = await Transaction.countDocuments(query);

    res.status(200).json({ transactions, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.statistics = async (req, res) => {
  const { month } = req.query;

  if (
    !month ||
    isNaN(month) ||
    month.length !== 2 ||
    month < "01" ||
    month > "12"
  ) {
    return res
      .status(400)
      .json({ error: "Invalid or missing month parameter" });
  }

  let year;
  if (month >= "09" && month <= "12") {
    year = 2021;
  } else {
    year = 2022;
  }

  const startDate = new Date(`${year}-${month}-01`);
  const endDate = new Date(startDate);
  endDate.setMonth(startDate.getMonth() + 1);

  try {
    const totalSaleAmount = await Transaction.aggregate([
      {
        $match: {
          dateOfSale: { $gte: startDate, $lt: endDate },
          sold: true,
        },
      },
      {
        $group: { _id: null, total: { $sum: { $toDouble: "$price" } } },
      },
    ]);

    const soldItems = await Transaction.countDocuments({
      dateOfSale: { $gte: startDate, $lt: endDate },
      sold: true,
    });

    const notSoldItems = await Transaction.countDocuments({
      dateOfSale: { $gte: startDate, $lt: endDate },
      sold: false,
    });

    res.status(200).json({
      totalSaleAmount: totalSaleAmount[0]?.total || 0,
      soldItems,
      notSoldItems,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.barChart = async (req, res) => {
  const { month } = req.query;

  let year;
  if (month >= "09" && month <= "12") {
    year = 2021;
  } else {
    year = 2022;
  }

  const startDate = new Date(`${year}-${month}-01`);
  const endDate = new Date(startDate);
  endDate.setMonth(startDate.getMonth() + 1);

  const priceRanges = [
    { range: "0-100", min: 0, max: 100 },
    { range: "101-200", min: 101, max: 200 },
    { range: "201-300", min: 201, max: 300 },
    { range: "301-400", min: 301, max: 400 },
    { range: "401-500", min: 401, max: 500 },
    { range: "501-600", min: 501, max: 600 },
    { range: "601-700", min: 601, max: 700 },
    { range: "701-800", min: 701, max: 800 },
    { range: "801-900", min: 801, max: 900 },
    { range: "901+", min: 901, max: Infinity },
  ];

  try {
    const result = await Promise.all(
      priceRanges.map(async ({ range, min, max }) => {
        const count = await Transaction.aggregate([
          {
            $match: {
              dateOfSale: { $gte: startDate, $lt: endDate },
            },
          },
          {
            $addFields: {
              priceNumber: { $toDouble: "$price" },
            },
          },
          {
            $match: {
              priceNumber: { $gte: min, $lt: max },
            },
          },
          {
            $count: "count",
          },
        ]);

        return {
          range,
          count: count[0]?.count || 0,
        };
      })
    );

    res.status(200).json(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports.pieChart = async (req, res) => {
  let { month } = req.query;

  if (
    !month ||
    isNaN(month) ||
    month.length !== 2 ||
    month < "01" ||
    month > "12"
  ) {
    return res.status(400).json({
      error: "Invalid month value. Please provide a value between 1 and 12.",
    });
  }

  month = parseInt(month, 10);

  try {
    const result = await Transaction.aggregate([
      {
        $addFields: {
          month: { $month: "$dateOfSale" },
        },
      },
      {
        $match: { month },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          category: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
