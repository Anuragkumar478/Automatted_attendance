import { Link } from "react-router-dom";
import { useState } from "react";
import { Sun, Moon, Search, Menu, X } from "lucide-react";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="relative bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-gray-900 dark:to-black text-white shadow-md">
      
      {/* Top Bar */}
      <div className="flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src="/logo.png" alt="EduTrack Logo" className="w-10 h-10 rounded-md shadow" />
          <h1 className="text-xl font-bold">EduTrack</h1>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-gray-200">Home</Link>
          <Link to="/student" className="hover:text-gray-200">Student</Link>
          <Link to="/attendance" className="hover:text-gray-200">Attendance</Link>
          <Link to="/studentAttendance" className="hover:text-gray-200">Challenge</Link>
          <Link to="/marks" className="hover:text-gray-200">Marks</Link>
          <Link to="/labs" className="hover:text-gray-200"></Link>
          <Link to="/projects" className="hover:text-gray-200">Projects</Link>
          <Link to="/register" className="hover:text-gray-200">Register</Link>
          <Link to="/teacherRegister" className="hover:text-gray-200">Teacher</Link>
          <Link to="/subjects" className="hover:text-gray-200">Subjects</Link>
          <Link to="/login" className="hover:text-gray-200">Login</Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden sm:flex items-center bg-white/20 rounded-full px-3 py-1">
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent text-white placeholder-gray-300 text-sm focus:outline-none"
            />
            <Search className="w-4 h-4 ml-2 text-white" />
          </div>

          {/* Dark Mode */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-white/20 transition"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-full hover:bg-white/20 transition"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-blue-600 dark:bg-gray-900 flex flex-col items-center gap-4 py-4 transition-all duration-300">
          <Link to="/" className="hover:text-gray-200" onClick={() => setMobileOpen(false)}>Home</Link>
          <Link to="/student" className="hover:text-gray-200" onClick={() => setMobileOpen(false)}>Student</Link>
          <Link to="/attendance" className="hover:text-gray-200" onClick={() => setMobileOpen(false)}>Attendance</Link>
          <Link to="/studentAttendance" className="hover:text-gray-200" onClick={() => setMobileOpen(false)}>Challenge</Link>
          <Link to="/marks" className="hover:text-gray-200" onClick={() => setMobileOpen(false)}>Marks</Link>
          <Link to="/labs" className="hover:text-gray-200" onClick={() => setMobileOpen(false)}>Labs</Link>
          <Link to="/projects" className="hover:text-gray-200" onClick={() => setMobileOpen(false)}>Projects</Link>
          <Link to="/register" className="hover:text-gray-200" onClick={() => setMobileOpen(false)}>Register</Link>
          <Link to="/teacherRegister" className="hover:text-gray-200" onClick={() => setMobileOpen(false)}>Teacher</Link>
          <Link to="/subjects" className="hover:text-gray-200" onClick={() => setMobileOpen(false)}>Subjects</Link>
          <Link to="/login" className="hover:text-gray-200" onClick={() => setMobileOpen(false)}>Login</Link>

          {/* Mobile Search */}
          <div className="flex items-center bg-white/20 rounded-full px-3 py-1 w-11/12 mt-2">
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent text-white placeholder-gray-300 text-sm focus:outline-none w-full"
            />
            <Search className="w-4 h-4 ml-2 text-white" />
          </div>

          {/* Mobile Dark Mode */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-white/20 transition mt-2"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
