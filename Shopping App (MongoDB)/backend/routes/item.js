const express = require("express");
const router = express.Router();
const itemController = require("../controller/itemController");

router.get("/fetch-items", itemController.fetchItems);
router.get("/fetch-items-details/:id", itemController.fetchItemsDetails);
router.post("/add-to-cart", itemController.AddToCart);
router.delete("/remove-from-cart", itemController.RemoveFromCart);
router.get("/check-item-cart", itemController.CheckItemCart);

module.exports = router;
