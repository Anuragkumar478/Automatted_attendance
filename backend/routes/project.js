const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const projectController = require('../controllers/projects');

router.post('/', auth, projectController.addProject);
router.put('/:id/evaluate', auth, projectController.evaluateProject);
router.get('/',projectController.getProject);
// ✅ Fetch all projects



module.exports = router;