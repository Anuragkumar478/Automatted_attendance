const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const labController = require('../controllers/lab');

router.post('/', auth, labController.recordLabVisit);
router.get('/student/:studentId', auth, labController.getLabVisitsByStudent);

module.exports = router;