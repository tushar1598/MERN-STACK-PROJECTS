const express = require("express");
const upload = require("../config/multer");
const router = express.Router();
const userController = require("../controller/userController");
const verifyToken = require("../config/auth");

router.post("/create-user", upload, userController.Createuser);
router.post("/create-session", userController.Createsession);
router.get("/protected", verifyToken, userController.Protected);
router.post("/reset-password-link", userController.Resetpasswordlink);
router.post("/reset-password", userController.Resetpassword);
router.get("/orders", userController.fetchOrders);
router.get("/get-profile", userController.Getprofile);
router.get("/search", userController.Search);
router.post("/update-profile", userController.Editprofile);
router.put("/update-profile-photo/:id", upload, userController.Profilephoto);
router.get("/get-orders-action", userController.Getordersactions);

module.exports = router;
