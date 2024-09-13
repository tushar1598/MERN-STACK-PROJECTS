const express = require("express");
const router = express.Router();
const studentController = require("../controller/studentController");
const verifyToken = require("../config/auth");

router.post("/create-student", studentController.Createstudent);
router.get("/fetch-students/:id", studentController.Fetchstudents);
router.get("/get-student-update/:id", studentController.Getstudentupdate);
router.post("/update-student", studentController.Updatestudent);
router.delete("/delete-student/:id", studentController.Deletestudent);
router.get("/download-student", verifyToken, studentController.Download);

module.exports = router;
