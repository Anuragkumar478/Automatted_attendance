const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Marks = require('../models/Marks');
const LabVisit = require('../models/LabVisit');
const Project = require('../models/Projects');
const path = require('path');
const fs = require('fs');

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get student by ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select('-password');
    if (!student) return res.status(404).json({ msg: 'Student not found' });
    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update student
exports.updateStudent = async (req, res) => {
  try {
    const { name, email, class: studentClass, department } = req.body;
    let student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ msg: 'Student not found' });

    student.name = name || student.name;
    student.email = email || student.email;
    student.class = studentClass || student.class;
    student.department = department || student.department;
    await student.save();

    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Upload profile picture
exports.uploadProfilePic = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ msg: 'Student not found' });
    if (!req.file) return res.status(400).json({ msg: 'Please upload a file' });

    if (student.profilePic) {
      const oldImagePath = path.join(__dirname, '..', student.profilePic);
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
    }

    student.profilePic = `/uploads/${req.file.filename}`;
    await student.save();
    res.json({ profilePic: student.profilePic });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error'); 
  }
};





