import React, { useEffect, useState, useRef } from "react";
import API from "../utils/api";
import AttendanceForm from "./AttendanceForm";
import AttendanceTable from "./AttendanceTable";

const Attendance = () => {
  const [year, setYear] = useState("");
  const [department, setDepartment] = useState("");
  const [subject, setSubject] = useState("");
  const [subjectsList, setSubjectsList] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [mode, setMode] = useState("manual"); // manual | qr | face | biometric

  // QR state
  const [qrCode, setQrCode] = useState(null);
  const [expiryTime, setExpiryTime] = useState(null);

  // FACE state
  const videoRef = useRef(null);

  // ✅ Open/close camera when Face ID mode is active
  useEffect(() => {
    if (mode === "face" && videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((err) => {
          console.error("Camera error:", err);
          alert("❌ Unable to access camera");
        });
    }

    // Stop camera when switching modes
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, [mode]);

  // ✅ Fetch subjects when year + department change
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!year || !department) {
        setSubjectsList([]);
        setSubject("");
        return;
      }
      try {
        const res = await API.get(`/subjects/dep?department=${department}&year=${year}`);
        const allSubjects = Array.isArray(res.data) ? res.data : [];
        setSubjectsList(allSubjects);
      } catch (err) {
        console.error("Error fetching subjects", err);
        setSubjectsList([]);
      }
    };
    fetchSubjects();
  }, [year, department]);

  // ✅ Fetch students
  const fetchStudents = async () => {
    if (!year || !department || !subject) {
      alert("Please select year, department and subject");
      return;
    }
    try {
      const res = await API.get(`/students/filter?year=${year}&department=${department}`);
      setStudents(res.data);

      // Default all Absent
      const initial = {};
      res.data.forEach((s) => (initial[s._id] = "Absent"));
      setAttendance(initial);
    } catch (err) {
      console.error("Error fetching students", err);
    }
  };

  // ✅ Mark attendance manually
  const markAttendance = (studentId, status) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  // ✅ Submit attendance (manual mode)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/attendance/", {
        year,
        department,
        subject,
        records: Object.keys(attendance).map((id) => ({
          studentId: id,
          status: attendance[id],
        })),
      });
      alert("✅ Attendance saved successfully!");
    } catch (err) {
      alert(err.response?.data?.msg || "❌ Error saving attendance");
    }
  };

  // ✅ Generate QR (teacher side)
  const generateQR = async () => {
    if (!subject) return alert("Please select subject");
    try {
      const pos = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );
      const { latitude, longitude } = pos.coords;

      const res = await API.post("/qr-attendance/generate", {
        classId: subject,
        lat: latitude,
        lon: longitude,
        duration: 2, // 2 minutes validity
      });

      setQrCode(res.data.qrCode);
      setExpiryTime(res.data.expiryTime);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to generate QR");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        Attendance System
      </h2>

      {/* Mode Switch */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <button
          onClick={() => setMode("manual")}
          className={`px-4 py-2 rounded-lg ${mode === "manual" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Manual
        </button>
        <button
          onClick={() => setMode("qr")}
          className={`px-4 py-2 rounded-lg ${mode === "qr" ? "bg-green-600 text-white" : "bg-gray-200"}`}
        >
          QR Code
        </button>
        <button
          onClick={() => setMode("face")}
          className={`px-4 py-2 rounded-lg ${mode === "face" ? "bg-purple-600 text-white" : "bg-gray-200"}`}
        >
          Face ID
        </button>
        <button
          onClick={() => setMode("biometric")}
          className={`px-4 py-2 rounded-lg ${mode === "biometric" ? "bg-pink-600 text-white" : "bg-gray-200"}`}
        >
          Biometric
        </button>
      </div>

      {/* Manual Mode */}
      {mode === "manual" &&
        (!students.length ? (
          <AttendanceForm
            year={year}
            setYear={setYear}
            department={department}
            setDepartment={setDepartment}
            subject={subject}
            setSubject={setSubject}
            subjectsList={subjectsList}
            fetchStudents={fetchStudents}
          />
        ) : (
          <AttendanceTable
            students={students}
            attendance={attendance}
            markAttendance={markAttendance}
            handleSubmit={handleSubmit}
          />
        ))}

      {/* QR Mode */}
      {mode === "qr" && (
        <div className="p-6 border rounded-xl bg-gray-50 dark:bg-gray-700">
          <AttendanceForm
            year={year}
            setYear={setYear}
            department={department}
            setDepartment={setDepartment}
            subject={subject}
            setSubject={setSubject}
            subjectsList={subjectsList}
            fetchStudents={() => {}}
          />

          <button
            onClick={generateQR}
            className="mt-4 w-full py-3 bg-green-600 text-white rounded-lg"
          >
            Generate QR
          </button>

          {qrCode && (
            <div className="mt-6 flex flex-col items-center">
              <img src={qrCode} alt="QR Code" className="w-64 h-64 border" />
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                QR expires at: {new Date(expiryTime).toLocaleTimeString()}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Face ID Mode */}
      {mode === "face" && (
        <div className="p-6 border rounded-xl bg-gray-50 dark:bg-gray-700">
          <AttendanceForm
            year={year}
            setYear={setYear}
            department={department}
            setDepartment={setDepartment}
            subject={subject}
            setSubject={setSubject}
            subjectsList={subjectsList}
            fetchStudents={() => {}}
          />
          <div className="mt-4 flex flex-col items-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-80 h-64 border rounded-lg"
            />
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              📷 Camera is active for Face Recognition
            </p>
          </div>
        </div>
      )}

      {/* Biometric Mode (UI Only) */}
      {mode === "biometric" && (
        <div className="p-6 border rounded-xl bg-gray-50 dark:bg-gray-700">
          <AttendanceForm
            year={year}
            setYear={setYear}
            department={department}
            setDepartment={setDepartment}
            subject={subject}
            setSubject={setSubject}
            subjectsList={subjectsList}
            fetchStudents={() => {}}
          />

          <div className="mt-6 flex flex-col items-center">
            <div className="w-32 h-32 border-4 border-dashed border-pink-500 rounded-full flex items-center justify-center">
              <span className="text-pink-600 font-bold">🔒 Scan Finger</span>
            </div>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Place your finger on biometric scanner
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
