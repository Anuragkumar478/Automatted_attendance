const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Marks = require('../models/Marks');
const LabVisit = require('../models/LabVisit');
const Project = require('../models/Projects');
const path = require('path');
const fs = require('fs');




exports.getStudentSummary = async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await Student.findById(studentId).select('-password');
    if (!student) return res.status(404).json({ msg: 'Student not found' });

    const attendance = await Attendance.find({ student: studentId }).sort({ date: -1 });
    const marks = await Marks.find({ student: studentId });
    const labVisits = await LabVisit.find({ student: studentId }).sort({ date: -1 });
    const projects = await Project.find({ student: studentId }).sort({ submissionDate: -1 });

    res.json({ student, attendance, marks, labVisits, projects });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};