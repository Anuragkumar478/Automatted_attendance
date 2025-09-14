const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const marksController = require('../controllers/marks');

router.post('/', auth, marksController.addMarks);
router.get('/student/:studentId', auth, marksController.getMarksByStudent);

module.exports = router;