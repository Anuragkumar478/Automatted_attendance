const Project = require('../models/Projects');
const Student = require('../models/Student');

// Add project
exports.addProject = async (req, res) => {
  try {
    const { studentId, title, description, link, subject } = req.body;
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ msg: 'Student not found' });

    const project = new Project({
      student: studentId,
      title,
      description,
      link,
      subject
    });

    await project.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Evaluate project
exports.evaluateProject = async (req, res) => {
  try {
    const { marks } = req.body;
    let project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: 'Project not found' });

    project.marks = marks;
    project.evaluatedBy = req.user.id;
    await project.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
// get project
exports.getProject=async(req,res)=>{
try{
const projects=await Project.find().populate("student","rollNumber");
res.json(projects)
}
catch(err){
console.error(err.message);
  res.status(500).send('Server error');
}
}
