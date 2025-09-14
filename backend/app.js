const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const Student = require('./models/Student');
const Attendance = require('./models/Attendance');
const Marks = require('./models/Marks');
const LabVisit = require('./models/LabVisit');
const Project = require('./models/Projects');


// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = require('./config/db');
connectDB();


// Initialize Express
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// File uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, './uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + file.originalname)
  })
});


// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/student'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/marks', require('./routes/marks'));
app.use('/api/labs', require('./routes/lab'));
app.use('/api/projects', require('./routes/project'));
app.use('/api/subjects',require('./routes/subject'));
app.use("/api/qr-attendance", require("./routes/qrAttendance"));


// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server error');

});

// Set up EJS for student summary
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Generate HTML summary
app.get('/api/students/:id/summary/html', async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await Student.findById(studentId).select('-password');
    if (!student) return res.status(404).json({ msg: 'Student not found' });

    const attendance = await Attendance.find({ student: studentId }).sort({ date: -1 });
    const marks = await Marks.find({ student: studentId });
    const labVisits = await LabVisit.find({ student: studentId }).sort({ date: -1 });
    const projects = await Project.find({ student: studentId }).sort({ submissionDate: -1 });

    res.render('summary', { student, attendance, marks, labVisits, projects });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
app.get('/', (req,res)=>{
  res.send('app is running ')
})

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));