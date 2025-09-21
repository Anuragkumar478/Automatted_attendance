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
const cookieParser = require("cookie-parser");

dotenv.config();

// Connect to MongoDB
const connectDB = require('./config/db');
connectDB();

const app = express();

// ----------- CORS Setup -----------
const allowedOrigins = [
  'http://localhost:5173',
  'https://your-frontend-domain.onrender.com',
];
// fghf

app.get('/cors-check', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.send('CORS headers set');
});

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, false); // allow tools like Postman
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(cookieParser());
// Handle preflight requests globally
// app.options("*", cors({
//   origin: function(origin, callback) {
//     if (!origin) return callback(null, false);
//     if (allowedOrigins.includes(origin)) return callback(null, origin);
//     return callback(new Error("Not allowed by CORS"));
//   },
//   credentials: true
// }));

// -----------------------------------

// Body parser
app.use(express.json());

// File uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, './uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + file.originalname)
  })
});

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ---------------- Routes ----------------
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/student'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/marks', require('./routes/marks'));
app.use('/api/labs', require('./routes/lab'));
app.use('/api/projects', require('./routes/project'));
app.use('/api/subjects', require('./routes/subject'));
app.use('/api/qr-attendance', require('./routes/qrAttendance'));

// ---------------- EJS ----------------
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

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

// Health check
app.get('/', (req, res) => res.send('App is running'));

// Error handling (must be last)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server error');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
