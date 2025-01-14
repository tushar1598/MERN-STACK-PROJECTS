const express = require("express");
const router = express.Router();

router.use("/", require("./transection"));
router.use("/api", require("./api"));

module.exports = router;
