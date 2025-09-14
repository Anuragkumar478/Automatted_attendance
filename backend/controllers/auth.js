const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Subjects=require('../models/subjects');




// Register Student
// Register Student
exports.registerStudent = async (req, res) => {
  const { name, rollNumber, email, password, year, department } = req.body;

  try {
    let student = await Student.findOne({ email });
    if (student) return res.status(400).json({ msg: "Student already exists" });

    // ✅ fetch subjects from DB instead of hardcoding
    const subjectDoc = await Subjects.findOne({ department, year });
    const subjects = subjectDoc ? subjectDoc.subjects : [];

     const profilePic = req.file ? `/uploads/${req.file.filename}` : "";

    student = new Student({
      name,
      rollNumber,
      email,
      password,
      year,
      department,
      subjects,
       profilePic,
    });

    const salt = await bcrypt.genSalt(10);
    student.password = await bcrypt.hash(password, salt);
    await student.save();

    const payload = { user: { id: student.id, role: "student" } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token,student });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Register Teacher
exports.registerTeacher = async (req, res) => {
  const { name, email, password, department, subjects } = req.body;
  
  try {
    let teacher = await Teacher.findOne({ email });
    if (teacher) return res.status(400).json({ msg: 'Teacher already exists' });

    teacher = new Teacher({ name, email, password, department, subjects });
    const salt = await bcrypt.genSalt(10);
    teacher.password = await bcrypt.hash(password, salt);
    await teacher.save();

    const payload = { user: { id: teacher.id, role: 'teacher' } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Login (Student or Teacher)
exports.login = async (req, res) => {
  const { email, password, role } = req.body;
  
  try {
    let user;
    if (role === 'student') user = await Student.findOne({ email });
    else if (role === 'teacher') user = await Teacher.findOne({ email });
    else return res.status(400).json({ msg: 'Invalid role' });

    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { user: { id: user.id, role } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user.id, name: user.name, role } });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get Current User
exports.getCurrentUser = async (req, res) => {
  try {
    let user;
    if (req.user.role === 'student') user = await Student.findById(req.user.id).select('-password');
    else if (req.user.role === 'teacher') user = await Teacher.findById(req.user.id).select('-password');
    else return res.status(400).json({ msg: 'Invalid role' });

    res.json({ ...user._doc, role: req.user.role });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};