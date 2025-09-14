const Marks = require('../models/Marks');
const Student = require('../models/Student');

// Add or update marks
exports.addMarks = async (req, res) => {
  try {
    const { studentId, subject, classTestMarks1,classTestMarks2, internalMarks, externalMarks } = req.body;
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ msg: 'Student not found' });

    let marks = await Marks.findOne({ student: studentId, subject });

    if (marks) {
      
      marks.classTestMarks1 = classTestMarks1 || marks.classTestMarks1;
      marks.classTestMarks2=classTestMarks2||marks.classTestMarks2;
      marks.internalMarks=internalMarks||marks.internalMarks;
      marks.externalMarks = externalMarks || marks.externalMarks;
    } else {
      marks = new Marks({
        student: studentId,
        subject,
        classTestMarks1,
        classTestMarks2,
        internalMarks,
        externalMarks,
        addedBy: req.user.id
      });
    }

    await marks.save();
    res.json(marks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get marks by student
exports.getMarksByStudent = async (req, res) => {
  try {
    const marks = await Marks.find({ student: req.params.studentId })
      .populate('addedBy', 'name');
    res.json(marks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};