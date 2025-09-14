import React from "react";

const AttendanceForm = ({
  year,
  setYear,
  department,
  setDepartment,
  subject,
  setSubject,
  subjectsList,
  fetchStudents,
}) => {
  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-2xl space-y-6 border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 text-center">
        Attendance Form
      </h2>

      {/* Year */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Select Year
        </label>
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50"
        >
          <option value="">-- Select Year --</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
        </select>
      </div>

      {/* Department */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Select Department
        </label>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50"
        >
          <option value="">-- Select Department --</option>
          <option value="CSE">Computer Science</option>
          <option value="ECE">Electronics</option>
          <option value="EE">Electrical</option>
          <option value="Mining">Mining</option>
        </select>
      </div>

      {/* Subject */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Select Subject
        </label>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50"
        >
          <option value="">-- Select Subject --</option>
          {subjectsList.length > 0 ? (
            subjectsList.map((sub, i) => (
              <option key={i} value={sub}>
                {sub}
              </option>
            ))
          ) : (
            <option disabled>No subjects found</option>
          )}
        </select>
      </div>

      {/* Button */}
      <button
        onClick={fetchStudents}
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 transition duration-200"
      >
        Load Students
      </button>
    </div>
  );
};

export default AttendanceForm;
