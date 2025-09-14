const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

// Mark attendance
// Mark attendance (batch)
exports.markAttendance = async (req, res) => {
  try {
    const { records, subject, year, department } = req.body;

    if (!records || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ msg: "No attendance records provided" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let saved = [];
    for (let record of records) {
      const { studentId, status } = record;

      const student = await Student.findById(studentId);
      if (!student) continue; // skip if invalid

      // Prevent duplicate marking
      const existing = await Attendance.findOne({
        student: studentId,
        subject,
        date: { $gte: today },
      });

      if (existing) continue;

      const attendance = new Attendance({
        student: studentId,
        status,
        subject,
        year,
        department,
        markedBy: req.user.id,
      });

      await attendance.save();
      saved.push(attendance);
    }

    res.json({ msg: "Attendance marked", count: saved.length, data: saved });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get attendance by student
exports.getAttendanceByStudent = async (req, res) => {
  try {
    const attendance = await Attendance.find({ student: req.params.studentId })
      .sort({ date: -1 })
      .populate('markedBy', 'name');
    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update attendance
exports.updateAttendance = async (req, res) => {
  try {
    const { status } = req.body;
    let attendance = await Attendance.findById(req.params.id);
    if (!attendance) return res.status(404).json({ msg: 'Attendance not found' });

    attendance.status = status || attendance.status;
    await attendance.save();
    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};