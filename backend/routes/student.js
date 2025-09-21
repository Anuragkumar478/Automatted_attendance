const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const studentController = require('../controllers/student');
const {getStudentSummary}=require('../controllers/studentSummary');
const {getStudentsByYearAndDepartment}=require('../controllers/getStudentByYear_and_department')
const multer = require('multer');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + file.originalname)
});
const upload = multer({ storage });

// Routes
router.get('/',auth, studentController.getAllStudents);
router.get('/filter', auth, getStudentsByYearAndDepartment); // ✅ added filter route
router.get('/:id', auth, studentController.getStudentById);
router.put('/:id', auth, studentController.updateStudent);
router.post('/:id/upload', auth, upload.single('profilePic'), studentController.uploadProfilePic);
router.get('/:id/summary', auth, getStudentSummary);

module.exports = router;
