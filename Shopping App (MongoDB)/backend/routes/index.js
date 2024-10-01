const express = require("express");
const router = express.Router();

router.use("/users", require("./user"));
router.use("/items", require("./item"));
router.use("/cart", require("./cart"));

module.exports = router;
