import React, { useState, useEffect } from "react";
import api from "../utils/api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";

const Student = () => {
  const [year, setYear] = useState("");
  const [department, setDepartment] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [studentSummary, setStudentSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch students when year & department are selected
  const fetchStudents = async () => {
    if (!year || !department) return;
    setLoading(true);
    try {
      const res = await api.get(
        `/students/filter?year=${year}&department=${department}`
      );
      setStudents(res.data);
      setSelectedStudentId(null);
      setStudentSummary(null);
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch summary for one student
  const fetchStudentSummary = async (studentId) => {
    setLoading(true);
    try {
      const res = await api.get(`/students/${studentId}/summary`);
      setSelectedStudentId(studentId);
      setStudentSummary(res.data);
    } catch (err) {
      console.error("Error fetching student summary:", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate attendance percentage
  const calculateAttendancePercentage = () => {
    if (!studentSummary?.attendance.length) return 0;
    const presentCount = studentSummary.attendance.filter(
      (a) => a.status === "Present"
    ).length;
    return Math.round((presentCount / studentSummary.attendance.length) * 100);
  };

  // Calculate average marks
  const calculateAverageMarks = () => {
    if (!studentSummary?.marks.length) return 0;
    const total = studentSummary.marks.reduce((sum, mark) => {
      return sum + (mark.internalMarks || 0) + (mark.externalMarks || 0);
    }, 0);
    return (total / (studentSummary.marks.length * 2)).toFixed(1);
  };

  // Prepare data for Monthly Attendance Chart
  const monthlyAttendanceData = () => {
    if (!studentSummary?.attendance) return [];
    const grouped = {};

    studentSummary.attendance.forEach((a) => {
      const month = new Date(a.date).toLocaleString("default", { month: "short" });
      if (!grouped[month]) grouped[month] = { month, Present: 0, Total: 0 };
      grouped[month].Total += 1;
      if (a.status === "Present") grouped[month].Present += 1;
    });

    return Object.values(grouped).map((m) => ({
      month: m.month,
      Percentage: Math.round((m.Present / m.Total) * 100),
    }));
  };

  // Dummy department average attendance (in real app -> fetch from API)
  const departmentAttendanceData = [
    { name: "CSE", value: 78 },
    { name: "ECE", value: 65 },
    { name: "EEE", value: 72 },
    { name: "Mining", value: 60 },
  ];

  const COLORS = ["#4F46E5", "#22C55E", "#F59E0B", "#EF4444"];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Student Dashboard</h2>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Filter Students</h3>
          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
              className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select Department</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="Mining">Mining</option>
            </select>

            <button
              onClick={fetchStudents}
              disabled={!year || !department || loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "Load Students"}
            </button>
          </div>
        </div>

        {/* Student List */}
        {students.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Student List</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-3 font-medium text-gray-600">Name</th>
                    <th className="p-3 font-medium text-gray-600">Roll No</th>
                    <th className="p-3 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3">{s.name}</td>
                      <td className="p-3">{s.rollNumber}</td>
                      <td className="p-3">
                        <button
                          onClick={() => fetchStudentSummary(s._id)}
                          disabled={loading}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
                        >
                          {loading && selectedStudentId === s._id ? "Loading..." : "View Summary"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Student Summary Dashboard */}
        {studentSummary && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Student Profile Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-1">
              <div className="flex flex-col items-center mb-6">
                {studentSummary.student.profilePic ? (
                  <img
                    src={`http://localhost:5000${studentSummary.student.profilePic}`}
                    alt={studentSummary.student.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 mb-4"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border-4 border-blue-100 mb-4">
                    No Image
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-800">{studentSummary.student.name}</h3>
                <p className="text-gray-600">Roll: {studentSummary.student.rollNumber}</p>
                <p className="text-gray-600">{studentSummary.student.email}</p>
                <div className="mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Year {studentSummary.student.year} | {studentSummary.student.department}
                </div>
              </div>

              {/* Stats Overview */}
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700 font-medium">Attendance</span>
                    <span className="text-blue-800 font-bold">{calculateAttendancePercentage()}%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${calculateAttendancePercentage()}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-green-700 font-medium">Average Marks</span>
                    <span className="text-green-800 font-bold">{calculateAverageMarks()}/100</span>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-700 font-medium">Projects</span>
                    <span className="text-purple-800 font-bold">{studentSummary.projects.length}</span>
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-amber-700 font-medium">Lab Visits</span>
                    <span className="text-amber-800 font-bold">{studentSummary.labVisits.length}</span>
                  </div>
                </div>
               <button
  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl shadow-md hover:scale-105 transition"
>
  <span>Check ATS Score</span>

</button>
 <button
  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-indigo-700 text-white rounded-xl shadow-md hover:scale-105 transition"
>
  <span>Send Attendance to Parent</span>
  
</button>
<button
  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-indigo-700 text-white rounded-xl shadow-md hover:scale-105 transition"
>
  <span>Send Summry to Parent</span>
  
</button>


              </div>
            </div>
             
            {/* Details Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h3 className="text-xl font-bold text-gray-800">Academic Performance</h3>
              </div>

              {/* ✅ Monthly Attendance Chart */}
              <div className="mb-8">
                <h4 className="font-semibold text-lg text-gray-700 mb-4">Monthly Attendance (%)</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyAttendanceData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="Percentage" fill="#4F46E5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* ✅ Department Avg Attendance Chart */}
              <div className="mb-8">
                <h4 className="font-semibold text-lg text-gray-700 mb-4">Department Avg Attendance</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={departmentAttendanceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {departmentAttendanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Marks Table */}
              <div className="mb-8">
                <h4 className="font-semibold text-lg text-gray-700 mb-4">Marks Overview</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100 text-left">
                        <th className="p-3 font-medium text-gray-600">Subject</th>
                        <th className="p-3 font-medium text-gray-600">CT1</th>
                        <th className="p-3 font-medium text-gray-600">CT2</th>
                        <th className="p-3 font-medium text-gray-600">Internal</th>
                        <th className="p-3 font-medium text-gray-600">External</th>
                        <th className="p-3 font-medium text-gray-600">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentSummary.marks.map((m) => {
                        const total = (m.internalMarks || 0) + (m.externalMarks || 0);
                        return (
                          <tr key={m._id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-3 font-medium">{m.subject}</td>
                            <td className="p-3">{m.classTestMarks1 || "-"}</td>
                            <td className="p-3">{m.classTestMarks2 || "-"}</td>
                            <td className="p-3">{m.internalMarks || "-"}</td>
                            <td className="p-3">{m.externalMarks || "-"}</td>
                            <td className="p-3 font-medium">{total || "-"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Attendance and Activities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Attendance */}
                <div>
                  <h4 className="font-semibold text-lg text-gray-700 mb-4">Recent Attendance</h4>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-80 overflow-y-auto">
                    {studentSummary.attendance.slice(0, 10).map((a) => (
                      <div key={a._id} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">{new Date(a.date).toLocaleDateString()}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${a.status === "Present" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {a.status}
                        </span>
                      </div>
                    ))}
                    {studentSummary.attendance.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No attendance records found</p>
                    )}
                  </div>
                </div>

                {/* Lab Visits */}
                <div>
                  <h4 className="font-semibold text-lg text-gray-700 mb-4">Recent Lab Visits</h4>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-80 overflow-y-auto">
                    {studentSummary.labVisits.slice(0, 10).map((l) => (
                      <div key={l._id} className="py-2 border-b border-gray-100">
                        <div className="font-medium text-gray-800">{l.labName}</div>
                        <div className="text-sm text-gray-600">{new Date(l.date).toLocaleDateString()}</div>
                      </div>
                    ))}
                    {studentSummary.labVisits.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No lab visits recorded</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Projects */}
              <div className="mt-8">
                <h4 className="font-semibold text-lg text-gray-700 mb-4">Projects</h4>
                <div className="space-y-4">
                  {studentSummary.projects.map((p) => (
                    <div key={p._id} className="bg-gray-50 rounded-lg p-4">
                      <h5 className="font-medium text-gray-800">{p.title}</h5>
                      <p className="text-sm text-gray-600 mt-1">Submitted: {new Date(p.submissionDate).toLocaleDateString()}</p>
                      {p.link && (
                        <a 
                          href={p.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-block mt-2 text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View Project →
                        </a>
                      )}
                    </div>
                  ))}
                  {studentSummary.projects.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No projects submitted</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Student;