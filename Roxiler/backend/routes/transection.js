const express = require("express");
const router = express.Router();
const transactionController = require("../controller/transactionController");

router.get("/initialize", transactionController.initializeDatabase);
router.get("/transactions", transactionController.listTransactions);
router.get("/statistics", transactionController.statistics);
router.get("/bar-chart", transactionController.barChart);
router.get("/pie-chart", transactionController.pieChart);

module.exports = router;
