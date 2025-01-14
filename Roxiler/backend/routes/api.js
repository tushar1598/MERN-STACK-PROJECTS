const express = require("express");
const router = express.Router();
const apiController = require("../controller/apiController");

router.get("/combined", apiController.combinedAPI);

module.exports = router;
