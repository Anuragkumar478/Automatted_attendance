const mongoose = require('mongoose');

const QRCodeSessionSchema = new mongoose.Schema({
  classId: { type: String, required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  expiryTime: { type: Date, required: true }, // keep Date instead of Number
  createdAt: { type: Date, default: Date.now }
});

// ✅ Correct export
module.exports = mongoose.model("QRCodeSession", QRCodeSessionSchema);
