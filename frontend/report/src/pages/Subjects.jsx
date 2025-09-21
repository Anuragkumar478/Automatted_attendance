import React, { useState } from "react";
import api from "../utils/api";



   
const Subjects = () => {
  const [form, setForm] = useState({
    department: "",
    year: "",
    subjects: "",
  });

  const [fetchedSubjects, setFetchedSubjects] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Add Subjects (teacher only)
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/subjects/", {
        department: form.department,
        year: form.year,
        subjects: form.subjects.split(",").map((s) => s.trim()), // split by comma
      });
      alert("Subjects added successfully!");
      console.log(res.data);
      setForm({ department: "", year: "", subjects: "" });
    } catch (err) {
      alert(err.response?.data?.msg || "Error adding subjects");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Get Subjects
  const handleFetch = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/subjects/dep?department=${form.department}&year=${form.year}`
      );

      // Merge subjects if multiple documents exist
      if (Array.isArray(res.data) && res.data.length > 0) {
        const merged = {
          department: res.data[0].department,
          year: res.data[0].year,
          subjects: [
            ...new Set(res.data.flatMap((doc) => doc.subjects)), // unique subjects
          ],
        };
        setFetchedSubjects(merged);
      } else {
        setFetchedSubjects(null);
        alert("No subjects found");
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Error fetching subjects");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-10 px-4">
      <div className="bg-white shadow-md rounded-xl w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Manage Subjects</h1>

        {/* Add Subjects Form */}
        <form onSubmit={handleAdd} className="space-y-4">
          {/* Department Dropdown */}
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">--Select Department--</option>
            <option value="ECE">Electronics Engineering</option>
            <option value="Mining">Mining Engineering</option>
            <option value="CSE">Computer Science</option>
            <option value="EE">Electrical Engineering</option>
          </select>

          {/* Year Dropdown */}
          <select
            name="year"
            value={form.year}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">--Select Year--</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>

          {/* Subjects Input */}
          <textarea
            name="subjects"
            placeholder="Subjects (comma separated)"
            value={form.subjects}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          ></textarea>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Add Subjects"}
          </button>
        </form>

        {/* Fetch Subjects */}
        <div className="mt-6">
          <button
            onClick={handleFetch}
            disabled={!form.department || !form.year || loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Loading..." : "Get Subjects"}
          </button>
        </div>

        {/* Show fetched subjects */}
        {fetchedSubjects && (
          <div className="mt-6 p-4 border rounded-lg bg-gray-50">
            <h2 className="text-lg font-semibold">Subjects:</h2>
            <p>
              <span className="font-bold">Department:</span>{" "}
              {fetchedSubjects.department}
            </p>
            <p>
              <span className="font-bold">Year:</span> {fetchedSubjects.year}
            </p>
            <ul className="list-disc list-inside">
              {fetchedSubjects.subjects.map((sub, i) => (
                <li key={i}>{sub}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subjects;
