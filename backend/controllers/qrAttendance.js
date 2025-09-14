// controllers/qrAttendance.js
const QRCode = require("qrcode");
const QRCodeSession = require("../models/QRCodeSession");
const Attendance = require("../models/Attendance");

// Haversine formula
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = x => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Teacher generates QR
exports.generateQR = async (req, res) => {
  try {
    const { classId, lat, lon, duration } = req.body;
    const expiryTime = new Date(Date.now() + duration * 60 * 1000);

    const session = new QRCodeSession({
      classId,
      teacher: req.user.id,
      lat,
      lon,
      expiryTime
    });

    await session.save();

    const qrPayload = { sessionId: session._id, classId, expiryTime };
    const qrCode = await QRCode.toDataURL(JSON.stringify(qrPayload));

    res.json({ qrCode, sessionId: session._id, expiryTime });
  } catch (err) {
    console.error(err);
    res.status(500).send("QR generation failed");
  }
};

// Student marks attendance
exports.markAttendanceQR = async (req, res) => {
  try {
    const { studentId, sessionId, lat, lon } = req.body;

    const session = await QRCodeSession.findById(sessionId);
    if (!session) return res.status(404).json({ msg: "Invalid QR" });

    if (Date.now() > session.expiryTime.getTime()) {
      return res.status(400).json({ msg: "QR expired" });
    }

    const distance = getDistance(lat, lon, session.lat, session.lon);
    if (distance > 30) {
      return res.status(400).json({ msg: "Not within 30m radius" });
    }

    // Prevent duplicate
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const existing = await Attendance.findOne({
      student: studentId,
      subject: session.classId,
      date: { $gte: today }
    });
    if (existing) return res.status(400).json({ msg: "Already marked" });

    const attendance = new Attendance({
      student: studentId,
      subject: session.classId, // or subject mapping
      status: "Present",
      markedBy: session.teacher
    });

    await attendance.save();
    res.json({ msg: "Attendance marked", data: attendance });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error marking attendance");
  }
};
