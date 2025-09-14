const mongoose = require('mongoose');

const MarksSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subject: { type: String, required: true },
  classTestMarks1: { type: Number, min: 0, max: 100 },
  classTestMarks2:{type:Number,min:0, max:100},
  internalMarks:{type:Number,min:0,max:100},
  externalMarks: { type: Number, min: 0, max: 100 },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Marks', MarksSchema);