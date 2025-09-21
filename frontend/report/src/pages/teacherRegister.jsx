import React from 'react'
import { useState } from "react";
import API from "../utils/api" 


const teacherRegister = () => {
     const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    subjects: "", // user types comma-separated subjects
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // transform subjects string into array
    const payload = {
      ...form,
      subjects: form.subjects
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      const res = await API.post("/auth/register/teacher", payload,{
        withCredentials:true,
      });
      alert("✅ Teacher registered successfully!");
      localStorage.setItem("token", res.data.token);
      setForm({ name: "", email: "", password: "", department: "", subjects: "" });
    } catch (err) {
      alert(err.response?.data?.msg || "❌ Registration failed");
    }
  };
  return (
       <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-100 to-teal-200">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
          Teacher Registration
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
            required
          />

          <input
            type="text"
            name="department"
            placeholder="Department"
            value={form.department}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
            required
          />
          

          <input
            type="text"
            name="subjects"
            placeholder="Subjects (comma separated, e.g. Maths, Physics)"
            value={form.subjects}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>

  )
}

export default teacherRegister

