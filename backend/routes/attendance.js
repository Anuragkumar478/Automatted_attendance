const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const attendanceController = require('../controllers/attendance');

router.post('/',auth, attendanceController.markAttendance);
router.get('/student/:studentId', auth, attendanceController.getAttendanceByStudent);
router.put('/:id', auth, attendanceController.updateAttendance);

module.exports = router;