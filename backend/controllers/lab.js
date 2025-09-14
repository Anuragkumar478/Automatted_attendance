const LabVisit = require('../models/LabVisit');
const Student = require('../models/Student');

// Record lab visit
exports.recordLabVisit = async (req, res) => {
  try {
    const { studentId, labName, purpose } = req.body;
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ msg: 'Student not found' });

    const labVisit = new LabVisit({
      student: studentId,
      labName,
      purpose,
      recordedBy: req.user.id
    });

    await labVisit.save();
    res.json(labVisit);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get lab visits by student
exports.getLabVisitsByStudent = async (req, res) => {
  try {
    const labVisits = await LabVisit.find({ student: req.params.studentId })
      .sort({ date: -1 })
      .populate('recordedBy', 'name');
    res.json(labVisits);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};