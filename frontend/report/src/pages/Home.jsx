import React from "react";
import { motion } from "framer-motion";
import { Users, CheckCircle, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-black text-gray-800 dark:text-white min-h-screen">
      
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-10 py-20">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-lg"
        >
          <div className="flex items-center space-x-3 mb-6">
            <img 
              src="/logo.png" 
              alt="EduTrack Logo" 
              className="w-14 h-14 rounded-xl shadow-md"
            />
            <h2 className="text-2xl font-bold text-blue-600">EduTrack</h2>
          </div>

          <h1 className="text-5xl font-extrabold leading-tight">
            Welcome to <span className="text-blue-600">EduTrack</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Smarter attendance, automated insights, and better academic planning.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/register")}
            className="mt-6 px-6 py-3 text-lg rounded-2xl shadow-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            🚀 Get Started
          </motion.button>
        </motion.div>

        <motion.img
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          src="/images (4).jpeg"
          alt="Dashboard Preview"
          className="rounded-2xl shadow-xl mt-10 md:mt-0"
        />
      </section>

      {/* Features Section */}
      <section id="features" className="px-10 py-20 bg-gray-50 dark:bg-gray-800">
        <h2 className="text-3xl font-bold text-center mb-10">✨ Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Student Management", desc: "Easily add, edit, and view student details.", icon: <Users className="mx-auto mb-4 text-blue-600" /> },
            { title: "Attendance Tracking", desc: "Smart and automated attendance system with QR/facial recognition.", icon: <CheckCircle className="mx-auto mb-4 text-green-600" /> },
            { title: "Analytics & Insights", desc: "Track attendance trends and identify disengaged students.", icon: <ClipboardList className="mx-auto mb-4 text-purple-600" /> },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="rounded-2xl shadow-md p-6 text-center bg-white dark:bg-gray-900"
            >
              {item.icon}
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="px-10 py-16 text-center bg-blue-600 text-white rounded-xl mx-10 -mt-10 shadow-xl">
        <h2 className="text-3xl font-bold mb-4">Ready to simplify attendance?</h2>
        <p className="mb-6">Join EduTrack today and take control of student management and attendance analytics.</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/register")}
          className="px-6 py-3 text-lg rounded-2xl shadow-lg bg-white text-blue-600 hover:bg-gray-100"
        >
          Register Now
        </motion.button>
      </section>

      {/* Footer */}
      <footer className="px-10 py-6 bg-gray-900 text-gray-300 text-center mt-20">
        <p>Made with ❤️ by Anurag Kumar | © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Home;
