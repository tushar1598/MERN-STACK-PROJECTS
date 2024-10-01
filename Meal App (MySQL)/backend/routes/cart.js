const express = require("express");
const router = express.Router();
const cartController = require("../controller/cartController");

router.get("/cart-items", cartController.Cart);
router.post("/increase-items", cartController.Increase);
router.post("/decrease-items", cartController.Decrease);
router.delete("/remove-item", cartController.Delete);
router.post("/create-order", cartController.CreateOrder);

module.exports = router;
