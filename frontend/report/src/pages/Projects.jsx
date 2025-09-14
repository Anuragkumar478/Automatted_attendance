import React, { useState, useEffect } from "react";
import API from "../utils/api";

const Projects = () => {
  const [year, setYear] = useState("");
  const [department, setDepartment] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    subject: "",
  });

  // ✅ Fetch Students by Year & Department
  const fetchStudents = async () => {
    if (!year || !department) return;
    try {
      const res = await API.get(`/students/filter?year=${year}&department=${department}`);
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  // ✅ Fetch all projects
  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects/");
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Add project
  const addProject = async (e) => {
    e.preventDefault();
    if (!selectedStudent) {
      alert("Please select a student first!");
      return;
    }
    try {
      const res = await API.post("/projects/", {
        studentId: selectedStudent, // 👈 send studentId here
        ...formData,
      });
      setProjects([...projects, res.data]);
      setFormData({ title: "", description: "", link: "", subject: "" });
      setSelectedStudent("");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">📂 Projects</h1>

      {/* Filter Students */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-semibold mb-4">🎯 Select Student</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Select Year</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>

          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Select Department</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="Mining">Mining</option>
          </select>

          <button
            onClick={fetchStudents}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Load Students
          </button>
        </div>

        {/* Student Dropdown */}
        {students.length > 0 && (
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="border p-2 rounded mt-4 w-full"
          >
            <option value="">Select Student</option>
            {students.map((s) => (
              <option key={s._id} value={s._id}>
                {s.rollNumber} - {s.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Add Project Form */}
      <form
        onSubmit={addProject}
        className="bg-white p-6 rounded-lg shadow-md mb-10"
      >
        <h2 className="text-lg font-semibold mb-4">➕ Add Project</h2>
        <input
          type="text"
          placeholder="Project Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full p-2 border rounded mb-4"
          required
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full p-2 border rounded mb-4"
        />
        <input
          type="text"
          placeholder="Subject"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="w-full p-2 border rounded mb-4"
          required
        />
        <input
          type="text"
          placeholder="Project Link"
          value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          className="w-full p-2 border rounded mb-4"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          Submit Project
        </button>
      </form>

      {/* Project List */}
      <h2 className="text-2xl font-semibold mb-4">📋 Project List</h2>
      <div className="grid gap-4">
        {projects.map((p) => (
          <div key={p._id} className="p-4 bg-gray-50 rounded shadow">
            <h3 className="font-bold text-lg">{p.title}</h3>
            <p>{p.description}</p>
            <p className="text-sm text-gray-600">Subject: {p.subject}</p>
            <p className="text-sm">Submitted by: {p.student?.rollNumber} - {p.student?.name}</p>
            <p className="text-sm">Marks: {p.marks ?? "Not Evaluated"}</p>
            {p.link && (
              <a href="" target="_blank" rel="noreferrer" className="text-blue-600 underline">
                View Project
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
