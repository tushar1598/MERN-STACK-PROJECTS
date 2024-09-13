const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const verifyToken = require("../config/auth");

router.post("/create-user", userController.Createuser);
router.post("/create-session", userController.Createsession);
router.get("/protected", verifyToken, userController.Protected);
router.post("/reset-password-link", userController.Resetpasswordlink);
router.post("/reset-password", userController.Resetpassword);
router.get("/messages/:id", userController.Messages);
router.post("/create-group", userController.Creategroup);
router.get("/fetch-group", verifyToken, userController.Fetchgroup);
router.get("/fetch-users", userController.Fetchusers);
router.post("/join-group", userController.Joingroup);
router.get("/fetch-members", userController.Fetchmembers);

module.exports = router;
