const mongoose = require('mongoose');

const LabVisitSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  labName: { type: String, required: true },
  date: { type: Date, default: Date.now },
  purpose: { type: String },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true }
});

module.exports = mongoose.model('LabVisit', LabVisitSchema);