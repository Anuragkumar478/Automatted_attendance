const express = require("express");
const router = express.Router();
const Subject = require("../models/subjects");
const auth = require("../middleware/auth"); // already in your project
const IsTeacher = require("../middleware/isTeacher"); // new middleware

// ✅ Add Subjects (only Admin)
router.post("/", auth, IsTeacher, async (req, res) => {
  try {
    const { department, year, subjects } = req.body;

    const newSubjects = new Subject({
      department,
      year,
      subjects,
    });

    await newSubjects.save();
    res.status(201).json({ msg: "Subjects added successfully", newSubjects });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// ✅ Get subjects by dept + year
router.get("/dep", auth, async (req, res) => {
  try {
    const { department, year } = req.query;

    // Find all Subject documents for this department + year
    const data = await Subject.find({ department, year });
    if (!data || data.length === 0) 
      return res.status(404).json({ msg: "No subjects found" });

    // 🔹 Flatten all subjects arrays into a single array and remove duplicates
    const allSubjects = data.flatMap((doc) => doc.subjects || []);
    const uniqueSubjects = [...new Set(allSubjects)];

    // Return an array of subject names
    res.json(uniqueSubjects);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});


module.exports = router;
