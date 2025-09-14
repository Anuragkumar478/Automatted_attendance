const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  title: { type: String, required: true },
  description: { type: String },
  submissionDate: { type: Date, default: Date.now },
  link: { type: String },
  subject: { type: String, required: true },
  marks: { type: Number, min: 0, max: 100 },
  evaluatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }
});

module.exports = mongoose.model('Project', ProjectSchema);