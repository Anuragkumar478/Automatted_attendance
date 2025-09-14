import React, { useEffect, useState } from "react";
import api from "../utils/api";

const Marks = () => {
  const [year, setYear] = useState("");
  const [department, setDepartment] = useState("");
  const [subject, setSubject] = useState("");
  const [examType, setExamType] = useState("");
  const [subjectsList, setSubjectsList] = useState([]);
  const [students, setStudents] = useState([]);
  const [marksData, setMarksData] = useState({});
  const [message, setMessage] = useState("");

  const examTypes = ["Class Test 1", "Class Test 2", "Internal", "External"];

  // Fetch subjects whenever year + department changes
  useEffect(() => {
    if (!year || !department) {
      setSubjectsList([]);
      setSubject("");
      return;
    }
    const fetchSubjects = async () => {
      try {
        const res = await api.get(
          `/subjects/dep?year=${Number(year)}&department=${department}`
        );
        setSubjectsList(res.data);
      } catch (err) {
        console.error("Error fetching subjects", err);
        setSubjectsList([]);
      }
    };
    fetchSubjects();
    setSubject("");
  }, [year, department]);

  // Fetch students whenever year + department + subject changes
  const fetchStudents = async () => {
    if (!year || !department || !subject) {
      alert("Please select Year, Department and Subject");
      return;
    }
    try {
      const res = await api.get(
        `/students/filter?year=${year}&department=${department}`
      );
      setStudents(res.data);

      // Initialize marks
      const initMarks = {};
      res.data.forEach((s) => (initMarks[s._id] = ""));
      setMarksData(initMarks);
    } catch (err) {
      console.error("Error fetching students", err);
      setStudents([]);
    }
  };

  const handleMarkChange = (studentId, value) => {
    setMarksData({ ...marksData, [studentId]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!examType) {
      setMessage("Please select Exam Type");
      return;
    }

    try {
      const promises = students.map((s) => {
        const value = Number(marksData[s._id]) || 0;
        const data = {
          studentId: s._id,
          subject,
        };

        if (examType === "Class Test 1") data.classTestMarks1 = value;
        if (examType === "Class Test 2") data.classTestMarks2 = value;
        if (examType === "Internal") data.internalMarks = value;
        if (examType === "External") data.externalMarks = value;

        return api.post("/marks/", data);
      });

      await Promise.all(promises);
      setMessage("✅ Marks saved successfully!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Error saving marks");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white shadow-lg rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
        Add / Update Marks
      </h2>

      {/* Filters Section */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="p-3 border rounded-xl"
        >
          <option value="">Select Year</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">Final Year</option>
        </select>

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="p-3 border rounded-xl"
        >
          <option value="">Select Department</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="EE">EE</option>
          <option value="Mining">Mining</option>
        </select>

        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="p-3 border rounded-xl col-span-2"
        >
          <option value="">Select Subject</option>
          {subjectsList.length
            ? subjectsList.map((sub, i) => (
                <option key={i} value={sub}>
                  {sub}
                </option>
              ))
            : null}
        </select>

        <select
          value={examType}
          onChange={(e) => setExamType(e.target.value)}
          className="p-3 border rounded-xl col-span-2"
        >
          <option value="">Select Exam Type</option>
          {examTypes.map((ex, i) => (
            <option key={i} value={ex}>
              {ex}
            </option>
          ))}
        </select>
      </div>

      {/* Load Students Button */}
      <button
        onClick={fetchStudents}
        className="w-full py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 mb-6"
      >
        Load Students
      </button>

      {/* Students Marks Table */}
      {students.length > 0 && (
        <form onSubmit={handleSubmit}>
          <table className="w-full border-collapse shadow rounded-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">Student Name</th>
                <th className="p-3 text-left">Roll No</th>
                <th className="p-3 text-center">Marks</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={
                        s.profilePic
                          ? `http://localhost:5000${s.profilePic}`
                          : "https://via.placeholder.com/40"
                      }
                      alt={s.name}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                    {s.name}
                  </td>
                  <td className="p-3">{s.rollNumber}</td>
                  <td className="p-3 text-center">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={marksData[s._id] || ""}
                      onChange={(e) => handleMarkChange(s._id, e.target.value)}
                      className="border p-1 w-24 text-center rounded-lg"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            type="submit"
            className="mt-6 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            Submit Marks
          </button>
        </form>
      )}

      {message && <p className="mt-4 text-center font-semibold">{message}</p>}
    </div>
  );
};

export default Marks;
