const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const auth = require('../middleware/auth');
const multer = require('multer');

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// ✅ Student register route (with photo upload)
router.post('/register/student', upload.single('profilePic'), authController.registerStudent);

router.post('/register/teacher', authController.registerTeacher);
router.post('/login', authController.login);
router.get('/', auth, authController.getCurrentUser);

module.exports = router;
