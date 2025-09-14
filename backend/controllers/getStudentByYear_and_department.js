const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Marks = require('../models/Marks');
const LabVisit = require('../models/LabVisit');
const Project = require('../models/Projects');
const path = require('path');
const fs = require('fs');

exports.getStudentsByYearAndDepartment = async (req, res) => {
  try {
    const { year, department } = req.query;

    if (!year || !department) {
      return res.status(400).json({ msg: "Year and Department are required" });
    }

    const students = await Student.find({ year, department }).select("-password");

    if (!students.length) {
      return res.status(404).json({ msg: "No students found for this year/department" });
    }

    res.json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};
