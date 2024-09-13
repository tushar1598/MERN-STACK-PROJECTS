const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const verifyToken = require("../config/auth");

router.post("/create-user", userController.Createuser);
router.post("/create-session", userController.Createsession);
router.get("/protected", verifyToken, userController.Protected);
router.post("/reset-password-link", userController.Resetpasswordlink);
router.post("/reset-password", userController.Resetpassword);
router.post("/add-expense", userController.Addexpense);
router.get("/get-expenses", verifyToken, userController.Getexpenses);
router.delete("/expense-delete/:id", userController.Expensedelete);
router.get("/get-expense-update/:id", userController.Getexpenseupdate);
router.post("/update-expense", userController.Expenseupdated);
router.post("/create-order", userController.Createorder);
router.get("/get-order", verifyToken, userController.Getorder);
router.get("/premium-user", verifyToken, userController.Premiumuser);

module.exports = router;
