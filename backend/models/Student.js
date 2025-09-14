const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String, default: "" },
  year: { type: Number, required: true },
  faceEncoding:[Number],
  department: { 
     type: String,  
     enum:["CSE", "EEE", "ECE", "Mining"],
     required: true 
    },
    subjects:[],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', StudentSchema);