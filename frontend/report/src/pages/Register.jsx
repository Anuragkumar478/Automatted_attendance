import React, { useEffect, useState } from "react";
import API from "../utils/api";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    rollNumber: "",
    email: "",
    password: "",
    year: "",
    department: "",
    subjects: [],
  });

  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);

  // handle text inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  // ✅ Fetch subjects when year & department selected
  useEffect(() => {
    const fetchSubjects = async () => {
      if (form.year && form.department) {
        try {
          setLoadingSubjects(true);
          const res = await API.get(
            `/subjects/dep?department=${form.department}&year=${form.year}`
          );

          if (Array.isArray(res.data) && res.data.length > 0) {
            const mergedSubjects = [
              ...new Set(res.data.flatMap((doc) => doc.subjects)),
            ];
            setForm((prev) => ({ ...prev, subjects: mergedSubjects }));
          } else {
            setForm((prev) => ({ ...prev, subjects: [] }));
          }
        } catch (err) {
          console.error("Error fetching subjects", err);
          setForm((prev) => ({ ...prev, subjects: [] }));
        } finally {
          setLoadingSubjects(false);
        }
      }
    };

    fetchSubjects();
  }, [form.year, form.department]);

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("rollNumber", form.rollNumber);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("year", form.year);
      formData.append("department", form.department);
      formData.append("subjects", JSON.stringify(form.subjects));
      if (profilePic) formData.append("profilePic", profilePic);

      const res = await API.post("/auth/register/student", formData, {
        // headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Student registered successfully!");
      localStorage.setItem("token", res.data.token);
    } catch (err) {
      alert(err.response?.data?.msg || "❌ Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-200">
      <form
        className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 space-y-4"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center text-blue-700">
          Student Registration
        </h2>

        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />

        {/* Roll Number */}
        <input
          type="text"
          name="rollNumber"
          placeholder="Roll Number"
          value={form.rollNumber}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />

        {/* Year */}
        <select
          name="year"
          value={form.year}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
        >
          <option value="">--Select Year--</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
        </select>

        {/* Department */}
        <select
          name="department"
          value={form.department}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
        >
          <option value="">--Select Department--</option>
          <option value="ECE">Electronics Engineering</option>
          <option value="Mining">Mining Engineering</option>
          <option value="CSE">Computer Science</option>
          <option value="EE">Electrical Engineering</option>
        </select>

        {/* Profile Picture */}
        <div>
          <label className="block mb-1 font-medium">Profile Picture</label>
          <input
            type="file"
            name="profilePic"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-24 h-24 mt-2 rounded-full object-cover border"
            />
          )}
        </div>

        {/* Subjects fetched from backend */}
        {loadingSubjects ? (
          <p className="text-sm text-gray-500">Loading subjects...</p>
        ) : form.subjects.length > 0 ? (
          <div className="bg-gray-100 p-2 rounded-lg">
            <h4 className="font-semibold mb-1">Subjects:</h4>
            <ul className="list-disc ml-5 text-sm text-gray-700">
              {form.subjects.map((subj, i) => (
                <li key={i}>{subj}</li>
              ))}
            </ul>
          </div>
        ) : form.year && form.department ? (
          <p className="text-sm text-red-500">No subjects found</p>
        ) : null}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
