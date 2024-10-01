const express = require("express");
const router = express.Router();
const itemController = require("../controller/itemController");

router.get("/fetch-items", itemController.FetchItems);
router.get("/fetch-items-details/:id", itemController.FetchItemDetails);
router.post("/add-to-cart", itemController.AddToCart);
router.delete("/remove-from-cart", itemController.RemoveToCart);
router.get("/check-item-cart", itemController.CheckToCart);

module.exports = router;
