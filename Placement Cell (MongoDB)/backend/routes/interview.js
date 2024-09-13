const express = require("express");
const router = express.Router();
const interviewController = require("../controller/interviewController");

router.post("/create-company", interviewController.Createcompany);
router.get("/fetch-interviews/:id", interviewController.Fetchinterviews);
router.post("/enroll-student", interviewController.Enrollstudent);

module.exports = router;
