const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const qrCtrl = require("../controllers/qrAttendance");

// Teacher
router.post("/generate", auth, qrCtrl.generateQR);

// Student
router.post("/mark", auth, qrCtrl.markAttendanceQR);

module.exports = router;
