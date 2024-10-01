const express = require("express");
const router = express.Router();
const cartController = require("../controller/cartController");

router.get("/items/:id", cartController.Items);
router.delete("/remove-item", cartController.RemoveItems);
router.post("/create-order", cartController.CreateOrder);

module.exports = router;
